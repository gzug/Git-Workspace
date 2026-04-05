const { normalizeQuestionnaireInput } = require('../adapters/normalizeInput');
const { projectResultForTier } = require('../adapters/projectResultForTier');
const { renderProductResult } = require('../adapters/renderProductResult');
const { buildResult } = require('../engine');
const { getQuestionnaireFlowState } = require('../flow/questionnaireFlow');

const SUPPORTED_TIERS = new Set(['preview', 'base', 'upgrade']);

function isPlainObject(value) {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

function pickTier(requestedTier) {
  if (SUPPORTED_TIERS.has(requestedTier)) {
    return {
      requestedTier,
      resolvedTier: requestedTier,
      warnings: [],
    };
  }

  return {
    requestedTier,
    resolvedTier: 'base',
    warnings: requestedTier == null
      ? []
      : [`Unknown tier \"${requestedTier}\". Fallback to base.`],
  };
}

function buildMissingAnswerItems(flowState) {
  if (!flowState?.nextScreen?.questions) return [];

  return flowState.nextScreen.questions
    .filter((question) => !flowState.answeredQuestionIds.includes(question.id))
    .map((question) => ({
      id: question.id,
      label: question.label,
      screenId: flowState.nextScreen.id,
      screenTitle: flowState.nextScreen.title,
    }));
}

function inferTrackContext(normalizedInput) {
  const indicators = normalizedInput.special_protection_indicator || [];
  const hasSpecialIndicator = indicators.some((value) => value !== 'none_known');

  if (hasSpecialIndicator || normalizedInput.agreement_already_signed === true) {
    return 'special-case-review';
  }

  if (normalizedInput.agreement_present === true && normalizedInput.agreement_already_signed !== true) {
    return 'contract-do-not-sign';
  }

  if (normalizedInput.case_entry === 'termination_announced_only') {
    return 'prepare-advice';
  }

  if (
    (normalizedInput.case_entry === 'termination_received' || normalizedInput.case_entry === 'multiple')
    && (
      normalizedInput.termination_access_date
      || normalizedInput.primary_goal === 'protect_deadlines'
      || normalizedInput.already_unemployed_now === true
      || normalizedInput.unemployment_registered === false
      || normalizedInput.jobseeker_registered === false
    )
  ) {
    return 'deadline-first';
  }

  return null;
}

function hasRedFlagSignal(normalizedInput, flowState) {
  const indicators = normalizedInput.special_protection_indicator || [];
  const hasSpecialIndicator = indicators.some((value) => value !== 'none_known');
  const nextScreenHasRedFlagQuestion = Boolean(
    flowState?.nextScreen?.questions?.some((question) => question.redFlagIfMissing)
  );

  return hasSpecialIndicator
    || normalizedInput.agreement_already_signed === true
    || normalizedInput.case_entry === 'multiple'
    || nextScreenHasRedFlagQuestion;
}

function buildFlowAbandonmentContext(normalizedInput, flowState, missingAnswers) {
  return {
    lastQuestionKey: flowState?.lastAnsweredQuestionId || null,
    nextQuestionKey: flowState?.nextQuestionId || missingAnswers[0]?.id || null,
    trackContext: inferTrackContext(normalizedInput),
    hadRedFlag: hasRedFlagSignal(normalizedInput, flowState),
    hadKnownDeadlineDate: Boolean(normalizedInput.termination_access_date || normalizedInput.employment_end_date),
  };
}

function incompleteState(normalizedInput, flowState, tierInfo) {
  const missingAnswers = buildMissingAnswerItems(flowState);
  const firstMissing = missingAnswers[0] || null;
  const flowAbandonment = buildFlowAbandonmentContext(normalizedInput, flowState, missingAnswers);

  return {
    status: 'incomplete',
    tier: tierInfo.resolvedTier,
    requestedTier: tierInfo.requestedTier,
    warnings: tierInfo.warnings,
    normalizedInput,
    flowState,
    missingAnswers,
    message: firstMissing
      ? `Für die Auswertung fehlt noch: ${firstMissing.label}.`
      : 'Für die Auswertung fehlen noch Pflichtangaben.',
    telemetry: buildTelemetry({
      status: 'incomplete',
      requestedTier: tierInfo.requestedTier,
      tier: tierInfo.resolvedTier,
      warningCount: tierInfo.warnings.length,
      missingAnswersCount: missingAnswers.length,
      primaryTrack: null,
      riskLevel: null,
      topActionsCount: 0,
      deadlinesCount: 0,
      redFlagsCount: 0,
      errorCode: null,
      flowAbandonment,
    }),
  };
}

function buildTelemetry(payload = {}) {
  return {
    event: 'questionnaire_result_view_built',
    generatedAt: new Date().toISOString(),
    flowAbandonment: null,
    ...payload,
  };
}

function errorState(code, message, extras = {}) {
  return {
    status: 'error',
    error: {
      code,
      message,
    },
    telemetry: buildTelemetry({
      status: 'error',
      requestedTier: extras.requestedTier,
      tier: extras.tier,
      warningCount: Array.isArray(extras.warnings) ? extras.warnings.length : 0,
      missingAnswersCount: 0,
      primaryTrack: null,
      riskLevel: null,
      topActionsCount: 0,
      deadlinesCount: 0,
      redFlagsCount: 0,
      errorCode: code,
    }),
    ...extras,
  };
}

function emitEvent(onEvent, event) {
  if (typeof onEvent !== 'function') return;

  try {
    onEvent(event);
  } catch (error) {
    // Monitoring hook must never break the runtime path.
  }
}

function finalizeView(view, onEvent) {
  emitEvent(onEvent, view.telemetry);
  return view;
}

function buildQuestionnaireResultView(rawInput, options = {}) {
  const onEvent = options.onEvent;

  if (!isPlainObject(rawInput)) {
    return finalizeView(errorState(
      'invalid_input',
      'Questionnaire input must be a plain object.',
      {
        requestedTier: options.tier,
        tier: 'base',
        warnings: [],
        normalizedInput: null,
        flowState: null,
      }
    ), onEvent);
  }

  const tierInfo = pickTier(options.tier);
  const normalizedInput = normalizeQuestionnaireInput(rawInput);
  const flowState = getQuestionnaireFlowState(normalizedInput);

  if (!flowState.isComplete) {
    return finalizeView(incompleteState(normalizedInput, flowState, tierInfo), onEvent);
  }

  const buildFn = options.buildFn || buildResult;
  const projectFn = options.projectFn || projectResultForTier;
  const renderFn = options.renderFn || renderProductResult;

  let result;
  try {
    result = buildFn(normalizedInput, options);
  } catch (error) {
    return finalizeView(errorState(
      'build_result_failed',
      error.message,
      {
        requestedTier: tierInfo.requestedTier,
        tier: tierInfo.resolvedTier,
        warnings: tierInfo.warnings,
        normalizedInput,
        flowState,
      }
    ), onEvent);
  }

  let projected;
  try {
    projected = projectFn(result, { tier: tierInfo.resolvedTier });
  } catch (error) {
    return finalizeView(errorState(
      'project_result_failed',
      error.message,
      {
        requestedTier: tierInfo.requestedTier,
        tier: tierInfo.resolvedTier,
        warnings: tierInfo.warnings,
        normalizedInput,
        flowState,
        result,
      }
    ), onEvent);
  }

  try {
    const rendered = renderFn(projected, { tier: tierInfo.resolvedTier });
    return finalizeView({
      status: 'ready',
      requestedTier: tierInfo.requestedTier,
      tier: tierInfo.resolvedTier,
      warnings: tierInfo.warnings,
      normalizedInput,
      flowState,
      result,
      projected,
      rendered,
      telemetry: buildTelemetry({
        status: 'ready',
        requestedTier: tierInfo.requestedTier,
        tier: tierInfo.resolvedTier,
        warningCount: tierInfo.warnings.length,
        missingAnswersCount: 0,
        primaryTrack: result?.synthesisDecision?.primaryTrack || null,
        riskLevel: result?.caseSnapshot?.riskLevel || null,
        topActionsCount: Array.isArray(result?.topActions) ? result.topActions.length : 0,
        deadlinesCount: Array.isArray(result?.deadlines) ? result.deadlines.length : 0,
        redFlagsCount: Array.isArray(result?.redFlags) ? result.redFlags.length : 0,
        errorCode: null,
      }),
    }, onEvent);
  } catch (error) {
    const warnings = [
      ...tierInfo.warnings,
      `Render failed for tier \"${tierInfo.resolvedTier}\". Structured result kept as fallback.`,
    ];
    return finalizeView({
      status: 'render-fallback',
      requestedTier: tierInfo.requestedTier,
      tier: tierInfo.resolvedTier,
      warnings,
      normalizedInput,
      flowState,
      result,
      projected,
      rendered: null,
      error: {
        code: 'render_failed',
        message: error.message,
      },
      telemetry: buildTelemetry({
        status: 'render-fallback',
        requestedTier: tierInfo.requestedTier,
        tier: tierInfo.resolvedTier,
        warningCount: warnings.length,
        missingAnswersCount: 0,
        primaryTrack: result?.synthesisDecision?.primaryTrack || null,
        riskLevel: result?.caseSnapshot?.riskLevel || null,
        topActionsCount: Array.isArray(result?.topActions) ? result.topActions.length : 0,
        deadlinesCount: Array.isArray(result?.deadlines) ? result.deadlines.length : 0,
        redFlagsCount: Array.isArray(result?.redFlags) ? result.redFlags.length : 0,
        errorCode: 'render_failed',
      }),
    }, onEvent);
  }
}

module.exports = {
  buildQuestionnaireResultView,
};
