# Kündigungs-Kompass MVP — Compact Handoff

Stand: 2026-03-22
Zweck: schneller Wiedereinstieg für Main-Agent, CleanUp oder Support-Agenten nach Pause, Reset oder Delegation.

---

## 1. Was bis hierhin passiert ist

Der Workspace und das Projekt wurden in mehreren Wellen geschärft:

### A. Agent-/Workflow-Ebene
Geschärft wurden:
- `AGENTS.md`
- `SOUL.md`
- `USER.md`
- `HEARTBEAT.md`
- `MEMORY.md`
- `vault/runbooks/agent-operations.md`
- `vault/runbooks/project-manager-agent-framework.md`
- `vault/runbooks/cleanup-intake-process.md`
- `memory/notes/cleanup-research-intake.md`

Kernänderungen:
- Main soll **orchestrator-first** arbeiten, nicht alles selbst ziehen
- Delegation früher prüfen und sauber schneiden
- Heartbeat nur bei echtem Risiko/Drift/Blocker melden
- CleanUp enger auf Intake, Vorsortierung und strukturierte Deltas geführt
- Research-Verdichtung auf **Typ / Härtegrad / MVP-Wirkung / klare Empfehlung / max. 1 Unsicherheit** geschärft
- Workspace-Lärm reduziert (`.gitignore`, `memory/notes/INBOX.md`)

### B. Projekt-Steuer- und Wiedereinstiegsdateien
Geschärft wurden:
- `projects/kuendigungs-kompass-mvp/PROJECT-STATUS.md`
- `projects/kuendigungs-kompass-mvp/README.md`
- `projects/kuendigungs-kompass-mvp/EXECUTION-BOARD.md`

Kernänderungen:
- Status und README auf den realen Projektstand gezogen
- Fokus und Risiken klarer
- Wiedereinstieg deutlich schneller
- weniger historische Archäologie, mehr aktuelle Steuerbarkeit

### C. Launch-/Flow-/Datums-/Monitoring-Dokumentation
Geschärft wurden:
- `FLOW-CONTRACT-V1.md`
- `DATE-LOGIC-MVP.md`
- `LAUNCH-HARDENING-V1.md`
- `E2E-REALITY-CHECK-V1.md`
- `MONITORING-ANALYTICS-V1.md`
- `SOFT-LAUNCH-CHECKLIST-V1.md`

Kernänderungen:
- max. 4 Screens als V1-Zielbild
- adaptive Nachfrage nur bei Routing-/Sicherheitsgewinn
- Datumslogik konservativer, weniger Scheingenauigkeit
- Launch-Reife als Routing + Guardrails + Fallbacks + Ops-Reaktion definiert
- Monitoring stärker auf Stabilität als auf Marketing/Analytics getrimmt

### D. Entscheidungen / Mapping / Copy / Rendering / Tests
Geschärft wurden:
- `V2-DECISIONS.md`
- `RESULT-MAPPING.md`
- `RESULT-COPY.md`
- `MAPPING-RENDERING-V1.md`
- `TEST-CONCEPT.md`
- `examples/PAIRS.md`

Kernänderungen:
- Unknown ist sicherer als Raten
- Basis bleibt vollständig handlungsfähig
- Upgrade ergänzt Werkzeuge, nicht zurückgehaltene Basis-Wahrheit
- Mapping priorisiert Routing / Frist / Guardrail vor Copy / Layout / Nice-to-have
- Copy-Layer ruhig, direkt, nicht alarmistisch, nicht weichgespült
- Tests stärker auf Drift, Guardrails und Fehlklassifikation fokussiert

---

## 2. Wichtige Commit-Anker

Relevante Commits in dieser Arbeitswelle:
- `81d1734` — Tighten agent ops and add support skills
- `8eaa30f` — Sharpen agent workflow and delegation rules
- `07ca3cb` — Tighten PM framework and heartbeat thresholds
- `0e19eeb` — Refresh memory with current operating focus
- `bfa7909` — Refine user preferences for focus and delegation
- `3ba2bd4` — Sharpen soul around focus and non-performative work
- `a065632` — Tighten project status and readme for faster re-entry
- `886e6e2` — Harden launch, flow, and date logic docs
- `aba0a57` — Tighten cleanup intake workflow and handoff
- `065686a` — Add cleanup rework rule for older research batches
- `e614c15` — Refine ignore rules for skill metadata
- `2af9e37` — Sharpen result mapping, copy, and test anchors
- `7b57d5f` — Ignore local workspace noise and add inbox note

---

## 3. Inhaltliche Kernentscheidungen, die jetzt gelten

Diese Punkte gelten als bewusst gezogen und sollten nicht leichtfertig wieder aufgerissen werden:

