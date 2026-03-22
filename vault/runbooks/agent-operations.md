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
3. Vor dem nächsten größeren Block aktiv prüfen, was delegierbar, schneidbar oder an Support-Agents abgebbar ist
4. Arbeiten
5. Ergebnis knapp und klar liefern
6. Mini-Review pro Block festhalten: Fortschritt, Reibung, Delegierbares, nächster Engpass
7. Falls dauerhaft relevant: in Memory/Vault festhalten
8. Nach Dateiänderungen committen

## Pflicht-Mini-Review pro Arbeitsblock
Am Ende jedes relevanten Arbeitsblocks kurz diese vier Punkte festhalten:
- Fortschritt
- Reibung
- Delegierbares
- nächster Engpass

Ziel:
- Selbstanalyse operationalisieren
- Delegationschancen früher erkennen
- Wiederanlaufkosten senken
- Engpässe sichtbarer machen, bevor sie eskalieren

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

## Delegations- und Entlastungsroutine für Projektmanager/Main-Agent
- In regelmäßigen Abständen kurz innehalten und die offenen Todos aktiv darauf prüfen, was an klar abgegrenzten, niederriskanten Aufgaben an unterstützende Agents abgegeben werden kann.
- Nicht erst delegieren, wenn Überlast schon eingetreten ist; früh prüfen, ob Intake, Verdichtung, Datenpflege, Review, kleine Recherchen oder andere bürokratische Nebenarbeit auslagerbar sind.
- Wiederkehrende einfache Aufgaben aktiv identifizieren und überlegen, ob ein Support-Agent wie `CleanUp` dafür sinnvoll eingelernt oder genutzt werden kann, damit der Main-Agent langfristig mehr Fokus auf Kernlogik, Entscheidungen und Integration behält.
- Delegation darf keine Unschärfe auslagern: erst Aufgabe sauber schneiden, dann abgeben.
- Ziel ist nicht maximale Agent-Aktivität, sondern spürbare Entlastung ohne Drift, Doppelarbeit oder neue Koordinationslast.

## Kontinuierliche Selbstanalyse für Agents
Diese Regel gilt für bestehende und künftige Agent-.md-Dateien und Rollenbeschreibungen.

- Jeder Agent beobachtet die eigene Arbeitsweise laufend mit Blick auf Qualität, Effizienz, Stärken, Schwächen, typische Fehler, Reibungspunkte und wiederkehrende Muster.
- Erkenntnisse daraus werden knapp und strukturiert dokumentiert, damit Verbesserungen nicht auf Gefühl, sondern auf Beobachtung basieren.
- In regelmäßigen Abständen soll jeder Agent prüfen, ob aus diesen Beobachtungen konkrete, praktische Verbesserungsmaßnahmen ableitbar sind.
- Wenn ein Agent eine belastbare Anpassung an seiner .md-Datei, Rolle, Arbeitsweise oder seinen Leitplanken erkennt, die Schwächen mindert oder Stärken sinnvoll ausbaut, soll er diese proaktiv und knapp als Änderungsvorschlag an Y. Hatabi kommunizieren.
- Solche Vorschläge müssen handfest sein: klare Beobachtung, klare Auswirkung, klare empfohlene Anpassung.
- Kein Agent soll dafür blind Selbstoptimierung betreiben oder seine Rolle eigenmächtig ausweiten; Änderungen an Agent-.mds bleiben bewusst, begründet und von außen bestätigt.

## Ergänzte Skills im Workspace
- `skills/driftguard/`: für lokale Drift-, Integritäts- und Baseline-Prüfungen an Skills oder Repos. Einsetzen, wenn Änderungen, Updates oder Vertrauensfragen schnell und lokal geprüft werden sollen.
- `skills/dev-coding-agent/`: für klar geschnittene, delegationsfähige Coding-Blöcke mit OpenCode. Einsetzen bei Feature-, Bugfix-, Refactor- oder Test-Arbeit mit stabilem Scope.
- Beide Skills sind Unterstützungshebel, keine Entscheidungsinstanzen: DriftGuard prüft und markiert; der Coding-Agent implementiert innerhalb eines sauber definierten Auftrags.
