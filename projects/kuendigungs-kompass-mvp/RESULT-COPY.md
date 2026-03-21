# Kündigungs-Kompass MVP — Result Copy Layer

Ziel: aus `synthesisDecision.primaryTrack` und den vorhandenen Result-Blöcken nutzerverständliche Antwortbausteine formen, ohne das Datenmodell aufzublähen.

## Prinzip

Die Ausgabe besteht aus 4 Schichten:

1. **Klartext-Headline** — sagt sofort, worum es jetzt wirklich geht.
2. **Kurz-Einordnung** — 2–3 Sätze zur Lage ohne Rechtsberatungs-Ton.
3. **Nächste Schritte** — aus `topActions` in natürlicher Sprache.
4. **Fristen / Risiken / Unterlagen** — nur so viel wie nötig, geordnet nach Relevanz.

---

## Copy-Template je `primaryTrack`

### 1) `deadline-first`

**Headline-Muster**
- Jetzt zuerst: Fristen und Meldungen im Blick behalten.
- Bei dir kommt es gerade darauf an, dass keine Frist und keine Meldung durchrutscht.

**Kurz-Einordnung**
- In deiner Situation ist es wichtiger, Zeitkritisches zu sichern, als jeden Aspekt sofort vollständig zu sortieren.
- Deshalb stehen Agentur-Meldungen und kurze Fristen jetzt vorn.

**CTA-/TopAction-Ton**
- Starte mit den Meldungen und Fristen — den Rest kannst du danach in Ruhe angehen.

### 2) `alg1-risk-first`

**Headline-Muster**
- Jetzt zuerst sicherstellen, dass dein Arbeitslosengeld nicht in Gefahr gerät.
- Bei dir hängt gerade am meisten davon ab, wie die Meldungen und die Beendigung laufen.

**Kurz-Einordnung**
- Wenn bestimmte Meldungen fehlen oder die Beendigung des Arbeitsverhältnisses ungünstig gestaltet ist, kann das Auswirkungen auf dein Arbeitslosengeld haben.
- Deshalb kommen diese Punkte jetzt zuerst.

**CTA-/TopAction-Ton**
- Fang mit den Meldungen und der Vertragsseite an — danach lässt sich der Rest besser einordnen.

### 3) `contract-do-not-sign`

**Headline-Muster**
- Vor der Unterschrift kurz innehalten.
- Dieser Vertrag ist gerade der Punkt, der am meisten beeinflusst, wie es weitergeht.

**Kurz-Einordnung**
- Ein Aufhebungs- oder Abwicklungsvertrag hat Folgen für dein Arbeitslosengeld und deinen Handlungsspielraum — beides sollte vor einer Unterschrift klar sein.
- Es lohnt sich, einen Moment zu warten und die wichtigen Punkte zuerst zu prüfen.

**CTA-/TopAction-Ton**
- Erst Folgen und Optionen klären, dann entscheiden.

### 4) `special-case-review`

**Headline-Muster**
- Dein Fall hat Besonderheiten, die individuell geprüft werden sollten.
- Hier ist eine sorgfältige Einordnung wichtiger als eine schnelle Antwort.

**Kurz-Einordnung**
- Es gibt Hinweise, dass dein Fall Aspekte hat, die über eine Standard-Kündigung hinausgehen.
- Deshalb stehen Fristschutz und gezielte Prüfung jetzt im Vordergrund — statt pauschaler Einordnungen.

**CTA-/TopAction-Ton**
- Fristen zuerst absichern, dann individuell klären lassen.

### 5) `prepare-advice`

**Headline-Muster**
- Gut vorbereitet in den nächsten Schritt gehen.
- Dein stärkster nächster Zug ist eine klare Vorbereitung.

**Kurz-Einordnung**
- Wenn noch nicht alles klar ist, bringt ein gut vorbereiteter Beratungstermin oft mehr als ein schneller Einzelschritt.
- Deshalb kommen jetzt Unterlagen, Fragen und Prioritäten als Erstes.

**CTA-/TopAction-Ton**
- Unterlagen, Fragen und Fristen ordnen — dann gezielt handeln.

---

## Antwortbausteine für wiederkehrende Inhalte

### Arbeitsuchendmeldung

