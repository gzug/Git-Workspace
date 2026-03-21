# Kündigungs-Kompass MVP — Golden Outputs

Ziel: vollständige Soll-Ergebnisse im Format von `result.schema.json`, abgeleitet aus den Referenzfällen.

Diese Outputs sind **keine zusätzliche Produktlogik**, sondern ein Prüfmaßstab für spätere Mapping-/Rendering-Implementierung.

---

## Golden Output 1 — Kündigung erhalten, schon arbeitslos, Arbeitslosmeldung offen

### Input-Fall

```json
{
  "case_entry": "termination_received",
  "termination_access_date": "2026-03-18",
  "employment_end_date": "2026-03-20",
  "jobseeker_registered": false,
  "already_unemployed_now": true,
  "unemployment_registered": false,
  "agreement_present": false,
  "release_status": "no",
  "special_protection_indicator": ["none_known"],
  "documents_secured": ["termination_letter", "employment_contract"],
  "primary_goal": "protect_deadlines"
}
```

### Soll-Result

```json
{
  "resultVersion": "v2",
  "caseSnapshot": {
    "headline": "Jetzt zuerst Fristen und Meldungen absichern",
    "situation": "Du hast eine schriftliche Kündigung erhalten, dein Arbeitsverhältnis ist bereits beendet und wichtige Agentur-Meldungen sind noch offen.",
    "riskLevel": "high",
    "primaryGoal": "protect_deadlines"
  },
  "synthesisDecision": {
    "primaryTrack": "deadline-first",
    "reasoning": "Weil du schon arbeitslos bist und sowohl Agentur-Meldungen als auch kurze Fristen gleichzeitig aktiv sind, hat Fristschutz jetzt Vorrang.",
    "confidenceClass": "mvp-reliable"
  },
  "topActions": [
    {
      "priority": 1,
      "label": "Arbeitslosmeldung sofort prüfen oder nachholen",
      "why": "Wenn du bereits arbeitslos bist, ist das ein eigener zeitkritischer Schritt gegenüber der Agentur für Arbeit.",
      "timing": "sofort",
      "statementClass": "mvp-reliable"
    },
    {
      "priority": 2,
      "label": "Arbeitsuchendmeldung ebenfalls sofort prüfen oder nachholen",
      "why": "Die Arbeitsuchendmeldung ist fachlich getrennt von der Arbeitslosmeldung und sollte nicht offen bleiben.",
      "timing": "sofort",
      "statementClass": "mvp-reliable"
    },
    {
      "priority": 3,
      "label": "3-Wochen-Frist für Kündigungsschutzklage sofort einordnen",
      "why": "Nach Zugang einer schriftlichen Kündigung läuft regelmäßig eine sehr kurze Frist, die du nicht versehentlich verstreichen lassen solltest.",
      "timing": "heute",
      "statementClass": "mvp-reliable"
    }
  ],
  "deadlines": [
    {
      "label": "Arbeitslosmeldung",
      "timing": "spätestens am ersten Tag der Arbeitslosigkeit; wenn noch offen, jetzt sofort prüfen",
      "importance": "critical",
      "note": "Die Arbeitslosmeldung ist ein eigener Schritt und nicht dasselbe wie die Arbeitsuchendmeldung.",
      "statementClass": "mvp-reliable"
    },
    {
      "label": "Arbeitsuchendmeldung",
      "timing": "spätestens 3 Monate vor Ende, sonst innerhalb von 3 Tagen nach Kenntnis",
      "importance": "critical",
      "note": "Auch wenn du schon arbeitslos bist, sollte diese Meldung als eigener Pflichtpunkt nicht übersehen werden.",
      "statementClass": "mvp-reliable"
    },
    {
      "label": "Kündigungsschutzklage prüfen",
      "timing": "regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung",
      "importance": "critical",
      "note": "Der MVP prüft nicht die Erfolgsaussicht, sondern markiert die Frist als priorisiert.",
      "statementClass": "mvp-reliable"
    }
  ],
  "riskFlags": [
    {
      "label": "Verspätete Agentur-Meldungen können Nachteile auslösen",
      "description": "Wenn Arbeitsuchend- oder Arbeitslosmeldung offen bleiben, steigt das Risiko unnötiger Probleme im weiteren ALG-I-Prozess.",
      "severity": "critical",
      "statementClass": "mvp-reliable"
    },
    {
      "label": "Kurze Klagefrist kann unbemerkt verstreichen",
      "description": "Nach Zugang einer schriftlichen Kündigung sollte die 3-Wochen-Frist nicht aus dem Blick geraten.",
      "severity": "critical",
      "statementClass": "mvp-reliable"
    }
  ],
  "redFlags": [],
  "documentChecklist": [
    {
      "label": "Kündigungsschreiben",
      "reason": "Zugang und Datum sind für die Fristprüfung zentral.",
      "status": "already-secured"
    },
    {
      "label": "Arbeitsvertrag",
      "reason": "Hilft bei Beratung und Einordnung der Ausgangslage.",
      "status": "already-secured"
    },
    {
      "label": "Lohnunterlagen",
      "reason": "Hilfreich für Agentur-Themen und Beratungsvorbereitung.",
      "status": "secure-now"
    }
  ],
  "advisorQuestions": [
    "Welche Schritte erwartet die Agentur für Arbeit in meinem Fall jetzt sofort von mir?",
    "Bis wann muss ich die 3-Wochen-Frist konkret gerechnet haben?",
    "Welche Unterlagen sollte ich für Agentur oder Beratung direkt bereithalten?"
  ],
  "opportunities": [],
  "disclaimers": [
    "Die Arbeitsuchendmeldung ersetzt nicht die Arbeitslosmeldung.",
    "Der MVP ersetzt keine individuelle Rechtsberatung.",
    "Das Tool bewertet keine Erfolgsaussichten einer Kündigungsschutzklage im Einzelfall."
  ],
  "statementLedger": {
    "mvpReliable": [
      "Arbeitsuchendmeldung und Arbeitslosmeldung sind fachlich getrennte Schritte.",
      "Die Arbeitslosmeldung soll spätestens am ersten Tag der Arbeitslosigkeit erfolgt sein.",
      "Für die Kündigungsschutzklage ist regelmäßig die 3-Wochen-Frist ab Zugang der schriftlichen Kündigung relevant."
    ],
    "cautiousChecks": [],
    "notUsedYet": [
      "Keine Aussage zu Erfolgschancen oder Abfindung ableiten."
    ]
  }
}
```

