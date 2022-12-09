const variablesRegex = /{{[0-9]+}}/g;
const startsWithVariableRegex = /^{{[0-9]+}}/;
const endsWithVariableRegex = /{{[0-9]+}}$/;
const singleBracketVariableRegex = /(?<!{){[0-9]+}(?!})/g;
const incompleteStartBracketVariableRegex = /(?<!{){[0-9]+}}/g;
const incompleteEndBracketVariableRegex = /{{[0-9]+}(?!})/g;

function countVariables(text) {
  if (!text) {
    return 0;
  }

  return (text.match(variablesRegex) || []).length;
}

export {
  countVariables,
  startsWithVariableRegex,
  endsWithVariableRegex,
  singleBracketVariableRegex,
  incompleteStartBracketVariableRegex,
  incompleteEndBracketVariableRegex,
};
