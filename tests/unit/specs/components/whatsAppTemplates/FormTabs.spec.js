import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import FormTabs from '@/components/whatsAppTemplates/FormTabs.vue';
import FormTabContent from '@/components/whatsAppTemplates/FormTabContent.vue';
import FormTabContentBody from '@/components/whatsAppTemplates/FormTabContentBody.vue';
import { unnnicTab } from '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  formMode = 'create',
  template = {
    name: 'template_name',
    category: 'MARKETING',
    translations: [{ language: 'pt_BR' }],
  },
  hasError = false,
  appUuid = '123',
  templateUuid = '456',
  paramsTemplateUuid = '789',
} = {}) => {
  const actions = {
    updateTemplateForm: jest.fn(),
    addNewTranslationForm: jest.fn(),
    renameTemplateTranslationForm: jest.fn(),
    setTemplateTranslationSelectedForm: jest.fn(),
    fetchTemplateData: jest.fn(),
    fetchSelectLanguages: jest.fn(),
    updateTemplateTranslationForm: jest.fn(),
    createTemplate: jest.fn(),
    createTemplateTranslation: jest.fn(),
    getWhatsAppTemplates: jest.fn(),
    clearTemplateData: jest.fn(),
    updateTemplateTranslation: jest.fn(),
  };

  const state = {
    whatsAppTemplate: template,
    loadingFetchWhatsAppTemplate: false,
    loadingWhatsAppTemplates: false,
    errorFetchWhatsAppTemplate: hasError,
    whatsAppTemplateSelectLanguages: [
      { value: 'pt_BR', text: 'Portuguese (BR)' },
      { value: 'en_US', text: 'English (US)' },
    ],
    templateForm: {
      name: template.name,
      category: template.category,
    },
    errorCreateTemplate: false,
    createdTemplateData: null,
    errorCreateTemplateTranslation: false,
    createdTemplateTranslationData: null,
    errorWhatsAppTemplateSelectLanguages: false,
    errorUpdateTemplateTranslation: false,
  };

  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return template.translations[0];
    }),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        actions,
        getters,
        state,
      },
    },
  });

  const wrapper = mount(FormTabs, {
    localVue,
    store,
    i18n,
    propsData: {
      formMode,
      templateUuid,
    },
    stubs: {
      FormTabContent,
      FormTabContentHeader: true,
      FormTabContentBody,
      FormTabContentFooter: true,
      FormTabContentButtons: true,
      VEmojiPicker: true,
    },
    mocks: {
      $route: {
        params: {
          appCode: 'wpp-cloud',
          appUuid: appUuid,
          templateUuid: paramsTemplateUuid,
        },
      },
      $router: {
        replace: jest.fn(),
      },
    },
  });

  await wrapper.vm.$nextTick();
  await jest.runAllTimers();

  return { wrapper, actions, state, getters };
};

