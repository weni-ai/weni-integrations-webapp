import appType from '@/api/appType';

export default {
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
};
