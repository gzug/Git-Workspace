# Kündigungs-Kompass MVP — Doku-Struktur-Notizen

Stand: 2026-04-05
Status: aktiv

## Ziel
Diese Datei hält die aktuelle Arbeitslogik für die Projektdokumentation fest, damit im aktiven Projektordner weniger Drift zwischen führenden Dateien, Zwischenständen und späterem Review entsteht.

## Aktuelle Einordnung
### Führend aktiv
- `PROJECT-STATUS.md` → Projektlage, Fokus, Risiken, Wiedereinstieg
- `V2-DECISIONS.md` → geltende Leitentscheidungen
- `RESULT-MAPPING.md` → operative Mapping-Logik
- `REFERENZFAELLE.md` → fachliche Referenzfälle / Soll-Outputs
- `RESULT-COPY-V2.md` → präferierter überarbeiteter Copy-Stand

### Noch aktiv, aber reviewbedürftig
- `RESULT-COPY.md` → älterer Copy-Stand; nicht löschen, aber nicht mehr stillschweigend als gleichrangig zu V2 behandeln

## Arbeitsregel
- Wenn mehrere Versionen einer Fachdoku im Root des Projektordners liegen, braucht es eine klar erkennbare führende Datei.
- Ältere oder überholte Zwischenstände sollen nicht als gleichrangig neben der führenden Version liegen, wenn das Wiederanlauf oder Entscheidungen vernebelt.
- Unklare Altstände zuerst nach `archive/review-docs/` oder in einen klaren Review-Status überführen statt blind löschen.

## Nächster sinnvoller Schritt
- `RESULT-COPY.md` gegen `RESULT-COPY-V2.md` final entscheiden:
  - entweder konsolidieren und Altstand archivieren
  - oder den Statusunterschied explizit markieren
- weitere V1/V2-Dateipaare im Projekt künftig früh markieren, damit keine Doku-Drift entsteht
