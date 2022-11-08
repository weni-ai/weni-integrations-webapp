jest.mock('lodash.debounce', () => jest.fn((fn) => fn));

jest.mock('@/api/appType', () => {
  return {
    updateAppConfig: jest.fn(),
  };
});

jest.mock('@weni/unnnic-system', () => ({
  ...jest.requireActual('@weni/unnnic-system'),
  unnnicCallAlert: jest.fn(),
}));

import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import wppDemoPreview from '@/components/config/channels/wpp_demo/Preview.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = async ({
  loadingCurrentAppType = false,
  errorCurrentApp = false,
  errorUpdateApp = false,
  appConfig = {},
  flows_starts = [],
} = {}) => {
  const state = {
    appType: {
      currentApp: {
        uuid: '123',
        code: 'wpp_demo',
        config: appConfig,
        flows_starts,
      },
      loadingCurrentAppType,
      errorCurrentApp,
      errorUpdateApp,
    },
  };

  const actions = {
    getApp: jest.fn(),
    updateApp: jest.fn(),
  };

  const store = new Vuex.Store({
    actions,
    state,
  });

  const wrapper = mount(wppDemoPreview, {
    localVue,
    store,
    i18n,
    propsData: {
      app: {
        uuid: '123',
        code: 'wpp_demo',
        config: {},
      },
    },
    stubs: {
      UnnnicInput: true,
      UnnnicButton: true,
      UnnnicIconSvg: true,
      UnnnicModal: true,
    },
  });

  await wrapper.vm.$nextTick();

  return { wrapper, actions };
};

