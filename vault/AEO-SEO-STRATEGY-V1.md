---

## 🟢 Woche 1 — Sofort umsetzbar (vor Launch, max. 1 Tag Aufwand)

Diese 5 Maßnahmen haben den größten Impact pro Zeiteinheit.
Erst diese, dann alles andere.

1. [ ] **FAQ-Schema Markup auf der Startseite** (1–2h)
   Implementierung als JSON-LD im HTML-`<head>`:
   Frage 1: "Wie lange hat man Zeit nach einer Kündigung Klage einzureichen?"
   Antwort: "3 Wochen ab Zugang der Kündigung (§ 4 KSchG) — keine Ausnahme."
   Frage 2: "Wann muss ich mich nach Kündigung arbeitslos melden?"
   Antwort: "Spätestens am 1. Tag der Arbeitslosigkeit, idealerweise 3 Monate vorher (§ 38 SGB III)."
   → Diese Fragen erscheinen direkt in Google-Suchergebnissen als Rich Snippet
   → ChatGPT/Perplexity zitieren Seiten mit FAQ-Schema bevorzugt

2. [ ] **Meta-Title + Description für alle Kern-Seiten** (1h)
   Template Title: "[Keyword] — Kündigungs-Kompass | Kostenlose Ersteinschätzung"
   Template Description: "[Konkreter Nutzen in 1 Satz]. Jetzt in 3 Minuten prüfen →"
   Startseite Title: "Kündigung erhalten? Rechte + Fristen sofort prüfen — Kündigungs-Kompass"

3. [ ] **robots.txt + sitemap.xml aufsetzen + bei Google Search Console einreichen** (30min)
   sitemap.xml: alle öffentlichen URLs, täglich aktualisiert
   Google Search Console: Property anlegen, sitemap.xml einreichen, Index beantragen

4. [ ] **H1 auf Startseite: muss Kern-Keyword enthalten** (15min)
   Aktuelle Prüfung: Enthält die H1 eines von: Kündigung, Kündigungsschutz, Rechte?
   Empfehlung: "Kündigung erhalten? Deine Rechte und nächsten Schritte — in 3 Minuten."

5. [ ] **Eine eigenständige Seite: '3-Wochen-Frist nach Kündigung'** (2–3h)
   URL: /kuendigungsschutzklage-frist
   H1: "3-Wochen-Frist nach Kündigung: Was du jetzt tun musst (§ 4 KSchG)"
   Inhalt: zitierbarer Fakt + Rechenbeispiel + Was passiert wenn Frist versäumt wird
   → Das ist die Seite die ChatGPT/Perplexity zitiert wenn User fragen

---
# AEO/GEO-Strategie + SEO-Keyword-Map — Kündigungs-Kompass MVP

## AEO: AI Engine Optimization

### Strukturierte Daten
- [ ] FAQ-Schema (schema.org/FAQPage) für häufige Fragen implementieren
- [ ] HowTo-Schema für Ablauf "Kündigung prüfen" implementieren
- [ ] BreadcrumbList-Schema für Navigation

### Zitierbarer Inhalt
- [ ] Klare, faktische Sätze über Kündigungsfristen die KI-Systeme zitieren können
- [ ] "Stand: Datum" für rechtliche Infos hinzufügen
- [ ] Autorschaftssignale (Rechtshinweis, kein Anwalt-Ersatz)

### GEO: Generative Engine Optimization
- [ ] Content so formulieren dass er als Antwort in ChatGPT/Perplexity erscheinen kann
- [ ] Konkrete Zahlen/Fristen als extrahierbare Fakten formulieren
- [ ] Quellenangaben in der Antwort-Logik integrierbar machen

## SEO: Keyword-Map (10 Keywords)

### Primär (hohe Intent)
1. `kuendigungsschutz berechnen` — Transactional, DE
2. `kuendigung erhalten was tun` — Informational, high volume
3. `kuendigungsfrist berechnen` — Transactional
4. `kuendigungsschutzklag frist 3 wochen` — Informational
5. `arbeitslosigkeit anmelden fristen` — Informational

