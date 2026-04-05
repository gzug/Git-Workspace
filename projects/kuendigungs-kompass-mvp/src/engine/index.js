const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

const questionsSchema = loadJson('questions.schema.json');
const rulesSchema = loadJson('rules.schema.json');
const resultSchema = loadJson('result.schema.json'); // loaded for version/constants sanity
const mappingConfig = loadJson('MAPPING-CONFIG-V1.json');

const questions = questionsSchema.questions || questionsSchema.example?.questions || [];
const rules = rulesSchema.rules || rulesSchema.example?.rules || [];

function normalizeAnswers(rawAnswers = {}) {
  const answers = { ...rawAnswers };
  for (const question of questions) {
    if (question.type === 'multiSelect' && !Array.isArray(answers[question.id])) {
      answers[question.id] = answers[question.id] == null ? [] : [answers[question.id]];
    }
  }
  return answers;
}

function valueIncludes(actual, expected) {
  if (Array.isArray(actual)) return actual.includes(expected);
  if (typeof actual === 'string') return actual === expected;
  return false;
}

function daysToDate(dateString, now = new Date()) {
  if (!dateString) return null;
  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) return null;
  const ms = target.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

function addDays(dateString, days) {
  if (!dateString) return null;
  const target = new Date(dateString);
  if (Number.isNaN(target.getTime())) return null;
  target.setDate(target.getDate() + days);
  return target;
}

function shiftWeekendForward(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  const shifted = new Date(date.getTime());
  const day = shifted.getDay();
  if (day === 6) shifted.setDate(shifted.getDate() + 2);
  if (day === 0) shifted.setDate(shifted.getDate() + 1);
  return shifted;
}

function buildLawsuitDeadlineInfo(dateString) {
  const rawDeadline = addDays(dateString, 21);
  if (!rawDeadline) return { date: null, shiftedForWeekend: false };
  const shiftedDeadline = shiftWeekendForward(rawDeadline);
  return {
    date: shiftedDeadline,
    shiftedForWeekend: shiftedDeadline.getTime() !== rawDeadline.getTime(),
  };
}

function formatDateDE(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Berlin',
  }).format(date);
}

function matchesCondition(condition, answers, now = new Date()) {
  const actual = answers[condition.field];
  switch (condition.operator) {
    case 'equals':
      return actual === condition.value;
    case 'notEquals':
      return actual !== condition.value;
    case 'includes':
      return valueIncludes(actual, condition.value);
    case 'notIncludes':
      return !valueIncludes(actual, condition.value);
    case 'exists':
      return condition.value === true
        ? actual !== undefined && actual !== null && !(Array.isArray(actual) && actual.length === 0)
        : actual === undefined || actual === null;
    case 'ltDaysToDate': {
      const days = daysToDate(actual, now);
      return days != null && days < condition.value;
    }
    case 'lteDaysToDate': {
      const days = daysToDate(actual, now);
      return days != null && days <= condition.value;
    }
    case 'gtDaysToDate': {
      const days = daysToDate(actual, now);
      return days != null && days > condition.value;
    }
    default:
      return false;
  }
}

function missingRequiredFields(answers) {
  const missing = [];
  for (const question of questions) {
    const askIfOk = !question.askIf || question.askIf.every((condition) => matchesCondition(condition, answers));
    if (!askIfOk) continue;
    const value = answers[question.id];
    const isMissing = value === undefined || value === null || (Array.isArray(value) && value.length === 0) || value === '';
    if (isMissing && (question.required || question.redFlagIfMissing)) {
      missing.push({
        id: question.id,
        label: question.label,
        redFlagIfMissing: Boolean(question.redFlagIfMissing),
      });
    }
  }
  return missing;
}

function evaluateRules(rawAnswers, options = {}) {
  const answers = normalizeAnswers(rawAnswers);
  const now = options.now ? new Date(options.now) : new Date();
  const matchedRules = [];
  const effects = [];

  for (const rule of rules) {
    if (rule.conditions.every((condition) => matchesCondition(condition, answers, now))) {
      matchedRules.push(rule);
      for (const effect of rule.effects) {
        effects.push({
          ...effect,
          ruleId: rule.id,
          ruleSeverity: rule.severity,
          ruleClass: rule.ruleClass,
          outcomeType: rule.outcomeType,
          stage: rule.stage,
          tags: rule.tags,
        });
      }
    }
  }

  return {
    answers,
    matchedRules,
    effects,
    missingFields: missingRequiredFields(answers),
  };
}

function dedupeBy(items, keyFn) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function effectId(effect) {
  return effect?.payload?.id || effect?.payload?.label || effect.ruleId;
}

function severityRank(severity) {
  return { critical: 4, high: 3, medium: 2, low: 1 }[severity] || 0;
}

function statementLedgerFromEffects(effects) {
  const ledger = {
    mvpReliable: [],
    cautiousChecks: [],
    notUsedYet: [],
  };

  for (const effect of effects) {
    const text = effect.payload.description || effect.payload.why || effect.payload.label;
    if (!text) continue;
    if (effect.payload.statementClass === 'mvp-reliable') ledger.mvpReliable.push(text);
    if (effect.payload.statementClass === 'cautious-check') ledger.cautiousChecks.push(text);
    if (effect.payload.statementClass === 'do-not-use-yet') ledger.notUsedYet.push(text);
  }

  ledger.mvpReliable = dedupeBy(ledger.mvpReliable, (x) => x);
  ledger.cautiousChecks = dedupeBy(ledger.cautiousChecks, (x) => x);
  ledger.notUsedYet = dedupeBy(ledger.notUsedYet, (x) => x);

  return ledger;
}

function hasExplicitReleaseStatus(value) {
  return value === 'yes_revocable' || value === 'yes_irrevocable';
}