---

## Golden Output 2 — Aufhebungsvertrag liegt vor, noch nicht unterschrieben

### Input-Fall

```json
{
  "case_entry": "settlement_offered",
  "employment_end_date": "2026-05-31",
  "jobseeker_registered": false,
  "already_unemployed_now": false,
  "agreement_present": true,
  "agreement_already_signed": false,
  "release_status": "yes_irrevocable",
  "special_protection_indicator": ["none_known"],
  "documents_secured": ["agreement_draft", "employment_contract", "salary_docs"],
  "primary_goal": "protect_alg1"
}
```

### Soll-Result

```json
{
  "resultVersion": "v2",
  "caseSnapshot": {
    "headline": "Nichts vorschnell unterschreiben",
    "situation": "Dir liegt ein Aufhebungs- oder Abwicklungsvertrag vor, du bist noch nicht arbeitssuchend gemeldet und dein wichtigstes Ziel ist der Schutz beim ALG I.",
    "riskLevel": "high",
    "primaryGoal": "protect_alg1"
  },
  "synthesisDecision": {
    "primaryTrack": "contract-do-not-sign",
    "reasoning": "Weil ein noch nicht unterschriebener Vertrag gerade der stärkste Hebel für Nachteile beim Arbeitslosengeld und beim Handlungsspielraum ist, hat der Vertragsstopp Vorrang.",
    "confidenceClass": "mvp-reliable"
  },
  "topActions": [
    {
      "priority": 1,
      "label": "Aufhebungsvertrag nicht vorschnell unterschreiben",
      "why": "Vor einer Unterschrift sollten die möglichen Folgen für Arbeitslosengeld, Fristen und Optionen sauber geprüft sein.",
      "timing": "vor jeder Unterschrift",
      "statementClass": "mvp-reliable"
    },
    {
      "priority": 2,
      "label": "Arbeitsuchendmeldung sofort prüfen oder nachholen",
      "why": "Auch ohne bereits eingetretene Arbeitslosigkeit ist diese frühe Meldung ein kritischer Pflichtpunkt.",
      "timing": "sofort",
      "statementClass": "mvp-reliable"
    },
    {
      "priority": 3,
      "label": "Vertragsentwurf und Fragen für Beratung bündeln",
      "why": "Eine saubere Vorbereitung hilft, die Folgen des Vertrags und sinnvolle Alternativen belastbar einzuordnen.",
      "timing": "heute",
      "statementClass": "mvp-reliable"
    }
  ],
  "deadlines": [
    {
      "label": "Arbeitsuchendmeldung",
      "timing": "spätestens 3 Monate vor Ende, sonst innerhalb von 3 Tagen nach Kenntnis",
      "importance": "critical",
      "note": "Diese Meldung sollte nicht aufgeschoben werden, auch wenn der Vertrag noch nicht unterschrieben ist.",
      "statementClass": "mvp-reliable"
    }
  ],
  "riskFlags": [
    {
      "label": "Sperrzeit-/Ruhensrisiko bei einvernehmlicher Beendigung",
      "description": "Wenn du an der Beendigung des Arbeitsverhältnisses mitwirkst, kann das Folgen für dein Arbeitslosengeld haben.",
      "severity": "critical",
      "statementClass": "mvp-reliable"
    },
    {
      "label": "Freistellung beendet nicht automatisch alle To-dos",
      "description": "Auch bei unwiderruflicher Freistellung bleiben Agentur-Themen, Fristen und Unterlagen relevant.",
      "severity": "medium",
      "statementClass": "mvp-reliable"
    }
  ],
  "redFlags": [],
  "documentChecklist": [
    {
      "label": "Aufhebungs-/Abwicklungsvertrag oder Entwurf",
      "reason": "Nur mit dem konkreten Text lassen sich Risiken und offene Punkte sinnvoll prüfen.",
      "status": "already-secured"
    },
    {
      "label": "Arbeitsvertrag",
      "reason": "Wichtig für die Ausgangslage und mögliche Rückfragen in der Beratung.",
      "status": "already-secured"
    },
    {
      "label": "Lohnunterlagen",
      "reason": "Hilfreich für ALG-I-Themen und die Vorbereitung auf Rückfragen.",
      "status": "already-secured"
    },
    {
      "label": "Infos zu Freistellung / Urlaub / Restansprüchen",
      "reason": "Relevant, weil Freistellung organisatorisch wichtig bleibt und offene Ansprüche später eine Rolle spielen können.",
      "status": "secure-now"
    }
  ],
  "advisorQuestions": [
    "Welche unmittelbaren Folgen hätte dieser Vertrag für mein Arbeitslosengeld?",
    "Gibt es in diesem Entwurf Formulierungen, die ich besonders kritisch prüfen lassen sollte?",
    "Welche Alternative habe ich, wenn ich jetzt nicht unterschreibe?"
  ],
  "opportunities": [],
  "disclaimers": [
    "Arbeitsuchendmeldung und Arbeitslosmeldung sind nicht dasselbe.",
    "Der MVP ersetzt keine individuelle Rechtsberatung.",
    "Abfindung, Sperrzeit und Ruhen hängen stark vom konkreten Einzelfall ab."
  ],
  "statementLedger": {
    "mvpReliable": [
      "Ein noch nicht unterschriebener Aufhebungs- oder Abwicklungsvertrag sollte nicht vorschnell unterzeichnet werden.",
      "Arbeitsuchendmeldung ist eine frühe Pflicht und bleibt zeitkritisch.",
      "Mitwirkung an der Beendigung kann ALG-I-Risiken auslösen."
    ],
    "cautiousChecks": [
      "Details der Freistellung und konkrete Vertragsfolgen im Einzelfall gesondert prüfen."
    ],
    "notUsedYet": [
      "Keine Abfindungserwartung oder Erfolgswahrscheinlichkeit ausgeben."
    ]
  }
}
```

