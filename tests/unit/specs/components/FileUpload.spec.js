import { shallowMount, createLocalVue } from '@vue/test-utils';
import FileUpload from '@/components/FileUpload';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

const VueDropzoneStub = {
  render: () => {},
  methods: {
    removeAllFiles: () => {},
    addFile: () => {},
    getAcceptedFiles: () => {
      return [];
    },
  },
};

describe('FileUpload.vue', () => {
  let wrapper, file;
  beforeEach(() => {
    file = {
      size: 30000,
      type: 'image/png',
    };
    wrapper = shallowMount(FileUpload, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicIconSvg: true,
        VueDropzone: VueDropzoneStub,
      },
      propsData: {
        type: 'image',
        formatsLabel: '.png, .jpg, .svg',
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('emitFile()', () => {
    it('should emit a new file', () => {
      wrapper.vm.emitFile('file');

      expect(wrapper.emitted('newFile')).toBeTruthy();
      expect(wrapper.emitted('newFile')[0]).toEqual(['file']);
    });
  });

  describe('allowedTypes()', () => {
    it('should return images types', () => {
      const types = wrapper.vm.allowedTypes();

      expect(types).toEqual('image/png,image/jpeg,image/svg+xml');
    });

    it('should return style type', async () => {
      await wrapper.setProps({ type: 'style' });
      const types = wrapper.vm.allowedTypes();

      expect(types).toEqual('text/css');
    });
  });

  describe('handleExceeded', () => {
    it('should call dropzone removeAllFiles', () => {
      const spy = spyOn(wrapper.vm.$refs.myDropzone, 'removeAllFiles');
      wrapper.vm.handleExceeded();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call addFile if file is provided', () => {
      const spy = spyOn(wrapper.vm.$refs.myDropzone, 'addFile');
      wrapper.vm.handleExceeded(file);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(file);
    });
  });

  describe('validateFile()', () => {
    it('should return false if type is not provided', () => {
      file.type = '';
      const valid = wrapper.vm.validateFile(file);

      expect(valid).toBeFalsy();
    });

    it('should return false if type is not a valid one', () => {
      file.type = 'weird/type';
      const valid = wrapper.vm.validateFile(file);

      expect(valid).toBeFalsy();
    });

    it('should return false if size exceeds the limit', () => {
      file.size = 99999999;
      const valid = wrapper.vm.validateFile(file);

      expect(valid).toBeFalsy();
    });

    it('should return true if file is valid from dropzone', () => {
      spyOn(wrapper.vm.$refs.myDropzone, 'getAcceptedFiles').and.returnValue([file]);
      const valid = wrapper.vm.validateFile(file);

      expect(valid).toBeTruthy();
    });
  });

  describe('handleAdd()', () => {
    let files = [];

    describe('multiple files', () => {
      beforeEach(() => {
        jest.useFakeTimers();
        files = ['invalidFile', 'validFile'];
      });

      it('should call validateFile', () => {
        const spy = spyOn(wrapper.vm, 'validateFile');
        wrapper.vm.handleAdd(files);

        expect(spy).toHaveBeenCalledTimes(files.length);
      });

      it('should emit valid files', () => {
        spyOn(wrapper.vm, 'validateFile').and.returnValues(false, true);
        const spy = spyOn(wrapper.vm, 'emitFile');
        wrapper.vm.handleAdd(files);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(files[1]);
      });

      it('should handleExceed with valid files', () => {
        spyOn(wrapper.vm, 'validateFile').and.returnValues(false, true);
        const spy = spyOn(wrapper.vm, 'handleExceeded');
        wrapper.vm.handleAdd(files);

        expect(spy).not.toHaveBeenCalled();
        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(files[1]);
      });

      it('should set show to error if all files are invalid', () => {
        spyOn(wrapper.vm, 'validateFile').and.returnValues(false, false);
        expect(wrapper.vm.show).toEqual('drop');
        wrapper.vm.handleAdd(files);

        expect(wrapper.vm.show).toEqual('error');
      });

      it('should handleExceed with invalid files', () => {
        spyOn(wrapper.vm, 'validateFile').and.returnValues(false, false);
        const spy = spyOn(wrapper.vm, 'handleExceeded');
        wrapper.vm.handleAdd(files);

        expect(spy).not.toHaveBeenCalled();
        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith();
      });
    });

    describe('single file', () => {
      beforeEach(() => {
        jest.useFakeTimers();
        files = ['file'];
      });
      it('should call validateFile', () => {
        const spy = spyOn(wrapper.vm, 'validateFile');
        wrapper.vm.handleAdd(files);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should set dropzone template to error', () => {
        spyOn(wrapper.vm, 'validateFile').and.returnValue(false);
        expect(wrapper.vm.show).toEqual('drop');
        wrapper.vm.handleAdd(files);

        expect(wrapper.vm.show).toEqual('error');
      });

      it('should remove all files from dropzone on error', () => {
        spyOn(wrapper.vm, 'validateFile').and.returnValue(false);
        const spy = spyOn(wrapper.vm.$refs.myDropzone, 'removeAllFiles');
        wrapper.vm.handleAdd(files);

        jest.runAllTimers();

        expect(spy).toHaveBeenCalledTimes(1);
      });

      it('should call emitFile', () => {
        spyOn(wrapper.vm, 'validateFile').and.returnValue(true);
        const spy = spyOn(wrapper.vm, 'emitFile');
        wrapper.vm.handleAdd(files);

        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith(files[0]);
      });
    });
  });
});