function buildDocumentChecklist(answers) {
  const secured = new Set(answers.documents_secured || []);
  const items = [];

  function push(label, reason, statusKey) {
    const status = secured.has(statusKey)
      ? 'already-secured'
      : 'secure-now';
    items.push({ label, reason, status });
  }

  if (answers.case_entry === 'termination_received') {
    push('Kündigungsschreiben', 'Zugang und Datum sind für die Fristprüfung zentral.', 'termination_letter');
  }
  if (answers.case_entry === 'termination_announced_only') {
    items.push({
      label: 'Schriftliche Kommunikation zur angekündigten Kündigung',
      reason: 'Hilfreich, um den Verlauf später nachvollziehen zu können.',
      status: 'secure-now',
    });
  }
  if (answers.agreement_present) {
    push(
      answers.agreement_already_signed ? 'Unterzeichneter Vertrag' : 'Aufhebungs-/Abwicklungsvertrag oder Entwurf',
      answers.agreement_already_signed
        ? 'Der exakte Inhalt ist jetzt zentral für jede weitere Einordnung.'
        : 'Nur mit dem konkreten Text lassen sich Risiken und offene Punkte sinnvoll prüfen.',
      'agreement_draft'
    );
  }

  items.push({
    label: 'Arbeitsvertrag',
    reason: answers.agreement_present
      ? 'Wichtig für die Ausgangslage und mögliche Rückfragen in der Beratung.'
      : 'Hilft bei Beratung und Einordnung der Ausgangslage.',
    status: secured.has('employment_contract') ? 'already-secured' : 'secure-now',
  });

  if (answers.case_entry === 'termination_announced_only' || secured.has('salary_docs') || answers.agreement_present || answers.already_unemployed_now) {
    items.push({
      label: 'Lohnunterlagen',
      reason: answers.agreement_present
        ? 'Hilfreich für ALG-I-Themen und die Vorbereitung auf Rückfragen.'
        : 'Hilfreich für Agentur-Themen und Beratungsvorbereitung.',
      status: secured.has('salary_docs') ? 'already-secured' : 'secure-now',
    });
  }

  if (hasExplicitReleaseStatus(answers.release_status) || secured.has('release_or_vacation_info')) {
    items.push({
      label: answers.agreement_already_signed ? 'Freistellungs- und Restanspruchsinfos' : 'Infos zu Freistellung / Urlaub / Restansprüchen',
      reason: answers.agreement_already_signed
        ? 'Relevant, weil die praktische Abwicklung jetzt wichtig bleibt.'
        : 'Relevant, weil Freistellung organisatorisch wichtig bleibt und offene Ansprüche später eine Rolle spielen können.',
      status: secured.has('release_or_vacation_info') ? 'already-secured' : 'secure-now',
    });
  }

  const indicators = answers.special_protection_indicator || [];
  if (indicators.some((x) => x !== 'none_known')) {
    items.push({
      label: 'Nachweise zum möglichen Schutzstatus',
      reason: 'Falls vorhanden, helfen diese Unterlagen, den Sonderfall schneller individuell einzuordnen.',
      status: 'secure-now',
    });
  }

  return dedupeBy(items, (item) => item.label);
}

function isOverlappingMultiRiskCase(answers) {
  const indicators = answers.special_protection_indicator || [];
  const hasSpecialIndicator = indicators.some((x) => x !== 'none_known');
  return answers.case_entry === 'multiple'
    && Boolean(answers.termination_access_date)
    && answers.agreement_present === true
    && answers.agreement_already_signed !== true
    && hasSpecialIndicator;
}

function buildAdvisorQuestions(answers, track) {
  if (track === 'contract-do-not-sign') {
    return [
      'Welche unmittelbaren Folgen hätte dieser Vertrag für mein Arbeitslosengeld?',
      'Gibt es in diesem Entwurf Formulierungen, die ich besonders kritisch prüfen lassen sollte?',
      'Welche Alternative habe ich, wenn ich jetzt nicht unterschreibe?'
    ];
  }
  if (track === 'alg1-risk-first') {
    return [
      'Welche Meldung sollte ich in meinem Fall jetzt als Erstes sauber erledigen?',
      'Was an der Beendigung kann für mein Arbeitslosengeld besonders wichtig werden?',
      'Welche Unterlagen sollte ich für Agentur oder Beratung direkt bereithalten?'
    ];
  }
  if (track === 'special-case-review') {
    if (isOverlappingMultiRiskCase(answers)) {
      return [
        'Welche Reihenfolge ist in meinem Fall wirklich die richtige: Vertrag, Klagefrist, Agentur oder Schutzstatus?',
        'Welche Risiken entstehen, wenn ich jetzt falsch priorisiere?',
        'Welche Unterlagen fehlen noch für eine belastbare Prüfung?'
      ];
    }
    if (answers.agreement_already_signed) {
      return [
        'Welche unmittelbaren Folgen hat die bereits erfolgte Unterschrift?',
        'Welche Fristen oder nächsten Schritte laufen jetzt trotzdem?',
        'Welche Punkte im Vertrag sind für ALG I oder weitere Ansprüche besonders kritisch?'
      ];
    }
    return [
      'Greift in meinem Fall möglicherweise ein besonderer Schutz?',
      'Welche Frist läuft trotz Sonderfall jetzt sofort?',
      'Welche Unterlagen oder Nachweise sollte ich für die Prüfung direkt mitbringen?'
    ];
  }
  if (track === 'deadline-first') {
    return [
      'Welche Schritte erwartet die Agentur für Arbeit in meinem Fall jetzt sofort von mir?',
      'Bis wann muss ich die 3-Wochen-Frist konkret gerechnet haben?',
      'Welche Unterlagen sollte ich für Agentur oder Beratung direkt bereithalten?'
    ];
  }
  return [
    'Ab wann ist in meinem Fall die Arbeitsuchendmeldung relevant?',
    'Welche Schritte sollte ich jetzt schon vorbereiten, obwohl noch nichts Schriftliches vorliegt?',
    'Welche Unterlagen sollte ich sofort sichern?'
  ];
}

