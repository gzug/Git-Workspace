# Kündigungs-Kompass — Integration Contract V1

Stand: 2026-04-06
Status: aktualisiert auf Block-4-Runtime

## Urteil
Für V1 ist **kein zusätzlicher äußerer Systemlayer** nötig.
Der künftige UI/API-Caller bleibt ein **dünner Adapter** über `buildQuestionnaireResultView(...)`:
1. rohen Input entgegennehmen
2. gewünschte Produktstufe setzen
3. optionalen Event-Sink als `onEvent` durchreichen
4. den resultierenden View-State unverfälscht an UI/API weitergeben

---

## Ziel
Den aktuellen Runtime-Vertrag so festziehen, dass ein späterer UI/API-Anschluss ohne neue Produkt- oder Infrastrukturdebatte andocken kann.

Wichtig:
- die Runtime bleibt der fachliche Kern
- Telemetrie bleibt ein externer Hook, nicht neue Core-Logik
- der Caller orchestriert nur den Aufruf und die Zustandsweitergabe

---

## 1. Kanonischer Runtime-Entry
### Führende Funktion
```js
buildQuestionnaireResultView(rawInput, {
  tier: 'preview' | 'base' | 'upgrade',
  onEvent,
})
```

### Aktueller Runtime-Pfad
```text
rawInput
→ normalizeQuestionnaireInput
→ getQuestionnaireFlowState
→ buildResult
→ projectResultForTier
→ renderProductResult
→ View-State + telemetry
```

### Wichtig zum Options-Objekt
Für den echten UI/API-Caller gehören nur diese Felder in den normalen Vertrag:
- `tier`
- `onEvent`

Die optionalen Injections `buildFn`, `projectFn`, `renderFn` existieren für Tests/Dev-Hooks und sind **kein** normaler Produktvertrag für spätere Caller.

---

## 2. Input-Vertrag
### Erwarteter Input
`rawInput` ist ein flaches Objekt mit Fragebogen-/API-Antworten.

Beispiel:
```json
{
  "case_entry": "termination_received",
  "termination_access_date": "2026-03-18",
  "employment_end_date": "2026-03-20",
  "jobseeker_registered": false,
  "already_unemployed_now": true,
  "unemployment_registered": false,
  "agreement_present": false,
  "release_status": "no",
  "special_protection_indicator": ["none_known"],
  "documents_secured": ["termination_letter", "employment_contract"],
  "primary_goal": "protect_deadlines"
}
```

### Was die Runtime selbst übernimmt
Die Runtime übernimmt intern:
- Typnormalisierung
- leere Werte → `null` / `[]`
- Bool-/Multi-Select-Normalisierung
- konservative Behandlung von Unknown-/Widerspruchsfällen
- Flow-Vollständigkeitsprüfung vor Result-Building

### Was der Caller nicht tun soll
Der äußere Caller soll **keine** zweite Vorlogik bauen für:
- Track-Wahl
- Pflichtfeldentscheidung
- konservative Unknown-Behandlung
- Teil- oder Fallback-Resultate
- Produktstufen-Priorisierung

Kurz: **kein fachliches Vorrechnen außerhalb der Runtime**.

---

## 3. Tier-Vertrag
### Unterstützte Tiers
- `preview`
- `base`
- `upgrade`

### Verhalten bei unbekanntem Tier
- die Runtime fällt kontrolliert auf `base` zurück
- `requestedTier` bleibt erhalten
- in `warnings` steht der Fallback-Hinweis
- Telemetrie zählt das als Warning, nicht als Crash

Der Caller darf diesen Fallback anzeigen oder loggen, soll ihn aber nicht mit eigener Tier-Logik überschreiben.

---

## 4. Output-Vertrag: View-States
Jeder Aufruf liefert genau **einen** View-State zurück.

### `ready`
Bedeutung:
- Flow vollständig
- Result gebaut
- Tier-Projektion gebaut
- Rendering erfolgreich

Relevante Felder:
- `status: 'ready'`
- `requestedTier`
- `tier`
- `warnings`
- `normalizedInput`
- `flowState`
- `result`
- `projected`
- `rendered`
- `telemetry`

### `incomplete`
Bedeutung:
- Routing-kritische Angaben fehlen noch
- Runtime rechnet **nicht** still ein scheinbar fertiges Result aus

Relevante Felder:
- `status: 'incomplete'`
- `requestedTier`
- `tier`
- `warnings`
- `normalizedInput`
- `flowState`
- `missingAnswers`
- `message`
- `telemetry.flowAbandonment`

### `render-fallback`
Bedeutung:
- fachliches Result ist vorhanden
- Tier-Projektion ist vorhanden
- Text-/Render-Schicht ist fehlgeschlagen
- strukturierter Fallback bleibt erhalten

Relevante Felder:
- `status: 'render-fallback'`
- `requestedTier`
- `tier`
- `warnings`
- `normalizedInput`
- `flowState`
- `result`
- `projected`
- `rendered: null`
- `error.code = 'render_failed'`
- `telemetry`

### `error`
Bedeutung:
- harter technischer Fehler vor fertigem View

Aktuelle Error-Codes:
- `invalid_input`
- `build_result_failed`
- `project_result_failed`

Relevante Felder:
- `status: 'error'`
- `error`
- `telemetry`
- je nach Fehlerstufe zusätzlich `normalizedInput`, `flowState`, `result`

---

## 5. Telemetrie- und Hook-Vertrag
### Kanonischer Hook
```js
buildQuestionnaireResultView(rawInput, { tier, onEvent })
```

