# Kündigungs-Kompass MVP — Flow Contract V1

Stand: 2026-03-21
Status: Block 3 Anschlussdokument

## Ziel
Den Übergang vom Frageschema zu einem echten Fragebogen-Flow und von dort zur Ergebnisansicht so definieren, dass Frontend-/Funnel-Arbeit ohne neue Grundsatzdebatten starten kann.

---

## 1. Flow-Grundsatz
Der erste Live-Flow soll **kein freies Formular**, sondern ein klar geführter, adaptiver Entscheidungsflow sein.

Leitlinie:
- erst die wenigen hochrelevanten Fragen
- dann nur fallbezogene Vertiefung
- keine unnötigen Zusatzfragen vor kritischen Fristen und Risiken

---

## 2. Stage-Reihenfolge aus dem Frageschema
Die Stages aus `questions.schema.json` geben die richtige Arbeitsreihenfolge bereits vor:

1. `entry`
2. `triage`
3. `deadline-check`
4. `contract-check`
5. `risk-check`
6. `supporting-context`
7. `goals`

### Praktische Bedeutung
- **entry / triage / deadline-check** sind der harte Kern
- **contract-check / risk-check** nur dann vertiefen, wenn fallrelevant
- **supporting-context / goals** erst danach

---

## 3. Mindest-Flow für Launch V1
### Screen 1 — Einstieg
- `case_entry`

### Screen 2 — Zeitkritische Basis
- `termination_access_date` (wenn fallrelevant)
- `employment_end_date`
- `jobseeker_registered`
- `already_unemployed_now`
- `unemployment_registered` (nur wenn relevant)

### Screen 3 — Vertragslage
- `agreement_present`
- `agreement_already_signed` (nur wenn relevant)
- `release_status`

### Screen 4 — Risikolage
- `special_protection_indicator`

### Screen 5 — Vorbereitung
- `documents_secured`
- `primary_goal`

Damit bleibt der Flow kurz genug, aber fachlich brauchbar.

---

## 4. Regeln für Frontend-/Funnel-Umsetzung
### Muss können
- `askIf` respektieren
- Pflichtfelder sichtbar markieren
- Red-Flag-relevante Pflichtfelder nicht still überspringen
- leere Antworten sauber behandeln
- Folgefragen erst anzeigen, wenn sie wirklich relevant sind

### Darf nicht passieren
- alle Fragen auf einer langen Seite ohne Priorisierung
- Vertragsfragen ohne vorhandenen Vertrag zeigen
- Arbeitslosmeldungsfrage immer zeigen, obwohl sie nur bedingt relevant ist
- Sonderfallfragen in harmloser Optik verstecken

---

## 5. Ergebnis-Flow nach Abschluss
Nach dem letzten Screen:

```text
Fragebogen fertig
→ normalizeQuestionnaireInput
→ buildResult
→ projectResultForTier
→ renderProductResult
→ Ergebnisansicht
```

### Ergebnisansicht für Launch V1
- zunächst text-/blockorientiert
- keine komplexe visuelle Produktarchitektur nötig
- Priorität auf Klarheit der Reihenfolge, nicht auf Design-Spielereien

---

## 6. Minimaler Ergebnis-Switch nach Produktstufe
### Preview
- direkt nach Fragebogenabschluss als Vorschau oder Pre-Purchase-View nutzbar

### Base
- Hauptauswertung nach Kauf/Freischaltung

### Upgrade
- zusätzliche Beratungs-/Entscheidungsvorbereitung

---

## 7. Fehler- und Abbruchlogik
### Wenn ein Pflichtfeld fehlt
- nicht stumm weiterrechnen
- klar anzeigen, was fehlt
- bei Red-Flag-Feldern keine harmlose Weiterleitung

### Wenn Nutzer abbricht
- später eventuell Resume sinnvoll
- für V1 aber kein Muss

### Wenn Input technisch kaputt ist
- lieber klarer Fehlerzustand als still falsches Result

---

## 8. Done-When
- der Fragebogen-Flow ist als Reihenfolge und Entscheidungslogik klar
- Frontend/Funnel kann Screens bauen, ohne neue Produktlogik zu erfinden
- Ergebnisansicht kann direkt an den bestehenden Adapterpfad andocken