function buildTopActions(answers, effects, track) {
  const actions = [];
  const secured = new Set(answers.documents_secured || []);

  for (const effect of effects) {
    const warningRoute = mappingConfig.warningRouting[effectId(effect)];
    const suppressedGenericActionIds = new Set([
      'complete-jobseeker-registration',
      'complete-unemployment-registration'
    ]);
    if (
      (effect.type === 'immediateAction' && !suppressedGenericActionIds.has(effectId(effect))) ||
      (effect.type === 'warning' && warningRoute === 'topActions')
    ) {
      actions.push({
        priority: effect.payload.priority || 99,
        label: effect.payload.label,
        why: effect.payload.why || effect.payload.description || effect.payload.label,
        timing: effect.payload.timing || mappingConfig.severityToTimingFallback[effect.ruleSeverity] || 'zeitnah',
        statementClass: effect.payload.statementClass,
        _severity: effect.ruleSeverity,
      });
    }
  }

  if (track === 'contract-do-not-sign') {
    actions.unshift({
      priority: 1,
      label: 'Aufhebungsvertrag nicht vorschnell unterschreiben',
      why: 'Vor einer Unterschrift sollten die möglichen Folgen für Arbeitslosengeld, Fristen und Optionen sauber geprüft sein.',
      timing: 'vor jeder Unterschrift',
      statementClass: 'mvp-reliable',
      _severity: 'critical',
    });
    if (answers.jobseeker_registered === false) {
      actions.push({
        priority: 2,
        label: 'Arbeitsuchendmeldung sofort prüfen oder nachholen',
        why: 'Auch ohne bereits eingetretene Arbeitslosigkeit ist diese frühe Meldung ein kritischer Pflichtpunkt.',
        timing: 'sofort',
        statementClass: 'mvp-reliable',
        _severity: 'critical',
      });
    }
    actions.push({
      priority: 3,
      label: 'Vertragsentwurf und Fragen für Beratung bündeln',
      why: 'Eine saubere Vorbereitung hilft, die Folgen des Vertrags und sinnvolle Alternativen belastbar einzuordnen.',
      timing: 'heute',
      statementClass: 'mvp-reliable',
      _severity: 'medium',
    });
  }

  if (track === 'deadline-first') {
    if (answers.already_unemployed_now && answers.unemployment_registered === false) {
      actions.push({
        priority: 1,
        label: 'Arbeitslosmeldung sofort prüfen oder nachholen',
        why: 'Wenn du bereits arbeitslos bist, ist das ein eigener zeitkritischer Schritt gegenüber der Agentur für Arbeit.',
        timing: 'sofort',
        statementClass: 'mvp-reliable',
        _severity: 'critical',
      });
    }
    if (answers.jobseeker_registered === false) {
      actions.push({
        priority: 2,
        label: answers.already_unemployed_now
          ? 'Arbeitsuchendmeldung ebenfalls sofort prüfen oder nachholen'
          : 'Arbeitsuchendmeldung sofort prüfen oder nachholen',
        why: answers.already_unemployed_now
          ? 'Die Arbeitsuchendmeldung ist fachlich getrennt von der Arbeitslosmeldung und sollte nicht offen bleiben.'
          : 'Diese frühe Meldung gehört zu den ersten kritischen Schritten.',
        timing: 'sofort',
        statementClass: 'mvp-reliable',
        _severity: 'critical',
      });
    }
    if (answers.termination_access_date) {
      actions.push({
        priority: 3,
        label: '3-Wochen-Frist für Kündigungsschutzklage sofort einordnen',
        why: 'Nach Zugang einer schriftlichen Kündigung läuft regelmäßig eine sehr kurze Frist, die du nicht versehentlich verstreichen lassen solltest.',
        timing: 'heute',
        statementClass: 'mvp-reliable',
        _severity: 'critical',
      });
    }
  }

  if (track === 'alg1-risk-first') {
    if (answers.jobseeker_registered === false) {
      actions.push({
        priority: 1,
        label: 'Arbeitsuchendmeldung sofort prüfen oder nachholen',
        why: 'Wenn diese frühe Meldung offen bleibt, kann das später beim Arbeitslosengeld unnötige Nachteile auslösen.',
        timing: 'sofort',
        statementClass: 'mvp-reliable',
        _severity: 'critical',
      });
    }
    actions.push({
      priority: 2,
      label: 'Beendigungsverlauf und Agentur-relevante Eckdaten sauber festhalten',
      why: 'Für die weitere Einordnung ist wichtig, wann und wie dir das Ende des Arbeitsverhältnisses angekündigt wurde und welche Meldungen schon erledigt sind.',
      timing: 'heute',
      statementClass: 'mvp-reliable',
      _severity: 'medium',
    });
    if (answers.case_entry === 'termination_announced_only') {
      actions.push({
        priority: 3,
        label: 'Sobald etwas Schriftliches kommt, den Fall direkt neu einordnen',
        why: 'Erst mit einer schriftlichen Kündigung werden Fristen wie die Kündigungsschutzklage konkret relevant.',
        timing: 'ab dann sofort',
        statementClass: 'mvp-reliable',
        _severity: 'medium',
      });
    }
  }

  if (track === 'special-case-review') {
    if (isOverlappingMultiRiskCase(answers)) {
      actions.push({
        priority: 1,
        label: 'Vor der Unterschrift kurz innehalten',
        why: 'Dieser Vertrag ist gerade der Punkt, der am meisten beeinflusst, wie es weitergeht.',
        timing: 'sofort',
        statementClass: 'mvp-reliable',
        _severity: 'critical',
      });
      actions.push({
        priority: 2,
        label: '3-Wochen-Frist und Agentur-Meldungen parallel im Blick behalten',
        why: 'Hier laufen mehrere wichtige Themen gleichzeitig und sollten zusammen eingeordnet werden.',
        timing: 'heute',
        statementClass: 'mvp-reliable',
        _severity: 'critical',
      });
      actions.push({
        priority: 3,
        label: 'Besonderheiten individuell prüfen lassen',
        why: 'Dein Fall hat Merkmale, die über eine typische Kündigung hinausgehen und individuell geprüft werden sollten.',
        timing: 'sehr zeitnah',
        statementClass: 'cautious-check',
        _severity: 'high',
      });
    } else if (answers.agreement_already_signed) {
      actions.push({
        priority: 1,
        label: 'Unterzeichneten Vertrag sofort individuell prüfen lassen',
        why: 'Nach der Unterschrift geht es nicht mehr um allgemeines Bremsen, sondern um konkrete Folgen und mögliche nächste Schritte.',
        timing: 'sofort',
        statementClass: 'cautious-check',
        _severity: 'high',
      });
      actions.push({
        priority: 2,
        label: 'Agentur-Themen und Leistungsfolgen gezielt klären',
        why: 'Mitwirkung an der Beendigung kann Auswirkungen auf Arbeitslosengeld und weitere Abläufe haben.',
        timing: 'sehr zeitnah',
        statementClass: 'mvp-reliable',
        _severity: 'high',
      });
      actions.push({
        priority: 3,
        label: 'Alle Vertrags- und Freistellungsunterlagen vollständig bündeln',
        why: 'Für jede belastbare Einordnung wird jetzt der genaue Wortlaut und die begleitende Dokumentation wichtig.',
        timing: 'heute',
        statementClass: 'mvp-reliable',
        _severity: 'medium',
      });
    } else {
      if (answers.termination_access_date) {
        actions.push({
          priority: 1,
          label: '3-Wochen-Frist für Kündigungsschutzklage sofort prüfen',
          why: 'Auch bei möglichem Sonderfall bleibt die kurze Frist nach Zugang der schriftlichen Kündigung zentral.',
          timing: 'heute',
          statementClass: 'mvp-reliable',
          _severity: 'critical',
        });
      }
      actions.push({
        priority: 2,
        label: 'Besonderheiten gezielt prüfen lassen',
        why: 'Dein Fall hat Merkmale, die über eine typische Kündigung hinausgehen und individuell geprüft werden sollten.',
        timing: 'sehr zeitnah',
        statementClass: 'cautious-check',
        _severity: 'high',
      });
      actions.push({
        priority: 3,
        label: 'Unterlagen für Beratung vollständig bündeln',
        why: 'Je klarer der Fall dokumentiert ist, desto schneller lässt sich der mögliche Schutzstatus einordnen.',
        timing: 'heute',
        statementClass: 'mvp-reliable',
        _severity: 'medium',
      });
    }
  }

  if (track === 'prepare-advice') {
    if (answers.jobseeker_registered === false) {
      actions.push({
        priority: 1,
        label: 'Arbeitsuchendmeldung jetzt prüfen oder nachholen',
        why: 'Die Arbeitsuchendmeldung ist ein eigener Schritt und sollte jetzt geprüft oder nachgeholt werden — sie ist nicht dasselbe wie die spätere Arbeitslosmeldung.',
        timing: 'sofort',
        statementClass: 'mvp-reliable',
        _severity: 'critical',
      });
    }
    if (answers.case_entry === 'termination_announced_only') {
      actions.push({
        priority: 2,
        label: 'Schriftliche Kündigung erst zeitnah einordnen, wenn sie vorliegt',
        why: 'Nach einer schriftlichen Kündigung läuft in der Regel eine kurze Frist. Solange noch nichts Schriftliches vorliegt, sollte das sauber getrennt bleiben.',
        timing: 'ab jetzt',
        statementClass: 'mvp-reliable',
        _severity: 'medium',
      });
    }
    if (secured.has('none_yet') || !answers.documents_secured || answers.documents_secured.length === 0) {
      actions.push({
        priority: 3,
        label: 'Kernunterlagen schon jetzt sichern',
        why: 'Wenn sich die Lage zuspitzt, spart vorbereitete Dokumentation Zeit und Fehler.',
        timing: 'heute',
        statementClass: 'mvp-reliable',
        _severity: 'medium',
      });
    }
  }

  return dedupeBy(actions, (item) => item.label)
    .sort((a, b) => (a.priority - b.priority) || (severityRank(b._severity) - severityRank(a._severity)))
    .slice(0, 3)
    .map(({ _severity, ...item }) => item);
}

