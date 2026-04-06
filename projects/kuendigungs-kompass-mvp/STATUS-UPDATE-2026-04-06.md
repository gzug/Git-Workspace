# Kündigungs-Kompass — Status Update 2026-04-06

## Stand jetzt
- Repo ist sauber gesichert; letzter abgeschlossener Block ist jetzt **Integration Contract + dünner Caller-Entscheid**
- Launch Hardening ist nicht mehr nur Doku, sondern hat weiter belastbare Gate-/Test-Artefakte:
  - Go/No-Go-Gate (`LAUNCH-HARDENING-DONE.md`)
  - ausführbaren Gate-Test (`test-launch-hardening-done.js`)
  - Drift-/Härtefall-Anker (`test-launch-hardening-anchors.js`)
- Monitoring/Telemetrie ist V1-seitig lokal andockbar:
  - `src/runtime/telemetry/emitResultViewEvent.js`
  - `src/runtime/telemetry/fileTelemetrySink.js`
  - `src/runtime/telemetry/aggregateTelemetry.js`
  - `src/demo.js --telemetry-out <path>`
  - `vault/runbooks/kk-telemetry-dev.md`
- `INTEGRATION-CONTRACT-V1.md` ist jetzt auf den aktuellen Runtime-/Telemetry-Stand gezogen
- V1-Entscheid ist fest: **kein zusätzlicher äußerer Caller-Layer**; künftiger UI/API-Anschluss bleibt ein dünner Adapter über `buildQuestionnaireResultView(..., { onEvent })`
- relevante Verifikationsläufe für diesen Block sind grün:
  - `node test-questionnaire-result-view.js`
  - `node test-runtime-telemetry.js`
- sichtbarer Output ist für Kernfälle stark gehärtet
- `agents/coder/` ist spezifiziert, aber **nicht aktiviert**

## Aktueller Engpass
Der Engpass ist weiter **nicht** neue Produktlogik und **nicht** breites Feature-Bauen.

Der saubere Stand ist jetzt:
- die Runtime ist der fachliche Kern
- `onEvent` ist der einzige kanonische Emissionspunkt
- der spätere UI/API-Caller soll nur aufrufen, Zustände mappen und optional einen Sink anschließen

Kurz:
**Keine neue Architektur auf Verdacht bauen. Erst wieder anfassen, wenn ein echter konkreter Caller mehr braucht als Aufruf + Status-Mapping + optionalen Sink.**

## Nächste autonome Aufgaben
### 1. Launch-Hardening weiter nur dort schärfen, wo echter Drift sichtbar ist
**Ziel:** keine neue Fläche bauen, sondern nur konkrete Mismatches zwischen Runtime, Snapshots, Fixtures und Steuerdoku schließen.

**Nicht tun:**
- keine Frontend-Debatte
- kein API-Server
- keine neue State-Machine
- keine Analytics-/Vendor-Auswahl

### 2. UI/API-Anschluss nur bei echtem Bedarf wieder öffnen
**Ziel:** den dünnen Anschluss nicht wieder künstlich aufblasen.

**Erlaubte Ergebnisse:**
- direkter Runtime-Aufruf bleibt bestehen
- optional ein sehr kleiner echter Caller-Beispielpfad, aber nur wenn ein konkreter Integrationskontext ihn wirklich erzwingt

**Stop-Regel:**
Wenn dafür Produkt- oder API-Entscheidungen fehlen, **stoppen statt raten**.

## Harte Grenzen für den nächsten Block
Nicht anfassen in diesem Schritt:
- State Machine / Prozess-Orchestrierung
- Domänen-Breite / neue Rechtsbereiche
- breites Website-/Frontend-Bauen
- Aktivierung von `Coder`
- Analytics-/Monitoring-Toolauswahl

## Wiedereinstieg nach Restart
1. diese Datei lesen
2. `PROJECT-STATUS.md`
3. `EXECUTION-BOARD.md`
4. `INTEGRATION-CONTRACT-V1.md`
5. dann nur noch die blockrelevanten Launch-Hardening-Dateien öffnen

## Wenn etwas unklar wird
Nicht breit neu konzipieren.
Erst prüfen:
- ist es wirklich für Launch-Hardening oder einen realen Caller nötig?
- wenn nein: nicht jetzt
- wenn ja, aber Produkturteil nötig: stoppen und Y. fragen
