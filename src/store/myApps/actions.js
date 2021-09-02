import appType from '@/api/myApps';

export default {
  async getConfiguredApps(store, { params }) {
    return await appType.getConfiguredApps(params);
  },
  async getInstalledApps(store, { params }) {
    return await appType.getInstalledApps(params);
  },
};
