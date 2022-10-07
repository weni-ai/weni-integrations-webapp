const variablesRegex = /{{[0-9]+}}/g;

function countVariables(text) {
  if (!text) {
    return 0;
  }

  return (text.match(variablesRegex) || []).length;
}

export { countVariables };
