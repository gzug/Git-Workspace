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

function normalizeArrayValue(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value.filter((item) => item !== '' && item != null);
  return [value].filter((item) => item !== '' && item != null);
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

function normalizeQuestionnaireInput(rawInput = {}) {
  const normalized = {};

  for (const [key, rawValue] of Object.entries(rawInput)) {
    if (ARRAY_FIELDS.has(key)) {
      normalized[key] = normalizeArrayValue(rawValue);
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

    normalized[key] = rawValue;
  }

  for (const key of ARRAY_FIELDS) {
    if (!(key in normalized)) normalized[key] = [];
  }

  return normalized;
}

module.exports = {
  normalizeQuestionnaireInput,
};
