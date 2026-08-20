export const WHATSAPP_CODES = ['wpp', 'wpp-cloud'];

export function getAppDisplayName(app, t) {
  if (app?.code === 'wwc') {
    return t('weniWebChat.data.name');
  }
  if (WHATSAPP_CODES.includes(app?.code)) {
    return app?.name || 'WhatsApp';
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
