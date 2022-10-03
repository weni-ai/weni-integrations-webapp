import {
  unnnicCallAlert as mockUnnnicCallAlert,
  unnnicInput,
  unnnicSelect,
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
      },
    },
    propsData: {
      selectedForm,
      removeLanguages,
      availableLanguages,
    },
    stubs: {
      FormTabContentHeader: true,
      FormTabContentBody,
      FormTabContentFooter: true,
      FormTabContentButtons: true,
    },
  });

  return { wrapper, actions, getters };
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
    const categorySelectComponent = wrapper.findAllComponents(unnnicSelect).at(0);

    categorySelectComponent.vm.$emit('input', 'transactional');
    await wrapper.vm.$nextTick();

    expect(actions.updateTemplateForm).toHaveBeenCalledTimes(1);
    expect(actions.updateTemplateForm).toHaveBeenCalledWith(expect.any(Object), {
      fieldName: 'category',
      fieldValue: 'transactional',
    });
  });

  describe('handleLanguageSelection()', () => {
    it('should call alert if language does not exists', async () => {
      const { wrapper, actions } = mountComponent({
        removeLanguages: ['Portuguese (BR)', 'English (US)'],
        language: 'pt_BR',
      });
      const languageSelectComponent = wrapper.findAllComponents(unnnicSelect).at(1);

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
      const languageSelectComponent = wrapper.findAllComponents(unnnicSelect).at(1);

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
      const languageSelectComponent = wrapper.findAllComponents(unnnicSelect).at(1);

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
      const languageSelectComponent = wrapper.findAllComponents(unnnicSelect).at(1);

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

  it('should go back on closeEdit', async () => {
    const { wrapper } = mountComponent();
    const closeButton = wrapper.find('.form-tab-content__actions__cancel');

    expect(wrapper.vm.$router.go).not.toHaveBeenCalled();

    await closeButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.$router.go).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.$router.go).toHaveBeenCalledWith(-1);
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
        key: ' ',
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
});
