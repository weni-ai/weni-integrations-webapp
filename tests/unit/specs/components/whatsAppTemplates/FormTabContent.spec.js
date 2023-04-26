import {
  unnnicCallAlert as mockUnnnicCallAlert,
  unnnicInput,
  unnnicSelect,
  unnnicMultiSelect,
} from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import FormTabContent from '@/components/whatsAppTemplates/FormTabContent.vue';
import FormTabContentHeader from '@/components/whatsAppTemplates/FormTabContentHeader.vue';
import FormTabContentBody from '@/components/whatsAppTemplates/FormTabContentBody.vue';
import FormTabContentFooter from '@/components/whatsAppTemplates/FormTabContentFooter.vue';
import FormTabContentButtons from '@/components/whatsAppTemplates/FormTabContentButtons.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

// Global mock
document.execCommand = jest.fn();

const mountComponent = ({
  selectedForm = null,
  removeLanguages = [],
  language = null,
  availableLanguages = [],
  templateResults = [],
  canEdit = true,
} = {}) => {
  if (!availableLanguages.length) {
    availableLanguages = [
      {
        value: 'en_US',
        text: 'English (US)',
      },
      {
        value: 'pt_BR',
        text: 'Portuguese (BR)',
      },
    ];
  }

  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return { language };
    }),
  };

  const state = {
    templateForm: {
      name: '',
      category: '',
    },
    whatsAppTemplates: {
      results: templateResults,
    },
  };

  const actions = {
    updateTemplateForm: jest.fn(),
    updateTemplateTranslationForm: jest.fn(),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        getters,
        state,
        actions,
      },
    },
  });

  const wrapper = mount(FormTabContent, {
    localVue,
    store,
    i18n,
    mocks: {
      $router: {
        go: jest.fn(),
        push: jest.fn(),
        currentRoute: {
          path: '/apps/my/wpp-cloud/12281962-f570-4252-99f1-d465df8f2270/templates/create',
        },
      },
    },
    propsData: {
      selectedForm,
      removeLanguages,
      availableLanguages,
      canEdit,
    },
    stubs: {
      FormTabContentHeader: true,
      FormTabContentBody,
      FormTabContentFooter: true,
      FormTabContentButtons: true,
      VEmojiPicker: true,
    },
  });

  return { wrapper, actions, getters, state };
};

