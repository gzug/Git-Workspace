const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = __dirname;
const MOCKUP_PATH = path.join(ROOT, 'mockup/static-result-mockup.html');
const SNAPSHOT_PATH = path.join(ROOT, 'examples/render-snapshots/05-kuendigung-nur-angekuendigt.base.txt');

function extractDataObject(html) {
  const match = html.match(/const DATA = (\{[\s\S]*?\n    \};)\n\n    const CASE_ORDER =/);
  if (!match) throw new Error('Could not extract DATA object from static-result-mockup.html');
  const script = `${match[0].replace(/\n\n    const CASE_ORDER =[\s\S]*$/, '')}\nDATA;`;
  return vm.runInNewContext(script, {});
}

function run() {
  const html = fs.readFileSync(MOCKUP_PATH, 'utf8');
  const data = extractDataObject(html);
  const announcedBase = data.announced?.tiers?.base;
  assert.ok(announcedBase, 'Missing announced base tier in static mockup');

  const snapshot = fs.readFileSync(SNAPSHOT_PATH, 'utf8').trim();

  const expectedFragments = [
    'Noch keine schriftliche Kündigung – jetzt die nächsten Schritte sauber vorbereiten',
    'Jetzt bei der Agentur für Arbeit arbeitssuchend melden oder Status prüfen — Die Arbeitsuchendmeldung ist ein eigener Schritt und sollte jetzt geprüft oder nachgeholt werden — sie ist nicht dasselbe wie die spätere Arbeitslosmeldung.',
    'Schriftliche Kündigung erst zeitnah einordnen, wenn sie vorliegt — Nach einer schriftlichen Kündigung läuft in der Regel eine kurze Frist. Solange noch nichts Schriftliches vorliegt, sollte das sauber getrennt bleiben.',
    'Kernunterlagen schon jetzt sichern — Wenn sich die Lage zuspitzt, spart vorbereitete Dokumentation Zeit und Fehler.',
    'Bei der Agentur für Arbeit arbeitssuchend melden: bei Ende am 30.06.2026 grundsätzlich bis 30.03.2026; falls dir das Ende erst später bekannt wurde, regelmäßig innerhalb von 3 Tagen nach Kenntnis',
    'Diese Meldung sollte nicht aufgeschoben werden, auch wenn die Beendigung bisher nur angekündigt ist oder noch Unterlagen fehlen.',
    'Frühe Agentur-Schritte könnten übersehen werden — Wer nur auf das schriftliche Kündigungsschreiben wartet, kann frühe To-dos bei der Agentur aus dem Blick verlieren.',
    'Schriftliche Kommunikation zur angekündigten Kündigung (jetzt sichern) — Hilfreich, um den Verlauf später nachvollziehen zu können.',
    'Arbeitsvertrag (jetzt sichern) — Hilft bei Beratung und Einordnung der Ausgangslage.',
    'Lohnunterlagen (jetzt sichern) — Hilfreich für Agentur-Themen und Beratungsvorbereitung.',
    'Ohne schriftliche Kündigung sollte jetzt noch keine Klagefrist angenommen werden.',
    'Die Arbeitsuchendmeldung ist der frühe Schritt, sobald das Ende des Arbeitsverhältnisses absehbar ist. Die Arbeitslosmeldung ist davon getrennt und wird erst bei tatsächlicher Arbeitslosigkeit relevant.',
  ];

  const mockupText = [
    announcedBase.headline,
    ...announcedBase.sections.flatMap((section) => section.list || []),
  ].join('\n');

  for (const fragment of expectedFragments) {
    assert.ok(mockupText.includes(fragment), `Missing mockup fragment: ${fragment}`);
    assert.ok(snapshot.includes(fragment), `Snapshot no longer contains expected fragment: ${fragment}`);
  }

  console.log('Static mockup announced base sync test passed.');
}

run();
