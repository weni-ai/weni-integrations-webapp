import TemplateDetails from '../../../../src/views/TemplateDetails/index.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('TemplateDetails', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(TemplateDetails, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