function buildDeadlines(answers) {
  const deadlines = [];
  if (answers.already_unemployed_now && answers.unemployment_registered === false) {
    deadlines.push({
      label: 'Arbeitslosmeldung',
      timing: 'spätestens am ersten Tag der Arbeitslosigkeit; wenn noch offen, jetzt sofort prüfen',
      importance: 'critical',
      note: 'Die Arbeitslosmeldung ist ein eigener Schritt und nicht dasselbe wie die Arbeitsuchendmeldung.',
      statementClass: 'mvp-reliable',
    });
  }
  if (answers.jobseeker_registered === false) {
    deadlines.push({
      label: 'Arbeitsuchendmeldung',
      timing: 'spätestens 3 Monate vor Ende, sonst innerhalb von 3 Tagen nach Kenntnis',
      importance: 'critical',
      note: answers.already_unemployed_now
        ? 'Auch wenn du schon arbeitslos bist, sollte diese Meldung als eigener Pflichtpunkt nicht übersehen werden.'
        : answers.agreement_present === true
          ? 'Diese Meldung sollte nicht aufgeschoben werden, auch wenn der Vertrag noch nicht unterschrieben ist.'
          : 'Diese Meldung sollte nicht aufgeschoben werden, auch wenn die Beendigung bisher nur angekündigt ist oder noch Unterlagen fehlen.',
      statementClass: 'mvp-reliable',
    });
  }
  if (answers.termination_access_date) {
    const lawsuitDeadline = buildLawsuitDeadlineInfo(answers.termination_access_date);
    const formattedLawsuitDeadline = formatDateDE(lawsuitDeadline.date);
    const noteParts = [];
    if ((answers.special_protection_indicator || []).some((x) => x !== 'none_known')) {
      noteParts.push('Der mögliche Sonderfall ändert nichts daran, dass die Frist nicht liegen bleiben sollte.');
    } else {
      noteParts.push('Ob sich eine Kündigungsschutzklage in deinem Fall lohnt, muss individuell geprüft werden. Wichtig ist hier zuerst, dass die Frist nicht aus dem Blick gerät.');
    }
    if (lawsuitDeadline.shiftedForWeekend) {
      noteParts.push('Fällt das rechnerische Fristende auf Samstag oder Sonntag, sollte der nächste Werktag mitgeprüft werden.');
    }
    noteParts.push('Wenn ein Landesfeiertag in Frage kommt, sollte das Fristende vorsichtshalber zusätzlich geprüft werden.');
    deadlines.push({
      label: 'Kündigungsschutzklage prüfen',
      timing: formattedLawsuitDeadline
        ? `regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung (ausgehend vom angegebenen Zugangsdatum: bis ${formattedLawsuitDeadline})`
        : 'regelmäßig innerhalb von 3 Wochen nach Zugang der schriftlichen Kündigung',
      importance: 'critical',
      note: noteParts.join(' '),
      statementClass: 'mvp-reliable',
    });
  }
  return deadlines;
}