---

## Golden Output 3 — Kündigung plus Sonderfallindikator

### Input-Fall

```json
{
  "case_entry": "termination_received",
  "termination_access_date": "2026-03-19",
  "employment_end_date": "2026-06-30",
  "jobseeker_registered": true,
  "already_unemployed_now": false,
  "agreement_present": false,
  "release_status": "unknown",
  "special_protection_indicator": ["pregnancy_or_maternity", "unsure"],
  "documents_secured": ["termination_letter", "employment_contract", "salary_docs"],
  "primary_goal": "prepare_advice"
}
```

### Soll-Result

```json
{
  "resultVersion": "v2",
  "caseSnapshot": {
    "headline": "Dein Fall sollte nicht als Standardfall behandelt werden",
    "situation": "Du hast eine schriftliche Kündigung erhalten und es gibt Hinweise auf einen möglichen Sonderfall oder besonderen Schutz, der gesondert geprüft werden sollte.",
    "riskLevel": "high",
    "primaryGoal": "prepare_advice"
  },
  "synthesisDecision": {
    "primaryTrack": "special-case-review",
    "reasoning": "Weil hier neben der Kündigungsfrist auch ein möglicher Schutzstatus oder Sonderfall im Raum steht, wäre Standardlogik zu grob und eine individuelle Prüfung vorrangig.",
    "confidenceClass": "cautious-check"
  },
  "topActions": [
    {
      "priority": 1,
      "label": "3-Wochen-Frist für Kündigungsschutzklage sofort prüfen",
      "why": "Auch bei möglichem Sonderfall bleibt die kurze Frist nach Zugang der schriftlichen Kündigung zentral.",
      "timing": "heute",
      "statementClass": "mvp-reliable"
    },
    {
      "priority": 2,
      "label": "Möglichen Sonderfall gezielt prüfen lassen",
      "why": "Hier sollte nicht mit pauschalen Aussagen gearbeitet werden, wenn ein besonderer Schutz in Betracht kommt.",
      "timing": "sehr zeitnah",
      "statementClass": "cautious-check"
    },
    {
      "priority": 3,
      "label": "Unterlagen für Beratung vollständig bündeln",
      "why": "Je klarer der Fall dokumentiert ist, desto schneller lässt sich der mögliche Schutzstatus einordnen.",
      "timing": "heute",
      "statementClass": "mvp-reliable"
    }
  ],
  "deadlines": [
    {
      "label": "Kündigungsschutzklage prüfen",
      "timing": "regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung",
      "importance": "critical",
      "note": "Der mögliche Sonderfall ändert nichts daran, dass die Frist nicht liegen bleiben sollte.",
      "statementClass": "mvp-reliable"
    }
  ],
  "riskFlags": [
    {
      "label": "Möglicher Sonderkündigungsschutz / heikler Sonderfall",
      "description": "Der Fall sollte nicht wie eine Standard-Kündigung behandelt werden, solange unklar ist, ob ein besonderer Schutz eingreift.",
      "severity": "high",
      "statementClass": "mvp-reliable"
    },
    {
      "label": "Unsicherheit bei Schutzstatus erhöht das Fehlentscheidungsrisiko",
      "description": "Wenn die Schutzlage unklar ist, kann vorschnelles Handeln wichtige Optionen verschlechtern.",
      "severity": "high",
      "statementClass": "cautious-check"
    }
  ],
  "redFlags": [
    {
      "label": "Möglicher besonderer Schutz oder Sonderfall",
      "whyEscalated": "Es gibt Hinweise auf Schwangerschaft / Mutterschutz oder eine unklare Schutzlage, die der MVP nicht selbst verlässlich auflösen sollte.",
      "recommendedEscalation": "Qualifizierte individuelle Prüfung mit Anwalt, Gewerkschaft oder passender Beratungsstelle"
    }
  ],
  "documentChecklist": [
    {
      "label": "Kündigungsschreiben",
      "reason": "Zugang und Inhalt sind für Fristen und Prüfung zentral.",
      "status": "already-secured"
    },
    {
      "label": "Arbeitsvertrag",
      "reason": "Hilft bei der rechtlichen und praktischen Einordnung des Falls.",
      "status": "already-secured"
    },
    {
      "label": "Lohnunterlagen",
      "reason": "Nützlich für Beratung und eventuelle Anschlussfragen.",
      "status": "already-secured"
    },
    {
      "label": "Nachweise zum möglichen Schutzstatus",
      "reason": "Falls vorhanden, helfen diese Unterlagen, den Sonderfall schneller individuell einzuordnen.",
      "status": "secure-now"
    }
  ],
  "advisorQuestions": [
    "Greift in meinem Fall möglicherweise ein besonderer Schutz?",
    "Welche Frist läuft trotz Sonderfall jetzt sofort?",
    "Welche Unterlagen oder Nachweise sollte ich für die Prüfung direkt mitbringen?"
  ],
  "opportunities": [],
  "disclaimers": [
    "Der MVP ersetzt keine individuelle Rechtsberatung.",
    "Ob tatsächlich ein besonderer Schutz greift, muss im Einzelfall geprüft werden.",
    "Das Tool priorisiert Fristen und Eskalation, entscheidet aber keinen Sonderfall abschließend."
  ],
  "statementLedger": {
    "mvpReliable": [
      "Die 3-Wochen-Frist nach Zugang der schriftlichen Kündigung bleibt regelmäßig relevant.",
      "Hinweise auf besonderen Schutz oder Sonderfälle sollen im MVP eine Eskalation auslösen."
    ],
    "cautiousChecks": [
      "Ob tatsächlich Sonderkündigungsschutz oder eine vergleichbare Schutzlage greift, muss individuell geprüft werden.",
      "Unsichere Schutzlagen dürfen nicht als feste Rechtsposition ausgegeben werden."
    ],
    "notUsedYet": [
      "Keine pauschale Aussage zur Wirksamkeit der Kündigung."
    ]
  }
}
```

---

## Operative Nutzung

Diese Golden Outputs sind sinnvoll für:
- spätere Rendering-Tests
- Snapshot-Vergleiche
- Prompt- oder Template-Validierung
- Dedupe-/Priorisierungsprüfung

Wenn eine spätere Implementierung hiervon stark abweicht, ist zuerst die Mapping-Logik zu prüfen — nicht direkt das Schema.
