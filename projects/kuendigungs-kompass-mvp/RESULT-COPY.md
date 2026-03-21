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
- Jetzt zuerst Fristen und Meldungen absichern.
- Bei dir zählt gerade vor allem: nichts Zeitkritisches liegen lassen.

**Kurz-Einordnung**
- In deinem Fall ist nicht die Detailbewertung zuerst entscheidend, sondern dass keine wichtige Frist oder Meldung verpasst wird.
- Deshalb priorisiert der Kompass jetzt Agentur-Themen und die Prüfung kurzer Fristen.

**CTA-/TopAction-Ton**
- Mach zuerst die Meldungen und Fristen dicht.
- Alles andere kommt danach.

### 2) `alg1-risk-first`

**Headline-Muster**
- Jetzt zuerst ALG-I-Risiken begrenzen.
- Bei dir ist das größte Risiko gerade nicht die Ordnung im Papier, sondern ein möglicher Nachteil beim Arbeitslosengeld.

**Kurz-Einordnung**
- Wenn Meldungen fehlen oder die Beendigung ungünstig läuft, kann das direkte Folgen für dein Arbeitslosengeld haben.
- Deshalb priorisiert der Kompass jetzt die Schritte, die finanzielle Nachteile eher verhindern.

**CTA-/TopAction-Ton**
- Erst ALG-I-Risiken entschärfen, dann den Rest sortieren.

### 3) `contract-do-not-sign`

**Headline-Muster**
- Nichts vorschnell unterschreiben.
- Bei dir ist der Vertrag gerade der kritische Hebel.

**Kurz-Einordnung**
- Ein Aufhebungs- oder Abwicklungsvertrag kann deine Lage schnell verschlechtern, wenn Folgen und Fristen vorher nicht sauber geprüft sind.
- Deshalb ist die klare Priorität: erst einordnen, dann entscheiden.

**CTA-/TopAction-Ton**
- Nicht unter Zeitdruck unterschreiben.
- Erst Wirkung auf ALG I, Fristen und Optionen klären.

### 4) `special-case-review`

**Headline-Muster**
- Dein Fall sollte nicht als Standardfall behandelt werden.
- Es gibt Hinweise auf einen Sonderfall, der separat geprüft werden sollte.

**Kurz-Einordnung**
- Hier wäre falsche Sicherheit gefährlicher als eine vorsichtige Eskalation.
- Der Kompass priorisiert deshalb Fristschutz plus individuelle Prüfung statt pauschaler Aussagen.

**CTA-/TopAction-Ton**
- Fristen sichern, dann gezielt beraten lassen.

### 5) `prepare-advice`

**Headline-Muster**
- Jetzt sauber für Beratung oder Anwalt vorbereiten.
- Dein nächster Hebel ist gute Vorbereitung statt Aktionismus.

**Kurz-Einordnung**
- Wenn die Lage nicht komplett klar ist, bringt ein sauber vorbereiteter Beratungstermin oft mehr als voreilige Einzelaktionen.
- Der Kompass ordnet deshalb Fragen, Unterlagen und die wichtigsten Punkte vor.

**CTA-/TopAction-Ton**
- Unterlagen, Fragen und Fristen geordnet mitnehmen.

---

## Antwortbausteine für wiederkehrende Inhalte

### Arbeitsuchendmeldung

**Kurzbaustein**
- Die Arbeitsuchendmeldung ist eine frühe Pflicht und sollte sofort geprüft oder nachgeholt werden.

**Wenn Nutzer denkt, das sei schon alles**
- Wichtig: Die Arbeitsuchendmeldung ersetzt nicht automatisch die spätere Arbeitslosmeldung.

### Arbeitslosmeldung

**Kurzbaustein**
- Wenn dein Arbeitsverhältnis schon beendet ist und du jetzt arbeitslos bist, ist die Arbeitslosmeldung ein eigener Schritt und sollte sofort geprüft oder nachgeholt werden.

**Abgrenzungsbaustein**
- Arbeitsuchendmeldung und Arbeitslosmeldung sind nicht dasselbe. Genau diese Trennung muss im Output sichtbar bleiben.

### Kündigungsschutzklage / 3-Wochen-Frist

**Kurzbaustein**
- Wenn dir eine schriftliche Kündigung zugegangen ist, läuft oft eine sehr kurze Frist. Die 3-Wochen-Prüfung sollte deshalb nicht liegen bleiben.

### Vertrag noch nicht unterschrieben

**Kurzbaustein**
- Unterschreibe den Vertrag nicht vorschnell. Erst die Folgen für Arbeitslosengeld, Fristen und Handlungsspielraum klären.

### Vertrag schon unterschrieben

**Kurzbaustein**
- Weil schon unterschrieben wurde, geht es jetzt weniger um Standardtipps und mehr um Folgen, Fristen und individuelle Prüfung.

### Sonderfallindikator

**Kurzbaustein**
- Es gibt Hinweise auf einen möglichen Sonderfall. Deshalb sollte dein Fall nicht nur als Standard-Kündigung eingeordnet werden.

### Freistellung

**Kurzbaustein**
- Auch bei Freistellung verschwinden Fristen, Meldungen und Unterlagenthemen nicht automatisch.

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
