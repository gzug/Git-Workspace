function selectPreviewNote(result = {}) {
  const disclaimers = result.disclaimers || [];
  const usefulDisclaimer = disclaimers.find((item) => !/verbindliche rechtliche Einschätzung/.test(item)) || null;
  if (usefulDisclaimer) return usefulDisclaimer;

  return result.opportunities?.[0]?.description || null;
}

function firstCriticalDeadline(deadlines = []) {
  const lawsuitDeadline = deadlines.find((item) => /Kündigungsschutzklage/.test(item.label));
  if (lawsuitDeadline) return lawsuitDeadline;

  return deadlines.find((item) => item.importance === 'critical') || deadlines[0] || null;
}

function firstRisk(riskFlags = []) {
  return riskFlags[0] || null;
}

function firstRedFlag(redFlags = []) {
  return redFlags[0] || null;
}

function projectPreview(result) {
  return {
    tier: 'preview',
    caseSnapshot: {
      headline: result.caseSnapshot.headline,
    },
    topAction: result.topActions[0] || null,
    deadline: firstCriticalDeadline(result.deadlines),
    riskFlag: firstRisk(result.riskFlags),
    redFlag: firstRedFlag(result.redFlags),
    disclaimer: selectPreviewNote(result),
  };
}

function projectBase(result) {
  return {
    tier: 'base',
    resultVersion: result.resultVersion,
    caseSnapshot: result.caseSnapshot,
    topActions: result.topActions,
    deadlines: result.deadlines,
    riskFlags: result.riskFlags,
    redFlags: result.redFlags,
    documentChecklist: result.documentChecklist,
    disclaimers: result.disclaimers,
  };
}

function projectUpgrade(result) {
  return {
    tier: 'upgrade',
    resultVersion: result.resultVersion,
    caseSnapshot: result.caseSnapshot,
    synthesisDecision: {
      primaryTrack: result.synthesisDecision.primaryTrack,
      reasoning: result.synthesisDecision.reasoning,
      confidenceClass: result.synthesisDecision.confidenceClass,
    },
    topActions: result.topActions,
    deadlines: result.deadlines,
    riskFlags: result.riskFlags,
    redFlags: result.redFlags,
    documentChecklist: result.documentChecklist,
    advisorQuestions: result.advisorQuestions,
    opportunities: result.opportunities,
    disclaimers: result.disclaimers,
  };
}

function projectResultForTier(result, options = {}) {
  const tier = options.tier || 'base';

  if (tier === 'preview') return projectPreview(result);
  if (tier === 'base') return projectBase(result);
  if (tier === 'upgrade') return projectUpgrade(result);

  throw new Error(`Unknown result tier: ${tier}`);
}

module.exports = {
  projectResultForTier,
};
