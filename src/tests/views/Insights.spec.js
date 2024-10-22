import { mount } from '@vue/test-utils';
import Insights from '@/views/Insights/index.vue';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import unnnic from '@weni/unnnic-system';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { insights_store } from '@/stores/modules/insights.store';

describe('Insights.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = mount(Insights, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          unnnic,
        },
      },
    });
  });

  it('should toggle the modal when the button is clicked', async () => {
    expect(wrapper.vm.showModal).toBe(false);
    const button = wrapper.findComponent({ ref: 'wpp_insights__button__close' });
    expect(button.exists()).toBe(true);
    await button.trigger('click');

    expect(wrapper.vm.showModal).toBe(true);

    await button.trigger('click');

    expect(wrapper.vm.showModal).toBe(false);
  });

  it('should call activeTemplate and show error alert if it fails', async () => {
    const setActiveProjectSpy = vi
      .spyOn(wrapper.vm, 'setActiveProject')
      .mockRejectedValue(new Error('Error'));
    const unnnicCallAlertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');

    await wrapper.setData({ showModal: true });
    const button = wrapper.findComponent({ ref: 'wpp_insights__button__active' });
    expect(button.exists()).toBe(true);
    await button.trigger('click');

    expect(setActiveProjectSpy).toHaveBeenCalledWith({ app_uuid: null });

    expect(unnnicCallAlertSpy).toHaveBeenCalledWith({
      props: {
        text: 'Unable to activate insights at this time, please try again later.',
        type: 'error',
      },
      seconds: 6,
    });
  });

  it('should set the period and call fetchTemplateAnalytics on date change', async () => {
    const fetchTemplateAnalyticsSpy = vi
      .spyOn(wrapper.vm, 'fetchTemplateAnalytics')
      .mockImplementation(() => {});

    const newPeriod = { start: '01-01-2024', end: '01-07-2024' };
    await wrapper.vm.setPeriod(newPeriod);

    expect(wrapper.vm.period).toEqual(newPeriod);

    expect(fetchTemplateAnalyticsSpy).toHaveBeenCalled();
  });

  it('should render the chart for sent messages if data is available', async () => {
    await wrapper.setData({
      templateAnalytics: {
        data: [
          {
            template_name: 'Template 1',
            dates: [
              { start: '2024-01-01', sent: 100 },
              { start: '2024-01-02', sent: 200 },
            ],
          },
        ],
      },
    });
    const store = insights_store();
    store.isActive = true;
    await wrapper.vm.$nextTick();

    const chart = wrapper.findComponent({ ref: 'sent' });
    expect(chart.exists()).toBe(true);
    expect(chart.props('title')).toBe('Sent messages');
  });
});