**Kurzbaustein**
- Die Arbeitsuchendmeldung ist ein eigener Schritt und sollte jetzt geprüft oder nachgeholt werden — sie ist nicht dasselbe wie die spätere Arbeitslosmeldung.

### Arbeitslosmeldung

**Kurzbaustein**
- Wenn dein Arbeitsverhältnis schon beendet ist und du jetzt arbeitslos bist, ist die Arbeitslosmeldung ein eigener, zeitkritischer Schritt — der sich von der Arbeitsuchendmeldung unterscheidet.

### Kündigungsschutzklage / 3-Wochen-Frist

**Kurzbaustein**
- Nach einer schriftlichen Kündigung läuft in der Regel eine kurze Frist. Es lohnt sich, das zeitnah einzuordnen.

### Vertrag noch nicht unterschrieben

**Kurzbaustein**
- Vor der Unterschrift ist es sinnvoll, die möglichen Folgen für Arbeitslosengeld, Fristen und Optionen zu kennen.

### Vertrag schon unterschrieben

**Kurzbaustein**
- Da der Vertrag bereits unterschrieben ist, geht es jetzt darum, die nächsten Schritte, offene Fristen und mögliche Folgen sauber einzuordnen.

### Sonderfallindikator

**Kurzbaustein**
- Dein Fall hat Merkmale, die über eine typische Kündigung hinausgehen und individuell geprüft werden sollten.

### Freistellung

**Kurzbaustein**
- Auch während einer Freistellung bleiben Fristen, Meldungen und wichtige Unterlagen relevant.

---

## Empfohlene Ausgabestruktur im Frontend oder Prompt-Layer

### A. Sehr kurze Version

- **Dein Fokus jetzt:** `{headline}`
- **Wichtigster nächster Schritt:** `topActions[0].label`
- **Kritische Frist:** erste Deadline mit `importance = critical`

Gut für:
- WhatsApp-/Chat-Vorschau
- Teaser nach dem Fragebogen

### B. Standard-MVP-Version

1. Headline aus `caseSnapshot.headline`
2. 2–3 Sätze Einordnung aus Track-Template + `caseSnapshot.situation`
3. Top 3 Schritte aus `topActions`
4. Kritische Fristen aus `deadlines`
5. Falls vorhanden: `riskFlags`
6. Falls vorhanden: `redFlags`
7. Unterlagenblock aus `documentChecklist`
8. 1 kurzer Disclaimer-Block

Gut für:
- Hauptausgabe des MVP

### C. Beratungs-Vorbereitung

1. Headline
2. Warum dieser Track gewählt wurde (`synthesisDecision.reasoning`)
3. TopActions
4. Dokumente
5. `advisorQuestions`

Gut für:
- PDF, Export oder Vorbereitung auf Anwalt / Gewerkschaft / Agentur

---

## Mapping-Hinweise

### `topActions`
Ausgabe nicht roh als Datensatz, sondern als klare Verben:
- „Sofort prüfen oder nachholen“
- „Nicht unterschreiben“
- „Unterlagen bündeln“
- „Beratung vorbereiten“

### `deadlines`
Immer mit Prioritätssprache versehen:
- `critical` → „kritisch“ / „jetzt prüfen“
- `high` → „zeitnah“
- `medium` → „mit einplanen“

### `riskFlags`
Nicht dramatisieren, aber klar benennen:
- „Hier droht ein Nachteil“
- „Das kann Folgen haben“
- keine Absolut- oder Garantiesprache

### `redFlags`
Immer als Eskalation formulieren:
- „Das sollte individuell geprüft werden“
- nicht: „Du hast sicher Sonderkündigungsschutz“

---

## Guardrails für die Copy

Nicht schreiben:
- „Du bekommst sicher Arbeitslosengeld ohne Sperre“
- „Die Kündigung ist unwirksam“
- „Du hast Anspruch auf Abfindung in Höhe von X“
- „Freistellung bedeutet, dass nichts mehr zu tun ist“

Stattdessen schreiben:
- „prüfen“
- „kann Folgen haben“
- „sollte jetzt priorisiert werden“
- „im Einzelfall gesondert klären"

---

## Operative Einschätzung

Für den MVP reicht ein **Template-Layer pro `primaryTrack` plus wiederverwendbare Bausteine** völlig aus.

Mehr braucht es in diesem Block nicht.
