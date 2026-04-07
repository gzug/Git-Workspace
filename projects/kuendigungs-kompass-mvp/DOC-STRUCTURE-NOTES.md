# Kündigungs-Kompass — Doku-Struktur-Notizen

Stand: 2026-04-05
Status: aktiv

## Ziel
Diese Datei hält die aktuelle Arbeitslogik für die Projektdokumentation fest, damit im aktiven Projektordner weniger Drift zwischen führenden Dateien, Zwischenständen und späterem Review entsteht.

## Aktuelle Einordnung
### Führend aktiv
- `PROJECT-STATUS.md` → kanonischer Einstieg; Projektlage, Fokus, Risiken, Wiedereinstieg
- `README.md` → nur kurzes Projekt-Intro, keine konkurrierende Steuerdatei
- `V2-DECISIONS.md` → geltende Leitentscheidungen
- `RESULT-MAPPING.md` → operative Mapping-Logik
- `REFERENZFAELLE.md` → fachliche Referenzfälle / Soll-Outputs
- `RESULT-COPY-V2.md` → präferierter überarbeiteter Copy-Stand

### Historisiert / nicht mehr führend
- `archive/review-docs/RESULT-COPY-legacy-2026-03-22.md` → älterer Copy-Stand; bewusst aus dem Root genommen, damit `RESULT-COPY-V2.md` nicht mehr mit einem Altstand konkurriert

## Arbeitsregel
- Wenn mehrere Versionen einer Fachdoku im Root des Projektordners liegen, braucht es eine klar erkennbare führende Datei.
- Ältere oder überholte Zwischenstände sollen nicht als gleichrangig neben der führenden Version liegen, wenn das Wiederanlauf oder Entscheidungen vernebelt.
- Unklare Altstände zuerst nach `archive/review-docs/` oder in einen klaren Review-Status überführen statt blind löschen.

## Nächster sinnvoller Schritt
- `RESULT-COPY-V2.md` gegen Runtime, Fixtures und Render-Snapshots spiegeln, damit die jetzt führende Copy-Datei nicht nur nominell, sondern faktisch der Referenzstand ist
- weitere V1/V2-Dateipaare im Projekt künftig früh markieren, damit keine Doku-Drift entsteht
