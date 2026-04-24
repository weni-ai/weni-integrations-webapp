export const DEFAULT_COLOR = '#009E96';

export const WEBCHAT_SCRIPT_URLS = {
  v1: 'https://storage.googleapis.com/push-webchat/wwc-latest.js',
  v2: 'https://cdn.cloud.weni.ai/webchat-latest.umd.js',
};

export const TIME_BETWEEN_MESSAGES_OPTIONS = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
];

export const APPEARANCE_FIELDS = [
  {
    id: 'subtitle',
    type: 'input',
    labelKey: 'weniWebChat.config.SubtitleInput.label',
    placeholderKey: 'weniWebChat.config.SubtitleInput.placeholder',
  },
  {
    id: 'initPayload',
    type: 'input',
    labelKey: 'weniWebChat.config.initPayloadInput.label',
    placeholderKey: 'weniWebChat.config.initPayloadInput.placeholder',
  },
  {
    id: 'tooltipMessage',
    type: 'input',
    labelKey: 'weniWebChat.config.TooltipInput.label',
    placeholderKey: 'weniWebChat.config.TooltipInput.placeholder',
  },
  {
    id: 'inputTextFieldHint',
    type: 'input',
    labelKey: 'weniWebChat.config.PlaceholderInput.label',
    placeholderKey: 'weniWebChat.config.PlaceholderInput.placeholder',
  },
];

export const TIME_REGEX = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;

/**
 * Generate script code for embedding the webchat
 * @param {Object} config - App config object
 * @returns {string} Script code or empty string
 */
export function generateScriptCode(config) {
  if (!config?.script) return '';

  const version = config.version ?? '1';
  const scriptUrl = version === '2' ? WEBCHAT_SCRIPT_URLS.v2 : WEBCHAT_SCRIPT_URLS.v1;

  return `<script>
  (function (d, s, u, w, v) {
    if (w[v]) { return; } else { w[v] = !0; }
    let h = d.getElementsByTagName(s)[0], k = d.createElement(s);
    k.onload = function () {
      let l = d.createElement(s); l.src = u; l.async = true;
      h.parentNode.insertBefore(l, k.nextSibling);
    };
    k.async = true; k.src = '${scriptUrl}';
    h.parentNode.insertBefore(k, h);
  })(document, 'script', '${config.script}', window, 'isWeniWebChatAlreadyInserted');
<${'/'}script>`;
}

/**
 * Format contact timeout from minutes to HH:MM
 * @param {number} minutes - Total minutes
 * @returns {string} Formatted time string
 */
export function formatContactTimeout(minutes) {
  if (!minutes) return '00:00';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Parse contact timeout from HH:MM to minutes
 * @param {string} time - Time string in HH:MM format
 * @returns {number} Total minutes
 */
export function parseContactTimeout(time) {
  if (!time) return 0;
  const [hours, minutes] = time.split(':');
  return parseInt(hours) * 60 + parseInt(minutes);
}

/**
 * Validate time format
 * @param {string} value - Time string
 * @returns {boolean} True if invalid
 */
export function isInvalidTime(value) {
  if (value === '00:00') return true;
  return !value || value.length !== 5 || !TIME_REGEX.test(value);
}
