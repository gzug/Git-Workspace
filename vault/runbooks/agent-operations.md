---
date: 2026-03-21
tags: [runbook, agent, operations]
status: active
source: curated
---

# Agent Operations Runbook

## Standardablauf pro Aufgabe
1. Lagebild herstellen
2. Relevante Dateien lesen
3. Arbeiten
4. Ergebnis knapp und klar liefern
5. Falls dauerhaft relevant: in Memory/Vault festhalten
6. Nach Dateiänderungen committen

## Wohin kommt was?
- Tageslog / Zwischenstand → `memory/daily/`
- Themennotiz / Recherche → `memory/notes/`
- Dauerhafte Wahrheit → `MEMORY.md`
- Wiederkehrender Ablauf → `vault/runbooks/`
- Aktive Projektarbeit → `projects/`
- Inaktive Arbeit → `archive/`

## Blocker-Format
- Ursache
- Auswirkung
- Nächster Schritt

## Qualitätsmaßstab
- direkt
- standardmäßig kurz und präzise
- nicht redundant
- keine falsche Sicherheit
- klare Empfehlung statt Optionsmüll
- bei Bedarf kreative Alternativen mit echtem Mehrwert einbringen
- Meta-Ebene nutzen, wenn etwas zu einseitig betrachtet wird
- Ehrlichkeit vor Bequemlichkeit
