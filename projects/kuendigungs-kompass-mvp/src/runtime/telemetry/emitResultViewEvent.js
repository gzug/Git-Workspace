function countItems(value) {
  return Array.isArray(value) ? value.length : 0;
}

function buildResultViewEvent(view = {}) {
  if (view && typeof view === 'object' && view.event === 'questionnaire_result_view_built') {
    return { ...view };
  }

  if (view?.telemetry && typeof view.telemetry === 'object') {
    return { ...view.telemetry };
  }

  return {
    event: 'questionnaire_result_view_built',
    generatedAt: new Date().toISOString(),
    status: view?.status || null,
    requestedTier: view?.requestedTier,
    tier: view?.tier,
    warningCount: Array.isArray(view?.warnings) ? view.warnings.length : 0,
    missingAnswersCount: countItems(view?.missingAnswers),
    primaryTrack: view?.result?.synthesisDecision?.primaryTrack || null,
    riskLevel: view?.result?.caseSnapshot?.riskLevel || null,
    topActionsCount: countItems(view?.result?.topActions),
    deadlinesCount: countItems(view?.result?.deadlines),
    redFlagsCount: countItems(view?.result?.redFlags),
    errorCode: view?.error?.code || null,
    flowAbandonment: null,
  };
}

function emitResultViewEvent(view, onEvent) {
  const event = buildResultViewEvent(view);

  if (typeof onEvent === 'function') {
    try {
      onEvent(event);
    } catch (error) {
      // Telemetry sink failures must not break callers.
    }
  }

  return event;
}

module.exports = {
  buildResultViewEvent,
  emitResultViewEvent,
};