function buildRiskFlags(answers, track) {
  const riskFlags = [];
  const special = (answers.special_protection_indicator || []).some((x) => x !== 'none_known');

  if (track === 'deadline-first') {
    if (answers.jobseeker_registered === false) {
      riskFlags.push({
        label: 'Offene Arbeitsuchendmeldung kann Nachteile auslösen',
        description: 'Wenn die frühe Arbeitsuchendmeldung offen bleibt, steigt das Risiko unnötiger Probleme im weiteren ALG-I-Prozess.',
        severity: 'critical',
        statementClass: 'mvp-reliable',
      });
    }
    if (answers.already_unemployed_now && answers.unemployment_registered === false) {
      riskFlags.push({
        label: 'Offene Arbeitslosmeldung kann den Leistungsstart erschweren',
        description: 'Wenn du bereits arbeitslos bist und diese separate Meldung offen bleibt, können unnötige Probleme beim weiteren ALG-I-Prozess entstehen.',
        severity: 'critical',
        statementClass: 'mvp-reliable',
      });
    }
    if (answers.termination_access_date) {
      riskFlags.push({
        label: 'Kurze Klagefrist kann unbemerkt verstreichen',
        description: 'Nach Zugang einer schriftlichen Kündigung sollte die 3-Wochen-Frist nicht aus dem Blick geraten.',
        severity: 'critical',
        statementClass: 'mvp-reliable',
      });
    }
  }

  if (track === 'contract-do-not-sign') {
    riskFlags.push({
      label: 'Sperrzeit-/Ruhensrisiko bei einvernehmlicher Beendigung',
      description: 'Wenn du an der Beendigung des Arbeitsverhältnisses mitwirkst, kann das Folgen für dein Arbeitslosengeld haben.',
      severity: 'critical',
      statementClass: 'mvp-reliable',
    });
    if (hasExplicitReleaseStatus(answers.release_status)) {
      riskFlags.push({
        label: 'Freistellung ändert nichts daran, dass zentrale Schritte offen bleiben können',
        description: 'Auch während einer Freistellung bleiben Fristen, Meldungen und wichtige Unterlagen relevant.',
        severity: 'medium',
        statementClass: 'mvp-reliable',
      });
    }
  }

  if (track === 'alg1-risk-first') {
    if (answers.jobseeker_registered === false) {
      riskFlags.push({
        label: 'Offene Arbeitsuchendmeldung kann sich später beim Arbeitslosengeld auswirken',
        description: 'Wenn die frühe Arbeitsuchendmeldung offen bleibt, kann das den späteren ALG-I-Prozess unnötig belasten.',
        severity: 'critical',
        statementClass: 'mvp-reliable',
      });
    }
    riskFlags.push({
      label: 'Unklarer Verlauf der Beendigung erschwert die spätere Einordnung',
      description: 'Wenn Meldungen, Ankündigung und weitere Schritte unsauber dokumentiert sind, wird die spätere Klärung mit Agentur oder Beratung unnötig schwer.',
      severity: 'high',
      statementClass: 'mvp-reliable',
    });
  }

  if (track === 'special-case-review') {
    if (isOverlappingMultiRiskCase(answers)) {
      riskFlags.push({
        label: 'Sperrzeit-/Ruhensrisiko bei möglicher Vertragsmitwirkung',
        description: 'Ein noch nicht unterschriebener Vertrag kann zusätzliche Risiken beim Arbeitslosengeld auslösen.',
        severity: 'critical',
        statementClass: 'mvp-reliable',
      });
      riskFlags.push({
        label: 'Möglicher Sonderfall / unklare Schutzlage',
        description: 'Solange unklar ist, ob ein besonderer Schutz greift, sollte der Fall nicht als Standardfall behandelt werden.',
        severity: 'high',
        statementClass: 'cautious-check',
      });
      riskFlags.push({
        label: 'Mehrfachdruck erhöht Fehlentscheidungsrisiko',
        description: 'Wenn Kündigung, Vertrag und Schutzfragen gleichzeitig auftauchen, steigt das Risiko falscher Priorisierung.',
        severity: 'high',
        statementClass: 'cautious-check',
      });
    } else if (answers.agreement_already_signed) {
      riskFlags.push({
        label: 'Vertrag bereits unterschrieben',
        description: 'Damit verschiebt sich der Fokus von allgemeiner Warnung auf Folgen, Fristen und individuelle Prüfung.',
        severity: 'high',
        statementClass: 'cautious-check',
      });
      riskFlags.push({
        label: 'ALG-I-Risiken weiter relevant',
        description: 'Auch nach Unterschrift können Sperrzeit- oder andere Leistungsfragen im Raum stehen.',
        severity: 'high',
        statementClass: 'mvp-reliable',
      });
    } else {
      riskFlags.push({
        label: 'Möglicher Sonderkündigungsschutz / heikler Sonderfall',
        description: 'Dein Fall hat Merkmale, die über eine typische Kündigung hinausgehen und individuell geprüft werden sollten.',
        severity: 'high',
        statementClass: 'mvp-reliable',
      });
      riskFlags.push({
        label: 'Unsicherheit bei Schutzstatus erhöht das Fehlentscheidungsrisiko',
        description: 'Wenn die Schutzlage unklar ist, braucht es eher eine sorgfältige Einordnung als eine schnelle Standardantwort.',
        severity: 'high',
        statementClass: 'cautious-check',
      });
    }
  }

  if (track === 'prepare-advice') {
    riskFlags.push({
      label: 'Frühe Agentur-Schritte könnten übersehen werden',
      description: 'Wer nur auf das schriftliche Kündigungsschreiben wartet, kann frühe To-dos bei der Agentur aus dem Blick verlieren.',
      severity: 'high',
      statementClass: 'mvp-reliable',
    });
  }

  if (!special && answers.agreement_already_signed && track !== 'special-case-review') {
    riskFlags.push({
      label: 'Vertrag bereits unterschrieben',
      description: 'Da der Vertrag bereits unterschrieben ist, geht es jetzt darum, die nächsten Schritte, offene Fristen und mögliche Folgen sauber einzuordnen.',
      severity: 'high',
      statementClass: 'cautious-check',
    });
  }

  return dedupeBy(riskFlags, (item) => item.label).slice(0, 3);
}

