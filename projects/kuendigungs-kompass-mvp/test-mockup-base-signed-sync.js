const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const ROOT = __dirname;
const MOCKUP_PATH = path.join(ROOT, 'mockup/static-result-mockup.html');
const SNAPSHOT_PATH = path.join(ROOT, 'examples/render-snapshots/04-vertrag-bereits-unterschrieben.base.txt');

function extractDataObject(html) {
  const match = html.match(/const DATA = (\{[\s\S]*?\n    \};)\n\n    const CASE_ORDER =/);
  if (!match) throw new Error('Could not extract DATA object from static-result-mockup.html');
  const script = `${match[0].replace(/\n\n    const CASE_ORDER =[\s\S]*$/, '')}\nDATA;`;
  return vm.runInNewContext(script, {});
}

function run() {
  const html = fs.readFileSync(MOCKUP_PATH, 'utf8');
  const data = extractDataObject(html);
  const signedBase = data.signed?.tiers?.base;
  assert.ok(signedBase, 'Missing signed base tier in static mockup');

  const snapshot = fs.readFileSync(SNAPSHOT_PATH, 'utf8').trim();
  const mockupText = [
    signedBase.headline,
    ...signedBase.sections.flatMap((section) => section.list || []),
  ].join('\n');

  const expectedFragments = [
    'Jetzt geht es um Folgen, Fristen und saubere Einordnung',
    'Unterzeichneten Vertrag sofort individuell prüfen lassen — Nach der Unterschrift geht es nicht mehr um allgemeines Bremsen, sondern um konkrete Folgen und mögliche nächste Schritte.',
    'Agentur-Themen und Leistungsfolgen gezielt klären — Mitwirkung an der Beendigung kann Auswirkungen auf Arbeitslosengeld und weitere Abläufe haben.',
    'Alle Vertrags- und Freistellungsunterlagen vollständig bündeln — Für jede belastbare Einordnung wird jetzt der genaue Wortlaut und die begleitende Dokumentation wichtig.',
    'Bereits unterschriebener Beendigungsvertrag — Hier sollte nicht mit pauschalen Aussagen gearbeitet werden, weil die konkreten Folgen individuell geprüft werden müssen. Nächster sinnvoller Schritt: Qualifizierte individuelle Prüfung mit Anwalt, Gewerkschaft oder passender Beratungsstelle.',
    'Vertrag bereits unterschrieben — Damit verschiebt sich der Fokus von allgemeiner Warnung auf Folgen, Fristen und individuelle Prüfung.',
    'ALG-I-Risiken weiter relevant — Auch nach Unterschrift können Sperrzeit- oder andere Leistungsfragen im Raum stehen.',
    'Unterzeichneter Vertrag (schon gesichert) — Der exakte Inhalt ist jetzt zentral für jede weitere Einordnung.',
    'Arbeitsvertrag (schon gesichert) — Wichtig für die Ausgangslage und mögliche Rückfragen in der Beratung.',
    'Lohnunterlagen (schon gesichert) — Hilfreich für ALG-I-Themen und die Vorbereitung auf Rückfragen.',
    'Freistellungs- und Restanspruchsinfos (schon gesichert) — Relevant, weil die praktische Abwicklung jetzt wichtig bleibt.',
    'Konkrete Rechtsfolgen eines bereits unterschriebenen Vertrags hängen stark vom Einzelfall ab.',
    'Ob der Vertrag anfechtbar oder wirksam ist, muss gesondert geprüft werden.',
  ];

  for (const fragment of expectedFragments) {
    assert.ok(mockupText.includes(fragment), `Missing mockup fragment: ${fragment}`);
    assert.ok(snapshot.includes(fragment), `Snapshot no longer contains expected fragment: ${fragment}`);
  }

  console.log('Static mockup signed base sync test passed.');
}

run();
