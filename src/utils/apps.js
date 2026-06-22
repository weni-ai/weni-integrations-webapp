export function getAppDisplayName(app, t) {
  if (app?.code === 'wwc') {
    return t('weniWebChat.data.name');
  }
  return app?.name ?? '';
}

export function appMatchesSearch(app, searchTerm, t) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) return true;

  const displayName = getAppDisplayName(app, t).toLowerCase();
  const apiName = (app?.name ?? '').toLowerCase();

  return displayName.includes(term) || apiName.includes(term);
}
