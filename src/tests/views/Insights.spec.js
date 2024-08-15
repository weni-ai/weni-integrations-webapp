import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Insights from '../../views/Insights/index.vue';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import i18n from '@/utils/plugins/i18n';
describe('Insights', () => {
  let wrapper;
  beforeEach(async () => {
    Insights.methods.fetchTemplates = vi.fn();
    Insights.methods.fetchTemplateAnalytics = vi.fn();
    wrapper = mount(Insights, {
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

  describe('mounted', () => {
    it('should call fetchTemplates', async () => {
      expect(Insights.methods.fetchTemplates).toHaveBeenCalledTimes(1);
    });
    it('should call fetchTemplateAnalytics', async () => {
      expect(Insights.methods.fetchTemplateAnalytics).toHaveBeenCalledTimes(1);
    });
  });
});
