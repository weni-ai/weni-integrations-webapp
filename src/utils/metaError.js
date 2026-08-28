export const META_CREDIT_ALLOCATION_SUBCODE = '1752246';

function matchesSubcode(value, subcode) {
  if (typeof value === 'number') {
    return String(value) === subcode;
  }
  if (typeof value === 'string') {
    return value === subcode;
  }
  return false;
}

function hasMetaErrorSubcode(value, subcode, seen = new WeakSet()) {
  if (value == null) {
    return false;
  }

  if (typeof value === 'string') {
    try {
      return hasMetaErrorSubcode(JSON.parse(value), subcode, seen);
    } catch {
      return value.includes(subcode);
    }
  }

  if (typeof value !== 'object') {
    return false;
  }

  if (seen.has(value)) {
    return false;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.some((item) => hasMetaErrorSubcode(item, subcode, seen));
  }

  if (
    'error_subcode' in value &&
    matchesSubcode(value.error_subcode, subcode)
  ) {
    return true;
  }

  // Axios-style errors carry the payload under response.data
  if (value.response?.data != null) {
    return hasMetaErrorSubcode(value.response.data, subcode, seen);
  }

  return Object.values(value).some((nested) =>
    hasMetaErrorSubcode(nested, subcode, seen),
  );
}

export function isMetaCreditAllocationError(value) {
  return hasMetaErrorSubcode(value, META_CREDIT_ALLOCATION_SUBCODE);
}
