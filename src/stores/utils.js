import { clearHtmlTags } from '@/utils/clearHtmlTags';

export function formatGenericApp(appList) {
  return appList.map((app) => {
    const summary =
      app.code === 'generic' ? clearHtmlTags(app.config.channel_claim_blurb) : app.summary;

    return { ...app, generic: app.code === 'generic', summary };
  });
}
