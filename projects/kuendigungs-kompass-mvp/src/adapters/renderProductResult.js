function pushList(lines, title, items, renderItem) {
  if (!items || items.length === 0) return;
  lines.push(`${title}:`);
  for (const item of items) lines.push(`- ${renderItem(item)}`);
  lines.push('');
}

function renderPreview(projected) {
  const lines = [];
  lines.push(`Dein Fokus jetzt: ${projected.caseSnapshot.headline}`);
  if (projected.topAction) lines.push(`Wichtigster nächster Schritt: ${projected.topAction.label}`);
  if (projected.deadline) {
    lines.push(`Kritische Frist: ${projected.deadline.label} — ${projected.deadline.timing}`);
  } else if (projected.riskFlag) {
    lines.push(`Wichtiges Risiko: ${projected.riskFlag.label}`);
  }
  if (projected.disclaimer) lines.push(`Hinweis: ${projected.disclaimer}`);
  return lines.join('\n').trim();
}

function renderBase(projected) {
  const lines = [];
  lines.push(projected.caseSnapshot.headline);
  lines.push('');
  lines.push(projected.caseSnapshot.situation);
  lines.push('');

  pushList(lines, 'Nächste Schritte', projected.topActions, (item) => `${item.label} — ${item.why}`);
  pushList(lines, 'Fristen', projected.deadlines, (item) => `${item.label}: ${item.timing}` + (item.note ? ` (${item.note})` : ''));
  pushList(lines, 'Risiken', projected.riskFlags, (item) => `${item.label} — ${item.description}`);
  pushList(lines, 'Red Flags', projected.redFlags, (item) => `${item.label} — ${item.whyEscalated}`);
  pushList(lines, 'Unterlagen', projected.documentChecklist, (item) => `${item.label} (${item.status}) — ${item.reason}`);
  pushList(lines, 'Hinweise', projected.disclaimers, (item) => item);

  return lines.join('\n').trim();
}

function renderUpgrade(projected) {
  const lines = [];
  lines.push(projected.caseSnapshot.headline);
  lines.push('');
  lines.push(`Warum dieser Fokus: ${projected.synthesisDecision.reasoning}`);
  lines.push('');

  pushList(lines, 'Nächste Schritte', projected.topActions, (item) => `${item.label} — ${item.why}`);
  pushList(lines, 'Fristen', projected.deadlines, (item) => `${item.label}: ${item.timing}` + (item.note ? ` (${item.note})` : ''));
  pushList(lines, 'Risiken', projected.riskFlags, (item) => `${item.label} — ${item.description}`);
  pushList(lines, 'Red Flags', projected.redFlags, (item) => `${item.label} — ${item.whyEscalated}`);
  pushList(lines, 'Unterlagen', projected.documentChecklist, (item) => `${item.label} (${item.status}) — ${item.reason}`);
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
