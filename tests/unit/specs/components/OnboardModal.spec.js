import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import OnboardModal from '@/components/OnboardModal.vue';
import { unnnicModalNext, unnnicButton } from '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

import { singleApp } from '../../../__mocks__/appMock';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  onboardStatus = true,
  errorConfiguredApps = false,
  configuredApps = [],
  project = '123',
} = {}) => {
  const store = new Vuex.Store({
    modules: {
      appType: {
        state: {
          onboardStatus,
        },
        actions: {
          setOnboardStatus: jest.fn(),
        },
      },
      auth: {
        state: {
          project,
        },
      },
      myApps: {
        state: {
          errorConfiguredApps,
          configuredApps,
        },
        actions: {
          getConfiguredApps: jest.fn(),
        },
      },
    },
  });

  const wrapper = mount(OnboardModal, {
    localVue,
    store,
    i18n,
    stubs: {
      unnnicModalNext,
    },
  });

  await wrapper.vm.$nextTick();

  return { wrapper };
};

describe('components/OnboardModal.vue', () => {
  it('should not render modal if app is configured', async () => {
    let { wrapper } = await mountComponent({ configuredApps: [singleApp] });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render modal if onboardStatus is false', async () => {
    let { wrapper } = await mountComponent({ onboardStatus: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render modal app is not configured', async () => {
    let { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('whatsapp', () => {
    it('should start whatsapp steps on whatsapp icon click', async () => {
      let { wrapper } = await mountComponent();

      const whatsappIcon = wrapper.findAll('img').at(0);
      await whatsappIcon.trigger('click');

      expect(wrapper).toMatchSnapshot();
    });

    it('should render whatsapp pages correctly and close modal in the end', async () => {
      let { wrapper } = await mountComponent();

      const whatsappIcon = wrapper.findAll('img').at(0);
      await whatsappIcon.trigger('click');

      expect(wrapper).toMatchSnapshot();

      const nextButton = wrapper.findAllComponents(unnnicButton).at(1);

      const pageLimit = wrapper.vm.appPageLimit['whatsapp'];

      for (let i = 0; i <= pageLimit; i++) {
        await nextButton.trigger('click');
        expect(wrapper).toMatchSnapshot();
      }

      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should handle whatsapp back action until app selection', async () => {
      let { wrapper } = await mountComponent();

      const whatsappIcon = wrapper.findAll('img').at(0);
      await whatsappIcon.trigger('click');

      const previousButton = wrapper.findAllComponents(unnnicButton).at(0);
      const nextButton = wrapper.findAllComponents(unnnicButton).at(1);

      const pageLimit = wrapper.vm.appPageLimit['whatsapp'];

      for (let i = 0; i < pageLimit; i++) {
        await nextButton.trigger('click');
      }

      expect(wrapper.vm.showModal).toBe(true);
      expect(wrapper).toMatchSnapshot();

      for (let i = 0; i < pageLimit; i++) {
        await previousButton.trigger('click');
        expect(wrapper).toMatchSnapshot();
      }

      await previousButton.trigger('click');
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('telegram', () => {
    it('should start telegram steps on telegram icon click', async () => {
      let { wrapper } = await mountComponent();

      const whatsappIcon = wrapper.findAll('img').at(1);
      await whatsappIcon.trigger('click');

      expect(wrapper).toMatchSnapshot();
    });

    it('should render telegram pages correctly and close modal in the end', async () => {
      let { wrapper } = await mountComponent();

      const telegramIcon = wrapper.findAll('img').at(1);
      await telegramIcon.trigger('click');

      expect(wrapper).toMatchSnapshot();

      const nextButton = wrapper.findAllComponents(unnnicButton).at(1);

      const pageLimit = wrapper.vm.appPageLimit['telegram'];

      for (let i = 0; i <= pageLimit; i++) {
        await nextButton.trigger('click');
        expect(wrapper).toMatchSnapshot();
      }

      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should handle telegram back action until app selection', async () => {
      let { wrapper } = await mountComponent();

      const telegramIcon = wrapper.findAll('img').at(1);
      await telegramIcon.trigger('click');

      const previousButton = wrapper.findAllComponents(unnnicButton).at(0);
      const nextButton = wrapper.findAllComponents(unnnicButton).at(1);

      const pageLimit = wrapper.vm.appPageLimit['telegram'];

      for (let i = 0; i < pageLimit; i++) {
        await nextButton.trigger('click');
      }

      expect(wrapper.vm.showModal).toBe(true);
      expect(wrapper).toMatchSnapshot();

      for (let i = 0; i < pageLimit; i++) {
        await previousButton.trigger('click');
        expect(wrapper).toMatchSnapshot();
      }

      await previousButton.trigger('click');
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('weni web chat', () => {
    it('should start weni web chat steps on weni web chat icon click', async () => {
      let { wrapper } = await mountComponent();

      const wwcIcon = wrapper.findAll('img').at(2);
      await wwcIcon.trigger('click');

      expect(wrapper).toMatchSnapshot();
    });

    it('should render weniwebchat pages correctly and close modal in the end', async () => {
      let { wrapper } = await mountComponent();

      const wwcIcon = wrapper.findAll('img').at(2);
      await wwcIcon.trigger('click');

      expect(wrapper).toMatchSnapshot();

      const nextButton = wrapper.findAllComponents(unnnicButton).at(1);

      const pageLimit = wrapper.vm.appPageLimit['wwc'];

      for (let i = 0; i <= pageLimit; i++) {
        await nextButton.trigger('click');
        expect(wrapper).toMatchSnapshot();
      }

      expect(wrapper.vm.showModal).toBe(false);
    });

    it('should handle wwc back action until app selection', async () => {
      let { wrapper } = await mountComponent();

      const wwcIcon = wrapper.findAll('img').at(1);
      await wwcIcon.trigger('click');

      const previousButton = wrapper.findAllComponents(unnnicButton).at(0);
      const nextButton = wrapper.findAllComponents(unnnicButton).at(1);

      const pageLimit = wrapper.vm.appPageLimit['wwc'];

      for (let i = 0; i < pageLimit; i++) {
        await nextButton.trigger('click');
      }

      expect(wrapper.vm.showModal).toBe(true);
      expect(wrapper).toMatchSnapshot();

      for (let i = 0; i < pageLimit; i++) {
        await previousButton.trigger('click');
        expect(wrapper).toMatchSnapshot();
      }

      await previousButton.trigger('click');
      expect(wrapper).toMatchSnapshot();
    });
  });
});
