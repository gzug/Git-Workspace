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

function incompleteState(normalizedInput, flowState, tierInfo) {
  const missingAnswers = buildMissingAnswerItems(flowState);
  const firstMissing = missingAnswers[0] || null;

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
    }),
  };
}

function buildTelemetry(payload = {}) {
  return {
    event: 'questionnaire_result_view_built',
    generatedAt: new Date().toISOString(),
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

function buildQuestionnaireResultView(rawInput, options = {}) {
  if (!isPlainObject(rawInput)) {
    return errorState(
      'invalid_input',
      'Questionnaire input must be a plain object.',
      {
        requestedTier: options.tier,
        tier: 'base',
        warnings: [],
        normalizedInput: null,
        flowState: null,
      }
    );
  }

  const tierInfo = pickTier(options.tier);
  const normalizedInput = normalizeQuestionnaireInput(rawInput);
  const flowState = getQuestionnaireFlowState(normalizedInput);

  if (!flowState.isComplete) {
    return incompleteState(normalizedInput, flowState, tierInfo);
  }

  const buildFn = options.buildFn || buildResult;
  const projectFn = options.projectFn || projectResultForTier;
  const renderFn = options.renderFn || renderProductResult;

  let result;
  try {
    result = buildFn(normalizedInput, options);
  } catch (error) {
    return errorState(
      'build_result_failed',
      error.message,
      {
        requestedTier: tierInfo.requestedTier,
        tier: tierInfo.resolvedTier,
        warnings: tierInfo.warnings,
        normalizedInput,
        flowState,
      }
    );
  }

  let projected;
  try {
    projected = projectFn(result, { tier: tierInfo.resolvedTier });
  } catch (error) {
    return errorState(
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
    );
  }

  try {
    const rendered = renderFn(projected, { tier: tierInfo.resolvedTier });
    return {
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
    };
  } catch (error) {
    const warnings = [
      ...tierInfo.warnings,
      `Render failed for tier \"${tierInfo.resolvedTier}\". Structured result kept as fallback.`,
    ];
    return {
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
    };
  }
}

module.exports = {
  buildQuestionnaireResultView,
};