1. **Deadline-first / Guardrail-first** statt Feature-Fläche
2. **Sonderfälle eskalieren**, nicht weich zu Standardfällen umdeuten
3. **Basis muss vollständig handlungsfähig bleiben**
4. **Upgrade = Werkzeuge / Tiefe / Export / Personalisierung**, nicht zurückgehaltene Basis-Wahrheit
5. **Unknown statt Raten**, wenn Fehlklassifikation schädlicher wäre
6. **Keine Scheingenauigkeit** bei Wirksamkeit, Abfindung, Sperrzeit, Klageerfolg, ALG-Höhe
7. **Track-Explosion vermeiden** — nur echte Routing-Unterschiede rechtfertigen neue Tracks
8. **Arbeitslosmeldung vs. Arbeitsuchendmeldung** muss sauber getrennt bleiben
9. **Feiertagslogik konservativ**: bundeseinheitlich okay, Landesfeiertage nur mit Prüfhinweis sofern nicht sicher modelliert
10. **Keine Frist-/Angst-Dringlichkeit als Upsell-Hebel**

---

## 4. Aktueller Projektstand

### Was steht
- Runtime-Pfad ist real vorhanden
- Kernlogik, Ergebnis-Views, Produktstufen und Fallback-Zustände stehen
- 6 Fixture-Paare sind etabliert
- erste textuelle Render-Snapshots und Launch-Hardening-Artefakte sind vorhanden
- Blöcke 1–3 (Core Stabilization, Product Output, Integration) sind im Wesentlichen durch

### Wo der Engpass jetzt liegt
**Block 4: Launch Hardening**

Nicht neue Feature-Fläche ist der Engpass, sondern:
- konservative Fristenlogik
- Drift-Kontrolle
- Guardrails
- Unknown-/Fallback-/Routing-Sicherheit
- Snapshot-/Assertion-Abdeckung

---

## 5. Was als Nächstes zu tun ist

### Priorisierte nächste Arbeitsfolge
1. **KSchG-Wochenendlogik + konservative Feiertagshinweise** in Engine / Doku / Fixtures wirklich durchziehen
2. **Arbeitslosmeldung vs. Arbeitsuchendmeldung** logisch und sprachlich final trennen
3. **Snapshot-/Drift-Abdeckung** gezielt auf repräsentative Fälle ausbauen
4. **Unknown-/Pflichtfeld-/Fallback-Logik** im Code und in den Result-Regeln nachschärfen
5. Danach erst **UI/API- und Soft-Launch-Schicht** weiterziehen

### Nicht als Nächstes tun
- keine neue breite Konzeptschleife
- keine Track-Explosion
- keine Conversion-/Upgrade-Fläche vor stabiler Basislogik
- keine weitere Meta-Datei-Optimierung als Hauptfokus

---

## 6. Konkrete Aufgabenfelder für Agents

### Für Main-Agent
- produktnahe / runtime-nahe Arbeit priorisieren
- Code, Tests, Snapshots, Guardrails, Datumslogik, Routing
- Research nur noch gezielt integrieren, nicht breit neu sortieren

### Für CleanUp
- neue Research-Batches nach neuem Schema verdichten
- alte Verdichtungen nur dort nachziehen, wo noch echter Effekt entsteht
- zuerst alles mit **Routing / Frist / Guardrail**-Wirkung anfassen
- keine Rohtextmassen archivieren
- keine finalen Produktentscheidungen treffen

### Für Coding-/Support-Agenten
Sauber delegierbar sind jetzt vor allem:
- Assertion-/Snapshot-Erweiterungen
- klar geschnittene Logikblöcke
- Doku↔Runtime↔Fixture-Drift-Prüfung
- konservative Test- und Fixture-Arbeit

---

## 7. Wichtigste Risiken

1. Drift zwischen Research, Doku, Fixtures und Runtime
2. Scheingenaue Fristen bei unvollständigem oder unsicherem Input
3. Sonderfälle landen im Standardpfad
4. Aufhebungsvertrag wird wie Kündigung behandelt
5. Unknown wird still zu `nein` oder Standard-Track umgedeutet
6. Happy-Path-Gefühl ersetzt echte Launch-Reife

---

## 8. Schnellstart für jeden Agent nach /new oder Handoff

Wenn du neu in diesen Block einsteigst, lies in dieser Reihenfolge:
1. `projects/kuendigungs-kompass-mvp/EXECUTION-BOARD.md`
2. `projects/kuendigungs-kompass-mvp/HANDOFF-COMPACT-2026-03-22.md`
3. `projects/kuendigungs-kompass-mvp/PROJECT-STATUS.md`
4. `projects/kuendigungs-kompass-mvp/FLOW-CONTRACT-V1.md`
5. `projects/kuendigungs-kompass-mvp/DATE-LOGIC-MVP.md`
6. bei Bedarf `RESULT-MAPPING.md`, `MAPPING-RENDERING-V1.md`, `TEST-CONCEPT.md`

---

## 9. Kurzform in einem Satz

Das Projekt ist nicht mehr im Konzeptmodus, sondern in einer **konservativen Launch-Härtungsphase**, in der Routing, Fristen, Unknown-/Fallback-Logik, Guardrails und Drift-Schutz wichtiger sind als neue Features oder weitere Meta-Optimierung.
