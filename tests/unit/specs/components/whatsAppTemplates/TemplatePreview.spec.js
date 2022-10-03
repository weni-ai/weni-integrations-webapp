import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import TemplatePreview from '@/components/whatsAppTemplates/TemplatePreview.vue';
import '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = ({
  hasForm = true,
  loadingFetchWhatsAppTemplate = false,
  templateHeader = {},
  templateBody = null,
  templateFooter = null,
  templateButtons = [],
} = {}) => {
  const state = {
    loadingFetchWhatsAppTemplate,
  };

  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return hasForm
        ? {
            header: templateHeader,
            body: templateBody,
            footer: templateFooter,
            buttons: templateButtons,
          }
        : null;
    }),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        state,
        getters,
      },
    },
  });

  const wrapper = mount(TemplatePreview, {
    localVue,
    store,
    i18n,
  });

  return { wrapper, getters };
};

describe('components/whatsAppTemplates/FormHeader.vue', () => {
  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('header', () => {
    it('should not load header currentForm is not provided', async () => {
      const { wrapper } = mountComponent({ hasForm: false });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(false);
    });

    it('should not load header if not provided', async () => {
      const { wrapper } = mountComponent({ templateHeader: null });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(false);
    });

    it('should load text header if header_type === TEXT and text is provided', async () => {
      const { wrapper } = mountComponent({
        templateHeader: { header_type: 'TEXT', text: 'header text' },
      });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(true);
      expect(headerComponentMedia.exists()).toBe(false);
    });

    it('should not load text header if header_type === TEXT and text is undefined', async () => {
      const { wrapper } = mountComponent({
        templateHeader: { header_type: 'TEXT', text: undefined },
      });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(false);
    });

    it('should load media header header_type === MEDIA and mediaType is provided', async () => {
      const { wrapper } = mountComponent({
        templateHeader: { header_type: 'MEDIA', mediaType: 'IMAGE' },
      });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(true);
    });

    it('should not load media header header_type === MEDIA and mediaType is undefined', async () => {
      const { wrapper } = mountComponent({
        templateHeader: { header_type: 'MEDIA', mediaType: undefined },
      });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(false);
    });

    it('should load media header with IMAGE icon if header_type === MEDIA and mediaType === IMAGE', async () => {
      const { wrapper } = mountComponent({
        templateHeader: { header_type: 'MEDIA', mediaType: 'IMAGE' },
      });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(true);

      expect(wrapper.vm.headerIcon).toEqual('common-file-horizontal-image-1');
    });

    it('should load media header with VIDEO icon if header_type === MEDIA and mediaType === VIDEO', async () => {
      const { wrapper } = mountComponent({
        templateHeader: { header_type: 'MEDIA', mediaType: 'VIDEO' },
      });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(true);

      expect(wrapper.vm.headerIcon).toEqual('button-play-1');
    });

    it('should load media header with DOCUMENT icon if header_type === MEDIA and mediaType === DOCUMENT', async () => {
      const { wrapper } = mountComponent({
        templateHeader: { header_type: 'MEDIA', mediaType: 'DOCUMENT' },
      });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(true);

      expect(wrapper.vm.headerIcon).toEqual('text-justified');
    });

    it('should load media header with DOCUMENT icon if header_type === MEDIA and mediaType === unknown', async () => {
      const { wrapper } = mountComponent({
        templateHeader: { header_type: 'MEDIA', mediaType: 'anything' },
      });

      const headerComponentText = wrapper.find('.template-preview__content__header');
      const headerComponentMedia = wrapper.find('.template-preview__content__header__icon-wrapper');

      expect(headerComponentText.exists()).toBe(false);
      expect(headerComponentMedia.exists()).toBe(true);

      expect(wrapper.vm.headerIcon).toEqual('text-justified');
    });
  });

  describe('body', () => {
    it('should not load body if currentForm is not provided', async () => {
      const { wrapper } = mountComponent({ hasForm: false });

      const bodyComponent = wrapper.find('.template-preview__content__body');

      expect(bodyComponent.exists()).toBe(false);
    });

    it('should not load body if form body is not defined', async () => {
      const { wrapper } = mountComponent({ templateBody: undefined });

      const bodyComponent = wrapper.find('.template-preview__content__body');

      expect(bodyComponent.exists()).toBe(false);
    });

    it('should load body if form body is provided', async () => {
      const { wrapper } = mountComponent({ templateBody: 'body text' });

      const bodyComponent = wrapper.find('.template-preview__content__body');

      expect(bodyComponent.exists()).toBe(true);
    });
  });

  describe('footer', () => {
    it('should not load footer if currentForm is not provided', async () => {
      const { wrapper } = mountComponent({ hasForm: false });

      const footerComponent = wrapper.find('.template-preview__content__footer');

      expect(footerComponent.exists()).toBe(false);
    });

    it('should not load footer if form footer is not defined', async () => {
      const { wrapper } = mountComponent({ templateFooter: undefined });

      const footerComponent = wrapper.find('.template-preview__content__footer');

      expect(footerComponent.exists()).toBe(false);
    });

    it('should load footer if form footer is provided', async () => {
      const { wrapper } = mountComponent({ templateFooter: 'footer text' });

      const footerComponent = wrapper.find('.template-preview__content__footer');

      expect(footerComponent.exists()).toBe(true);
    });
  });

  describe('buttons', () => {
    it('should not load buttons if currentForm is not provided', async () => {
      const { wrapper } = mountComponent({ hasForm: false });

      const actionButtonsWrapper = wrapper.find('.template-preview__action-buttons');
      const repliesButtonsWrapper = wrapper.find('.template-preview__buttons');

      expect(actionButtonsWrapper.exists()).toBe(false);
      expect(repliesButtonsWrapper.exists()).toBe(false);
    });

    it('should not load buttons if buttons are not defined', async () => {
      const { wrapper } = mountComponent({ templateButtons: undefined });

      const actionButtonsWrapper = wrapper.find('.template-preview__action-buttons');
      const repliesButtonsWrapper = wrapper.find('.template-preview__buttons');

      expect(actionButtonsWrapper.exists()).toBe(false);
      expect(repliesButtonsWrapper.exists()).toBe(false);
    });

    describe('should load buttons if buttons are provided', () => {
      describe('replies type', () => {
        it('should load replies if button is QUICK_REPLY', async () => {
          const { wrapper } = mountComponent({
            templateButtons: [{ button_type: 'QUICK_REPLY' }],
          });

          const actionButtonsComponent = wrapper.find('.template-preview__action-buttons__actions');
          const repliesButtonsComponent = wrapper.find('.template-preview__buttons__replies');

          expect(actionButtonsComponent.exists()).toBe(false);
          expect(repliesButtonsComponent.exists()).toBe(true);
        });
      });

      describe('action type', () => {
        it('should load actions if button is PHONE_NUMBER', async () => {
          const { wrapper } = mountComponent({
            templateButtons: [{ button_type: 'PHONE_NUMBER' }],
          });

          const actionButtonsComponent = wrapper.find('.template-preview__action-buttons__actions');
          const repliesButtonsComponent = wrapper.find('.template-preview__buttons__replies');

          expect(actionButtonsComponent.exists()).toBe(true);
          expect(repliesButtonsComponent.exists()).toBe(false);
        });

        it('should load actions if button is URL', async () => {
          const { wrapper } = mountComponent({
            templateButtons: [{ button_type: 'URL' }],
          });

          const actionButtonsComponent = wrapper.find('.template-preview__action-buttons__actions');
          const repliesButtonsComponent = wrapper.find('.template-preview__buttons__replies');

          expect(actionButtonsComponent.exists()).toBe(true);
          expect(repliesButtonsComponent.exists()).toBe(false);
        });
      });
    });
  });
});
