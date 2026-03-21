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
  "special_protection_indicator": [
    "none_known"
  ],
  "documents_secured": [
    "termination_letter",
    "employment_contract"
  ],
  "primary_goal": "protect_deadlines"
}
```

### Soll-Result

```json
{
  "resultVersion": "v2",
  "caseSnapshot": {
    "headline": "Jetzt zuerst: Fristen und Meldungen im Blick behalten",
    "situation": "Du hast eine schriftliche Kündigung erhalten. Jetzt kommt es darauf an, dass keine Frist und keine Meldung durchrutscht.",
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
      "timing": "regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung (ausgehend vom angegebenen Zugangsdatum: bis 08.04.2026)",
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
      "Die Arbeitsuchendmeldung soll in der Regel spätestens 3 Monate vor Ende des Arbeitsverhältnisses erfolgen; erfährst du später davon, binnen 3 Tagen.",
      "Zu späte Meldungen können finanzielle Nachteile beim späteren Arbeitslosengeld auslösen.",
      "Die Arbeitslosmeldung ist eine eigene Pflicht und soll spätestens am ersten Tag der Arbeitslosigkeit erfolgt sein. Wenn das noch offen ist, jetzt direkt handeln.",
      "Arbeitsuchendmeldung und Arbeitslosmeldung sind nicht dasselbe. Für Leistungsbezug und Start der Arbeitslosigkeit muss die separate Meldung geprüft werden.",
      "Beide Meldungen sind fachlich getrennt. Im MVP soll diese Unterscheidung explizit sichtbar bleiben.",
      "Wer die Unwirksamkeit einer schriftlichen Kündigung geltend machen will, muss regelmäßig innerhalb von 3 Wochen nach Zugang Klage erheben.",
      "Ob die Kündigung im Einzelfall wirksam oder angreifbar ist, leistet der MVP nicht."
    ],
    "cautiousChecks": [],
    "notUsedYet": [
      "Der MVP soll keine belastbare Erwartung zu Abfindungshöhe oder Durchsetzbarkeit suggerieren."
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
  "special_protection_indicator": [
    "none_known"
  ],
  "documents_secured": [
    "agreement_draft",
    "employment_contract",
    "salary_docs"
  ],
  "primary_goal": "protect_alg1"
}
```

### Soll-Result

```json
{
  "resultVersion": "v2",
  "caseSnapshot": {
    "headline": "Vor der Unterschrift kurz innehalten",
    "situation": "Dir liegt ein Aufhebungs- oder Abwicklungsvertrag vor. Vor einer Unterschrift sollten die Folgen für dein Arbeitslosengeld und deine nächsten Optionen klar sein.",
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
      "label": "Freistellung ändert nichts daran, dass zentrale Schritte offen bleiben können",
      "description": "Auch während einer Freistellung bleiben Fristen, Meldungen und wichtige Unterlagen relevant.",
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
      "Die Arbeitsuchendmeldung soll in der Regel spätestens 3 Monate vor Ende des Arbeitsverhältnisses erfolgen; erfährst du später davon, binnen 3 Tagen.",
      "Zu späte Meldungen können finanzielle Nachteile beim späteren Arbeitslosengeld auslösen.",
      "Beide Meldungen sind fachlich getrennt. Im MVP soll diese Unterscheidung explizit sichtbar bleiben.",
      "Aufhebungs- oder Abwicklungsverträge können erhebliche Folgen für Arbeitslosengeld und Verhandlungsspielraum haben.",
      "Bei Vertragsbeendigungen mit eigener Mitwirkung können Auswirkungen auf das Arbeitslosengeld entstehen.",
      "Auch bei Freistellung bleiben Meldungen, Fristen und Unterlagenthemen relevant."
    ],
    "cautiousChecks": [],
    "notUsedYet": [
      "Der MVP soll keine belastbare Erwartung zu Abfindungshöhe oder Durchsetzbarkeit suggerieren."
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
  "special_protection_indicator": [
    "pregnancy_or_maternity",
    "unsure"
  ],
  "documents_secured": [
    "termination_letter",
    "employment_contract",
    "salary_docs"
  ],
  "primary_goal": "prepare_advice"
}
```

### Soll-Result

```json
{
  "resultVersion": "v2",
  "caseSnapshot": {
    "headline": "Dein Fall hat Besonderheiten, die individuell geprüft werden sollten",
    "situation": "Du hast eine schriftliche Kündigung erhalten und es gibt Hinweise auf Aspekte, die über eine Standard-Kündigung hinausgehen.",
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
      "label": "Besonderheiten gezielt prüfen lassen",
      "why": "Dein Fall hat Merkmale, die über eine typische Kündigung hinausgehen und individuell geprüft werden sollten.",
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
      "timing": "regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung (ausgehend vom angegebenen Zugangsdatum: bis 09.04.2026)",
      "importance": "critical",
      "note": "Der mögliche Sonderfall ändert nichts daran, dass die Frist nicht liegen bleiben sollte.",
      "statementClass": "mvp-reliable"
    }
  ],
  "riskFlags": [
    {
      "label": "Möglicher Sonderkündigungsschutz / heikler Sonderfall",
      "description": "Dein Fall hat Merkmale, die über eine typische Kündigung hinausgehen und individuell geprüft werden sollten.",
      "severity": "high",
      "statementClass": "mvp-reliable"
    },
    {
      "label": "Unsicherheit bei Schutzstatus erhöht das Fehlentscheidungsrisiko",
      "description": "Wenn die Schutzlage unklar ist, braucht es eher eine sorgfältige Einordnung als eine schnelle Standardantwort.",
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
      "status": "already-secured"
    },
    {
      "label": "Infos zu Freistellung / Urlaub / Restansprüchen",
      "reason": "Relevant, weil Freistellung organisatorisch wichtig bleibt und offene Ansprüche später eine Rolle spielen können.",
      "status": "secure-now"
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
      "Beide Meldungen sind fachlich getrennt. Im MVP soll diese Unterscheidung explizit sichtbar bleiben.",
      "Wer die Unwirksamkeit einer schriftlichen Kündigung geltend machen will, muss regelmäßig innerhalb von 3 Wochen nach Zugang Klage erheben.",
      "Ob die Kündigung im Einzelfall wirksam oder angreifbar ist, leistet der MVP nicht.",
      "Auch bei Freistellung bleiben Meldungen, Fristen und Unterlagenthemen relevant.",
      "Hier sollte der MVP nicht normalisieren, sondern auf erhöhte Vorsicht und individuelle Prüfung umschalten."
    ],
    "cautiousChecks": [
      "Ob tatsächlich ein besonderer Schutz greift, muss im Einzelfall verifiziert werden."
    ],
    "notUsedYet": [
      "Der MVP soll keine belastbare Erwartung zu Abfindungshöhe oder Durchsetzbarkeit suggerieren."
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