describe('components/whatsAppTemplates/FormTabContent.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should emit name input change', async () => {
    const { wrapper, actions } = mountComponent();
    const nameComponent = wrapper.findComponent(unnnicInput);

    nameComponent.vm.$emit('input', 'new name');
    await wrapper.vm.$nextTick();

    expect(actions.updateTemplateForm).toHaveBeenCalledTimes(1);
    expect(actions.updateTemplateForm).toHaveBeenCalledWith(expect.any(Object), {
      fieldName: 'name',
      fieldValue: 'new name',
    });
  });

  it('should emit category change', async () => {
    const { wrapper, actions } = mountComponent();
    const categorySelectComponent = wrapper.findComponent(unnnicMultiSelect);

    expect(actions.updateTemplateForm).not.toHaveBeenCalled();

    categorySelectComponent.vm.$emit('change', [
      {
        title: 'Category',
        selected: 1,
        items: [
          {
            value: 'TRANSACTIONAL',
            title: 'transactional',
            description: 'transactional',
          },
          {
            value: 'MARKETING',
            title: 'marketing',
            description: 'marketing',
          },
          {
            value: 'OTP',
            title: 'otp',
            description: 'otp',
          },
        ],
      },
    ]);
    await wrapper.vm.$nextTick();

    expect(actions.updateTemplateForm).toHaveBeenCalledTimes(1);
    expect(actions.updateTemplateForm).toHaveBeenCalledWith(expect.any(Object), {
      fieldName: 'category',
      fieldValue: 'MARKETING',
    });
  });

  describe('handleLanguageSelection()', () => {
    it('should call alert if language does not exists', async () => {
      const { wrapper, actions } = mountComponent({
        removeLanguages: ['Portuguese (BR)', 'English (US)'],
        language: 'pt_BR',
      });
      const languageSelectComponent = wrapper.findComponent(unnnicSelect);

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      languageSelectComponent.vm.$emit('input', 'unknown');
      await wrapper.vm.$nextTick();

      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'Unexpected language, please refresh',
            title: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
      expect(actions.updateTemplateTranslationForm).not.toHaveBeenCalled();
    });

    it('should call alert if language is in removeLanguages', async () => {
      const { wrapper, actions } = mountComponent({
        removeLanguages: ['Portuguese (BR)', 'English (US)'],
        language: 'pt_BR',
      });
      const languageSelectComponent = wrapper.findComponent(unnnicSelect);

      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();

      languageSelectComponent.vm.$emit('input', 'en_US');
      await wrapper.vm.$nextTick();

      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'This language already exists',
            title: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
      expect(actions.updateTemplateTranslationForm).not.toHaveBeenCalled();
    });

    it('should call updateTemplateTranslationForm for a new language', async () => {
      const { wrapper, actions } = mountComponent({
        selectedForm: 'Portuguese (BR)',
        removeLanguages: ['Portuguese (BR)'],
        language: 'pt_BR',
      });
      const languageSelectComponent = wrapper.findComponent(unnnicSelect);

      languageSelectComponent.vm.$emit('input', 'en_US');
      await wrapper.vm.$nextTick();

      expect(actions.updateTemplateTranslationForm).toHaveBeenCalledTimes(1);
      expect(actions.updateTemplateTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'Portuguese (BR)',
        fieldName: 'language',
        fieldValue: 'en_US',
      });
    });

    it('should emit language-change with the new language name', async () => {
      const { wrapper } = mountComponent({
        selectedForm: 'Portuguese (BR)',
        removeLanguages: ['Portuguese (BR)'],
        language: 'pt_BR',
      });
      const languageSelectComponent = wrapper.findComponent(unnnicSelect);

      languageSelectComponent.vm.$emit('input', 'en_US');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('language-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual(['English (US)']);
    });
  });

  it('should handle FormTabContentHeader input', async () => {
    const { wrapper, actions } = mountComponent({ selectedForm: 'Portuguese' });
    const contentHeader = wrapper.findComponent(FormTabContentHeader);

    contentHeader.vm.$emit('input-change', { fieldName: 'headerText', fieldValue: 'new text' });
    await wrapper.vm.$nextTick();

    expect(actions.updateTemplateTranslationForm).toHaveBeenCalledTimes(1);
    expect(actions.updateTemplateTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
      formName: 'Portuguese',
      fieldName: 'headerText',
      fieldValue: 'new text',
    });
  });

  it('should handle FormTabContentBody input', async () => {
    const { wrapper, actions } = mountComponent({ selectedForm: 'Portuguese' });
    const contentHeader = wrapper.findComponent(FormTabContentBody);

    contentHeader.vm.$emit('input-change', { fieldName: 'bodyText', fieldValue: 'new text' });
    await wrapper.vm.$nextTick();

    expect(actions.updateTemplateTranslationForm).toHaveBeenCalledTimes(1);
    expect(actions.updateTemplateTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
      formName: 'Portuguese',
      fieldName: 'bodyText',
      fieldValue: 'new text',
    });
  });

  it('should handle FormTabContentFooter input', async () => {
    const { wrapper, actions } = mountComponent({ selectedForm: 'Portuguese' });
    const contentHeader = wrapper.findComponent(FormTabContentFooter);

    contentHeader.vm.$emit('input-change', { fieldName: 'footerText', fieldValue: 'new text' });
    await wrapper.vm.$nextTick();

    expect(actions.updateTemplateTranslationForm).toHaveBeenCalledTimes(1);
    expect(actions.updateTemplateTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
      formName: 'Portuguese',
      fieldName: 'footerText',
      fieldValue: 'new text',
    });
  });

  it('should handle FormTabContentButtons input', async () => {
    const { wrapper, actions } = mountComponent({ selectedForm: 'Portuguese' });
    const contentHeader = wrapper.findComponent(FormTabContentButtons);

    contentHeader.vm.$emit('input-change', {
      fieldName: 'templateButtons',
      fieldValue: ['1', '2'],
    });
    await wrapper.vm.$nextTick();

    expect(actions.updateTemplateTranslationForm).toHaveBeenCalledTimes(1);
    expect(actions.updateTemplateTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
      formName: 'Portuguese',
      fieldName: 'templateButtons',
      fieldValue: ['1', '2'],
    });
  });

  it('should go to templates table on closeEdit', async () => {
    const { wrapper } = mountComponent();
    const closeButton = wrapper.find('.form-tab-content__actions__cancel');

    expect(wrapper.vm.$router.push).not.toHaveBeenCalled();

    await closeButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
      '/apps/my/wpp-cloud/12281962-f570-4252-99f1-d465df8f2270/templates',
    );
  });

  describe('formatTemplateName()', () => {
    it('should convert spaces into underscores and everything to lowercase', () => {
      const { wrapper } = mountComponent();

      const event = {
        srcElement: {
          value: 'Text with spaces and UPPERCASE LETTERS',
        },
      };

      wrapper.vm.formatTemplateName(event);

      expect(event.srcElement.value).toEqual('text_with_spaces_and_uppercase_letters');
    });
  });

  describe('preventTemplateName()', () => {
    it('should prevent not alpha numeric characters and underscores to be inserted', () => {
      const { wrapper } = mountComponent();

      const event = {
        preventDefault: jest.fn(),
        key: '?',
      };

      expect(event.preventDefault).not.toHaveBeenCalled();
      wrapper.vm.preventTemplateName(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should not prevent alpha numeric characters and underscores to be inserted', () => {
      const { wrapper } = mountComponent();

      let event = {
        preventDefault: jest.fn(),
        key: 'a',
      };

      expect(event.preventDefault).not.toHaveBeenCalled();
      wrapper.vm.preventTemplateName(event);
      expect(event.preventDefault).not.toHaveBeenCalledTimes(1);

      event = {
        preventDefault: jest.fn(),
        key: '1',
      };

      expect(event.preventDefault).not.toHaveBeenCalled();
      wrapper.vm.preventTemplateName(event);
      expect(event.preventDefault).not.toHaveBeenCalledTimes(1);

      event = {
        preventDefault: jest.fn(),
        key: '_',
      };

      expect(event.preventDefault).not.toHaveBeenCalled();
      wrapper.vm.preventTemplateName(event);
      expect(event.preventDefault).not.toHaveBeenCalledTimes(1);
    });
  });

  describe('saveTemplate()', () => {
    it('should emit save-changes if there are no errorStates', async () => {
      const { wrapper } = mountComponent();
      const saveButton = wrapper.find('.form-tab-content__actions__save');

      expect(wrapper.emitted('save-changes')).toBeFalsy();

      await saveButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('save-changes')).toBeTruthy();
    });

    it('should not emit save-changes if there are errorStates', async () => {
      const { wrapper } = mountComponent();
      wrapper.vm.errorStates = {
        name: {
          value: true,
          message: 'error',
        },
      };
      const saveButton = wrapper.find('.form-tab-content__actions__save');

      expect(wrapper.emitted('save-changes')).toBeFalsy();

      await saveButton.trigger('click');
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('save-changes')).toBeFalsy();
    });

    it('should not emit save-changes if cannot save', async () => {
      const { wrapper } = mountComponent({ canEdit: false });

      expect(wrapper.emitted('save-changes')).toBeFalsy();

      await wrapper.vm.saveTemplate();
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted('save-changes')).toBeFalsy();
    });
  });

  describe('handleTemplateFormInput()', () => {
    it('should set name error and message if name already exists', async () => {
      const { wrapper } = mountComponent();
      spyOn(wrapper.vm, 'verifyExistingName').and.returnValue(true);

      wrapper.vm.handleTemplateFormInput({ fieldName: 'name', fieldValue: 'a name' });

      expect(wrapper.vm.errorStates.name.value).toBeTruthy();
      expect(wrapper.vm.errorStates.name.message).toEqual(
        'This name already exists, please enter a different one.',
      );
    });
  });

  describe('verifyExistingName()', () => {
    it('should return true if name already exists', () => {
      const { wrapper } = mountComponent({
        templateResults: [{ name: 'name 1' }, { name: 'name 2' }],
      });

      expect(wrapper.vm.verifyExistingName('name 1')).toBeTruthy();
    });

    it('should return false if name does not exist', () => {
      const { wrapper } = mountComponent({
        templateResults: [{ name: 'name 1' }, { name: 'name 2' }],
      });

      expect(wrapper.vm.verifyExistingName('name 3')).toBeFalsy();
    });
  });

  describe('currentCategory()', () => {
    it('should return empty string if category is not found', () => {
      const { wrapper, state } = mountComponent();

      state.templateForm.category = 'not found';

      expect(wrapper.vm.currentCategory).toEqual('');
    });

    it('should return category translation if category is found', () => {
      const { wrapper, state } = mountComponent();

      state.templateForm.category = 'MARKETING';

      expect(wrapper.vm.currentCategory).toEqual('Marketing');
    });
  });
});