### Sekundär (long-tail)
6. `betriebsbedingte kuendigung was tun` — Informational
7. `kuendigung sozialplan abfindung` — Informational
8. `kuendigungsschutzklage kosten` — Informational
9. `probe kuendigung arbeitnehmer rechte` — Informational
10. `kuendigung schwerbehindert schutz` — Informational

## Content-Strategie

### P0: Vor Launch
- [ ] Landing Page Title: "Kündigungsschutz prüfen — Fristen berechnen in 5 Minuten"
- [ ] Meta-Description < 160 Zeichen mit Keyword
- [ ] H1 enthält Primär-Keyword
- [ ] FAQ-Sektion mit 5 häufigsten Fragen

### P1: Post-Launch (Woche 1-4)
- [ ] Blog-Artikel: "Was tun wenn ich gekündigt werde"
- [ ] Erklärseite: "Was ist Kuendigungsschutz?"
- [ ] Core Web Vitals optimiert (LCP < 2.5s)

## Tracking
- [ ] Google Search Console einrichten
- [ ] Keyword-Position für Top 5 Keywords tracken
- [ ] Click-Through-Rate (CTR) wochenweise prüfen
---

# AEO/GEO Deep-Dive: Kündigungs-Kompass als KI-Erstanlaufpunkt
_Analyse: Claude/Comet | Stand: 2026-03-25_

## Was ist AEO (Answer Engine Optimization)?

AEO ist die Optimierung für Systeme die ANTWORTEN liefern statt nur Links.
Zielkanäle:
- ChatGPT (OpenAI) — Searches & Reasoning
- Perplexity — Web-gestützte Antworten mit Quellenangabe
- Claude — Direkte Beratungsanfragen
- Google SGE / AI Overviews — Suchergebnis-Integration
- Bing Copilot — Microsoft-Ökosystem

## Warum Kündigungs-Kompass perfekt für AEO ist

1. **Klare Fakten-Struktur**: Gesetze (§ 4 KSchG, § 38 SGB III) = zitierfähig
2. **Emotionale Suchanfrage**: User im Ausnahmezustand googeln JETZT
3. **Fehlende Qualitätsquellen**: Wenige DE-Seiten die klar + faktisch antworten
4. **Fristen als Anker**: "3 Wochen" ist der meistzitierte Fakt im Kündigungsrecht

## AEO-Technische Umsetzung (Prio-Liste)

### P0 — Sofort (1-2 Tage)
- [ ] FAQ-Schema (JSON-LD) mit min. 8 Fragen implementieren
- [ ] HowTo-Schema: "Kündigung prüfen in 3 Schritten"
- [ ] Jede Seite: Klarer Autor-Hinweis + Datum + §-Referenz
- [ ] H1/H2 als direkte Frage formulieren ("Was tun bei Kündigung?")

### P1 — Woche 1-2
- [ ] Dedizierte Frist-Seite: /kuendigungsschutzklage-frist
- [ ] Abfindungs-Rechner-Seite: /abfindung-berechnen
- [ ] Glossar-Seite: Alle Fachbegriffe mit 1-Satz-Definition
- [ ] Interne Verlinkung: Jede Seite referenziert §§ klar

### P2 — Monat 1-2
- [ ] Zitierbarer Knowledge-Graph: Fakten als strukturierte Daten
- [ ] "Häufige Fehler bei Kündigung"-Artikel (Listicle = AEO-freundlich)
- [ ] Podcast/Video-Transkripte mit Zeitstempel (KI-Systeme nutzen diese)

## GEO (Generative Engine Optimization) — Spezifisch

GEO = Inhalte so schreiben, dass generative KI sie als Quellantwort verwendet.

