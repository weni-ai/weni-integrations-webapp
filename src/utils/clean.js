/* eslint-disable no-unused-vars */
// Recursively remove empty items from nested objects.
function removeEmpty(obj) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v]),
  );
}

export default removeEmpty;