describe('components/config/channels/wpp_demo/Preview.vue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be rendered properly', async () => {
    const { wrapper } = await mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('closePreview()', () => {
    it('should emit closeModal', async () => {
      const { wrapper } = await mountComponent();
      expect(wrapper.emitted('closeModal')).toBeFalsy();
      wrapper.vm.closePreview();
      expect(wrapper.emitted('closeModal')).toBeTruthy();
    });
  });

  describe('getFlowGroups()', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call getApp()', async () => {
      const { wrapper, actions } = await mountComponent();
      jest.clearAllMocks();
      expect(actions.getApp).not.toHaveBeenCalled();
      await wrapper.vm.getFlowGroups();
      expect(actions.getApp).toHaveBeenCalledTimes(1);
      expect(actions.getApp).toHaveBeenCalledWith(expect.any(Object), {
        code: 'wpp_demo',
        appUuid: '123',
      });
    });

    it('should call callErrorModal if getApp fails', async () => {
      const { wrapper } = await mountComponent({
        errorCurrentApp: true,
      });
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.getFlowGroups();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ text: 'WhatsAppDemo.preview.errors.fetch_app' });
    });

    it('should call callErrorModal if flows_starts are not present', async () => {
      const { wrapper } = await mountComponent({ flows_starts: null });
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      expect(spy).not.toHaveBeenCalled();
      await wrapper.vm.getFlowGroups();
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        text: 'WhatsAppDemo.preview.errors.missing_trigger_data',
      });
    });

    it('should process and map selected flows', async () => {
      const { wrapper } = await mountComponent({
        flows_starts: [
          {
            uuid: '123',
            name: 'Flow 1',
          },
          {
            uuid: '456',
            name: 'Flow 2',
          },
        ],
        appConfig: {
          flows_starts: [
            {
              uuid: '456',
              name: 'Flow 2',
            },
          ],
        },
      });
      wrapper.vm.flowGroups = [];
      await wrapper.vm.getFlowGroups();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.flowGroups).toEqual([
        {
          items: [
            {
              name: 'Flow 1',
              title: 'Flow 1',
              uuid: '123',
            },
          ],
          selected: -1,
        },
        {
          items: [
            {
              name: 'Flow 2',
              title: 'Flow 2',
              uuid: '456',
            },
          ],
          selected: 0,
        },
      ]);
      expect(wrapper.vm.selectTitle).toEqual('1 WhatsAppDemo.preview.flows_selected');
    });

    it('should process and map selected flows when nothing is selected', async () => {
      const { wrapper } = await mountComponent({
        flows_starts: [
          {
            uuid: '123',
            name: 'Flow 1',
          },
          {
            uuid: '456',
            name: 'Flow 2',
          },
        ],
      });
      wrapper.vm.flowGroups = [];
      await wrapper.vm.getFlowGroups();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.flowGroups).toEqual([
        {
          items: [
            {
              name: 'Flow 1',
              title: 'Flow 1',
              uuid: '123',
            },
          ],
          selected: -1,
        },
        {
          items: [
            {
              name: 'Flow 2',
              title: 'Flow 2',
              uuid: '456',
            },
          ],
          selected: -1,
        },
      ]);
      expect(wrapper.vm.selectTitle).toEqual('WhatsAppDemo.preview.select_flow');
    });
  });

  describe('handleFlowChange()', () => {
    it('should call error modal if event quantity is greater than 3', async () => {
      const { wrapper } = await mountComponent();
      const spy = spyOn(wrapper.vm, 'callErrorModal');
      expect(spy).not.toHaveBeenCalled();
      wrapper.vm.handleFlowChange([
        { selected: 0 },
        { selected: 0 },
        { selected: 0 },
        { selected: 0 },
      ]);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ text: 'WhatsAppDemo.preview.errors.max_flow_selected' });
    });

    it('should update flowGroups and select title with event data', async () => {
      const { wrapper } = await mountComponent();
      const flows = [
        {
          selected: -1,
          items: [
            {
              name: 'Flow 1',
              title: 'Flow 1',
              uuid: '123',
            },
          ],
        },
        {
          selected: -1,
          items: [
            {
              name: 'Flow 2',
              title: 'Flow 2',
              uuid: '1234',
            },
          ],
        },
        {
          selected: 0,
          items: [
            {
              name: 'Flow 3',
              title: 'Flow 3',
              uuid: '12345',
            },
          ],
        },
        {
          selected: 0,
          items: [
            {
              name: 'Flow 4',
              title: 'Flow 4',
              uuid: '123456',
            },
          ],
        },
      ];
      wrapper.vm.flowGroups = flows;
      const modifedFlows = flows;
      modifedFlows[0].selected = 0;
      const spy = spyOn(wrapper.vm, 'updateFlows');

      wrapper.vm.handleFlowChange(modifedFlows);
      expect(wrapper.vm.flowGroups).toEqual(modifedFlows);
      expect(wrapper.vm.selectTitle).toEqual('3 WhatsAppDemo.preview.flows_selected');
      expect(spy).toHaveBeenCalledTimes(1);
    });

    describe('updateFlows()', () => {
      it('should call callErrorModal if updateApp fails', async () => {
        const { wrapper } = await mountComponent({ errorUpdateApp: true });
        const spy = spyOn(wrapper.vm, 'callErrorModal');
        expect(spy).not.toHaveBeenCalled();
        await wrapper.vm.updateFlows();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledWith({ text: 'WhatsAppDemo.preview.errors.update_app' });
      });

      it('should call updateApp with formatted payload', async () => {
        const { wrapper, actions } = await mountComponent();

        wrapper.vm.flowGroups = [
          {
            selected: 0,
            items: [
              {
                name: 'Flow 1',
                title: 'Flow 1',
                uuid: '123',
              },
            ],
          },
          {
            selected: -1,
            items: [
              {
                name: 'Flow 2',
                title: 'Flow 2',
                uuid: '1234',
              },
            ],
          },
        ];

        await wrapper.vm.updateFlows();

        expect(actions.updateApp).toHaveBeenCalledTimes(1);
        expect(actions.updateApp).toHaveBeenCalledWith(expect.any(Object), {
          appUuid: '123',
          code: 'wpp_demo',
          payload: {
            flows_starts: [
              {
                name: 'Flow 1',
                title: 'Flow 1',
                uuid: '123',
              },
            ],
          },
        });
      });
    });
  });
});
