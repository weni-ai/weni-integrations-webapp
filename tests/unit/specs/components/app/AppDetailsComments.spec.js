import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import { mount, createLocalVue } from '@vue/test-utils';
import AppDetailsComments from '@/components/app/AppDetailsComments';
import i18n from '@/utils/plugins/i18n';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(Vuex);

describe('AppDetailsComments.vue', () => {
  let wrapper;
  let store;
  let actions;

  beforeEach(() => {
    actions = {
      listComments: jest.fn(() => {
        return { data: [] };
      }),
      createComment: jest.fn(),
      deleteComment: jest.fn(),
      updateComment: jest.fn(),
    };

    store = new Vuex.Store({
      actions,
    });

    wrapper = mount(AppDetailsComments, {
      localVue,
      store,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
        UnnnicComment: true,
        UnnnicDropdown: true,
        UnnnicDropdownItem: true,
        UnnnicIconSvg: true,
      },
      propsData: {
        appCode: 'code',
      },
      attachTo: document.body,
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('fullOwnerName()', () => {
    it('should return full name', () => {
      const owner = {
        first_name: 'Jane',
        last_name: 'Doe',
      };
      const fullName = wrapper.vm.fullOwnerName(owner);
      expect(fullName).toEqual('Jane Doe');
    });
  });

  describe('toggleRemoveModal()', () => {
    it('should toggle', () => {
      expect(wrapper.vm.showRemoveModal).toBeFalsy();
      wrapper.vm.toggleRemoveModal();
      expect(wrapper.vm.showRemoveModal).toBeTruthy();
    });
  });

  describe('confirmDelete()', () => {
    it('should set showRemoveModal to true', () => {
      const uuid = '123';
      expect(wrapper.vm.showRemoveModal).toBeFalsy();
      wrapper.vm.confirmDelete(uuid);
      expect(wrapper.vm.showRemoveModal).toBeTruthy();
    });

    it('should set currentRemovalUuid', () => {
      const uuid = '123';
      expect(wrapper.vm.currentRemovalUuid).not.toEqual(uuid);
      wrapper.vm.confirmDelete(uuid);
      expect(wrapper.vm.currentRemovalUuid).toEqual(uuid);
    });
  });

  describe('handleComment()', () => {
    const comment = {
      uuid: '123',
      text: 'comment ', // whitespace on end to test trim()
    };
    beforeEach(() => {
      wrapper.vm.currentComment = comment.text;
    });

    it('should do nothing if currentComment is empty', async () => {
      wrapper.vm.currentComment = '   ';
      const spy = spyOn(wrapper.vm, 'resetFields');
      expect(spy).not.toHaveBeenCalled();

      await wrapper.vm.handleComment();

      expect(spy).not.toHaveBeenCalled();
    });

    it('should call fetchComments()', async () => {
      const spy = spyOn(wrapper.vm, 'fetchComments');
      expect(spy).not.toHaveBeenCalled();

      await wrapper.vm.handleComment();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(wrapper.vm.appCode);
    });

    it('should call unnnicCallAlert on error', async () => {
      spyOn(wrapper.vm, 'fetchComments').and.throwError(new Error('error fetching'));
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.handleComment();
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });

    it('should call resetFields() if currentComment is valid', async () => {
      const spy = spyOn(wrapper.vm, 'resetFields');
      expect(spy).not.toHaveBeenCalled();

      await wrapper.vm.handleComment();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    describe('ADD mode', () => {
      beforeEach(() => {
        wrapper.vm.editMode = false;
      });

      it('should call createComment()', async () => {
        expect(actions.createComment).not.toHaveBeenCalled();
        await wrapper.vm.handleComment();
        expect(actions.createComment).toHaveBeenCalledTimes(1);
        expect(actions.createComment).toHaveBeenCalledWith(expect.any(Object), {
          code: wrapper.vm.appCode,
          payload: {
            content: comment.text.trim(),
          },
        });
      });
    });

    describe('EDIT mode', () => {
      beforeEach(() => {
        wrapper.vm.editMode = true;
        wrapper.vm.editCommentUuid = comment.uuid;
      });

      it('should call updateComment()', async () => {
        expect(actions.updateComment).not.toHaveBeenCalled();
        await wrapper.vm.handleComment();
        expect(actions.updateComment).toHaveBeenCalledTimes(1);
        expect(actions.updateComment).toHaveBeenCalledWith(expect.any(Object), {
          code: wrapper.vm.appCode,
          commentUuid: comment.uuid,
          payload: {
            content: comment.text.trim(),
          },
        });
      });
    });
  });

  describe('handleDelete()', () => {
    const commentUuid = 123;
    it('should call deleteComment()', async () => {
      expect(actions.deleteComment).not.toHaveBeenCalled();

      await wrapper.vm.handleDelete(commentUuid);

      expect(actions.deleteComment).toHaveBeenCalledTimes(1);
      expect(actions.deleteComment).toHaveBeenCalledWith(expect.any(Object), {
        code: wrapper.vm.appCode,
        commentUuid,
      });
    });

    it('should call fetchComments()', async () => {
      const spy = spyOn(wrapper.vm, 'fetchComments');
      expect(spy).not.toHaveBeenCalled();

      await wrapper.vm.handleDelete(commentUuid);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(wrapper.vm.appCode);
    });

    it('should call unnnicCallAlert() on error', async () => {
      spyOn(wrapper.vm, 'fetchComments').and.throwError(new Error('error fetching'));
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      await wrapper.vm.handleDelete(commentUuid);
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleUpdate()', () => {
    const comment = {
      uuid: '123',
      content: 'text',
    };

    it('should set on edit mode', () => {
      expect(wrapper.vm.editMode).toBeFalsy();
      wrapper.vm.handleUpdate(comment);
      expect(wrapper.vm.editMode).toBeTruthy();
    });

    it('should set comment data to edit', () => {
      expect(wrapper.vm.editCommentUuid).toBeNull();
      expect(wrapper.vm.currentComment).toBeNull();
      wrapper.vm.handleUpdate(comment);
      expect(wrapper.vm.editCommentUuid).toEqual(comment.uuid);
      expect(wrapper.vm.currentComment).toEqual(comment.content);
    });

    it('should set focus on input', () => {
      const input = wrapper.findComponent({ ref: 'comment_input' }).element.children[0].children[0];
      expect(input).not.toBe(document.activeElement);
      wrapper.vm.handleUpdate(comment);
      expect(input).toBe(document.activeElement);
    });
  });
});