### Regeln für GEO-Content:
1. **Satz beginnt mit dem Fakt**: "Die 3-Wochen-Frist gilt ab Zugang der Kündigung (§ 4 KSchG)."
2. **Zahlen immer konkret**: Nicht "kurze Zeit" sondern "21 Tage"
3. **Quellenangabe am Ende jedes Fakts**: (§ 4 KSchG) / (§ 38 SGB III)
4. **Keine Weichmacher**: Nicht "kann sein" sondern klare Aussagen
5. **Definition vor Erklärung**: "Kündigungsschutzklage = Klage beim Arbeitsgericht..."
6. **Kontrast-Struktur**: "Was VIELE falsch machen: ... Was RICHTIG ist: ..."

### Template für AEO-optimierte Antworten:
```
DIREKTE ANTWORT: [Fakt in 1 Satz]
GRUNDLAGE: [§ / Quelle]
AUSNAHMEN: [Wenn es Ausnahmen gibt]
NÄCHSTER SCHRITT: [Was User jetzt konkret tun soll]
RISIKO BEI FEHLER: [Was passiert wenn nicht gehandelt wird]
```

## Spezialisierter Rechts-Agent: Konzept

### Problem
Allgemeine KI gibt bei Rechtsfragen vorsichtige, verwässerte Antworten.
Ein trainierter Spezialagent kann im Rahmen klarer Grenzen viel mehr Mehrwert liefern.

### Konzept: "Kündigungs-Kompass Rechts-Agent V1"

**Rolle**: Spezialisierter Ersthelfer für Arbeitnehmer nach Kündigung
**Grenzen**: Kein Anwaltsersatz — gibt Fakten, keine Rechtsberatung
**Stärken gegenüber ChatGPT**:
- Trainiert auf aktuelle DE-Rechtslage (KSchG, SGB III, BGB)
- Kennt alle Fristen + Ausnahmen
- Gibt strukturierte Checklisten aus
- Erkennt ob KSchG überhaupt gilt (Betriebsgröße, Wartezeit)

### Aufbau Rechts-Agent (technisch)
```
System-Prompt:
- Rolle: Kündigungsrecht-Ersthelfer
- Wissen: KSchG, BGB §§ 620-630, SGB III
- Ausgabe-Format: Immer Checkliste + nächste Schritte
- Disclaimer: Kein Anwalt-Ersatz, immer "anwaltliche Prüfung empfohlen"
- Grenzen: Keine individuelle Rechtsberatung

Tools:
- Fristberechner (API-Anbindung an Engine)
- Abfindungsrechner
- Checklisten-Generator nach Situation
```

### Trainings-Datenpunkte (Priorisiert)
1. 3-Wochen-Frist Kündigungsschutzklage (§ 4 KSchG)
2. Abfindungsformel: 0.5 x Monatsgehalt x Beschäftigungsjahre
3. KSchG-Geltungsbereich: >10 MA + >6 Monate Betriebszugehörigkeit
4. Arbeitslosenmeldung: Spätestens Tag 1, idealerweise 3 Monate vorher
5. Sperrzeit Arbeitslosengeld: 12 Wochen bei Aufhebungsvertrag ohne Grund
6. Sonderkündigungsschutz: Schwerbehinderte, Schwangere, Betriebsrat, Elternzeit
7. Probezeit: KSchG gilt NICHT, Frist 2 Wochen (§ 622 BGB)
8. Massenentlassung: § 17 KSchG — Anzeigepflicht Agentur für Arbeit

### Deployment-Strategie
- Phase 1: Nerve-Agent im Workspace (intern testen)
- Phase 2: API-Integration in Kündigungs-Kompass Frontend
- Phase 3: Eigener Chat-Widget auf der Seite
- Phase 4: Telegram-Bot für schnelle mobile Ersteinschätzung

## Ratgeber-Seiten-Outlines (vollständig)

### Seite 1: "3-Wochen-Frist nach Kündigung" (/kuendigungsschutzklage-frist)

