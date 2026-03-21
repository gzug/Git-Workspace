---
date: 2026-03-18
tags: [project, kuendigungs-kompass]
status: active
source: curated
---

# Kündigungs-Kompass

## Kurzbeschreibung
MVP-Idee für ein strukturiertes, nicht-anwaltliches Orientierungstool rund um Kündigung, Aufhebungsvertrag, Fristen, Risiken und nächste sinnvolle Schritte.

## Aktueller Stand
Im Workspace liegt ein MVP-Grundgerüst unter `projects/kuendigungs-kompass-mvp/` mit:
- `questions.schema.json`
- `rules.schema.json`
- `result.schema.json`
- begleitender README

Inhaltlich ist der Produktkern inzwischen deutlich geschärft:
- Fokus auf **Kündigung** und **Aufhebungsvertrag**
- Ziel ist **klare Orientierung in einer Krisensituation**, nicht Rechtsberatung
- Kernnutzen: **Fristen priorisieren, Fehler vermeiden, nächste Schritte ordnen, Chancen sichtbar machen**
- Arbeits-Preislogik: **29 € Basis**, **49 € Upgrade**
- Tonalität: **ruhig, klar, direkt, menschlich, nicht behördlich**

## Zweck des MVP
- Sofortmaßnahmen sichtbar machen
- kritische Fristen priorisieren
- typische Fehler verhindern
- auf Beratungsgespräche vorbereiten
- sinnvolle Chancen wie Weiterbildung oder Förderoptionen markieren

## Produktlogik V1
Der MVP soll keine Einzelfall-Rechtsbewertung simulieren, sondern eine saubere Priorisierungs- und Orientierungshilfe liefern.

### Im Scope
- Kündigung erhalten
- Aufhebungsvertrag angeboten / vorgelegt
- Arbeitsuchend- und Arbeitslosmeldung
- Fristen und Sofortmaßnahmen
- ALG-I-Grundlagen
- Sperrzeit-/Ruhensrisiken auf hoher Ebene
- Abfindung / Freistellung als Basiswissen
- Dokumenten-Checkliste
- Gesprächsvorbereitung
- Chancenmodul zu Weiterbildung / Bildungsgutschein / relevanten Prüffeldern

### Explizit nicht im Scope
- individuelle Rechtsberatung
- tiefe Sonderfallprüfung im Detail
- umfassende Steuer-/Sozialversicherungsrechner
- breite Pre-Kündigungs-Beratung
- finale Einzelfall-Aussagen wie „sicher“, „eindeutig“ oder „vollständig“

## Offene Punkte
- finale Fragebogenreihenfolge und Branching-Logik
- exakte Free-vs-Paid-Grenze
- konkrete Nutzenabgrenzung des 49-€-Upgrades
- Landingpage-/Hero-Messaging-Hierarchie
- finaler Wording-/Guardrail-Katalog
- Überführung der Spec in klickbaren Prototyp bzw. Funnel-Logik

## Arbeitsregel
Rohmaterial, Experimente und operative Projektarbeit bleiben außerhalb des Vaults.
In diese Notiz gehört nur der verdichtete Projektstand.

## Chronik

### 2026-03-18
- Die kuratierte Projekt-Notiz wurde auf einen belastbaren Zwischenstand gebracht.
- Der Kern ist jetzt klar als **interaktiver Krisen-Navigator** beschrieben statt als lose Sammlung arbeitsrechtlicher Infos.
- Scope, Nicht-Scope und offene Produktfragen wurden sauber getrennt.
- Das vorhandene MVP-Grundgerüst im Workspace wurde als technischer Ausgangspunkt festgehalten.

### 2026-03-17
- Produktpositionierung geschärft: **ruhig, klar, direkt, menschlich**; keine Kanzlei-, Behörden- oder Alarm-Tonalität.
- Arbeitsname **Kündigungs-Kompass** als derzeit stärkster Kandidat bestätigt.
- Preisrichtung auf **29 € Basis** plus **49 € Upgrade** verdichtet.
- MVP-Kern auf Kündigung / Aufhebungsvertrag / Fristen / Meldelogik / Risiken / Chancenmodul fokussiert.
- Erste MVP-Artefakte im Workspace angelegt: `questions.schema.json`, `rules.schema.json`, `result.schema.json`, `README.md`.
- Ein erster verdichteter Handoff-Stand formuliert: nächster sinnvoller Schritt ist die finale Übersetzung in Fragebogenstruktur, Output-Logik und Angebotslogik.

## Nächster sinnvoller Schritt
Die vorhandene Produktlogik jetzt in drei konkrete Artefakte übersetzen:
1. finale **Fragebogenstruktur V1**
2. finale **Output-Struktur Free vs Paid**
3. daraus abgeleitete **Landingpage-/Offer-Logik**
