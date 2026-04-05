function pushList(lines, title, items, renderItem) {
  if (!items || items.length === 0) return;
  lines.push(`${title}:`);
  for (const item of items) lines.push(`- ${renderItem(item)}`);
  lines.push('');
}

function pushActionSections(lines, actions = []) {
  if (!actions || actions.length === 0) return;

  const [firstAction, ...restActions] = actions;
  lines.push('Als Erstes:');
  lines.push(`- ${firstAction.label} — ${firstAction.why}`);
  lines.push('');

  pushList(lines, 'Danach', restActions, (item) => `${item.label} — ${item.why}`);
}

function formatDocumentStatus(status) {
  if (status === 'already-secured') return 'schon gesichert';
  if (status === 'secure-now') return 'jetzt sichern';
  return status;
}

function renderRedFlagItem(item) {
  return `${item.label} — ${item.whyEscalated}`
    + (item.recommendedEscalation ? ` Nächster sinnvoller Schritt: ${item.recommendedEscalation}.` : '');
}

function renderDeadlineItem(item) {
  return `${item.label}: ${item.timing}`
    + (item.note ? `\n  Hinweis: ${item.note}` : '');
}

function renderPreview(projected) {
  const lines = [];
  lines.push(projected.caseSnapshot.headline);
  if (projected.topAction) lines.push(`Wichtigster nächster Schritt: ${projected.topAction.label}`);

  if (projected.redFlag) {
    lines.push(`Besonders wichtig: ${projected.redFlag.label}`);
    if (projected.redFlag.recommendedEscalation) {
      lines.push(`Sinnvoll jetzt: ${projected.redFlag.recommendedEscalation}`);
    }
  }

  if (projected.deadline) {
    lines.push(`Kritische Frist: ${projected.deadline.label} — ${projected.deadline.timing}`);
  } else if (!projected.redFlag && projected.riskFlag) {
    lines.push(`Wichtiges Risiko: ${projected.riskFlag.label}`);
  }

  if (projected.disclaimer) lines.push(`Wichtig dabei: ${projected.disclaimer}`);
  return lines.join('\n').trim();
}

function renderBase(projected) {
  const lines = [];
  lines.push(projected.caseSnapshot.headline);
  lines.push('');
  lines.push(projected.caseSnapshot.situation);
  lines.push('');

  pushActionSections(lines, projected.topActions);
  pushList(lines, 'Fristen', projected.deadlines, renderDeadlineItem);
  pushList(lines, 'Risiken', projected.riskFlags, (item) => `${item.label} — ${item.description}`);
  pushList(lines, 'Besonders wichtig', projected.redFlags, renderRedFlagItem);
  pushList(lines, 'Unterlagen', projected.documentChecklist, (item) => `${item.label} (${formatDocumentStatus(item.status)}) — ${item.reason}`);
  pushList(lines, 'Hinweise', projected.disclaimers, (item) => item);

  return lines.join('\n').trim();
}

function renderUpgrade(projected) {
  const lines = [];
  lines.push(projected.caseSnapshot.headline);
  lines.push('');
  lines.push(`Warum dieser Fokus: ${projected.synthesisDecision.reasoning}`);
  lines.push('');

  pushActionSections(lines, projected.topActions);
  pushList(lines, 'Fristen', projected.deadlines, renderDeadlineItem);
  pushList(lines, 'Risiken', projected.riskFlags, (item) => `${item.label} — ${item.description}`);
  pushList(lines, 'Besonders wichtig', projected.redFlags, renderRedFlagItem);
  pushList(lines, 'Unterlagen', projected.documentChecklist, (item) => `${item.label} (${formatDocumentStatus(item.status)}) — ${item.reason}`);
  pushList(lines, 'Fragen für Beratung', projected.advisorQuestions, (item) => item);
  pushList(lines, 'Chancen', projected.opportunities, (item) => `${item.label} — ${item.description}`);
  pushList(lines, 'Hinweise', projected.disclaimers, (item) => item);

  return lines.join('\n').trim();
}

function renderProductResult(projected, options = {}) {
  const tier = options.tier || projected.tier || 'base';

  if (tier === 'preview') return renderPreview(projected);
  if (tier === 'base') return renderBase(projected);
  if (tier === 'upgrade') return renderUpgrade(projected);

  throw new Error(`Unknown render tier: ${tier}`);
}

module.exports = {
  renderProductResult,
};
