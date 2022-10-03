import { unnnicCallAlert as mockUnnnicCallAlert } from '@weni/unnnic-system';

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import { toBase64 as mockToBase64 } from '@/utils/files';
jest.mock('@/utils/files', () => ({
  ...jest.requireActual('@/utils/files'),
  toBase64: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import TranslationSampleForm from '@/components/whatsAppTemplates/TranslationSampleForm.vue';
import { unnnicModal } from '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = ({
  hasMedia = false,
  hasVariables = false,
  header = {
    header_type: 'TEXT',
  },
  body = '',
} = {}) => {
  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return { header, body };
    }),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        getters,
      },
    },
  });

  const wrapper = mount(TranslationSampleForm, {
    localVue,
    store,
    i18n,
    propsData: {
      hasMedia,
      hasVariables,
    },
    stubs: {
      unnnicModal,
    },
  });

  return { wrapper, getters };
};

describe('components/whatsAppTemplates/TranslationSampleForm.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('variableCount', () => {
    it('should return zero as variable count', () => {
      const body = 'No Variables';
      const { wrapper } = mountComponent({ body });

      expect(wrapper.vm.variableCount).toEqual(0);
    });

    it('should return correct variable count', () => {
      const body = 'Variable {{1}}';
      const { wrapper } = mountComponent({ body });

      expect(wrapper.vm.variableCount).toEqual(1);
    });
  });

  describe('supportedFormats', () => {
    it('should return valid IMAGE formats', () => {
      const header = { header_type: 'MEDIA', mediaType: 'IMAGE' };
      const { wrapper } = mountComponent({ header });

      expect(wrapper.vm.supportedFormats).toEqual('.png,.jpg,.jpeg');
    });

    it('should return valid VIDEO formats', () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      expect(wrapper.vm.supportedFormats).toEqual('.mp4');
    });

    it('should return valid DOCUMENT formats', () => {
      const header = { header_type: 'MEDIA', mediaType: 'DOCUMENT' };
      const { wrapper } = mountComponent({ header });

      expect(wrapper.vm.supportedFormats).toEqual('.pdf');
    });

    it('should return empty string if not valid', () => {
      const header = { header_type: 'MEDIA', mediaType: 'UNKNOWN' };
      const { wrapper } = mountComponent({ header });

      expect(wrapper.vm.supportedFormats).toEqual('');
    });
  });

  describe('closeSampleModal()', () => {
    it('should emit close-modal', async () => {
      const { wrapper } = mountComponent();

      let event = wrapper.emitted('close-modal');
      expect(event).toBeFalsy();

      wrapper.vm.closeSampleModal();

      event = wrapper.emitted('close-modal');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
    });
  });

  describe('handleVariableChange()', () => {
    it('should update variablesData', async () => {
      const { wrapper } = mountComponent();

      await wrapper.setData({ variablesData: ['data1', 'data2'] });

      wrapper.vm.handleVariableChange(1, 'new data 2');

      expect(wrapper.vm.variablesData).toEqual(['data1', 'new data 2']);
    });

    it('should update formatted body', () => {
      const body = 'Variable {{1}} {{2}}';
      const { wrapper } = mountComponent({ body });

      wrapper.vm.handleVariableChange(1, 'new text');

      expect(wrapper.vm.formattedBody).toEqual('Variable {{1}} new text');
    });
  });

  describe('validFormat()', () => {
    it('should return false if file type is incompatible with supported type', () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const files = [{ type: 'pdf' }];

      expect(wrapper.vm.validFormat(files)).toBeFalsy();
    });

    it('should return true if file type is compatible with supported type', () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const files = [{ type: 'mp4' }];

      expect(wrapper.vm.validFormat(files)).toBeTruthy();
    });
  });

  describe('validSize()', () => {
    it('should return false if file size is greater than 10Mb', () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const files = [{ size: 11000000 }];

      expect(wrapper.vm.validSize(files)).toBeFalsy();
    });

    it('should return true if file size lower than 10Mb', () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const files = [{ size: 9000000 }];

      expect(wrapper.vm.validSize(files)).toBeTruthy();
    });
  });

  describe('validateFiles()', () => {
    it('should return false if there are no files', () => {
      const { wrapper } = mountComponent();

      const files = [];

      expect(wrapper.vm.validateFiles(files)).toBeFalsy();
    });

    it('should return false if there more than one file', () => {
      const { wrapper } = mountComponent();

      const files = [{}, {}];

      expect(wrapper.vm.validateFiles(files)).toBeFalsy();
    });

    it('should return false if file type is not valid', () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const files = [{ type: 'pdf' }];

      expect(wrapper.vm.validateFiles(files)).toBeFalsy();
    });

    it('should return false if file size is not valid', () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const files = [{ type: 'mp4', size: 11000000 }];

      expect(wrapper.vm.validateFiles(files)).toBeFalsy();
    });

    it('should return true if file size and type are valid', () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const files = [{ type: 'mp4', size: 9000000 }];

      expect(wrapper.vm.validateFiles(files)).toBeTruthy();
    });
  });

  describe('handleFileChange()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should set file as event data if valid', async () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const file = { type: 'mp4', size: 9000000 };

      const event = {
        target: {
          files: [file],
        },
      };

      expect(wrapper.vm.file).toBe(null);
      await wrapper.vm.handleFileChange(event);
      expect(wrapper.vm.file).toEqual(file);
    });

    it('should not set file as event data if not valid', async () => {
      const header = { header_type: 'MEDIA', mediaType: 'VIDEO' };
      const { wrapper } = mountComponent({ header });

      const file = { type: 'pdf', size: 9000000 };

      const event = {
        target: {
          files: [file],
        },
      };

      expect(wrapper.vm.file).toBe(null);
      await wrapper.vm.handleFileChange(event);
      expect(wrapper.vm.file).toBe(null);
    });

    it('should set fileToPreview as base 64 result if mediaType is IMAGE', async () => {
      const header = { header_type: 'MEDIA', mediaType: 'IMAGE' };
      const { wrapper } = mountComponent({
        hasMedia: true,
        header,
      });
      mockToBase64.mockImplementationOnce(() => Promise.resolve('b64photo'));

      const file = { type: 'png', size: 900 };

      const event = {
        target: {
          files: [file],
        },
      };

      expect(wrapper.vm.fileToPreview).toBe(null);
      await wrapper.vm.handleFileChange(event);
      expect(wrapper.vm.fileToPreview).toBe('b64photo');
    });
  });

  describe('saveSample()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call error modal if variable is missing', async () => {
      const { wrapper } = mountComponent({
        hasVariables: true,
        body: 'Has 2 variables {{1}} {{2}}',
      });
      const spy = spyOn(wrapper.vm, 'callErrorModal');

      wrapper.vm.variablesData = ['first'];

      await wrapper.vm.saveSample();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ text: 'Missing variable example' });
    });

    it('should call error modal if media is missing', async () => {
      const { wrapper } = mountComponent({
        hasMedia: true,
        body: 'Simple body',
      });
      const spy = spyOn(wrapper.vm, 'callErrorModal');

      wrapper.vm.file = null;

      await wrapper.vm.saveSample();

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ text: 'Missing media example' });
    });

    it('should be successfull if variables are provided', async () => {
      const { wrapper } = mountComponent({
        hasVariables: true,
        body: 'Has 2 variables {{1}} {{2}}',
      });
      const spy = spyOn(wrapper.vm, 'callErrorModal');

      wrapper.vm.variablesData = ['first', 'second'];

      await wrapper.vm.saveSample();

      expect(spy).not.toHaveBeenCalled();

      let event = wrapper.emitted('sample-submission');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          variables: ['first', 'second'],
          headerFile: undefined,
        },
      ]);

      event = wrapper.emitted('close-modal');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
    });

    it('should be successfull if meida is provided', async () => {
      const { wrapper } = mountComponent({
        hasMedia: true,
        body: 'Simple body',
      });
      const spy = spyOn(wrapper.vm, 'callErrorModal');

      mockToBase64.mockImplementationOnce(() => Promise.resolve('b64photo'));
      wrapper.vm.file = true;

      await wrapper.vm.saveSample();

      expect(spy).not.toHaveBeenCalled();

      let event = wrapper.emitted('sample-submission');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          variables: [],
          headerFile: 'b64photo',
        },
      ]);

      event = wrapper.emitted('close-modal');

      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
    });
  });

  describe('callErrorModal', () => {
    const { wrapper } = mountComponent();
    it('should call unnnicCallAlert', () => {
      expect(mockUnnnicCallAlert).not.toHaveBeenCalled();
      wrapper.vm.callErrorModal({ text: 'error text' });
      expect(mockUnnnicCallAlert).toHaveBeenCalledTimes(1);
      expect(mockUnnnicCallAlert).toHaveBeenCalledWith(
        expect.objectContaining({
          props: {
            text: 'error text',
            title: expect.any(String),
            icon: expect.any(String),
            scheme: expect.any(String),
            position: expect.any(String),
            closeText: expect.any(String),
          },
          seconds: expect.any(Number),
        }),
      );
    });
  });
});
