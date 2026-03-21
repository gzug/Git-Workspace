# Kündigungs-Kompass MVP — Launch Hardening V1

Stand: 2026-03-21

## Ziel
Der MVP soll nicht nur fachlich plausibel, sondern **kontrolliert live-fähig** werden.

Launch Hardening bedeutet hier bewusst **nicht**: große Produktfläche bauen.
Es bedeutet:
- den Runtime-Pfad gegen echte Nutzereingaben absichern
- Fehler früh sichtbar machen
- Rückfallverhalten klar definieren
- Soft-Launch nur mit klarer Stop-/Go-Logik fahren

---

## 1. E2E-Realitätscheck
Vor einem Soft Launch muss der vollständige Pfad realistisch geprüft werden:

1. Fragebogen startet sauber
2. unvollständige Eingaben führen kontrolliert zu `incomplete`
3. vollständige Eingaben führen kontrolliert zu `ready`
4. Renderfehler führen kontrolliert zu `render-fallback`
5. harte Eingabefehler führen kontrolliert zu `error`
6. Produktstufen `preview`, `base`, `upgrade` liefern erwartbare Unterschiede

### Mindestfälle für den Realitätscheck
- schriftliche Kündigung, Fristdruck, Arbeitslosmeldung offen
- Aufhebungsvertrag noch nicht unterschrieben
- Sonderfall / Schutzindikator
- bereits unterschriebener Vertrag
- nur angekündigte Kündigung
- Mehrfachfall mit überlagerter Risikolage
- unvollständige Eingaben
- unbekannte Produktstufe
- Renderfehler-Simulation

---

## 2. Monitoring-Minimum
Für V1 reicht kein Vollmonitoring, aber ein brauchbares Minimum ist Pflicht.

### Es muss sichtbar werden:
- wie oft `ready` / `incomplete` / `render-fallback` / `error` auftreten
- welche Error-Codes wirklich vorkommen
- welche Tiers angefragt werden
- wie oft Fallback von unbekannter Tier-Angabe auf `base` passiert
- welche Tracks tatsächlich dominieren (`deadline-first`, `contract-do-not-sign`, `special-case-review`, `prepare-advice`)

### Nicht Ziel von V1
- personenbezogene Speicherung
- tiefe User-Journey-Analytics
- umfangreiche Event-Taxonomie
- Conversion-Optimierung vor Stabilität

---

## 3. Minimal-Analytics
Analytics im MVP dürfen nur das beantworten, was für Produktstabilität und Scope-Entscheidungen nötig ist.

### Sinnvolle Minimalfragen
- Welche Eingabepfade enden am häufigsten in `incomplete`?
- Welche Tracks treten am häufigsten auf?
- Wie oft werden Red Flags ausgelöst?
- Wie oft fällt Rendering auf Fallback zurück?
- Wie oft werden unbekannte Tiers angefragt?

### Nicht als Erstes tracken
- marketinglastige Funnel-Metriken
- pseudo-präzise Conversion-Optimierung
- Verhaltensprofile einzelner Nutzer

---

## 4. Soft-Launch-Stop-Regeln
Der MVP sollte **nicht** still weiterlaufen, wenn folgende Signale auftreten:

- `error`-Rate sichtbar erhöht
- `render-fallback` tritt wiederholt auf
- `incomplete` wirkt nicht wie normaler Flow, sondern wie Fragebogen-Drift
- Red-Flag-Fälle landen sichtbar in falschen Tracks
- Copy oder Rendering widersprechen Fixtures / Golden Outputs

---

## 5. Soft-Launch-Go-Regeln
Ein Soft Launch ist vertretbar, wenn:

- alle Kern- und Edge-Fixtures grün sind
- Runtime-Result-View die Zustände `ready`, `incomplete`, `render-fallback`, `error` kontrolliert liefert
- Monitoring-Minimum angeschlossen ist
- Soft-Launch-Checkliste vorhanden ist
- Rollback klar definiert ist

---

## 6. Nächste Artefakte
Dieses Dokument braucht für die operative Nutzung drei direkte Ergänzungen:

1. `E2E-REALITY-CHECK-V1.md`
2. `MONITORING-ANALYTICS-V1.md`
3. `SOFT-LAUNCH-CHECKLIST-V1.md`

Diese drei Dateien bilden zusammen den kleinsten sinnvollen Launch-Hardening-Rahmen für den MVP.
