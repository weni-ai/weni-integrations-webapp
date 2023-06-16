import { mount, createLocalVue } from '@vue/test-utils';
import TableSort from '@/components/whatsAppTemplates/TableSort.vue';
import '@weni/unnnic-system';

const localVue = createLocalVue();

const mountComponent = ({ sortDirection = 'NONE' } = {}) => {
  const wrapper = mount(TableSort, {
    localVue,
    propsData: {
      sortDirection,
    },
  });

  return { wrapper };
};

describe('components/whatsAppTemplates/TableSort.vue', () => {
  it('should be rendered properly with the default icon and emit accordingly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();

    wrapper.find('.table-sort__icon').trigger('click');

    expect(wrapper.emitted().sort).toBeTruthy();
    expect(wrapper.emitted().sort[0]).toEqual(['DESC']);
  });

  it('should be rendered properly with the asc icon  and emit accordingly', () => {
    const { wrapper } = mountComponent({ sortDirection: 'ASC' });
    expect(wrapper).toMatchSnapshot();

    wrapper.find('.table-sort__icon').trigger('click');

    expect(wrapper.emitted().sort).toBeTruthy();
    expect(wrapper.emitted().sort[0]).toEqual(['NONE']);
  });

  it('should be rendered properly with the desc icon  and emit accordingly', () => {
    const { wrapper } = mountComponent({ sortDirection: 'DESC' });
    expect(wrapper).toMatchSnapshot();

    wrapper.find('.table-sort__icon').trigger('click');

    expect(wrapper.emitted().sort).toBeTruthy();
    expect(wrapper.emitted().sort[0]).toEqual(['ASC']);
  });
});
