import appType from '@/api/appType';

export default {
  async listComments({ commit }, code) {
    commit('LIST_COMMENTS_REQUEST');
    try {
      const { data } = await appType.listComments(code);
      commit('LIST_COMMENTS_SUCCESS', data);
    } catch (err) {
      commit('LIST_COMMENTS_ERROR', err);
    }
  },

  async createComment({ commit }, { code, payload }) {
    commit('CREATE_COMMENT_REQUEST');
    try {
      const { data } = await appType.createComment(code, payload);
      commit('CREATE_COMMENT_SUCCESS', data);
    } catch (err) {
      commit('CREATE_COMMENT_ERROR', err);
    }
  },

  async deleteComment({ commit }, { code, commentUuid }) {
    commit('DELETE_COMMENT_REQUEST');
    try {
      const { data } = await appType.deleteComment(code, commentUuid);
      commit('DELETE_COMMENT_SUCCESS', data);
    } catch (err) {
      commit('DELETE_COMMENT_ERROR', err);
    }
  },

  async updateComment({ commit }, { code, commentUuid, payload }) {
    commit('UPDATE_COMMENT_REQUEST');
    try {
      const { data } = await appType.updateComment(code, commentUuid, payload);
      commit('UPDATE_COMMENT_SUCCESS', data);
    } catch (err) {
      commit('UPDATE_COMMENT_ERROR', err);
    }
  },
};
