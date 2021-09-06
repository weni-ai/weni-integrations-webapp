import appType from '@/api/appType';

export default {
  async getAllAppTypes(store, filter) {
    return await appType.getAllAppTypes(filter);
  },

  async getAppType(store, code) {
    return await appType.getAppType(code);
  },

  async listComments(store, code) {
    return await appType.listComments(code);
  },

  async createComment(store, { code, payload }) {
    return await appType.createComment(code, payload);
  },

  async deleteComment(store, { code, commentUuid }) {
    return await appType.deleteComment(code, commentUuid);
  },

  async updateComment(store, { code, commentUuid, payload }) {
    return await appType.updateComment(code, commentUuid, payload);
  },

  async postRating(store, { code, payload }) {
    return await appType.postRating(code, payload);
  },

  async createApp(store, { code, payload }) {
    return await appType.createApp(code, payload);
  },

  async fetchFeatured() {
    return await appType.fetchFeatured();
  },
};
