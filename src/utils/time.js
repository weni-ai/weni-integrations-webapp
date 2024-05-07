const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};
const getRelativeTime = (date1, locale) => {
  var rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  var elapsed = date1 - new Date();

  for (var u in units) {
    if (Math.abs(elapsed) > units[u] || u == 'second') {
      return rtf.format(Math.round(elapsed / units[u]), u);
    }
  }
};

export default getRelativeTime;
