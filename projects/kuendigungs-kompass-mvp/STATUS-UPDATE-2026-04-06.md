# Kündigungs-Kompass — Status Update 2026-04-06

## Stand jetzt
- Repo ist sauber gesichert; letzter abgeschlossener Block: **Dev-Hook + Telemetrie-Runbook**
- Launch Hardening ist nicht mehr nur Doku, sondern hat jetzt:
  - Go/No-Go-Gate (`LAUNCH-HARDENING-DONE.md`)
  - ausführbaren Gate-Test (`test-launch-hardening-done.js`)
  - Drift-/Härtefall-Anker (`test-launch-hardening-anchors.js`)
- Monitoring/Telemetrie ist V1-seitig lokal andockbar:
  - `src/runtime/telemetry/emitResultViewEvent.js`
  - `src/runtime/telemetry/fileTelemetrySink.js`
  - `src/runtime/telemetry/aggregateTelemetry.js`
  - `src/demo.js --telemetry-out <path>`
  - `vault/runbooks/kk-telemetry-dev.md`
- sichtbarer Output ist für Kernfälle stark gehärtet
- `agents/coder/` ist spezifiziert, aber **nicht aktiviert**

## Aktueller Engpass
Der nächste Engpass ist **nicht** neue Produktlogik und **nicht** breiteres Feature-Bauen, sondern der dünnste saubere Übergang von der bestehenden Runtime zu einem späteren UI/API-Aufrufer.

Kurz:
**Wie dockt ein äußerer Caller sauber an `buildQuestionnaireResultView(..., { onEvent })` an, ohne das Projekt wieder in Website-/Infra-Breite zu ziehen?**

## Nächste autonome Aufgaben
### 1. Integration Contract auf aktuellen Stand ziehen
**Ziel:** `INTEGRATION-CONTRACT-V1.md` von Block-3-Vorarbeit auf den aktuellen Block-4-Stand heben.

**Dabei festziehen:**
- aktueller Runtime-Vertrag (`ready`, `incomplete`, `render-fallback`, `error`)
- Rolle von `buildQuestionnaireResultView(...)`
- Rolle des optionalen `onEvent`
- äußerer Telemetrie-Anschluss als externer Hook, nicht als Runtime-Core-Logik
- kleinste sinnvolle Verantwortung eines künftigen UI/API-Callers

**Nicht tun:**
- keine neue Produktlogik
- keine Frontend-Debatte
- keine Vendor-Entscheidung
- keine neue State-Machine

**Done when:**
- `INTEGRATION-CONTRACT-V1.md` enthält keine Block-3-Stale-Annahmen mehr
- der künftige äußere Caller ist als dünner Adapter beschrieben, nicht als neuer Systemlayer

---

### 2. Danach nur wenn Task 1 klar ist: dünnsten äußeren Caller skizzieren
**Ziel:** entscheiden, ob ein kleiner zusätzlicher technischer Adapter wirklich nötig ist.

**Erlaubte Ergebnisse:**
- entweder **nur** ein sauberer Vertrag / kein weiterer Code nötig
- oder ein **sehr kleiner** zusätzlicher Adapter/Beispielpfad, wenn damit der spätere UI/API-Anschluss real deutlich klarer wird

**Wichtig:**
- kein echter Frontend-Bau
- kein API-Server
- keine breite neue Runtime-Fläche
- nur der dünnste sinnvolle Anschluss

**Stop-Regel:**
Wenn dafür echte Produkt- oder API-Entscheidungen fehlen, **stoppen statt raten**.

---

### 3. Danach Drift schließen und erneut prüfen
Wenn 1 oder 2 Änderungen erzeugen:
- relevante Tests laufen lassen
- nur wirklich betroffene Steuerdateien synchronisieren
- dann sauber stoppen

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
4. dann `INTEGRATION-CONTRACT-V1.md`
5. danach direkt mit Aufgabe 1 starten

## Wenn etwas unklar wird
Nicht breit neu konzipieren.
Erst prüfen:
- ist es wirklich für den dünnen UI/API-Anschluss nötig?
- wenn nein: nicht jetzt
- wenn ja, aber Produkturteil nötig: stoppen und Y. fragen
