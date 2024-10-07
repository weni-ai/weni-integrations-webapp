import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import OtherApps from '../../views/OtherApps/index.vue';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import i18n from '@/utils/plugins/i18n';
describe('OtherApps', () => {
  let wrapper;
  beforeEach(async () => {
    OtherApps.methods.fetchTemplates = vi.fn();
    OtherApps.methods.fetchTemplateAnalytics = vi.fn();
    wrapper = mount(OtherApps, {
      global: {
        plugins: [createTestingPinia(), i18n],
      },
      mocks: {
        $route: {
          hash: '#test',
        },
      },
    });
    await wrapper.vm.$nextTick();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });
});
