import { defineStore } from 'pinia';
import appType from '@/api/appType';

export const comments_store = defineStore('comments', {
  state() {
    return {
      loadingListComments: true,
      errorListComments: null,
      commentsList: null,

      loadingCreateComment: true,
      errorCreateComment: null,
      createCommentResult: null,

      loadingDeleteComment: true,
      errorDeleteComment: null,
      deleteCommentResult: null,

      loadingUpdateComment: true,
      errorUpdateComment: null,
      updateCommentResult: null,
    };
  },
  actions: {
    async listComments(code) {
      this.loadingListComments = true;
      this.errorListComments = null;
      this.commentsList = null;
      try {
        const { data } = await appType.listComments(code);
        this.commentsList = data.reverse();
        this.loadingListComments = false;
      } catch (err) {
        this.errorListComments = err;
        this.loadingListComments = false;
      }
    },
    async createComment({ code, payload }) {
      this.loadingCreateComment = true;
      this.errorCreateComment = null;
      this.createCommentResult = null;
      try {
        const { data } = await appType.createComment(code, payload);
        this.createCommentResult = data;
        this.loadingCreateComment = false;
      } catch (err) {
        this.errorCreateComment = err;
        this.loadingCreateComment = false;
      }
    },
    async deleteComment({ code, commentUuid }) {
      this.loadingDeleteComment = true;
      this.errorDeleteComment = null;
      this.deleteCommentResult = null;
      try {
        const { data } = await appType.deleteComment(code, commentUuid);
        this.deleteCommentResult = data;
        this.loadingDeleteComment = false;
      } catch (err) {
        this.errorDeleteComment = err;
        this.loadingDeleteComment = false;
      }
    },
    async updateComment({ code, commentUuid, payload }) {
      this.loadingUpdateComment = true;
      this.errorUpdateComment = null;
      this.updateCommentResult = null;
      try {
        const { data } = await appType.updateComment(code, commentUuid, payload);
        this.updateCommentResult = data;
        this.loadingUpdateComment = false;
      } catch (err) {
        this.errorUpdateComment = err;
        this.loadingUpdateComment = false;
      }
    },
  },
});
