export default {
  LIST_COMMENTS_REQUEST(state) {
    state.loadingListComments = true;
    state.errorListComments = null;
    state.commentsList = null;
  },
  LIST_COMMENTS_SUCCESS(state, data) {
    state.commentsList = data.reverse();
    state.loadingListComments = false;
  },
  LIST_COMMENTS_ERROR(state, err) {
    state.errorListComments = err;
    state.loadingListComments = false;
  },

  CREATE_COMMENT_REQUEST(state) {
    state.loadingCreateComment = true;
    state.errorCreateComment = null;
    state.createCommentResult = null;
  },
  CREATE_COMMENT_SUCCESS(state, data) {
    state.createCommentResult = data;
    state.loadingCreateComment = false;
  },
  CREATE_COMMENT_ERROR(state, err) {
    state.errorCreateComment = err;
    state.loadingCreateComment = false;
  },

  DELETE_COMMENT_REQUEST(state) {
    state.loadingDeleteComment = true;
    state.errorDeleteComment = null;
    state.deleteCommentResult = null;
  },
  DELETE_COMMENT_SUCCESS(state, data) {
    state.deleteCommentResult = data;
    state.loadingDeleteComment = false;
  },
  DELETE_COMMENT_ERROR(state, err) {
    state.errorDeleteComment = err;
    state.loadingDeleteComment = false;
  },

  UPDATE_COMMENT_REQUEST(state) {
    state.loadingUpdateComment = true;
    state.errorUpdateComment = null;
    state.updateCommentResult = null;
  },
  UPDATE_COMMENT_SUCCESS(state, data) {
    state.updateCommentResult = data;
    state.loadingUpdateComment = false;
  },
  UPDATE_COMMENT_ERROR(state, err) {
    state.errorUpdateComment = err;
    state.loadingUpdateComment = false;
  },
};
