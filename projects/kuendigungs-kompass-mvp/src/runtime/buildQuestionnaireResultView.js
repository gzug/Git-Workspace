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
  };
}

function errorState(code, message, extras = {}) {
  return {
    status: 'error',
    error: {
      code,
      message,
    },
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
    };
  } catch (error) {
    return {
      status: 'render-fallback',
      requestedTier: tierInfo.requestedTier,
      tier: tierInfo.resolvedTier,
      warnings: [
        ...tierInfo.warnings,
        `Render failed for tier \"${tierInfo.resolvedTier}\". Structured result kept as fallback.`,
      ],
      normalizedInput,
      flowState,
      result,
      projected,
      rendered: null,
      error: {
        code: 'render_failed',
        message: error.message,
      },
    };
  }
}

module.exports = {
  buildQuestionnaireResultView,
};
