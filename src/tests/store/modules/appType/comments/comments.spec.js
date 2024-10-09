import { createPinia, setActivePinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { comments_store } from '@/stores/modules/appType/comments/comments.store';
import appType from '@/api/appType';

vi.mock('@/api/appType', () => ({
  default: {
    listComments: vi.fn(),
    createComment: vi.fn(),
    deleteComment: vi.fn(),
    updateComment: vi.fn(),
  },
}));

describe('comments_store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const store = comments_store();
    expect(store.loadingListComments).toBe(true);
    expect(store.errorListComments).toBeNull();
    expect(store.commentsList).toBeNull();

    expect(store.loadingCreateComment).toBe(true);
    expect(store.errorCreateComment).toBeNull();
    expect(store.createCommentResult).toBeNull();

    expect(store.loadingDeleteComment).toBe(true);
    expect(store.errorDeleteComment).toBeNull();
    expect(store.deleteCommentResult).toBeNull();

    expect(store.loadingUpdateComment).toBe(true);
    expect(store.errorUpdateComment).toBeNull();
    expect(store.updateCommentResult).toBeNull();
  });

  it('should list comments and update state', async () => {
    const store = comments_store();
    const mockComments = [
      { id: 1, text: 'Comment 1' },
      { id: 2, text: 'Comment 2' },
    ];
    appType.listComments.mockResolvedValue({ data: mockComments });

    await store.listComments('code');

    expect(store.commentsList).toEqual(mockComments.reverse());
    expect(store.loadingListComments).toBe(false);
    expect(store.errorListComments).toBeNull();
    expect(appType.listComments).toHaveBeenCalledWith('code');
  });

  it('should handle error when listing comments', async () => {
    const store = comments_store();
    const mockError = new Error('Test Error');
    appType.listComments.mockRejectedValue(mockError);

    await store.listComments('code');

    expect(store.commentsList).toBeNull();
    expect(store.loadingListComments).toBe(false);
    expect(store.errorListComments).toBe(mockError);
  });

  it('should create a comment and update state', async () => {
    const store = comments_store();
    const mockResult = { id: 1, text: 'New Comment' };
    appType.createComment.mockResolvedValue({ data: mockResult });

    await store.createComment({ code: 'code', payload: { text: 'New Comment' } });

    expect(store.createCommentResult).toEqual(mockResult);
    expect(store.loadingCreateComment).toBe(false);
    expect(store.errorCreateComment).toBeNull();
  });

  it('should handle error when creating a comment', async () => {
    const store = comments_store();
    const mockError = new Error('Test Error');
    appType.createComment.mockRejectedValue(mockError);

    await store.createComment({ code: 'code', payload: { text: 'New Comment' } });

    expect(store.createCommentResult).toBeNull();
    expect(store.loadingCreateComment).toBe(false);
    expect(store.errorCreateComment).toBe(mockError);
  });

  it('should delete a comment and update state', async () => {
    const store = comments_store();
    const mockResult = { success: true };
    appType.deleteComment.mockResolvedValue({ data: mockResult });

    await store.deleteComment({ code: 'code', commentUuid: 'uuid' });

    expect(store.deleteCommentResult).toEqual(mockResult);
    expect(store.loadingDeleteComment).toBe(false);
    expect(store.errorDeleteComment).toBeNull();
  });

  it('should handle error when deleting a comment', async () => {
    const store = comments_store();
    const mockError = new Error('Test Error');
    appType.deleteComment.mockRejectedValue(mockError);

    await store.deleteComment({ code: 'code', commentUuid: 'uuid' });

    expect(store.deleteCommentResult).toBeNull();
    expect(store.loadingDeleteComment).toBe(false);
    expect(store.errorDeleteComment).toBe(mockError);
  });

  it('should update a comment and update state', async () => {
    const store = comments_store();
    const mockResult = { id: 1, text: 'Updated Comment' };
    appType.updateComment.mockResolvedValue({ data: mockResult });

    await store.updateComment({
      code: 'code',
      commentUuid: 'uuid',
      payload: { text: 'Updated Comment' },
    });

    expect(store.updateCommentResult).toEqual(mockResult);
    expect(store.loadingUpdateComment).toBe(false);
    expect(store.errorUpdateComment).toBeNull();
  });

  it('should handle error when updating a comment', async () => {
    const store = comments_store();
    const mockError = new Error('Test Error');
    appType.updateComment.mockRejectedValue(mockError);

    await store.updateComment({
      code: 'code',
      commentUuid: 'uuid',
      payload: { text: 'Updated Comment' },
    });

    expect(store.updateCommentResult).toBeNull();
    expect(store.loadingUpdateComment).toBe(false);
    expect(store.errorUpdateComment).toBe(mockError);
  });
});
