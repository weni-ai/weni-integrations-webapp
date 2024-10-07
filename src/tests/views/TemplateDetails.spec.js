import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import TemplateDetails from '../../views/TemplateDetails/index.vue';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import i18n from '@/utils/plugins/i18n';
import { insights_store } from '@/stores/modules/insights.store';
describe('TemplateDetails', () => {
  let wrapper;
  beforeEach(async () => {
    wrapper = mount(TemplateDetails, {
      global: {
        plugins: [createTestingPinia(), i18n],
      },
    });
    await wrapper.vm.$nextTick();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should redirectEdit', () => {
    const pushMock = vi.fn();
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    });

    const wrapper = mount(TemplateDetails, {
      global: {
        plugins: [pinia, i18n],
        mocks: {
          $router: {
            push: pushMock,
          },
        },
      },
    });
    const store = insights_store();
    store.appUuid = '1234';
    store.selectedTemplate = { uuid: '5678' };
    wrapper.vm.redirectEdit();
    expect(pushMock).toHaveBeenCalledWith({
      path: '/apps/my/wpp-cloud/1234/templates/edit/5678',
    });
  });
});
