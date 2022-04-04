import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import ConversationsTable from '@/components/config/channels/whatsapp/ConversationsTable.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(VueRouter);
describe('whatsapp/ConversationsTable.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(ConversationsTable, {
      localVue,
      i18n,
      propsData: {
        userMessages: 10,
        businessMessages: 20,
        total: 30,
      },
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicTable: true,
        UnnnicTableRow: true,
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
