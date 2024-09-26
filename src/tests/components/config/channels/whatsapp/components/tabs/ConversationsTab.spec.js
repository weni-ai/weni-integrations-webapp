import { mount } from '@vue/test-utils';
import ConversationsTab from '@/components/config/channels/whatsapp/components/tabs/ConversationsTab.vue';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import unnnic from '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { describe, it, beforeEach, expect, vi } from 'vitest';

describe('ConversationsTab', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    // Mount the component
    wrapper = mount(ConversationsTab, {
      props: {
        app: { code: 'app_code', uuid: 'app_uuid' },
      },
      global: {
        plugins: [i18n, UnnnicSystem, pinia],
        mocks: {
          $t: (key) => key,
          $router: { replace: vi.fn() },
          unnnic,
        },
      },
    });
  });

  it('renders the filter label correctly', () => {
    expect(wrapper.find('.conversations__content__label').text()).toBe('Filter by');
  });

  it('displays the conversations count labels correctly', () => {
    const labels = wrapper.findAll('.conversations__content__label');
    expect(labels[0].text()).toBe('Filter by');
    expect(labels[1].text()).toBe('Number of conversations');
  });

  it('calls requestReport when button is clicked', async () => {
    const requestReportSpy = vi.spyOn(wrapper.vm, 'requestReport');
    const button = wrapper.findComponent({ ref: 'reportButton' });
    expect(button.exists()).toBe(true);
    wrapper.vm.startDate = '2024-01-01';
    wrapper.vm.endDate = '2024-01-04';
    await wrapper.vm.$nextTick();

    expect(button.props().disabled).toBe(false);
    await button.trigger('click');
    expect(requestReportSpy).toHaveBeenCalled();
  });

  // it('navigates to insights when insights button is clicked', async () => {
  //   const spy = vi.spyOn(wrapper.vm, 'navigateToInsights');
  //   const insightsButton = wrapper.findComponent({ ref: 'insightsButton' });
  //   expect(insightsButton.exists()).toBe(true);
  //   expect(insightsButton.props().text).toBe('See insights');
  //   await insightsButton.trigger('click');

  //   await wrapper.vm.$nextTick();

  //   expect(spy).toHaveBeenCalled();
  //   expect(wrapper.vm.$router.replace).toHaveBeenCalledWith('/insights');
  // });

  // it('shows alert on error during fetching conversations', async () => {
  //   const spyCallAlert = vi.spyOn(unnnic, 'unnnicCallAlert');
  //   const store = whatsapp_store();
  //   store.errorConversations = { error_user_msg: 'Fetch Error' };
  //   await wrapper.vm.handleDateFilter({ startDate: '2024-01-01', endDate: '2024-01-02' });
  //   await wrapper.vm.$nextTick();

  //   expect(spyCallAlert).toHaveBeenCalledWith({
  //     props: {
  //       text: 'Fetch Error',
  //       type: 'error',
  //     },
  //     seconds: 6,
  //   });
  // });

  it('shows alert on error during reporting', async () => {
    const spyCallAlert = vi.spyOn(unnnic, 'unnnicCallAlert');
    const store = whatsapp_store();
    store.errorConversationsReport = {
      error_user_msg: 'Report Error',
      response: { status: 500 },
    };
    await wrapper.vm.requestReport();

    expect(spyCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'Failed to request detailed report, please try again later',
        type: 'error',
      },
      seconds: 6,
    });
  });

  it('shows alert for report already processing', async () => {
    const spyCallAlert = vi.spyOn(unnnic, 'unnnicCallAlert');
    const store = whatsapp_store();
    store.errorConversationsReport = { response: { status: 409 } };
    await wrapper.vm.requestReport();

    expect(spyCallAlert).toHaveBeenCalledWith({
      props: {
        text: 'Failed to request detailed report, please try again later',
        type: 'error',
      },
      seconds: 6,
    });
  });

  // it('shows success alert on successful report', async () => {
  //   const spyCallAlert = vi.spyOn(unnnic, 'unnnicCallAlert');
  //   const store = whatsapp_store();
  //   store.errorConversationsReport = null;
  //   expect(wrapper.vm.errorConversationsReport).toBe(null);

  //   await wrapper.vm.requestReport();

  //   expect(spyCallAlert).toHaveBeenCalledWith({
  //     props: {
  //       text: 'Report Success',
  //       type: 'success',
  //     },
  //     seconds: 6,
  //   });
  // });

  it('computes beforeItems correctly', () => {
    wrapper.vm.businessInitiated = 5;
    wrapper.vm.userInitiated = 10;

    expect(wrapper.vm.beforeItems).toEqual([
      { startedBy: 'Business', quantity: 5 },
      { startedBy: 'User', quantity: 10 },
    ]);
  });

  it('computes afterItems correctly', () => {
    wrapper.vm.afterData = {
      MARKETING: 3,
      UTILITY: 4,
      AUTHENTICATION: 2,
      SERVICE: 1,
    };

    expect(wrapper.vm.afterItems).toEqual([
      { category: 'Marketing', quantity: 3 },
      { category: 'Utility', quantity: 4 },
      { category: 'Authentication', quantity: 2 },
      { category: 'Service', quantity: 1 },
    ]);
  });

  it('computes hasBefore and hasAfter correctly', () => {
    wrapper.vm.businessInitiated = 0;
    wrapper.vm.userInitiated = 0;
    expect(wrapper.vm.hasBefore).toBe(false);

    wrapper.vm.afterData = {
      MARKETING: 3,
      UTILITY: 0,
      AUTHENTICATION: 0,
      SERVICE: 0,
    };
    expect(wrapper.vm.hasAfter).toBe(true);
  });

  it('computes startDateObject and endDateObject correctly', () => {
    wrapper.vm.startDate = '2024-01-01';
    wrapper.vm.endDate = '2024-01-02';

    const startDate = wrapper.vm.startDateObject;
    const endDate = wrapper.vm.endDateObject;

    expect(startDate.getUTCFullYear()).toEqual(2024);
    expect(startDate.getUTCMonth()).toEqual(0); // Janeiro é 0
    expect(startDate.getUTCDate()).toEqual(1);

    expect(endDate.getUTCFullYear()).toEqual(2024);
    expect(endDate.getUTCMonth()).toEqual(0);
    expect(endDate.getUTCDate()).toEqual(2);
  });
});