function buildRedFlags(answers, evaluation, track) {
  const flags = [];
  const indicators = answers.special_protection_indicator || [];
  if (track === 'special-case-review' && answers.agreement_already_signed) {
    flags.push({
      label: 'Bereits unterschriebener Beendigungsvertrag',
      whyEscalated: 'Hier sollte nicht mit pauschalen Aussagen gearbeitet werden, weil die konkreten Folgen individuell geprüft werden müssen.',
      recommendedEscalation: 'Qualifizierte individuelle Prüfung mit Anwalt, Gewerkschaft oder passender Beratungsstelle',
    });
  } else if (isOverlappingMultiRiskCase(answers)) {
    flags.push({
      label: 'Überlagerter Mehrfachfall mit möglichem Sonderfall',
      whyEscalated: 'Hier laufen mehrere wichtige Themen gleichzeitig. Deshalb braucht dein Fall eine klare Priorisierung, aber keine vorschnelle Standardantwort.',
      recommendedEscalation: 'Qualifizierte individuelle Prüfung mit Anwalt, Gewerkschaft oder passender Beratungsstelle',
    });
  } else if (track === 'special-case-review' || indicators.some((x) => x !== 'none_known')) {
    flags.push({
      label: 'Möglicher besonderer Schutz oder Sonderfall',
      whyEscalated: 'Es gibt Hinweise auf Schwangerschaft / Mutterschutz oder eine unklare Schutzlage, die individuell geprüft werden sollte.',
      recommendedEscalation: 'Qualifizierte individuelle Prüfung mit Anwalt, Gewerkschaft oder passender Beratungsstelle',
    });
  }

  for (const missing of evaluation.missingFields.filter((x) => x.redFlagIfMissing)) {
    flags.push({
      label: `Wichtige Angabe fehlt: ${missing.label}`,
      whyEscalated: 'Ohne diese Angabe ist eine saubere Standard-Einordnung unsicher.',
      recommendedEscalation: 'Antwort ergänzen oder individuell prüfen lassen',
    });
  }

  return dedupeBy(flags, (item) => item.label).slice(0, 2);
}

function selectPrimaryTrack(rawAnswers, evaluation = evaluateRules(rawAnswers)) {
  const answers = evaluation.answers;
  const indicators = answers.special_protection_indicator || [];
  const hasSpecialIndicator = indicators.some((x) => x !== 'none_known');

  if (hasSpecialIndicator || answers.agreement_already_signed || evaluation.missingFields.some((x) => x.redFlagIfMissing)) {
    const reasoning = answers.agreement_already_signed
      ? 'Weil der Vertrag bereits unterschrieben ist, ist der Standardhinweis \"nicht unterschreiben\" nicht mehr ausreichend. Jetzt stehen Folgenanalyse, Fristen und individuelle Prüfung im Vordergrund.'
      : isOverlappingMultiRiskCase(answers)
        ? 'Weil sich Fristdruck, Vertragsrisiko und unklare Schutzlage gleichzeitig überlagern, braucht dein Fall hier mehr als eine schnelle Standard-Einordnung.'
        : 'Weil hier neben der Kündigungsfrist auch ein möglicher Schutzstatus oder Sonderfall im Raum steht, wäre Standardlogik zu grob und eine individuelle Prüfung vorrangig.';
    return {
      primaryTrack: 'special-case-review',
      reasoning,
      confidenceClass: hasSpecialIndicator || answers.agreement_already_signed ? 'cautious-check' : 'mvp-reliable',
    };
  }

  if (answers.agreement_present === true && answers.agreement_already_signed === false) {
    return {
      primaryTrack: 'contract-do-not-sign',
      reasoning: 'Weil ein noch nicht unterschriebener Vertrag gerade der stärkste Hebel für Nachteile beim Arbeitslosengeld und beim Handlungsspielraum ist, hat der Vertragsstopp Vorrang.',
      confidenceClass: 'mvp-reliable',
    };
  }

  if (answers.case_entry === 'termination_announced_only') {
    if (
      answers.primary_goal === 'protect_alg1'
      || answers.already_unemployed_now
      || answers.unemployment_registered === false
    ) {
      return {
        primaryTrack: 'alg1-risk-first',
        reasoning: 'Weil hier noch keine schriftliche Kündigung vorliegt, aber frühe Meldungen und der weitere Verlauf der Beendigung für das Arbeitslosengeld wichtig werden können, liegt der Fokus zuerst auf ALG-I-Risiken.',
        confidenceClass: 'mvp-reliable',
      };
    }

    return {
      primaryTrack: 'prepare-advice',
      reasoning: 'Weil noch keine schriftliche Kündigung zugegangen ist, steht nicht die 3-Wochen-Klagefrist im Vordergrund, sondern Vorbereitung und frühe Agentur-Absicherung.',
      confidenceClass: 'mvp-reliable',
    };
  }

  if (answers.already_unemployed_now || answers.unemployment_registered === false || answers.jobseeker_registered === false) {
    if (answers.primary_goal === 'protect_deadlines' || answers.termination_access_date) {
      return {
        primaryTrack: 'deadline-first',
        reasoning: 'Weil du schon arbeitslos bist und sowohl Agentur-Meldungen als auch kurze Fristen gleichzeitig aktiv sind, hat Fristschutz jetzt Vorrang.',
        confidenceClass: 'mvp-reliable',
      };
    }
    return {
      primaryTrack: 'alg1-risk-first',
      reasoning: 'Weil Meldungen oder Mitwirkung an der Beendigung finanzielle Nachteile auslösen können, liegt der Fokus zuerst auf der Begrenzung von ALG-I-Risiken.',
      confidenceClass: 'mvp-reliable',
    };
  }

  return {
    primaryTrack: 'prepare-advice',
    reasoning: 'Weil gerade keine dominante Frist- oder Vertragseskalation im Vordergrund steht, ist Vorbereitung für Beratung und die nächsten Schritte der sinnvollste Fokus.',
    confidenceClass: 'mvp-reliable',
  };
}