### Hook-Regeln
- `onEvent` ist optional
- pro gebautem View wird genau **ein** Event emittiert
- das Event ist aktuell identisch zu `view.telemetry`
- Sink-Fehler dürfen den Runtime-Pfad **nie** kaputtmachen

### Aktuelles Event
Event-Name:
- `questionnaire_result_view_built`

Felder:
- `status`
- `requestedTier`
- `tier`
- `warningCount`
- `missingAnswersCount`
- `primaryTrack`
- `riskLevel`
- `topActionsCount`
- `deadlinesCount`
- `redFlagsCount`
- `errorCode`
- `flowAbandonment`
- `generatedAt`

### Wichtige Rollentrennung
Die Runtime ist nur für den **einen kanonischen Emissionspunkt** zuständig.
Der äußere Caller ist zuständig für:
- welchen Sink er anschließt
- wohin Events geschrieben/weitergeleitet werden
- spätere Persistenz-/Logger-/API-Integration
- eventuelle Mehrfach-Sinks außerhalb der Runtime

Nicht in die Runtime ziehen:
- Vendor-SDKs
- Retry-/Queue-Logik
- Analytics-Produktschnittstellen
- API-spezifische Response-Metadaten

---

## 6. Verantwortung des künftigen UI/API-Callers
### Muss tun
Der äußere Caller soll nur:
1. `rawInput` entgegennehmen
2. `tier` aus UI/API-Kontext bestimmen
3. optional einen Sink bauen, z. B. Logger, File-Sink oder späteren API-Bridge-Sink
4. `buildQuestionnaireResultView(rawInput, { tier, onEvent })` aufrufen
5. nach `status` die passende UI/API-Reaktion ausspielen

### Darf tun
- `warnings` intern loggen oder technisch anzeigen
- bei `incomplete` Resume-/Weiterleitungslogik an `missingAnswers` und `flowState.nextScreen` andocken
- bei `render-fallback` den strukturierten Fallback intern oder technisch nutzen
- bei `error` einen klaren Stop-/Fallback-Pfad auslösen

### Darf nicht tun
- keinen zweiten fachlichen Result-Build versuchen
- keine eigene Red-Flag-/Deadline-Logik nachschieben
- keinen alternativen Event-Kernpfad definieren
- keine neue State-Machine erfinden, solange nur ein dünner Anschluss gebraucht wird

---

## 7. Dünnster sinnvolle Caller-Schnitt
### Referenzmuster
```js
const view = buildQuestionnaireResultView(rawInput, {
  tier: requestedTier,
  onEvent,
});
```

Mehr braucht ein V1-Caller fachlich nicht.

### Beispiel: API-/UI-nahe Orchestrierung
```js
function runQuestionnaire(rawInput, { tier = 'base', onEvent } = {}) {
  return buildQuestionnaireResultView(rawInput, { tier, onEvent });
}
```

### Status-Mapping außerhalb der Runtime
- `ready` → normale Ergebnisansicht / API-Response
- `incomplete` → fehlende Fragen + nächster Screen
- `render-fallback` → strukturierte Auswertung behalten, Renderfehler operativ sichtbar machen
- `error` → technischer Stop-Pfad

Der Caller mappt also **nur Zustände**, nicht Fachlogik.

---

## 8. V1-Entscheidung zum äußeren Caller
Aktueller Entscheid:
**Kein zusätzlicher Adapter-Code nötig.**

Grund:
- `buildQuestionnaireResultView(...)` ist bereits der dünne Orchestrator
- `onEvent` ist bereits der saubere externe Hook
- `src/demo.js --telemetry-out <path>` beweist den kleinsten realen Caller-Pfad bereits praktisch
- `src/runtime/telemetry/fileTelemetrySink.js` und `aggregateTelemetry.js` decken den lokalen Dev-Anschluss ab, ohne neue Produktschicht zu bauen

Konsequenz:
- für V1 bleibt der spätere UI/API-Anschluss ein direkter Aufruf der Runtime-Funktion
- zusätzlicher Caller-Code ist erst sinnvoll, wenn ein echter konkreter UI/API-Kontext mehr verlangt als bloß Aufruf + Status-Mapping + optionaler Sink

---

## 9. Nicht jetzt tun
- keinen API-Server vorbauen
- kein Frontend-Gerüst auf Verdacht bauen
- keine neue Persistenzschicht in die Runtime ziehen
- keine zweite Event-Art nur aus Architektur-Ästhetik einführen
- keine Vendor- oder Tool-Entscheidung im Contract festschreiben

---

## 10. Evidenz / Drift-Schutz
Dieser Vertrag ist aktuell durch folgende Artefakte gedeckt:
- `src/runtime/buildQuestionnaireResultView.js`
- `src/runtime/telemetry/emitResultViewEvent.js`
- `src/runtime/telemetry/fileTelemetrySink.js`
- `src/runtime/telemetry/aggregateTelemetry.js`
- `src/demo.js`
- `test-questionnaire-result-view.js`
- `test-runtime-telemetry.js`
- `MONITORING-ANALYTICS-V1.md`
- `vault/runbooks/kk-telemetry-dev.md`

## Done-When
Dieser Contract ist für Block 4 ausreichend, wenn:
- kein Block-3-Stale-Stand mehr drin ist
- der künftige UI/API-Caller klar als dünner Adapter beschrieben ist
- `onEvent` sauber als externer Hook definiert ist
- kein neuer Systemlayer still vorausgesetzt wird
