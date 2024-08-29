import { mount } from '@vue/test-utils';
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppDetailsComments from '@/components/app/AppDetailsComments.vue';
import { nextTick } from 'vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';
import { comments_store } from '@/stores/modules/appType/comments/comments.store.js';


describe('AppDetailsComments.vue', () => {
  let wrapper;
  const appCode = '123';
  let commentsStore;

  beforeEach(() => {
    const pinia = createTestingPinia({
      stubActions: false,
      createSpy: vi.fn,
    });
    setActivePinia(pinia);

    commentsStore = comments_store()

    wrapper = mount(AppDetailsComments, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
        },
      },
      props: {
        appCode,
      },
      methods: {
        unnnicCallAlert: vi.fn(),
      },
    });
  });

  it('renders correctly in non-edit mode', () => {
    expect(wrapper.find('.app-details-comments__header').text()).toContain('Leave a comment');
  });


  it('calls listComments on mount', () => {
    const commentsStore = comments_store()
    expect(commentsStore.listComments).toHaveBeenCalledWith(appCode);
  });

  it('resets fields when resetFields is called', async () => {
    wrapper.vm.editMode = true;
    wrapper.vm.currentComment = 'Test comment';
    wrapper.vm.resetFields();
    await nextTick();
    expect(wrapper.vm.editMode).toBe(false);
    expect(wrapper.vm.currentComment).toBeNull();
  });

  it('handles comment submission correctly in create mode', async () => {
    wrapper.vm.currentComment = 'New comment';
    wrapper.vm.editMode = false;
    await wrapper.vm.handleComment();
    expect(commentsStore.createComment).toHaveBeenCalled();
  });

  it('handles comment submission correctly in edit mode', async () => {
    wrapper.vm.currentComment = 'Updated comment';
    wrapper.vm.editMode = true;
    await wrapper.vm.handleComment();
    expect(commentsStore.updateComment).toHaveBeenCalled();
  });

  // it('displays error alert if createComment fails', async () => {
  //   const commentsStore = comments_store();
  //   commentsStore.errorCreateComment = 'Error';
  //   wrapper.vm.currentComment = 'New comment';
  //   await wrapper.vm.handleComment();
  //   expect(unnnicCallAlert).toBeCalledTimes(1)
  //   expect(spy).toHaveBeenCalledWith({
  //     props: { text: 'apps.details.status_error', type: 'error' },
  //     seconds: 3,
  //   });
  // });

  // it('displays error alert if updateComment fails', async () => {
  //   commentsStore.errorUpdateComment = 'Error';
  //   wrapper.vm.currentComment = 'Updated comment';
  //   await wrapper.vm.handleComment();
  //   expect(unnnic.unnnicCallAlert).toHaveBeenCalledWith({
  //     props: { text: 'apps.details.status_error', type: 'error' },
  //     seconds: 3,
  //   });
  // });

  it('toggles remove modal visibility', async () => {
    expect(wrapper.vm.showRemoveModal).toBe(false);
    wrapper.vm.toggleRemoveModal();
    await nextTick();
    expect(wrapper.vm.showRemoveModal).toBe(true);
  });

  it('handles deleteComment correctly', async () => {
    wrapper.vm.currentRemovalUuid = 'uuid-123';
    await wrapper.vm.handleDelete(wrapper.vm.currentRemovalUuid);
    expect(commentsStore.deleteComment).toHaveBeenCalledWith({
      code: appCode,
      commentUuid: 'uuid-123',
    });
  });

  // it('displays success alert after successful delete', async () => {
  //   wrapper.vm.currentRemovalUuid = 'uuid-123';
  //   await wrapper.vm.handleDelete(wrapper.vm.currentRemovalUuid);
  //   expect(unnnic.unnnicCallAlert).toHaveBeenCalledWith({
  //     props: { text: 'apps.details.comments.remove.status_text', type: 'success' },
  //     seconds: 3,
  //   });
  // });

  // it('displays error alert if deleteComment fails', async () => {
  //   commentsStore.errorDeleteComment = 'Error';
  //   wrapper.vm.currentRemovalUuid = 'uuid-123';
  //   await wrapper.vm.handleDelete(wrapper.vm.currentRemovalUuid);
  //   expect(unnnic.unnnicCallAlert).toHaveBeenCalledWith({
  //     props: { text: 'apps.details.status_error', type: 'error' },
  //     seconds: 3,
  //   });
  // });
});
