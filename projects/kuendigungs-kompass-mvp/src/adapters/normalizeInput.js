const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const questionsSchema = JSON.parse(fs.readFileSync(path.join(ROOT, 'questions.schema.json'), 'utf8'));
const questions = questionsSchema.questions || questionsSchema.example?.questions || [];

const ALLOWED_OPTIONS_BY_FIELD = new Map(
  questions
    .filter((question) => Array.isArray(question.options) && question.options.length > 0)
    .map((question) => [question.id, new Set(question.options.map((option) => option.value))])
);

function isEmptyString(value) {
  return typeof value === 'string' && value.trim() === '';
}

function isUnknownLiteral(value) {
  return typeof value === 'string' && value.trim().toLowerCase() === 'unknown';
}

function normalizeBoolean(value) {
  if (value === true || value === false) return value;
  if (typeof value !== 'string') return null;

  const normalized = value.trim().toLowerCase();
  if (normalized === 'true' || normalized === 'yes') return true;
  if (normalized === 'false' || normalized === 'no') return false;
  if (normalized === 'unknown') return null;
  return null;
}

function isValidIsoDateString(value) {
  if (typeof value !== 'string') return false;
  const normalized = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return false;

  const [yearString, monthString, dayString] = normalized.split('-');
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function normalizeArrayValue(value, allowedOptions, exclusiveOption) {
  const values = value == null
    ? []
    : Array.isArray(value)
      ? value.filter((item) => item !== '' && item != null)
      : [value].filter((item) => item !== '' && item != null);

  const filtered = !allowedOptions
    ? values
    : values.filter((item) => allowedOptions.has(item));

  if (!exclusiveOption || filtered.length <= 1 || !filtered.includes(exclusiveOption)) {
    return filtered;
  }

  return filtered.filter((item) => item !== exclusiveOption);
}

function normalizeSingleSelect(value, allowedOptions) {
  if (value == null) return null;
  if (typeof value !== 'string') return null;

  const normalized = value.trim();
  if (normalized === '') return null;
  if (!allowedOptions) return normalized;
  return allowedOptions.has(normalized) ? normalized : null;
}

function applyCrossFieldGuardrails(normalized) {
  const terminationAccessRelevant = normalized.case_entry === 'termination_received' || normalized.case_entry === 'multiple';
  if (!terminationAccessRelevant) {
    normalized.termination_access_date = null;
  }

  if (normalized.already_unemployed_now !== true) {
    normalized.unemployment_registered = null;
  }

  if (normalized.case_entry === 'settlement_offered') {
    normalized.agreement_present = true;
  }

  if (normalized.agreement_already_signed === true) {
    normalized.agreement_present = true;
  }

  if (normalized.agreement_present !== true && normalized.agreement_already_signed !== true) {
    normalized.agreement_already_signed = null;
  }

  return normalized;
}

const ARRAY_FIELDS = new Set([
  'special_protection_indicator',
  'documents_secured',
]);

const BOOLEAN_FIELDS = new Set([
  'jobseeker_registered',
  'already_unemployed_now',
  'unemployment_registered',
  'agreement_present',
  'agreement_already_signed',
]);

const DATE_FIELDS = new Set([
  'termination_access_date',
  'employment_end_date',
]);

const EXCLUSIVE_MULTI_SELECT_OPTIONS = new Map([
  ['special_protection_indicator', 'none_known'],
  ['documents_secured', 'none_yet'],
]);

function normalizeQuestionnaireInput(rawInput = {}) {
  const normalized = {};

  for (const [key, rawValue] of Object.entries(rawInput)) {
    const allowedOptions = ALLOWED_OPTIONS_BY_FIELD.get(key);
    const exclusiveOption = EXCLUSIVE_MULTI_SELECT_OPTIONS.get(key);

    if (ARRAY_FIELDS.has(key)) {
      normalized[key] = normalizeArrayValue(rawValue, allowedOptions, exclusiveOption);
      continue;
    }

    if (isEmptyString(rawValue)) {
      normalized[key] = null;
      continue;
    }

    if (DATE_FIELDS.has(key)) {
      if (isUnknownLiteral(rawValue)) {
        normalized[key] = null;
      } else if (isValidIsoDateString(rawValue)) {
        normalized[key] = rawValue.trim();
      } else {
        normalized[key] = null;
      }
      continue;
    }

    if (BOOLEAN_FIELDS.has(key)) {
      normalized[key] = normalizeBoolean(rawValue);
      continue;
    }

    if (allowedOptions) {
      normalized[key] = normalizeSingleSelect(rawValue, allowedOptions);
      continue;
    }

    normalized[key] = rawValue;
  }

  for (const key of ARRAY_FIELDS) {
    if (!(key in normalized)) normalized[key] = [];
  }

  return applyCrossFieldGuardrails(normalized);
}

module.exports = {
  normalizeQuestionnaireInput,
};
