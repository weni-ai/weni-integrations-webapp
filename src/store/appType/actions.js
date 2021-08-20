import appType from '@/api/appType';

export default {
  async getAllAppTypes(store, filter) {
    return await appType.getAllAppTypes(filter);
  },

  async getAppType(store, code) {
    return await appType.getAppType(code);
  },
};
