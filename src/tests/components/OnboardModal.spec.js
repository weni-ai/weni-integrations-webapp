import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import OnboardModal from '@/components/OnboardModal/index.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { createTestingPinia } from '@pinia/testing';

describe('OnboardModal.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    stubActions: false,
    createSpy: vi.fn,
  });

  beforeEach(() => {
    wrapper = mount(OnboardModal, {
      data() {
        return {
          showModal: true,
          currentApp: null,
          availableApps: ['whatsapp', 'telegram', 'wwc'],
          onboardIcons: {
            whatsapp: 'whatsapp.png',
            telegram: 'telegram.png',
            wwc: 'wwc.png',
          },
          onboardGifs: {
            whatsapp: ['whatsapp1.gif', 'whatsapp2.gif', 'whatsapp3.gif'],
            telegram: ['telegram1.gif', 'telegram2.gif'],
            wwc: ['wwc1.gif'],
          },
          onboardDescriptions: {
            whatsapp: ['desc1', 'desc2', 'desc3'],
            telegram: ['desc1', 'desc2'],
            wwc: ['desc1'],
          },
          page: 0,
          appPageLimit: {
            whatsapp: 2,
            telegram: 1,
            wwc: 0,
          },
        };
      },
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
        },
      },
    });
  });

  it('renders the modal when showModal is true', () => {
    expect(wrapper.find('.onboard').exists()).toBe(true);
  });

  it('displays the correct initial title', async () => {
    Object.defineProperty(wrapper.vm, 'showModal', {
      value: true,
    });
    await wrapper.vm.$nextTick();
    const title = wrapper.find('.onboard--title');
    expect(wrapper.vm.showModal).toBe(true);
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Integrate a channel to your project');
  });

  it('displays the app selection when no app is selected', () => {
    expect(wrapper.find('.onboard__app-selection__wrapper').exists()).toBe(true);
    expect(wrapper.findAll('.onboard__app-selection__app').length).toBe(3);
  });

  it('sets the correct app when an icon is clicked', async () => {
    await wrapper.find('.onboard__app-selection__app').trigger('click');
    expect(wrapper.vm.currentApp).toBe('whatsapp');
  });

  it('navigates to the next page correctly', async () => {
    Object.defineProperty(wrapper.vm, 'currentApp', {
      value: 'whatsapp',
    });
    await wrapper.vm.$nextTick();
    const buttonSecondary = wrapper.findComponent({ ref: 'button-secondary' });
    expect(buttonSecondary.exists()).toBe(true);
    await buttonSecondary.trigger('click');
    expect(wrapper.vm.page).toBe(1);
  });

  it('closes the modal and resets the data when the last page is reached', async () => {
    Object.defineProperty(wrapper.vm, 'currentApp', {
      value: 'whatsapp',
    });
    Object.defineProperty(wrapper.vm, 'page', {
      value: 2,
    });
    await wrapper.vm.$nextTick();
    const buttonSecondary = wrapper.findComponent({ ref: 'button-secondary' });
    expect(buttonSecondary.exists()).toBe(true);
    await buttonSecondary.trigger('click');
    expect(wrapper.vm.showModal).toBe(false);
    expect(wrapper.vm.page).toBe(0);
    expect(wrapper.vm.currentApp).toBe(null);
  });
});
