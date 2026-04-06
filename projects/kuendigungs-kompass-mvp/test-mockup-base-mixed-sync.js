const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = __dirname;
const MOCKUP_PATH = path.join(ROOT, 'mockup/static-result-mockup.html');
const SNAPSHOT_PATH = path.join(ROOT, 'examples/render-snapshots/06-mehrere-eingaenge-gleichzeitig.base.txt');

function extractDataObject(html) {
  const match = html.match(/const DATA = (\{[\s\S]*?\n    \};)\n\n    const CASE_ORDER =/);
  if (!match) throw new Error('Could not extract DATA object from static-result-mockup.html');
  const script = `${match[0].replace(/\n\n    const CASE_ORDER =[\s\S]*$/, '')}\nDATA;`;
  return vm.runInNewContext(script, {});
}

function run() {
  const html = fs.readFileSync(MOCKUP_PATH, 'utf8');
  const data = extractDataObject(html);
  const mixedBase = data.mixed?.tiers?.base;
  assert.ok(mixedBase, 'Missing mixed base tier in static mockup');

  const snapshot = fs.readFileSync(SNAPSHOT_PATH, 'utf8').trim();
  const mockupText = [
    mixedBase.headline,
    ...mixedBase.sections.flatMap((section) => section.list || []),
  ].join('\n');

  const expectedFragments = [
    'Bei dir greifen gerade mehrere wichtige Themen gleichzeitig ineinander',
    '3-Wochen-Frist für Kündigungsschutzklage sofort prüfen — Wenn diese kurze Frist läuft, sollte sie im Mehrfachfall nicht hinter Vertrags- oder Sonderfallthemen zurückfallen.',
    'Vor der Unterschrift kurz innehalten — Solange noch nichts unterschrieben ist, sollte der Vertrag nicht vorschnell zusätzlichen Druck erzeugen.',
    'Besonderheiten individuell prüfen lassen — Dein Fall hat Merkmale, die über eine typische Kündigung hinausgehen und individuell geprüft werden sollten.',
    'Bei der Agentur für Arbeit arbeitssuchend melden: bei Ende am 30.04.2026 grundsätzlich bis 30.01.2026; falls dir das Ende erst später bekannt wurde, regelmäßig innerhalb von 3 Tagen nach Kenntnis',
    'Diese Meldung sollte nicht aufgeschoben werden, auch wenn der Vertrag noch nicht unterschrieben ist.',
    'Kündigungsschutzklage prüfen: regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung (ausgehend vom angegebenen Zugangsdatum: bis 13.04.2026)',
    'Fällt das rechnerische Fristende auf Samstag oder Sonntag, sollte der nächste Werktag mitgeprüft werden. Wenn ein Landesfeiertag in Frage kommt, sollte das Fristende vorsichtshalber zusätzlich geprüft werden.',
    'Überlagerter Mehrfachfall mit möglichem Sonderfall — Hier laufen mehrere wichtige Themen gleichzeitig. Deshalb braucht dein Fall eine klare Priorisierung, aber keine vorschnelle Standardantwort. Nächster sinnvoller Schritt: Qualifizierte individuelle Prüfung mit Anwalt, Gewerkschaft oder passender Beratungsstelle.',
    'Sperrzeit-/Ruhensrisiko bei möglicher Vertragsmitwirkung — Ein noch nicht unterschriebener Vertrag kann zusätzliche Risiken beim Arbeitslosengeld auslösen.',
    'Möglicher Sonderfall / unklare Schutzlage — Solange unklar ist, ob ein besonderer Schutz greift, sollte der Fall nicht als Standardfall behandelt werden.',
    'Mehrfachdruck erhöht Fehlentscheidungsrisiko — Wenn Kündigung, Vertrag und Schutzfragen gleichzeitig auftauchen, steigt das Risiko falscher Priorisierung.',
    'Aufhebungs-/Abwicklungsvertrag oder Entwurf (schon gesichert) — Nur mit dem konkreten Text lassen sich Risiken und offene Punkte sinnvoll prüfen.',
    'Arbeitsvertrag (jetzt sichern) — Wichtig für die Ausgangslage und mögliche Rückfragen in der Beratung.',
    'Infos zu Freistellung / Urlaub / Restansprüchen (jetzt sichern) — Relevant, weil Freistellung organisatorisch wichtig bleibt und offene Ansprüche später eine Rolle spielen können.',
    'Nachweise zum möglichen Schutzstatus (jetzt sichern) — Falls vorhanden, helfen diese Unterlagen, den Sonderfall schneller individuell einzuordnen.',
    'Hier ist eine klare Reihenfolge wichtig, aber keine vorschnelle Scheinsicherheit.',
    'Die Arbeitsuchendmeldung ist der frühe Schritt, sobald das Ende des Arbeitsverhältnisses absehbar ist. Die Arbeitslosmeldung ist davon getrennt und wird erst bei tatsächlicher Arbeitslosigkeit relevant.',
  ];

  for (const fragment of expectedFragments) {
    assert.ok(mockupText.includes(fragment), `Missing mockup fragment: ${fragment}`);
    assert.ok(snapshot.includes(fragment), `Snapshot no longer contains expected fragment: ${fragment}`);
  }

  console.log('Static mockup mixed base sync test passed.');
}

run();