describe('components/whatsAppTemplates/FormTabs.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('created()', () => {
    it('should load with New Language tab if formMode is create', async () => {
      const { wrapper, actions } = await mountComponent();
      expect(wrapper.vm.createdTabs).toEqual(['New Language']);
      expect(wrapper.vm.currentTabIndex).toEqual(0);
      expect(actions.addNewTranslationForm).toHaveBeenCalledTimes(1);
      expect(actions.addNewTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'New Language',
      });
    });

    it('should not load with default tab if templateUuid is provided', async () => {
      const { wrapper, actions } = await mountComponent({ formMode: 'edit' });
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.currentTabIndex).toEqual(0);
      expect(wrapper.vm.existingTabs).toEqual(['Portuguese (BR)']);
      expect(actions.addNewTranslationForm).toHaveBeenCalledTimes(1);
    });

    it('should not call buildTemplateForm if an error occurred', async () => {
      const { wrapper } = await mountComponent({ formMode: 'edit', hasError: true });
      const spy = spyOn(wrapper.vm, 'buildTemplateForm');

      await wrapper.vm.fetchData();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('fetchData()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call callErrorModal if appUuid is not provided', async () => {
      const { wrapper } = await mountComponent({ formMode: 'edit', appUuid: null });
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      jest.clearAllMocks();

      await wrapper.vm.fetchData();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        text: 'Invalid application identifier, please refresh the page.',
      });
    });

    it('should call callErrorModal if failed to fetch template data', async () => {
      const { wrapper, state } = await mountComponent({ formMode: 'edit' });
      const spy = spyOn(wrapper.vm, 'callErrorModal');

      state.errorFetchWhatsAppTemplate = true;
      await wrapper.vm.fetchData();

      expect(spy).toHaveBeenCalledWith({
        text: 'Error fetching template data, please try again later',
      });
    });

    it('should call fetchTemplateData', async () => {
      const { wrapper, actions } = await mountComponent({
        formMode: 'edit',
      });
      jest.clearAllMocks();

      await wrapper.vm.fetchData();

      expect(actions.fetchTemplateData).toHaveBeenCalledTimes(1);
      expect(actions.fetchTemplateData).toHaveBeenCalledWith(expect.any(Object), {
        appUuid: '123',
        templateUuid: '456',
      });
    });

    it('should call buildTemplateForm', async () => {
      const { wrapper } = await mountComponent({
        formMode: 'edit',
      });
      await wrapper.vm.$nextTick();
      jest.clearAllMocks();

      const spy = spyOn(wrapper.vm, 'buildTemplateForm');

      await wrapper.vm.fetchData();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call createDefaultNewLanguageTab if translation length is empty', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [],
      };

      const { wrapper } = await mountComponent({
        formMode: 'edit',
        template,
      });
      await wrapper.vm.$nextTick();
      jest.clearAllMocks();

      const spy = spyOn(wrapper.vm, 'createDefaultNewLanguageTab');

      await wrapper.vm.fetchData();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call buildTranslationForm for each translation', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [{ language: 'pt_BR' }, { language: 'en_US' }],
      };

      const { wrapper } = await mountComponent({
        formMode: 'edit',
        template,
      });
      await wrapper.vm.$nextTick();
      jest.clearAllMocks();

      const spy = spyOn(wrapper.vm, 'buildTranslationForm');

      await wrapper.vm.fetchData();

      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should call setTemplateTranslationSelectedForm with the first translation', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [{ language: 'pt_BR' }, { language: 'en_US' }],
      };

      const { wrapper, actions } = await mountComponent({
        formMode: 'edit',
        template,
      });
      await wrapper.vm.$nextTick();
      jest.clearAllMocks();

      await wrapper.vm.fetchData();

      expect(actions.setTemplateTranslationSelectedForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'pt_BR',
      });
    });
  });

  describe('fetchLanguages()', () => {
    it('should call fetchSelectLanguages', async () => {
      const { wrapper, actions } = await mountComponent({
        formMode: 'create',
      });
      await wrapper.vm.$nextTick();
      jest.clearAllMocks();

      await wrapper.vm.fetchLanguages();

      expect(actions.fetchSelectLanguages).toHaveBeenCalledTimes(1);
      expect(actions.fetchSelectLanguages).toHaveBeenCalledWith(expect.any(Object), {
        appUuid: '123',
      });
    });

    it('should call callErrorModal on errorWhatsAppTemplateSelectLanguages', async () => {
      const { wrapper, state } = await mountComponent({
        formMode: 'create',
      });
      await wrapper.vm.$nextTick();
      jest.clearAllMocks();

      state.errorWhatsAppTemplateSelectLanguages = true;

      const spy = spyOn(wrapper.vm, 'callErrorModal');

      await wrapper.vm.fetchLanguages();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        text: 'Error fetching languages data, please try again later...',
      });
    });
  });

  describe('handleTranslationSelection()', () => {
    it('should change current tab on translation tab change', async () => {
      const { wrapper, actions } = await mountComponent();
      jest.clearAllMocks();
      wrapper.vm.createdTabs = ['pt', 'en'];
      const tabComponent = wrapper.findComponent(unnnicTab);

      expect(wrapper.vm.currentTabIndex).toEqual(0);

      tabComponent.vm.$emit('change', 'en');
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.currentTabIndex).toEqual(1);
      expect(actions.setTemplateTranslationSelectedForm).toHaveBeenCalledTimes(1);
      expect(actions.setTemplateTranslationSelectedForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'en',
      });
    });
  });

  describe('addTranslation()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call addTranslation on button click', async () => {
      const { wrapper } = await mountComponent();
      const addTranslationButton = wrapper.findComponent({ ref: 'add-translation-button' });
      const spy = spyOn(wrapper.vm, 'addTranslation');

      wrapper.vm.createdTabs = ['default'];

      expect(spy).toHaveBeenCalledTimes(0);
      await addTranslationButton.trigger('click');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return early if createdTabs still includes new', async () => {
      const { wrapper } = await mountComponent();
      const addTranslationButton = wrapper.findComponent({ ref: 'add-translation-button' });

      wrapper.vm.createdTabs = ['New Language'];

      expect(wrapper.vm.createdTabs).toEqual(['New Language']);
      await addTranslationButton.trigger('click');
      expect(wrapper.vm.createdTabs).toEqual(['New Language']);
    });

    it('should create new tab', async () => {
      const { wrapper, actions } = await mountComponent();
      jest.clearAllMocks();
      const addTranslationButton = wrapper.findComponent({ ref: 'add-translation-button' });

      wrapper.vm.createdTabs = ['pt'];

      expect(wrapper.vm.createdTabs).toEqual(['pt']);
      await addTranslationButton.trigger('click');
      expect(wrapper.vm.createdTabs).toEqual(['pt', 'New Language']);
      expect(actions.addNewTranslationForm).toHaveBeenCalledTimes(1);
      expect(actions.addNewTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'New Language',
      });
      expect(actions.setTemplateTranslationSelectedForm).toHaveBeenCalledTimes(1);
      expect(actions.setTemplateTranslationSelectedForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'New Language',
      });
    });
  });

  describe('handleLanguageChange()', () => {
    it('should call handleLanguageChange on FormTabContent event', async () => {
      const { wrapper, actions } = await mountComponent();
      const formTabsContent = wrapper.findComponent(FormTabContent);

      wrapper.vm.createdTabs = ['pt', 'en'];

      expect(actions.renameTemplateTranslationForm).not.toHaveBeenCalled();
      formTabsContent.vm.$emit('language-change', 'es');
      await wrapper.vm.$nextTick();
      expect(actions.renameTemplateTranslationForm).toHaveBeenCalledTimes(1);
      expect(actions.renameTemplateTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        currentName: 'pt',
        newName: 'es',
      });
      expect(wrapper.vm.createdTabs).toEqual(['es', 'en']);
    });
  });

  describe('buildTranslationForm()', () => {
    it('should set header mediaType correctly', async () => {
      const translation = { language: 'pt_BR', header: { header_type: 'IMAGE' } };
      const { wrapper, actions } = await mountComponent();

      wrapper.vm.buildTranslationForm(translation);

      expect(actions.addNewTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'Portuguese (BR)',
        formData: {
          language: 'pt_BR',
          header: {
            mediaType: 'IMAGE',
            header_type: 'MEDIA',
          },
        },
      });
    });

    it('should set button country_code accordingly to its country_calling_code', async () => {
      const { wrapper, actions } = await mountComponent();
      const translation = {
        language: 'pt_BR',
        buttons: [
          {
            button_type: 'URL',
            text: 'button url text',
            url: 'https://weni.ai',
          },
          {
            button_type: 'PHONE_NUMBER',
            text: 'button text',
            country_code: '55',
            phone_number: '(82)99999-9999',
          },
        ],
      };

      wrapper.vm.buildTranslationForm(translation);

      expect(actions.addNewTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'Portuguese (BR)',
        formData: {
          language: 'pt_BR',
          buttons: [
            {
              button_type: 'URL',
              text: 'button url text',
              url: 'weni.ai',
            },
            {
              button_type: 'PHONE_NUMBER',
              text: 'button text',
              phone_number: '(82)99999-9999',
              country_code: 'BR',
              country_calling_code: '55',
            },
          ],
        },
      });
    });

    it('should set only the first 2 buttons if phontype is PHONE_NUMBER or URL', async () => {
      const { wrapper, actions } = await mountComponent();
      const translation = {
        language: 'pt_BR',
        buttons: [
          {
            button_type: 'URL',
            text: 'button url text',
            url: 'https://weni.ai',
          },
          {
            button_type: 'PHONE_NUMBER',
            text: 'button text',
            country_code: '55',
            phone_number: '(82)99999-9999',
          },
          {
            button_type: 'PHONE_NUMBER',
            text: 'button text 2',
            country_code: '56',
            phone_number: '(82)99999-9999',
          },
        ],
      };

      wrapper.vm.buildTranslationForm(translation);

      expect(actions.addNewTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'Portuguese (BR)',
        formData: {
          language: 'pt_BR',
          buttons: [
            {
              button_type: 'URL',
              text: 'button url text',
              url: 'weni.ai',
            },
            {
              button_type: 'PHONE_NUMBER',
              text: 'button text',
              phone_number: '(82)99999-9999',
              country_code: 'BR',
              country_calling_code: '55',
            },
          ],
        },
      });
    });

    it('should QUICK_REPLIES correctly', async () => {
      const { wrapper, actions } = await mountComponent();
      const translation = {
        language: 'pt_BR',
        buttons: [
          {
            button_type: 'QUICK_REPLY',
            text: 'button text 1',
          },
          {
            button_type: 'QUICK_REPLY',
            text: 'button text 2',
          },
          {
            button_type: 'QUICK_REPLY',
            text: 'button text 3',
          },
        ],
      };

      wrapper.vm.buildTranslationForm(translation);

      expect(actions.addNewTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'Portuguese (BR)',
        formData: {
          language: 'pt_BR',
          buttons: [
            {
              button_type: 'QUICK_REPLY',
              text: 'button text 1',
            },
            {
              button_type: 'QUICK_REPLY',
              text: 'button text 2',
            },
            {
              button_type: 'QUICK_REPLY',
              text: 'button text 3',
            },
          ],
        },
      });
    });
  });

  describe('closeSampleModal()', () => {
    it('should set showSampleModal to false', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [{ language: 'pt_BR', header: { header_type: 'TEXT' } }],
      };
      const { wrapper } = await mountComponent({ template });

      await wrapper.setData({ showSampleModal: true });
      expect(wrapper.vm.showSampleModal).not.toBe(false);

      wrapper.vm.closeSampleModal();

      expect(wrapper.vm.showSampleModal).toBe(false);
    });
  });

  describe('templateHasVariables()', () => {
    it('should return true if template body has variables', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [
          {
            language: 'pt_BR',
            body: 'Variables {{1}}',
          },
        ],
      };
      const { wrapper } = await mountComponent({ template });

      expect(wrapper.vm.templateHasVariables()).toBeTruthy();
    });

    it('should return false if template body does not have variables', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [
          {
            language: 'pt_BR',
            body: 'simple text',
          },
        ],
      };
      const { wrapper } = await mountComponent({ template });

      expect(wrapper.vm.templateHasVariables()).toBeFalsy();
    });
  });

  describe('templateHasMedia()', () => {
    it('should return true if template header_type is MEDIA', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [
          {
            language: 'pt_BR',
            header: { header_type: 'MEDIA', mediaType: 'IMAGE' },
            body: 'simple text',
          },
        ],
      };
      const { wrapper } = await mountComponent({ template });

      expect(wrapper.vm.templateHasMedia()).toBeTruthy();
    });

    it('should return false if template header_type is not MEDIA', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [
          {
            language: 'pt_BR',
            header: { header_type: 'TEXT', text: 'sample' },
            body: 'simple text',
          },
        ],
      };
      const { wrapper } = await mountComponent({ template });

      expect(wrapper.vm.templateHasMedia()).toBeFalsy();
    });
  });

  describe('requiresSample()', () => {
    it('should return false if template does not have media header and body variables', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [{ language: 'pt_BR', header: { header_type: 'TEXT' } }],
      };
      const { wrapper } = await mountComponent({ template });

      expect(wrapper.vm.requiresSample()).toBeFalsy();
    });

    it('should return true if template does not have media header but have body variables', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [
          { language: 'pt_BR', header: { header_type: 'TEXT' }, body: 'Variable {{1}}' },
        ],
      };
      const { wrapper } = await mountComponent({ template });

      expect(wrapper.vm.requiresSample()).toBeTruthy();
    });

    it('should return true if template have media header but do not have body variables', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [
          {
            language: 'pt_BR',
            header: { header_type: 'MEDIA', mediaType: 'IMAGE' },
            body: 'simple text',
          },
        ],
      };
      const { wrapper } = await mountComponent({ template });

      expect(wrapper.vm.requiresSample()).toBeTruthy();
    });
  });

  describe('closeSampleModal', () => {
    it('should close the sample modal', async () => {
      const { wrapper } = await mountComponent();

      wrapper.vm.showSampleModal = true;
      wrapper.vm.closeSampleModal();
      expect(wrapper.vm.showSampleModal).toBe(false);
    });
  });

  describe('createDefaultNewLanguageTab()', () => {
    it('should create the default language tab with New Language name', async () => {
      const { wrapper, actions } = await mountComponent();
      jest.clearAllMocks();
      wrapper.vm.createdTabs = [];
      wrapper.vm.createDefaultNewLanguageTab();
      expect(wrapper.vm.createdTabs).toEqual(['New Language']);
      expect(actions.addNewTranslationForm).toHaveBeenCalledTimes(1);
      expect(actions.addNewTranslationForm).toHaveBeenCalledWith(expect.any(Object), {
        formName: 'New Language',
      });
    });
  });

  describe('handleSampleSubmission()', () => {
    it('should set sampleVariablesData and sampleFileData from incoming event', async () => {
      const { wrapper } = await mountComponent();

      const spy = spyOn(wrapper.vm, 'executeSave');

      const event = {
        variables: ['first', 'second'],
        headerFile: 'file',
      };

      await wrapper.vm.handleSampleSubmission(event);

      expect(wrapper.vm.sampleVariablesData).toEqual(['first', 'second']);
      expect(wrapper.vm.sampleFileData).toEqual('file');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call execute save even without complete event', async () => {
      const { wrapper } = await mountComponent();

      const spy = spyOn(wrapper.vm, 'executeSave');

      const event = {
        variables: [],
        headerFile: '',
      };

      await wrapper.vm.handleSampleSubmission(event);

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleSave()', () => {
    it('should not call executeSave if template name is null', async () => {
      const { wrapper } = await mountComponent({
        template: { name: null, category: '', translations: [] },
      });
      const spy = spyOn(wrapper.vm, 'executeSave');
      const spyError = spyOn(wrapper.vm, 'callErrorModal');

      await wrapper.vm.handleSave();

      expect(spy).not.toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledWith({ text: 'Invalid template name' });
    });

    it('should not call executeSave if template name is just spaces', async () => {
      const { wrapper } = await mountComponent({
        template: { name: '  ', category: '', translations: [] },
      });
      const spy = spyOn(wrapper.vm, 'executeSave');
      const spyError = spyOn(wrapper.vm, 'callErrorModal');

      await wrapper.vm.handleSave();

      expect(spy).not.toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledWith({ text: 'Invalid template name' });
    });

    it('should not call executeSave if category is null', async () => {
      const { wrapper } = await mountComponent({
        template: { name: 'name', category: null, translations: [] },
      });
      const spy = spyOn(wrapper.vm, 'executeSave');
      const spyError = spyOn(wrapper.vm, 'callErrorModal');

      await wrapper.vm.handleSave();

      expect(spy).not.toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledWith({ text: 'Invalid template category' });
    });

    it('should not call executeSave if language is null', async () => {
      const { wrapper } = await mountComponent({
        template: { name: 'name', category: 'category', translations: [{ language: null }] },
      });
      const spy = spyOn(wrapper.vm, 'executeSave');
      const spyError = spyOn(wrapper.vm, 'callErrorModal');

      await wrapper.vm.handleSave();

      expect(spy).not.toHaveBeenCalled();
      expect(spyError).toHaveBeenCalledTimes(1);
      expect(spyError).toHaveBeenCalledWith({ text: 'Invalid template language' });
    });

    it('should not call executeSave if sample is required', async () => {
      const template = {
        name: 'template_name',
        category: 'MARKETING',
        translations: [
          {
            language: 'pt_BR',
            header: { header_type: 'MEDIA', mediaType: 'IMAGE' },
            body: 'simple text',
          },
        ],
      };
      const { wrapper } = await mountComponent({ template });
      const spy = spyOn(wrapper.vm, 'executeSave');
      const spyError = spyOn(wrapper.vm, 'callErrorModal');

      expect(wrapper.vm.showSampleModal).toBe(false);
      await wrapper.vm.handleSave();

      expect(spy).not.toHaveBeenCalled();
      expect(spyError).not.toHaveBeenCalled();
      expect(wrapper.vm.showSampleModal).toBe(true);
    });

    it('should call executeSave if everything looks good', async () => {
      const { wrapper } = await mountComponent();
      const spy = spyOn(wrapper.vm, 'executeSave');
      const spyError = spyOn(wrapper.vm, 'callErrorModal');

      await wrapper.vm.handleSave();

      expect(spyError).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('executeSave()', () => {
    it('should call createTemplate if currentFormMode is create', async () => {
      const { wrapper, actions, state } = await mountComponent();

      wrapper.vm.currentFormMode = 'create';
      state.createdTemplateData = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        footer: 'footer text',
      };

      await wrapper.vm.executeSave();

      expect(actions.createTemplate).toHaveBeenCalledTimes(1);
      expect(actions.createTemplate).toHaveBeenCalledWith(expect.any(Object), {
        appUuid: '123',
        payload: {
          name: 'template_name',
          category: 'MARKETING',
        },
      });
    });

    it('should call errorModal if errorCreateTemplate', async () => {
      const { wrapper, state } = await mountComponent();
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      wrapper.vm.currentFormMode = 'create';
      state.errorCreateTemplate = true;

      await wrapper.vm.executeSave();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        text: 'Could not create template, please try again later',
      });
    });

    it('should call createTemplateTranslation with params templateUuid', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper, actions, state, getters } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
        templateUuid: null,
        paramsTemplateUuid: '987',
      });

      wrapper.vm.currentFormMode = 'edit';
      state.createdTemplateData = template;
      getters.templateTranslationCurrentForm = jest.fn(() => {
        return template;
      });

      await wrapper.vm.executeSave();

      expect(actions.createTemplateTranslation).toHaveBeenCalledTimes(1);
      expect(actions.createTemplateTranslation).toHaveBeenCalledWith(expect.any(Object), {
        appUuid: '123',
        templateUuid: '987',
        payload: {
          body: {
            type: 'BODY',
            text: 'body text',
          },
          header: {
            header_type: 'TEXT',
            text: 'header text',
          },
          language: 'pt_BR',
        },
      });
    });

    it('should call createTemplateTranslation', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper, actions, state, getters } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.currentFormMode = 'create';
      state.createdTemplateData = template;
      getters.templateTranslationCurrentForm = jest.fn(() => {
        return template;
      });

      await wrapper.vm.executeSave();

      expect(actions.createTemplateTranslation).toHaveBeenCalledTimes(1);
      expect(actions.createTemplateTranslation).toHaveBeenCalledWith(expect.any(Object), {
        appUuid: '123',
        templateUuid: '456',
        payload: {
          body: {
            type: 'BODY',
            text: 'body text',
          },
          header: {
            header_type: 'TEXT',
            text: 'header text',
          },
          language: 'pt_BR',
        },
      });
    });

    it('should call callErrorModal on errorCreateTemplateTranslation', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper, state, getters } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.currentFormMode = 'create';
      state.createdTemplateData = template;
      getters.templateTranslationCurrentForm = jest.fn(() => {
        return template;
      });

      const spy = spyOn(wrapper.vm, 'callErrorModal');
      state.errorCreateTemplateTranslation = true;

      await wrapper.vm.executeSave();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        text: 'Could not create template translation, please try again later',
      });
    });

    it('should call router replace and set currentFormMode to edit on success', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper, state, getters } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.currentFormMode = 'create';
      state.createdTemplateData = template;
      getters.templateTranslationCurrentForm = jest.fn(() => {
        return template;
      });

      await wrapper.vm.executeSave();

      expect(wrapper.vm.$router.replace).toHaveBeenCalledTimes(1);
      expect(wrapper.vm.currentFormMode).toBe('edit');
    });

    it('should remove current creation tab from createdTabs and move into existingTabs on success', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper, state, getters } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.currentFormMode = 'create';
      state.createdTemplateData = template;
      getters.templateTranslationCurrentForm = jest.fn(() => {
        return template;
      });
      expect(wrapper.vm.createdTabs).toEqual(['New Language']);
      expect(wrapper.vm.existingTabs).toEqual([]);

      await wrapper.vm.executeSave();

      expect(wrapper.vm.createdTabs).toEqual([]);
      expect(wrapper.vm.existingTabs).toEqual(['New Language']);
    });

    it('should not remove current creation tab from createdTabs if tab does not exists at createdTabs', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper, state, getters } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.currentFormMode = 'create';
      state.createdTemplateData = template;
      getters.templateTranslationCurrentForm = jest.fn(() => {
        return template;
      });
      wrapper.vm.existingTabs = ['Portuguese (BR)'];
      wrapper.vm.currentTabIndex = 0;
      expect(wrapper.vm.createdTabs).toEqual(['New Language']);
      expect(wrapper.vm.existingTabs).toEqual(['Portuguese (BR)']);

      await wrapper.vm.executeSave();

      expect(wrapper.vm.createdTabs).toEqual(['New Language']);
      expect(wrapper.vm.existingTabs).toEqual(['Portuguese (BR)']);
    });

    it('should call updateTemplateTranslation', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
        message_template_id: '123',
      };
      const { wrapper, actions, state, getters } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.currentFormMode = 'create';
      state.createdTemplateData = template;
      getters.templateTranslationCurrentForm = jest.fn(() => {
        return template;
      });

      await wrapper.vm.executeSave();

      expect(actions.updateTemplateTranslation).toHaveBeenCalledTimes(1);
      expect(actions.updateTemplateTranslation).toHaveBeenCalledWith(expect.any(Object), {
        appUuid: '123',
        templateUuid: '456',
        payload: {
          body: {
            type: 'BODY',
            text: 'body text',
          },
          header: {
            header_type: 'TEXT',
            text: 'header text',
          },
          message_template_id: '123',
          language: 'pt_BR',
        },
      });
    });

    it('should call callErrorModal on errorCreateTemplateTranslation', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
        message_template_id: '123',
      };
      const { wrapper, state, getters } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.currentFormMode = 'edit';
      state.createdTemplateData = template;
      getters.templateTranslationCurrentForm = jest.fn(() => {
        return template;
      });

      const spy = spyOn(wrapper.vm, 'callErrorModal');
      state.errorUpdateTemplateTranslation = true;

      await wrapper.vm.executeSave();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        text: 'Could not update the template, please try again later.',
      });
    });
  });

  describe('buildPayload()', () => {
    it('should should return a valid payload', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: 'body text',
        language: 'pt_BR',
        message_template_id: '123',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      const payload = await wrapper.vm.buildPayload();

      expect(payload).toEqual({
        body: {
          type: 'BODY',
          text: 'body text',
        },
        header: {
          header_type: 'TEXT',
          text: 'header text',
        },
        message_template_id: '123',
        language: 'pt_BR',
      });
    });

    it('should call callErrorModal with unknown error', async () => {
      const template = {
        uuid: '456',
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      spyOn(wrapper.vm, 'validateForm').and.throwError('Unknown error');

      const payload = await wrapper.vm.buildPayload();

      expect(payload).toEqual(null);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ text: 'Unknown error occurred, please refresh the page' });
    });

    it('should call callErrorModal with validation error', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'header text' },
        body: '',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });
      const spy = spyOn(wrapper.vm, 'callErrorModal');

      const payload = await wrapper.vm.buildPayload();

      expect(payload).toEqual(null);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ text: 'Body cannot be empty' });
    });
  });

  describe('validateForm()', () => {
    it('should throw an error if header is invalid', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '   ' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).toThrow('Header cannot be empty');
    });

    it('should pass if header is an empty string and not return header in result', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).not.toThrow();
      const result = wrapper.vm.validateForm();
      expect(result).toEqual({
        body: {
          type: 'BODY',
          text: 'body text',
        },
      });
    });

    it('should pass if header is a valid string and return it in result', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: 'valid header' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).not.toThrow();
      const result = wrapper.vm.validateForm();
      expect(result).toEqual({
        header: {
          header_type: 'TEXT',
          text: 'valid header',
        },
        body: {
          type: 'BODY',
          text: 'body text',
        },
      });
    });

    it('should throw an error if body is invalid', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: '  ',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).toThrow('Body cannot be empty');
    });

    it('should throw an error if body is an empty string', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: '',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).toThrow('Body cannot be empty');
    });

    it('should pass if body is a valid string and return it in result', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).not.toThrow();
      const result = wrapper.vm.validateForm();
      expect(result).toEqual({
        body: {
          type: 'BODY',
          text: 'body text',
        },
      });
    });

    it('should throw an error if footer is invalid', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        footer: '   ',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).toThrow('Footer cannot be empty');
    });

    it('should pass if footer is an empty string and not return it in result', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        footer: '',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).not.toThrow();
      const result = wrapper.vm.validateForm();
      expect(result).toEqual({
        body: {
          type: 'BODY',
          text: 'body text',
        },
      });
    });

    it('should pass if footer is a valid string and return it in result', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        footer: 'footer text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).not.toThrow();
      const result = wrapper.vm.validateForm();
      expect(result).toEqual({
        body: {
          type: 'BODY',
          text: 'body text',
        },
        footer: {
          type: 'FOOTER',
          text: 'footer text',
        },
      });
    });

    it('should throw an error if buttons are invalid', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [{ button_type: 'QUICK_REPLY', text: '  ' }],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).toThrow('Button text cannot be empty');
    });

    it('should pass if buttons are valid and return it in result', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [{ button_type: 'QUICK_REPLY', text: 'button text' }],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateForm()).not.toThrow();
      const result = wrapper.vm.validateForm();
      expect(result).toEqual({
        body: {
          type: 'BODY',
          text: 'body text',
        },
        buttons: [
          {
            button_type: 'QUICK_REPLY',
            text: 'button text',
          },
        ],
      });
    });
  });

  describe('validateHeader', () => {
    it('should throw an error if header type is TEXT and text is just spaces', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '   ' },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateHeader()).toThrow('Header cannot be empty');
    });

    it('should throw an error if header type is TEXT and text greater than 60 characters', async () => {
      const template = {
        uuid: '456',
        header: {
          header_type: 'TEXT',
          text: 'Nam quis nulla. Integer malesuada. In in enim a arcu imperdi',
        },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateHeader()).toThrow(
        'Header cannot be greater than 60 characters',
      );
    });

    it('should return null if header type is TEXT and text is an empty string', async () => {
      const template = {
        uuid: '456',
        header: {
          header_type: 'TEXT',
          text: '',
        },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateHeader()).not.toThrow();
      const result = wrapper.vm.validateHeader();
      expect(result).toEqual(null);
    });

    it('should return header if header type is TEXT and text is valid', async () => {
      const template = {
        uuid: '456',
        header: {
          header_type: 'TEXT',
          text: 'valid header text',
        },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateHeader()).not.toThrow();
      const result = wrapper.vm.validateHeader();
      expect(result).toEqual({ header_type: 'TEXT', text: 'valid header text' });
    });

    it('should throw error if header type is MEDIA and mediaType is not defined', async () => {
      const template = {
        uuid: '456',
        header: {
          header_type: 'MEDIA',
          mediaType: undefined,
        },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateHeader()).toThrow('Invalid media type');
    });

    it('should throw error if header type is MEDIA and media sample is missing', async () => {
      const template = {
        uuid: '456',
        header: {
          header_type: 'MEDIA',
          mediaType: 'IMAGE',
        },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.sampleFileData = null;

      expect(() => wrapper.vm.validateHeader()).toThrow('Missing media example');
    });

    it('should return header if header type is MEDIA, mediaType is defined and media sample exists', async () => {
      const template = {
        uuid: '456',
        header: {
          header_type: 'MEDIA',
          mediaType: 'IMAGE',
        },
        body: 'body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.sampleFileData = 'file';

      expect(() => wrapper.vm.validateHeader()).not.toThrow();
      const result = wrapper.vm.validateHeader();
      expect(result).toEqual({ header_type: 'IMAGE', example: 'file', mediaType: null });
    });
  });

  describe('validateBody()', () => {
    it('should throw error if body is empty', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: '',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateBody()).toThrow('Body cannot be empty');
    });

    it('should throw error if body is just spaces', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: '   ',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateBody()).toThrow('Body cannot be empty');
    });

    it('should throw error if body is greater than 1024 characters', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'Nam quis nulla. Integer malesuada. In in enim a arcu imperdiet malesuada. Sed vel lectus. Donec odio urna, tempus molestie, porttitor ut, iaculis quis, sem. Phasellus rhoncus. Aenean id metus id velit ullamcorper pulvinar. Vestibulum fermentum tortor id mi. Pellentesque ipsum. Nulla non arcu lacinia neque faucibus fringilla. Nulla non lectus sed nisl molestie malesuada. Proin in tellus sit amet nibh dignissim sagittis. Vivamus luctus egestas leo. Maecenas sollicitudin. Nullam rhoncus aliquam metus. Etiam egestas wisi a erat. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nullam feugiat, turpis at pulvinar vulputate, erat libero tristique tellus, nec bibendum odio risus sit amet ante. Aliquam erat volutpat. Nunc auctor. Mauris pretium quam et urna. Fusce nibh. Duis risus. Curabitur sagittis hendrerit ante. Aliquam erat volutpat. Vestibulum erat nulla, ullamcorper nec, rutrum non, nonummy ac, erat. Duis condimentum augue id magna semper rutrum. Nullam justo enim, consectetuer nec, ullamcorper ac, vet',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateBody()).toThrow(
        'Body cannot be greater than 1024 characters',
      );
    });

    it('should return body if valid', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'valid body text',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateBody()).not.toThrow();
      const result = wrapper.vm.validateBody();
      expect(result).toEqual({ type: 'BODY', text: 'valid body text' });
    });

    it('should throw error if body is missing all variables', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body with 2 variables {{1}} {{2}}',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.sampleVariablesData = [];

      expect(() => wrapper.vm.validateBody()).toThrow('Missing variables example');
    });

    it('should throw error if body is missing one or more variables', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body with 2 variables {{1}} {{2}}',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.sampleVariablesData = ['first'];

      expect(() => wrapper.vm.validateBody()).toThrow('Missing variables example');
    });

    it('should return body with example if variables data is correct', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body with 2 variables {{1}} {{2}}',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      wrapper.vm.sampleVariablesData = ['first', 'second'];

      expect(() => wrapper.vm.validateBody()).not.toThrow();
      const result = wrapper.vm.validateBody();
      expect(result).toEqual({
        type: 'BODY',
        text: 'body with 2 variables {{1}} {{2}}',
        example: { body_text: [['first', 'second']] },
      });
    });
  });

  describe('validateFooter()', () => {
    it('should throw error if footer is just spaces', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        footer: '  ',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateFooter()).toThrow('Footer cannot be empty');
    });

    it('should throw error if footer longer than 60 characters', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        footer: 'Nam quis nulla. Integer malesuada. In in enim a arcu imperdi',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateFooter()).toThrow(
        'Footer cannot be greater than 60 characters',
      );
    });

    it('should return null if footer is empty', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        footer: '',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateFooter()).not.toThrow();
      const result = wrapper.vm.validateFooter();
      expect(result).toEqual(null);
    });

    it('should return footer if valid', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        footer: 'valid footer',
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateFooter()).not.toThrow();
      const result = wrapper.vm.validateFooter();
      expect(result).toEqual({ type: 'FOOTER', text: 'valid footer' });
    });
  });

  describe('validateButtons()', () => {
    it('should return null if buttons are empty', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).not.toThrow();
      const result = wrapper.vm.validateButtons();
      expect(result).toEqual(null);
    });

    it('should throw error if button text is empty', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [{ button_type: 'QUICK_REPLY', text: '' }],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).toThrow('Button text cannot be empty');
    });

    it('should throw error if button text is just spaces', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [{ button_type: 'QUICK_REPLY', text: '  ' }],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).toThrow('Button text cannot be empty');
    });

    it('should return valid button if buttons if type is QUICK_REPLY and text is defined', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [{ button_type: 'QUICK_REPLY', text: 'button text' }],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).not.toThrow();
      const result = wrapper.vm.validateButtons();
      expect(result).toEqual([{ button_type: 'QUICK_REPLY', text: 'button text' }]);
    });

    it('should throw error if button type is PHONE_NUMBER and phone_number is empty', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [
          {
            button_type: 'PHONE_NUMBER',
            text: 'button text',
            phone_number: '',
            country_code: 'BR',
            country_calling_code: '55',
          },
        ],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).toThrow('Phone number cannot be empty');
    });

    it('should throw error if button type is PHONE_NUMBER and phone_number is just spaces', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [
          {
            button_type: 'PHONE_NUMBER',
            text: 'button text',
            phone_number: '  ',
            country_code: 'BR',
            country_calling_code: '55',
          },
        ],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).toThrow('Phone number cannot be empty');
    });

    it('should throw error if button type is PHONE_NUMBER and country_code is empty', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [
          {
            button_type: 'PHONE_NUMBER',
            text: 'button text',
            phone_number: '99999-9999',
            country_code: '',
            country_calling_code: '55',
          },
        ],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).toThrow('Phone country code cannot be empty');
    });

    it('should throw error if button type is PHONE_NUMBER and country_code is just spaces', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [
          {
            button_type: 'PHONE_NUMBER',
            text: 'button text',
            phone_number: '99999-9999',
            country_code: '   ',
            country_calling_code: '55',
          },
        ],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).toThrow('Phone country code cannot be empty');
    });

    it('should return valid button if buttons if type is PHONE_NUMBER, text is defined, phone_number is defined and country_code is defined and country_code should be country_calling_code in result', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [
          {
            button_type: 'PHONE_NUMBER',
            text: 'button text',
            phone_number: '99999-9999',
            country_code: 'BR',
            country_calling_code: '55',
          },
        ],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).not.toThrow();
      const result = wrapper.vm.validateButtons();
      expect(result).toEqual([
        {
          button_type: 'PHONE_NUMBER',
          text: 'button text',
          phone_number: '99999-9999',
          country_code: '55',
          country_calling_code: '55',
        },
      ]);
    });

    it('should throw error if button type is URL and url is empty', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [
          {
            button_type: 'URL',
            text: 'button text',
            url: '',
          },
        ],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).toThrow('URL cannot be empty');
    });

    it('should throw error if button type is URL and url is just spaces', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [
          {
            button_type: 'URL',
            text: 'button text',
            url: '   ',
          },
        ],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).toThrow('Invalid button URL');
    });

    it('should return valid button if buttons if type is URL, text is defined and url is defined', async () => {
      const template = {
        uuid: '456',
        header: { header_type: 'TEXT', text: '' },
        body: 'body text',
        buttons: [
          {
            button_type: 'URL',
            text: 'button text',
            url: 'https://weni.ai',
          },
        ],
        language: 'pt_BR',
      };
      const { wrapper } = await mountComponent({
        template: {
          name: '',
          category: '',
          translations: [template],
        },
      });

      expect(() => wrapper.vm.validateButtons()).not.toThrow();
      const result = wrapper.vm.validateButtons();
      expect(result).toEqual([
        {
          button_type: 'URL',
          text: 'button text',
          url: 'https://weni.ai',
        },
      ]);
    });
  });
});
