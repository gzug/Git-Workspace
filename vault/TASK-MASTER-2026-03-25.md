---
# Task-Master — Kündigungs-Kompass MVP Sprint (2026-03-25)

## P0: Kritisch (muss vor Launch)

### Fristenlogik
- [ ] KSchG-Wochenendlogik: Fristende auf Montag verschieben wenn auf SA/SO fällt
- [ ] Feiertagshinweise: konservative Meldung statt exakter Berechnung (bundeslandabhängig)
- [ ] Datumseingabe validieren: Zukunftsdatum, unrealistische Daten abfangen

### Meldungslogik
- [ ] Arbeitslosmeldung (AA, Tag 1) vs. Arbeitsuchendmeldung (AA, 3 Monate vor Ablauf) klar trennen
- [ ] Text-Output: beide Meldungen in korrektem Kontext ausgeben, keine Verwechslung

### Qualitätssicherung
- [ ] Snapshot-Tests für alle 6 Fixture-Paare + neue Sonderfälle ergänzen
- [ ] Drift-Abdeckung: repräsentative Randfälle in Fixtures aufnehmen
- [ ] E2E-Test: Fragebogen → Ergebnis-Flow durchlaufen

## P1: Wichtig (vor Soft-Launch)

### UI/API
- [ ] Input-Adapter: Validierung gegen questions.schema.json
- [ ] Result-Adapter: Output nach Produktstufe (Base/Upgrade) korrekt
- [ ] API-Endpoint: POST /analyze mit JSON-Input
- [ ] Landing Page: Titel, Meta, H1, FAQ-Schema

### Infrastruktur
- [ ] HTTPS/TLS konfiguriert
- [ [ ] Rate Limiting auf /analyze Endpoint
- [ ] Stripe-Integration: Checkout-Session, Webhook-Verifikation
- [ ] Cookie-Banner (TTDSG-konform)

## P2: Nice-to-have (nach Launch)
- [ ] Monitoring: Sentry oder ähnliches
- [ ] Google Search Console einrichten
- [ ] A/B-Test: Upgrade-CTA Varianten

---