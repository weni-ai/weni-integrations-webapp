import IntlMessageFormat from 'intl-messageformat';

/**
 * Matches real ICU blocks only: {var, plural|selectordinal, { … }
 * or {var, select, { … }. Avoids false positives like
 * "{user, select another option}" or "{item, plural forms available}".
 */
const ICU_PLURAL_OR_SELECTORDINAL_PATTERN =
  /\{([a-zA-Z][\w]*),\s*(?:plural|selectordinal)\s*,\s*(?:(?:=\d+)|zero|one|two|few|many|other)\s*\{/i;

const ICU_SELECT_PATTERN = /\{([a-zA-Z][\w]*),\s*select\s*,\s*[\w#.-]+\s*\{/i;

export function shouldUseIntlMessageFormat(message) {
  return ICU_PLURAL_OR_SELECTORDINAL_PATTERN.test(message) || ICU_SELECT_PATTERN.test(message);
}

/** Tag names in ICU XML markup (<b>, <i>, <br>) need function handlers in .format(). */
const ICU_XML_TAG_PATTERN = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b/g;

const NAMED_PLACEHOLDER_PATTERN = /\{\s*(\w+)\s*\}/g;

/**
 * Builds the message parts for plain (non-ICU) strings, resolving `{name}`
 * placeholders through the message context. Unprovided placeholders are kept
 * literally to preserve the previous behavior. Returning context-resolved parts
 * lets `ctx.normalize` produce a string for `t()` and vnodes for the
 * `<i18n-t>` component.
 */
function buildPlainMessageParts(message, ctx) {
  const values = ctx.values || {};
  const parts = [];
  let lastIndex = 0;
  let match;

  NAMED_PLACEHOLDER_PATTERN.lastIndex = 0;
  while ((match = NAMED_PLACEHOLDER_PATTERN.exec(message)) !== null) {
    const [token, name] = match;

    if (match.index > lastIndex) {
      parts.push(message.slice(lastIndex, match.index));
    }

    if (Object.prototype.hasOwnProperty.call(values, name)) {
      parts.push(ctx.interpolate(ctx.named(name)));
    } else {
      parts.push(token);
    }

    lastIndex = NAMED_PLACEHOLDER_PATTERN.lastIndex;
  }

  if (lastIndex < message.length) {
    parts.push(message.slice(lastIndex));
  }

  return parts;
}

function createDefaultTagHandler(tagName) {
  if (tagName === 'br') {
    return (chunks) => chunks.join('') + '\n';
  }

  return (chunks) => {
    const content = chunks.join('');
    return `<${tagName}>${content}</${tagName}>`;
  };
}

/**
 * Merges $t params with default ICU tag handlers so plural + HTML works without
 * passing b/i/br manually on every call.
 */
function buildIntlFormatValues(message, values = {}) {
  const formatValues = { ...(values || {}) };
  let match;

  while ((match = ICU_XML_TAG_PATTERN.exec(message)) !== null) {
    const tagName = match[1];
    const existing = formatValues[tagName];

    if (typeof existing === 'function') {
      continue;
    }

    formatValues[tagName] = createDefaultTagHandler(tagName);
  }

  ICU_XML_TAG_PATTERN.lastIndex = 0;
  return formatValues;
}

/**
 * Vue I18n custom messageCompiler: ICU plural/select via IntlMessageFormat;
 * plain strings (HTML, simple {name}) use named interpolation only.
 * Both branches return through `ctx.normalize` so the same compiled function
 * supports `t()` (string output) and `<i18n-t>` (vnode array output).
 */
const icuMessageCompiler = (message, { locale, key, onError }) => {
  if (typeof message === 'string') {
    if (shouldUseIntlMessageFormat(message)) {
      const formatter = new IntlMessageFormat(message, locale);
      return (ctx) => {
        const formatted = formatter.format(buildIntlFormatValues(message, ctx.values));
        const parts = Array.isArray(formatted) ? formatted : [formatted];
        return ctx.normalize(parts);
      };
    }

    return (ctx) => ctx.normalize(buildPlainMessageParts(message, ctx));
  }

  onError?.(new Error('not support for AST'));
  return () => key;
};

export default icuMessageCompiler;
