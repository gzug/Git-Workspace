function isEmptyString(value) {
  return typeof value === 'string' && value.trim() === '';
}

function isUnknownLiteral(value) {
  return typeof value === 'string' && value.trim().toLowerCase() === 'unknown';
}

function normalizeBoolean(value) {
  if (value === true || value === false) return value;
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'yes') return true;
  if (value === 'no') return false;
  return value;
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
      normalized[key] = isUnknownLiteral(rawValue) ? null : rawValue;
      continue;
    }

    if (BOOLEAN_FIELDS.has(key)) {
      const boolValue = normalizeBoolean(rawValue);
      normalized[key] = isUnknownLiteral(boolValue) || boolValue === '' ? null : boolValue;
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