function buildCaseSnapshot(answers, track) {
  if (track === 'contract-do-not-sign') {
    return {
      headline: 'Vor der Unterschrift kurz innehalten',
      situation: 'Dir liegt ein Aufhebungs- oder Abwicklungsvertrag vor. Vor einer Unterschrift sollten die Folgen für dein Arbeitslosengeld und deine nächsten Optionen klar sein.',
      riskLevel: 'high',
      primaryGoal: answers.primary_goal,
    };
  }
  if (track === 'deadline-first') {
    return {
      headline: 'Jetzt zuerst: Fristen und Meldungen im Blick behalten',
      situation: 'Du hast eine schriftliche Kündigung erhalten. Jetzt kommt es darauf an, dass keine Frist und keine Meldung durchrutscht.',
      riskLevel: 'high',
      primaryGoal: answers.primary_goal,
    };
  }
  if (track === 'alg1-risk-first') {
    return {
      headline: 'Jetzt zuerst sicherstellen, dass dein Arbeitslosengeld nicht in Gefahr gerät',
      situation: 'Bei dir hängt gerade am meisten davon ab, wie die Meldungen und die Beendigung weiterlaufen.',
      riskLevel: 'high',
      primaryGoal: answers.primary_goal,
    };
  }
  if (track === 'special-case-review' && answers.agreement_already_signed) {
    return {
      headline: 'Jetzt geht es um Folgen, Fristen und saubere Einordnung',
      situation: 'Ein Aufhebungs- oder Abwicklungsvertrag wurde bereits unterschrieben. Jetzt geht es nicht mehr ums Innehalten, sondern um die nächsten Schritte und die möglichen Folgen.',
      riskLevel: 'high',
      primaryGoal: answers.primary_goal,
    };
  }
  if (track === 'special-case-review') {
    if (isOverlappingMultiRiskCase(answers)) {
      return {
        headline: 'Bei dir greifen gerade mehrere wichtige Themen gleichzeitig ineinander',
        situation: 'Es liegen gleichzeitig eine schriftliche Kündigung, ein noch nicht unterschriebener Vertrag und ein unklarer Sonderfallindikator vor.',
        riskLevel: 'high',
        primaryGoal: answers.primary_goal,
      };
    }
    return {
      headline: 'Dein Fall hat Besonderheiten, die individuell geprüft werden sollten',
      situation: 'Du hast eine schriftliche Kündigung erhalten und es gibt Hinweise auf Aspekte, die über eine Standard-Kündigung hinausgehen.',
      riskLevel: 'high',
      primaryGoal: answers.primary_goal,
    };
  }
  return {
    headline: 'Gut vorbereitet in den nächsten Schritt gehen',
    situation: 'Eine Kündigung wurde angekündigt, aber noch nicht schriftlich ausgesprochen. Jetzt helfen vor allem geordnete Unterlagen, Fragen und Prioritäten.',
    riskLevel: 'medium',
    primaryGoal: answers.primary_goal,
  };
}

function buildOpportunities(answers, track) {
  if (track === 'deadline-first') {
    return [{
      label: 'Wenn die Fristen sitzen, wird der Rest deutlich besser steuerbar',
      description: 'Sind Meldungen und kurze Fristen sauber gesichert, entsteht oft wieder mehr Ruhe für Beratung, Verhandlung und die nächsten Entscheidungen.',
      statementClass: 'cautious-check',
    }];
  }

  if (track === 'alg1-risk-first') {
    return [{
      label: 'Frühe Meldungen sichern dir Spielraum für die nächsten Schritte',
      description: 'Wenn die Agentur-Themen früh sauber stehen, lässt sich der weitere Verlauf oft geordneter und mit weniger Druck angehen.',
      statementClass: 'cautious-check',
    }];
  }

  if (track === 'contract-do-not-sign') {
    return [{
      label: 'Vor der Unterschrift ist oft noch mehr offen, als es gerade wirkt',
      description: 'Solange noch nichts unterschrieben ist, bleiben Verhandlung, Prüfung und andere Wege meist eher offen als nachträglich.',
      statementClass: 'cautious-check',
    }];
  }

  if (track === 'special-case-review') {
    return [{
      label: 'Mit sauberer Prüfung lassen sich unnötige Fehler und verschenkte Chancen eher vermeiden',
      description: 'Gerade in heiklen Fällen lohnt sich eine gute Einordnung, weil sie Fristen schützt und den Blick auf sinnvolle nächste Schritte offen hält.',
      statementClass: 'cautious-check',
    }];
  }

  if (track === 'prepare-advice' && answers.primary_goal === 'plan_next_step') {
    return [{
      label: 'Auch jetzt ist oft mehr vorbereitbar, als es im ersten Moment wirkt',
      description: 'Wenn du Unterlagen, Fragen und Prioritäten sortierst, gehst du in die nächsten Schritte meist klarer und mit mehr Spielraum hinein.',
      statementClass: 'cautious-check',
    }];
  }
  return [];
}

