import TableHeaderLoading from '@/components/whatsAppTemplates/loadings/TableHeaderLoading.vue';
import { mount, createLocalVue } from '@vue/test-utils';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();

describe('TableHeaderLoading', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(TableHeaderLoading, {
      localVue,
      i18n,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicSkeletonLoading: true,
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
