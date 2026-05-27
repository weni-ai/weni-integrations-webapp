function formatDateParam(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}-${year}`;
}

export function getLastNDaysRange(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  return {
    start: formatDateParam(start),
    end: formatDateParam(end),
  };
}
