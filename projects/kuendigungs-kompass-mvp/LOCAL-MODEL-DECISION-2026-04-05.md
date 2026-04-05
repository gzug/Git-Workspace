# Kündigungs-Kompass MVP — Local Model Decision

Stand: 2026-04-05
Status: entschieden für den aktuellen Arbeitsstand

## Bewertete Modelle
Nur diese zwei Modelle wurden betrachtet:
- `ollama/gemma4:e4b`
- `ollama/qwen3:8b`

Keine größere Gemma-4-Variante und kein anderes Qwen-Modell.

## Ziel der Bewertung
Nicht das "beste Modell allgemein" finden, sondern den sinnvollsten lokalen Worker für den realen OpenClaw-/Kündigungs-Kompass-Betrieb bestimmen.

Leitfrage:
- nimmt das Modell dem Main-Agenten billige Vorarbeit ab,
- ohne mehr Routing-Komplexität, Pflegeaufwand oder neue Instabilität zu erzeugen?

## Außencheck — verdichtete Erkenntnisse
### `gemma4:e4b`
- klar als On-Device-/Edge-Modell positioniert
- auf Apple-Silicon-/Laptop-Nutzung ausgelegt
- für agentische und strukturierende Aufgaben vermarktet
- passt von der Größenordnung grundsätzlich zum M4 Mac mini mit 16 GB

### `qwen3:8b`
- in Ollama bereits etabliert
- externe Erfahrungsberichte beschreiben es als performant, brauchbar und ordentlich bei Tool-/Strukturaufgaben
- passt ebenfalls grundsätzlich in die 16-GB-Klasse

## Direkter Praxistest im aktuellen Setup
Geplant war ein Lean-Vergleich auf echten Kündigungs-Kompass-Mini-Aufgaben.

Operatives Ergebnis im aktuellen OpenClaw-Setup:
- mehrere direkte Worker-Läufe über den lokalen Modellpfad lieferten kein verwertbares Ergebnis
- das betraf sowohl `gemma4:e4b` als auch `qwen3:8b`
- damit gibt es aktuell keinen belastbaren Beleg, dass einer der beiden Kandidaten im delegierten Subagent-Pfad stabil genug produktiv trägt

Wichtig:
- das ist kein Beweis, dass die Modelle fachlich untauglich sind
- es ist aber ein belastbarer Hinweis, dass der aktuelle delegierte Laufweg im Setup noch nicht als produktiver Standard taugt

## Entscheidung
### Für jetzt
- `gpt-5.4` bleibt Kopf für Planung, Orchestrierung, Synthese und riskante Entscheidungen
- `qwen3:8b` bleibt vorerst der bestehende lokale Fallback-/Heartbeat-Pfad
- `gemma4:e4b` bleibt installiert als zusätzlicher Kandidat, aber noch **nicht** als produktiver Standard-Worker im Projektpfad

### Nicht entschieden wurde
- kein endgültiger fachlicher Sieger zwischen `gemma4:e4b` und `qwen3:8b`
- kein Multi-Modell-Routing im Produktivpfad

## Begründung
1. Die aktuelle Engstelle ist nicht Modellqualität allein, sondern der delegierte Laufpfad im Setup.
2. Ein zusätzliches Routing lohnt sich erst, wenn es stabilen Output liefert.
3. Kündigungs-Kompass ist gerade in Launch-Hardening; dort ist neue operative Komplexität teurer als ein theoretisch besseres lokales Modell.
4. Projektfortschritt darf nicht an einem noch unklaren Local-Worker-Setup hängen.

## Konsequenz für die Arbeit am Projekt
### Sofort nutzen
- Main-Agent für Entscheidungen, Struktur und riskante Änderungen
- normale Sub-Agenten nur dort, wo der Laufpfad stabil und der Block sauber schneidbar ist

### Vorläufig nicht als Kernpfad nutzen
- lokale Modelle als automatische Delegations-Standardroute für fachkritische oder projektkritische Arbeit

### Später erneut prüfen, wenn sinnvoll
Ein neuer Vergleich lohnt sich erst, wenn mindestens eines davon gegeben ist:
- der lokale delegierte Laufpfad liefert stabilen Output
- es gibt einen sehr kleinen, klar abgegrenzten Worker-Use-Case mit wenig Risiko
- der Nutzen ist groß genug, um die zusätzliche Routing-Logik zu rechtfertigen

## Arbeitsregel bis dahin
Nicht auf das perfekte lokale Worker-Setup warten.
Projektarbeit weiter an den echten Launch-Hardening-Hebeln vorziehen.