function buildDisclaimers(answers, track) {
  const agencySeparationDisclaimer = 'Arbeitsuchendmeldung = früher eigener Schritt bei bekanntem Ende; Arbeitslosmeldung = separater Schritt ab tatsächlicher Arbeitslosigkeit.';

  if (track === 'contract-do-not-sign') {
    return [
      agencySeparationDisclaimer,
      'Für eine verbindliche rechtliche Einschätzung braucht es den Blick auf deinen Einzelfall.',
      'Abfindung, Sperrzeit und Ruhen hängen stark vom konkreten Einzelfall ab.'
    ];
  }
  if (track === 'deadline-first') {
    return [
      agencySeparationDisclaimer,
      'Für eine verbindliche rechtliche Einschätzung braucht es den Blick auf deinen Einzelfall.',
      'Ob eine Kündigungsschutzklage in deinem Fall sinnvoll ist, sollte individuell geprüft werden.'
    ];
  }
  if (track === 'alg1-risk-first') {
    return [
      agencySeparationDisclaimer,
      'Für eine verbindliche rechtliche Einschätzung braucht es den Blick auf deinen Einzelfall.',
      'Ob und wie sich etwas auf dein Arbeitslosengeld auswirkt, hängt vom Einzelfall und vom weiteren Verlauf ab.'
    ];
  }
  if (track === 'special-case-review' && answers.agreement_already_signed) {
    return [
      'Für eine verbindliche rechtliche Einschätzung braucht es den Blick auf deinen Einzelfall.',
      'Konkrete Rechtsfolgen eines bereits unterschriebenen Vertrags hängen stark vom Einzelfall ab.',
      'Ob der Vertrag anfechtbar oder wirksam ist, muss gesondert geprüft werden.'
    ];
  }
  if (track === 'special-case-review') {
    if (isOverlappingMultiRiskCase(answers)) {
      return [
        'Für eine verbindliche rechtliche Einschätzung braucht es den Blick auf deinen Einzelfall.',
        'Hier ist eine klare Reihenfolge wichtig, aber keine vorschnelle Scheinsicherheit.',
        agencySeparationDisclaimer
      ];
    }
    return [
      'Für eine verbindliche rechtliche Einschätzung braucht es den Blick auf deinen Einzelfall.',
      'Ob tatsächlich ein besonderer Schutz greift, muss im Einzelfall geprüft werden.',
      'Hier geht es zuerst darum, Fristen zu sichern und den Sonderfall danach gezielt prüfen zu lassen.'
    ];
  }
  return [
    'Ohne schriftliche Kündigung sollte jetzt noch keine Klagefrist angenommen werden.',
    'Für eine verbindliche rechtliche Einschätzung braucht es den Blick auf deinen Einzelfall.',
    agencySeparationDisclaimer
  ];
}

function buildResult(rawAnswers, options = {}) {
  const evaluation = options.evaluation || evaluateRules(rawAnswers, options);
  const answers = evaluation.answers;
  const synthesisDecision = selectPrimaryTrack(answers, evaluation);
  const track = synthesisDecision.primaryTrack;
  const visibleEffects = evaluation.effects.filter(
    (effect) => !mappingConfig.guardrails.suppressStatementClasses.includes(effect.payload.statementClass)
  );

  const result = {
    resultVersion: resultSchema.properties.resultVersion.const,
    caseSnapshot: buildCaseSnapshot(answers, track),
    synthesisDecision,
    topActions: buildTopActions(answers, visibleEffects, track),
    deadlines: buildDeadlines(answers),
    riskFlags: buildRiskFlags(answers, track),
    redFlags: buildRedFlags(answers, evaluation, track),
    documentChecklist: buildDocumentChecklist(answers),
    advisorQuestions: buildAdvisorQuestions(answers, track),
    opportunities: buildOpportunities(answers, track),
    disclaimers: buildDisclaimers(answers, track),
    statementLedger: statementLedgerFromEffects(evaluation.effects),
  };

  if (result.statementLedger.notUsedYet.length === 0 && answers.agreement_present) {
    result.statementLedger.notUsedYet.push('Keine Abfindungserwartung oder Erfolgswahrscheinlichkeit ausgeben.');
  }
  if (result.statementLedger.notUsedYet.length === 0 && answers.case_entry === 'termination_announced_only') {
    result.statementLedger.notUsedYet.push('Keine Aussage über die Wirksamkeit einer nur angekündigten Kündigung.');
  }

  return result;
}

function renderResult(result, view = 'standard') {
  const lines = [];
  const pushList = (title, items, renderItem) => {
    if (!items || items.length === 0) return;
    lines.push(`${title}:`);
    for (const item of items) lines.push(`- ${renderItem(item)}`);
    lines.push('');
  };
  const pushActionSections = (actions = []) => {
    if (!actions || actions.length === 0) return;

    const [firstAction, ...restActions] = actions;
    lines.push('Als Erstes:');
    lines.push(`- ${firstAction.label} — ${firstAction.why}`);
    lines.push('');

    pushList('Danach', restActions, (item) => `${item.label} — ${item.why}`);
  };
  const formatDocumentStatus = (status) => {
    if (status === 'already-secured') return 'schon gesichert';
    if (status === 'secure-now') return 'jetzt sichern';
    return status;
  };

  if (view === 'short') {
    lines.push(`Dein Fokus jetzt: ${result.caseSnapshot.headline}`);
    if (result.topActions[0]) lines.push(`Wichtigster nächster Schritt: ${result.topActions[0].label}`);
    const critical = result.deadlines.find((d) => d.importance === 'critical');
    if (critical) lines.push(`Kritische Frist: ${critical.label} — ${critical.timing}`);
    return lines.join('\n').trim();
  }

  lines.push(result.caseSnapshot.headline);
  lines.push('');

  if (view === 'advice') {
    lines.push(`Warum dieser Fokus: ${result.synthesisDecision.reasoning}`);
    lines.push('');
  } else {
    lines.push(result.caseSnapshot.situation);
    lines.push('');
  }

  pushActionSections(result.topActions);
  pushList('Fristen', result.deadlines, (item) => `${item.label}: ${item.timing}` + (item.note ? ` (${item.note})` : ''));
  pushList('Risiken', result.riskFlags, (item) => `${item.label} — ${item.description}`);
  pushList('Besonders wichtig', result.redFlags, (item) => `${item.label} — ${item.whyEscalated}`);
  pushList('Unterlagen', result.documentChecklist, (item) => `${item.label} (${formatDocumentStatus(item.status)}) — ${item.reason}`);
  if (view === 'advice') pushList('Fragen für Beratung', result.advisorQuestions, (item) => item);
  pushList('Hinweise', result.disclaimers, (item) => item);

  return lines.join('\n').trim();
}

module.exports = {
  evaluateRules,
  buildResult,
  selectPrimaryTrack,
  renderResult,
};
