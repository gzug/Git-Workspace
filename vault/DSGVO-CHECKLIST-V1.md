# DSGVO-Checkliste — Kündigungs-Kompass MVP

## Datensparsamkeit (Art. 5)
- [ ] Nur technisch notwendige Daten erheben
- [ ] Keine IP-Adressen ohne Rechtsgrundlage
- [ ] Session-Daten nach Sitzung löschen

## Rechtsgrundlage (Art. 6)
- [ ] Einwilligung oder berechtigtes Interesse dokumentiert
- [ ] Cookie-Consent korrekt

## Auskunftspflicht (Art. 13-14)
- [ ] Datenschutzerklärung vollständig
- [ ] Angaben Verantwortlicher vorhanden

## Auftragsverarbeitung
- [ ] AVV mit Stripe vorhanden
- [ ] AVV mit Hosting-Anbieter vorhanden

## Betroffenenrechte
- [ ] Auskunft, Löschung, Übertragbarkeit umsetzbar

## TTDSG
- [ ] Cookie-Banner mit echtem Opt-in
- [ ] Ablehnen gleich einfach wie Zustimmen
## ⚠️ Kern-Risiko: Fragebogen-Antworten (Beschäftigungsdaten)

Die Fragebogen-Inputs enthalten implizit personenbezogene Daten:
Betriebszugehörigkeit, Gehalt, Bundesland, Kündigungsgrund.
Diese können unter Art. 9 DSGVO fallen wenn sie Rückschlüsse
auf besondere Kategorien ermöglichen (z.B. Behinderung, Gewerkschaft).

- [ ] Werden Antworten nach Session-Ende gespeichert?
      JA → explizite Rechtsgrundlage + Einwilligung nötig
      NEIN → dokumentieren dass keine Persistenz stattfindet
- [ ] Werden Antworten mit IP-Adresse oder Geräte-ID verknüpft?
      JA → Einwilligung nötig, in DSE ausweisen
- [ ] Verarbeitet OpenAI die Inputs via API?
      JA → OpenAI DPA abschließen (api.openai.com/privacy)
           Sicherstellen: kein Training-Opt-In für API-Calls
- [ ] Empfohlene Minimallösung: Session-only, kein persistentes
      Logging der Fragebogen-Antworten → rechtlich sauberste Option
- [ ] Hinweis in Datenschutzerklärung: "Ihre Eingaben werden nicht
      gespeichert und nicht an Dritte weitergegeben"

---
_Letzte Änderung: 2026-03-25 | Review: Claude/Comet_

---
## Ergaenzungen (2026-03-25)

### Verarbeitungsverzeichnis (Art. 30 DSGVO)
- [ ] Alle Verarbeitungstaetigkeiten dokumentieren
  - Tool-Nutzung (Fragebogen-Daten)
  - Zahlungsabwicklung (Stripe)
  - E-Mail-Marketing (falls vorhanden)
  - Analytics (Cookiebot/GA)

### Hosting + Technische Sicherheit
- [ ] Server in EU oder EWR (DSGVO-Pflicht)
  - Vercel: Regions-Setting pruefen (eu-central-1 oder eu-west-1)
- [ ] SSL/TLS aktiv (HTTPS erzwingen)
- [ ] Minimaldatenprinzip: Nur noetige Felder abfragen

### Anwalts-Check vor Launch (EMPFOHLEN)
Die DSGVO-Pruefung ist komplex und bereichsspezifisch.
Ein Rechtsanwalt fuer Datenschutzrecht oder ein spezialisierter DSGVO-Agent
koennte hier deutlich mehr Impact haben als ein allgemeines LLM.
Hinweis: Datenschutzerklaerung-Generator (z.B. datenschutz.org) als
Zwischenloesung verwenden bis zum Anwaltscheck.

---
_Update 2026-03-25 | Autor: Claude/Comet | Ergaenzungen hinzugefuegt_