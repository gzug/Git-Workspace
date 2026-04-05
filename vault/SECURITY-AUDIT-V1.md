# Security-Audit-Checkliste — Kündigungs-Kompass MVP

## Input-Validierung
- [ ] Alle User-Inputs gegen Schema validiert
- [ ] SQL/NoSQL Injection verhindern
- [ ] XSS-Schutz aktiv (Content-Security-Policy)

## API Rate Limiting
- [ ] Rate Limiting auf allen Public Endpoints
- [ ] Retry-After Header korrekt gesetzt
- [ ] IP-basiertes Throttling für Abuse-Schutz

## CORS
- [ ] CORS Origin explizit konfiguriert (kein *)
- [ ] Credentials-Flag korrekt gesetzt

## Stripe-Webhook
- [ ] Webhook-Signatur (stripe-signature) verifiziert
- [ ] Idempotenz-Keys für doppelte Events
- [ ] Test-Mode vs. Live-Mode getrennt

## n8n / Automatisierungen
- [ ] Keine Credentials in n8n-Exports
- [ ] Webhooks mit Auth-Token geschützt

## HTTPS / TLS
- [ ] TLS 1.2+ erzwungen
- [ ] HSTS Header gesetzt
- [ ] Mixed-Content geblockt

## Auth & Sessions
- [ ] Sichere Session-Cookies (httpOnly, sameSite)
- [ ] CSRF-Token für State-ändernde Requests

## Ops-Sicherheit
- [ ] Secrets in Env-Variablen, nicht im Code
- [ ] .env nie in Git committed
- [ ] Dependency-Scan vor Launch
## Dependency-Sicherheit (häufig vergessen)

- [ ] `npm audit` ausführen → alle Critical und High beheben vor Launch
      Befehl: cd /pfad/zum/projekt && npm audit --audit-level=high
- [ ] Keine `*` oder `latest` Versionen in package.json
- [ ] Node.js Version: LTS (>= 20.x), nicht EOL
- [ ] Abhängigkeiten mit bekannten CVEs identifizieren:
      Tool: `npx audit-ci --high` oder `snyk test`
- [ ] package-lock.json oder yarn.lock im Git (für reproduzierbare Builds)
- [ ] Automatisches Dependency-Update-Monitoring einrichten:
      Empfehlung: GitHub Dependabot oder Renovate Bot aktivieren

## Vor-Launch Pflicht-Checks (manuell, 1x)

- [ ] Alle API-Endpoints mit ungültigen Inputs testen
      (leere Strings, 10.000 Zeichen, HTML-Tags, SQL-Fragmente)
- [ ] Payment-Flow mit Stripe Test-Cards durchspielen:
      4242 4242 4242 4242 = Erfolg
      4000 0000 0000 0002 = Declined
      4000 0025 0000 3155 = 3DS-Pflicht
- [ ] Error-Messages im Frontend: kein Stack-Trace, keine DB-Infos sichtbar
- [ ] .env-Datei nicht im Git: `git log --all -- .env` prüfen

---
_Letzte Änderung: 2026-03-25 | Review: Claude/Comet_