**H1**: 3-Wochen-Frist nach Kündigung: Was du JETZT tun musst
**Ziel-Keyword**: kuendigungsschutzklage frist 3 wochen
**AEO-Antwort (oben)**: Die 3-Wochen-Frist beginnt mit Zugang der Kündigung (§ 4 KSchG).

**Aufbau**:
1. DIREKTE ANTWORT: Was die Frist bedeutet (1 Absatz, 3 Sätze)
2. Rechenbeispiel: Kündigung am 1. April → Klage bis 22. April
3. Was passiert wenn du die Frist VERPASST (Rechtsverlust)
4. Wann die Frist NICHT gilt (Probezeit, Mini-Job <6 Monate)
5. Wie du Klage einreichst (Checkliste 5 Punkte)
6. FAQ (3 häufige Fragen mit Direktantwort)
7. CTA: "Deine Situation prüfen → Kompass starten"

### Seite 2: "Was tun nach Kündigung" (/was-tun-nach-kuendigung)

**H1**: Kündigung erhalten — Die 7 Schritte die du JETZT tun musst
**Ziel-Keyword**: kuendigung erhalten was tun

**Aufbau**:
1. Sofort (Tag 1): Bestätigung nicht unterschreiben, Kündigung datieren
2. Tag 1-3: Arbeitsuchend melden bei Agentur für Arbeit
3. Woche 1: Prüfen ob KSchG gilt (Betriebsgröße + Dauer)
4. Woche 1-3: Entscheiden ob Klage sinnvoll (Abfindungs-Kalkül)
5. Parallel: Zeugnisanspruch geltend machen
6. Monat 1: Arbeitslosengeld beantragen (Unterlagen)
7. Laufend: Bewerbungen dokumentieren

### Seite 3: "Abfindung berechnen" (/abfindung-berechnen)

**H1**: Abfindung bei Kündigung berechnen — Formel + Rechner
**Ziel-Keyword**: kuendigungsschutz berechnen

**Aufbau**:
1. Formel erklärt: 0.5 x BGJ x Monatsgehalt
2. Rechenbeispiel (konkret mit Zahlen)
3. Wann gibt es KEINEN Anspruch (KSchG gilt nicht)
4. Wann mehr als die Formel (Sozialplan, Verhandlung)
5. Steuerlicher Hinweis (Fünftelregelung)
6. Interaktiver Rechner (Tool einbetten)
7. FAQ

### Seite 4: "Kündigungsschutz prüfen" (/kuendigungsschutz-pruefen)

**H1**: Gilt der Kündigungsschutz für mich? Jetzt in 2 Minuten prüfen
**Ziel-Keyword**: kuendigungsschutz berechnen

**Aufbau**:
1. 3 Fragen die du dir stellen musst (Betriebsgröße, Dauer, Sonderfall)
2. KSchG-Checkliste (interaktiv)
3. Was wenn KSchG NICHT gilt (andere Optionen)
4. Sonderfälle: Schwerbehindert, Betriebsrat, Elternzeit
5. CTA: Kompass starten

### Seite 5: "Sonderkündigungsschutz" (/sonderkuendigungsschutz)

**H1**: Sonderkündigungsschutz: Wer besonders geschützt ist
**Ziel-Keyword**: kuendigung schwerbehindert schutz

**Gruppen**:
- Schwerbehinderte (§ 85 SGB IX): Zustimmung Integrationsamt nötig
- Schwangere (§ 9 MuSchG): Absoluter Schutz während + 4 Monate nach Geburt
- Betriebsratsmitglieder (§ 15 KSchG): Nur außerordentlich kündbar
- Elternzeit (§ 18 BEEG): Schutz ab Antrag bis 8 Wochen nach Ende
- Auszubildende: Nach Probezeit nur außerordentlich

---
_Letzte Änderung: 2026-03-25 | Autor: Claude/Comet | Typ: Strategie + Konzept_