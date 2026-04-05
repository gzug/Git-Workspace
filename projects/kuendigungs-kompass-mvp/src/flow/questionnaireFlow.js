const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const questionsSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'questions.schema.json'), 'utf8'));
const questions = questionsSchema.questions || questionsSchema.example?.questions || [];

const LAUNCH_V1_SCREEN_IDS = [
  ['case_entry'],
  ['termination_access_date', 'employment_end_date', 'jobseeker_registered', 'already_unemployed_now', 'unemployment_registered'],
  ['agreement_present', 'agreement_already_signed', 'release_status'],
  ['special_protection_indicator'],
  ['documents_secured', 'primary_goal'],
];

const SCREEN_DEFS = [
  {
    id: 'entry',
    title: 'Einstieg',
    questionIds: LAUNCH_V1_SCREEN_IDS[0],
  },
  {
    id: 'time-critical-basics',
    title: 'Zeitkritische Basis',
    questionIds: LAUNCH_V1_SCREEN_IDS[1],
  },
  {
    id: 'contract-status',
    title: 'Vertragslage',
    questionIds: LAUNCH_V1_SCREEN_IDS[2],
  },
  {
    id: 'risk-check',
    title: 'Risikolage',
    questionIds: LAUNCH_V1_SCREEN_IDS[3],
  },
  {
    id: 'preparation',
    title: 'Vorbereitung',
    questionIds: LAUNCH_V1_SCREEN_IDS[4],
  },
];

const questionMap = new Map(questions.map((question) => [question.id, question]));

function normalizeAnswers(rawAnswers = {}) {
  return { ...rawAnswers };
}

function valueIncludes(actual, expected) {
  if (Array.isArray(actual)) return actual.includes(expected);
  if (typeof actual === 'string') return actual === expected;
  return false;
}

function matchesCondition(condition, answers) {
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
        : actual === undefined || actual === null || (Array.isArray(actual) && actual.length === 0);
    default:
      return false;
  }
}

function shouldAskQuestion(question, answers) {
  if (!question) return false;
  if (!question.askIf || question.askIf.length === 0) return true;
  return question.askIf.every((condition) => matchesCondition(condition, answers));
}

function isQuestionAnswered(question, answers) {
  const value = answers[question.id];
  if (value === undefined || value === null) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function getVisibleQuestionsForScreen(screenDef, answers) {
  return screenDef.questionIds
    .map((id) => questionMap.get(id))
    .filter((question) => shouldAskQuestion(question, answers));
}

function getLaunchV1Screens(rawAnswers = {}) {
  const answers = normalizeAnswers(rawAnswers);

  return SCREEN_DEFS
    .map((screenDef, index) => {
      const visibleQuestions = getVisibleQuestionsForScreen(screenDef, answers);
      const completed = visibleQuestions.length > 0 && visibleQuestions.every((question) => isQuestionAnswered(question, answers));

      return {
        id: screenDef.id,
        title: screenDef.title,
        order: index + 1,
        questions: visibleQuestions,
        isVisible: visibleQuestions.length > 0,
        isCompleted: completed,
      };
    })
    .filter((screen) => screen.isVisible);
}

function getNextIncompleteScreen(rawAnswers = {}) {
  const screens = getLaunchV1Screens(rawAnswers);
  return screens.find((screen) => !screen.isCompleted) || null;
}

function getQuestionnaireFlowState(rawAnswers = {}) {
  const answers = normalizeAnswers(rawAnswers);
  const screens = getLaunchV1Screens(answers);
  const nextScreen = screens.find((screen) => !screen.isCompleted) || null;
  const answeredQuestionIds = new Set();
  let lastAnsweredQuestionId = null;
  let breakReached = false;

  for (const screen of screens) {
    for (const question of screen.questions) {
      const answered = isQuestionAnswered(question, answers);
      if (answered) answeredQuestionIds.add(question.id);

      if (!breakReached) {
        if (answered) {
          lastAnsweredQuestionId = question.id;
        } else {
          breakReached = true;
        }
      }
    }
  }

  const nextQuestion = nextScreen?.questions.find((question) => !isQuestionAnswered(question, answers)) || null;

  return {
    flowId: 'launch-v1',
    screens,
    nextScreen,
    nextQuestionId: nextQuestion?.id || null,
    lastAnsweredQuestionId,
    isComplete: nextScreen == null,
    answeredQuestionIds: Array.from(answeredQuestionIds),
  };
}

module.exports = {
  getLaunchV1Screens,
  getNextIncompleteScreen,
  getQuestionnaireFlowState,
  shouldAskQuestion,
};
