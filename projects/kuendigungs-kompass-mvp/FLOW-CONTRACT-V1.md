# Kündigungs-Kompass — Flow Contract V1

Stand: 2026-03-22
Status: aktives Anschlussdokument

## Ziel
Den Übergang vom Frageschema zu einem echten Fragebogen-Flow und von dort zur Ergebnisansicht so definieren, dass Frontend-/Funnel-Arbeit ohne neue Grundsatzdebatten starten kann.

## Leitprinzipien
- kein freies Formular, sondern klar geführter adaptiver Flow
- so wenig Fragen wie möglich, so viele wie für korrektes Routing nötig
- Fragen nur dann vertiefen, wenn sie Routing, Guardrails oder Scheingenauigkeit beeinflussen
- keine frühen sensiblen oder fachlich unklaren Fragen ohne klaren Nutzen
- Ergebnis soll zuerst Orientierung und nächste Schritte geben, nicht Vollständigkeit demonstrieren

## Flow-Regeln für V1
### Pflicht-Nachfrage nur wenn falsches Ergebnis schlimmer wäre als unvollständiges Ergebnis
Pflichtfelder nur dann erzwingen, wenn ohne sie ein falscher Track oder ein gefährlich falsches Ergebnis entstehen würde.

### Adaptive Nachfrage nur bei Routing-Konsequenz oder Sicherheitsgewinn
Eine Nachfrage ist nur gerechtfertigt, wenn sie:
- Track-Routing ändert
- einen Kern-Baustein aktiviert/deaktiviert
- scheingenauen Output verhindert

### Unsicherheit sichtbar erlauben
Bei nicht-trivialen Feldern soll, wo sinnvoll, eine `unsicher`-Option möglich sein statt Nutzer zu Falschantworten zu zwingen.

## Zielbild für Launch V1
**Maximal 4 Screens** mit klar sichtbarer Fortschrittsanzeige.
Eine Frage bzw. ein eng zusammengehöriges Thema pro Screen.

## Empfohlener Mindest-Flow für Launch V1
### Screen 1 — Vertragstyp / Einstieg
Pflicht:
- `case_entry` / Vertragstyp
  - Kündigung erhalten
  - Aufhebungsvertrag angeboten, noch nicht unterschrieben
  - Aufhebungsvertrag bereits unterschrieben

Erwartung am Start:
- 1 Satz Erwartungsrahmen: wenige Fragen, danach Fristen und nächste Schritte
- sichtbare Fortschrittsanzeige

### Screen 2 — Schlüsseldaten
Pflicht oder track-kritisch:
- `termination_access_date` bei Kündigung
  - mit Inline-Erklärung: Tag des Erhalts, nicht Briefdatum
  - Option `Datum unbekannt` zulassen
- `employment_end_date`
  - als „Wann endet dein Arbeitsverhältnis?“ formulieren

Fallabhängig:
- `agreement_already_signed` nur wenn Aufhebungsvertrag-Track nicht schon in Screen 1 festgelegt ist
- `release_status` / Freistellung nur wenn relevant
- `release_date` nur nach bestätigter Freistellung

### Screen 3 — Red Flags / Schutz / Routing-relevante Kontexte
Pflicht nur bei Routing-Relevanz:
- `special_protection_indicator`
- wenn Red Flag aktiv: Nachfrage nach Typ
  - Schwangerschaft
  - Elternzeit
  - Schwerbehinderung
  - Betriebsrat
  - unsicher / anderes prüfen

Zusätzlich hier oder am Ende von Screen 2, wenn noch nicht erhoben:
- Betriebsgröße
- Betriebszugehörigkeit

Diese beiden Felder dürfen für V1 unvollständig bleiben, wenn der Rest korrekt berechenbar ist.

### Screen 4 — Abschluss / verbleibende notwendige Kontexte
Nur noch fallrelevante Restfragen:
- `jobseeker_registered`
- `already_unemployed_now`
- `unemployment_registered` nur wenn relevant
- `documents_secured` nur wenn für Output sinnvoll
- `primary_goal` nur wenn der Flow nicht unnötig verlängert wird

Wenn der Output ohne diese Felder korrekt genug bleibt, nicht künstlich aufblasen.

## Datumsfelder — UI-Regeln
- **Zugangsdatum** und **Briefdatum** nie vermischen
- kein eigenes Feld für Briefdatum in V1
- keine Freitext-Datumsfelder, wenn vermeidbar
- Date-Picker oder klar getrennte Tages-/Monats-/Jahres-Eingabe
- Erklärung direkt am Feld, nicht in Tooltip verstecken

## Bool-Felder — Regel
Ja/Nein nur dann, wenn Nutzer die Frage ohne Fachwissen sicher beantworten können.
Sonst Auswahloptionen oder `unsicher`.

Nicht als Nutzerfrage stellen:
- „Gilt KSchG für dich?“
- andere fachlich abgeleitete Zustände, die das Produkt selbst berechnen kann

## Ergebnis-Flow nach Abschluss
```text
Fragebogen fertig
→ normalizeQuestionnaireInput
→ buildResult
→ projectResultForTier
→ renderProductResult
→ Ergebnisansicht
```

## Ergebnisprinzipien für Launch V1
- zuerst Orientierung und To-do #1
- Fristen vor Erklärtext
- Risiken nach To-dos
- Unterlagen nach Fristen/To-dos
- Beratungsfragen nur fallabhängig
- Disclaimer/Hinweise nie dominant

## Preview / Base / Upgrade
### Preview
- Orientierung + Blockstruktur + erste konkrete Sofortmaßnahme
- kein künstlich abgeschnittenes Basis-Ergebnis

### Base
- vollständige handlungsfähige Basis-Auswertung
- alle gesetzlichen Fristen, primären To-dos und Risiko-/Eskalationshinweise sichtbar

### Upgrade
- Tiefe, Werkzeuge, Export, Verhandlungshilfe, spätere Zusatzhilfen
- nie zurückgehaltene Basisinformationen

## Fehler- und Abbruchlogik
### Wenn ein Pflichtfeld fehlt
- nicht stumm weiterrechnen
- feldspezifisch sagen, was fehlt
- unvollständiges Teilergebnis bevorzugen, wenn Rest korrekt ist

### Wenn Nutzer unsicher ist
- konservativ markieren
- lieber Unvollständigkeits-Marker als falsche Sicherheit

### Wenn Nutzer abbricht
- Resume ist V2-Kandidat
- V1 soll künftige lokale Persistenz nicht verbauen

### Wenn Input technisch kaputt ist
- lieber klarer Fehlerzustand als still falsches Result
- technische Zustände nicht in UI durchreichen

## Done-When
- Frontend/Funnel kann Screens bauen, ohne neue Produktlogik zu erfinden
- Routing-kritische Fragen sind explizit
- unnötige oder zu frühe Fragen sind aus dem harten Kern entfernt
- Ergebnisansicht kann direkt an den bestehenden Adapterpfad andocken
- der Flow schützt vor Fachbegriff-Abbruch, Scheingenauigkeit und unnötiger Tiefe
