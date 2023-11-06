import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import { unnnicSelect, unnnicInput } from '@weni/unnnic-system';
import FormTabContentButtons from '@/components/whatsAppTemplates/FormTabContentButtons.vue';
import BaseInput from '../../../../../src/components/BaseInput.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = ({ templateButtons = [] } = {}) => {
  const getters = {
    templateTranslationCurrentForm: jest.fn(() => {
      return { buttons: templateButtons };
    }),
  };

  const store = new Vuex.Store({
    modules: {
      WhatsApp: {
        namespaced: true,
        getters,
      },
    },
  });

  const wrapper = mount(FormTabContentButtons, {
    localVue,
    store,
    i18n,
  });

  return { wrapper, getters };
};

describe('components/whatsAppTemplates/FormTabContentButtons.vue', () => {
  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render replies wrapper if buttonsType === quick_reply', async () => {
    const { wrapper } = mountComponent({
      templateButtons: [
        { button_type: 'QUICK_REPLY', text: 'reply1' },
        { button_type: 'QUICK_REPLY', text: 'reply2' },
      ],
    });

    const repliesDiv = wrapper.find('.form-tab-content-buttons__replies');
    expect(repliesDiv.exists()).toBe(true);

    const actionsDiv = wrapper.find('.form-tab-content-buttons__call-actions');
    expect(actionsDiv.exists()).toBe(false);
  });

  it('should render call-actions wrapper if buttonsType === call_to_action', async () => {
    const { wrapper } = mountComponent({
      templateButtons: [{ button_type: 'PHONE_NUMBER', country_code: 'BR' }],
    });

    const actionsDiv = wrapper.find('.form-tab-content-buttons__call-actions');
    expect(actionsDiv.exists()).toBe(true);

    const repliesDiv = wrapper.find('.form-tab-content-buttons__replies');
    expect(repliesDiv.exists()).toBe(false);
  });

  describe('currentButtons', () => {
    it('should return current buttons if defined', () => {
      const templateButtons = [
        { button_type: 'QUICK_REPLY', text: 'reply1' },
        { button_type: 'QUICK_REPLY', text: 'reply2' },
      ];
      const { wrapper } = mountComponent({ templateButtons });

      expect(wrapper.vm.currentButtons).toEqual(templateButtons);
    });

    it('should return empty array if not defined', () => {
      const { wrapper } = mountComponent({
        templateButtons: null,
      });

      expect(wrapper.vm.currentButtons).toEqual([]);
    });
  });

  describe('showAddButton', () => {
    it('should display add button if type is quick_reply and count < 3', async () => {
      const { wrapper } = mountComponent({
        templateButtons: [
          { button_type: 'QUICK_REPLY', text: 'reply1' },
          { button_type: 'QUICK_REPLY', text: 'reply2' },
        ],
      });

      const addButton = wrapper.find('.form-tab-content-buttons__add-button');
      expect(addButton.exists()).toBe(true);
    });

    it('should not display add button if type is quick_reply and count >= 3', async () => {
      const { wrapper } = mountComponent({
        templateButtons: [
          { button_type: 'QUICK_REPLY', text: 'reply1' },
          { button_type: 'QUICK_REPLY', text: 'reply2' },
          { button_type: 'QUICK_REPLY', text: 'reply3' },
        ],
      });

      const addButton = wrapper.find('.form-tab-content-buttons__add-button');
      expect(addButton.exists()).toBe(false);
    });

    it('should display add button if type is call_to_action and count < 2', async () => {
      const { wrapper } = mountComponent({
        templateButtons: [{ button_type: 'PHONE_NUMBER', country_code: 'BR' }],
      });

      const addButton = wrapper.find('.form-tab-content-buttons__add-button');
      expect(addButton.exists()).toBe(true);
    });

    it('should not display add button if type is call_to_action and count >= 2', async () => {
      const { wrapper } = mountComponent({
        templateButtons: [
          { button_type: 'PHONE_NUMBER', country_code: 'BR' },
          { button_type: 'PHONE_NUMBER', country_code: 'US' },
        ],
      });

      const addButton = wrapper.find('.form-tab-content-buttons__add-button');
      expect(addButton.exists()).toBe(false);
    });
  });

  describe('showRemoveButton', () => {
    it('should display remove button if type is quick_reply and count > 1', async () => {
      const { wrapper } = mountComponent({
        templateButtons: [
          { button_type: 'QUICK_REPLY', text: 'reply1' },
          { button_type: 'QUICK_REPLY', text: 'reply2' },
        ],
      });

      const removeButton = wrapper.find('.form-tab-content-buttons__replies__remove-button');
      expect(removeButton.exists()).toBe(true);
    });

    it('should display remove button if type is call_to_action and count > 1', async () => {
      const { wrapper } = mountComponent({
        templateButtons: [
          { button_type: 'PHONE_NUMBER', country_code: 'BR' },
          { button_type: 'PHONE_NUMBER', country_code: 'US' },
        ],
      });

      const removeButton = wrapper.find(
        '.form-tab-content-buttons__call-actions__button__header__remove-button',
      );
      expect(removeButton.exists()).toBe(true);
    });
  });

  describe('handleButtonTypeChange()', () => {
    it('should not emit button type change when event is the same', async () => {
      const { wrapper } = mountComponent({
        templateButtons: [{ button_type: 'PHONE_NUMBER', country_code: 'BR' }],
      });
      const buttonTypeSelector = wrapper.findAllComponents(unnnicSelect).at(0);

      buttonTypeSelector.vm.$emit('input', 'call_to_action');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');

      expect(event).toBeFalsy();
    });

    it('should emit button type change when call_to_action', async () => {
      const { wrapper } = mountComponent();
      const buttonTypeSelector = wrapper.findAllComponents(unnnicSelect).at(0);

      buttonTypeSelector.vm.$emit('input', 'call_to_action');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');

      expect(event).toBeTruthy();
      expect(event.length).toBe(2);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            { button_type: 'PHONE_NUMBER', country_code: 'BR', country_calling_code: '55' },
          ],
        },
      ]);
      expect(event[1]).toEqual([
        {
          fieldName: 'buttonsType',
          fieldValue: 'call_to_action',
        },
      ]);
    });

    it('should emit button type change when quick_reply', async () => {
      const { wrapper } = mountComponent();
      const buttonTypeSelector = wrapper.findAllComponents(unnnicSelect).at(0);

      buttonTypeSelector.vm.$emit('input', 'quick_reply');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');

      expect(event).toBeTruthy();
      expect(event.length).toBe(2);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            {
              button_type: 'QUICK_REPLY',
              text: '',
            },
          ],
        },
      ]);
      expect(event[1]).toEqual([
        {
          fieldName: 'buttonsType',
          fieldValue: 'quick_reply',
        },
      ]);
    });

    it('should emit button type change when none', async () => {
      const { wrapper } = mountComponent();
      const buttonTypeSelector = wrapper.findAllComponents(unnnicSelect).at(0);

      buttonTypeSelector.vm.$emit('input', 'none');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');

      expect(event).toBeTruthy();
      expect(event.length).toBe(2);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [],
        },
      ]);
      expect(event[1]).toEqual([
        {
          fieldName: 'buttonsType',
          fieldValue: 'none',
        },
      ]);
    });
  });

  describe('quick_replies', () => {
    it('should emit input-change in quick_reply input', async () => {
      const buttons = [{ button_type: 'QUICK_REPLY', text: '' }];
      const { wrapper } = mountComponent({
        buttonsType: 'quick_reply',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const replyInput = wrapper.findComponent(BaseInput);

      replyInput.vm.$emit('input', 'reply text');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [{ button_type: 'QUICK_REPLY', text: 'reply text' }],
        },
      ]);
    });

    it('should emit input-change in quick_reply input in correct index', async () => {
      const buttons = [
        { button_type: 'QUICK_REPLY', text: 'reply1' },
        { button_type: 'QUICK_REPLY', text: 'reply2' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'quick_reply',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const replyInput = wrapper.findAllComponents(BaseInput).at(1);

      replyInput.vm.$emit('input', 'reply text');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            { button_type: 'QUICK_REPLY', text: 'reply1' },
            { button_type: 'QUICK_REPLY', text: 'reply text' },
          ],
        },
      ]);
    });
  });

  describe('call_to_action', () => {
    it('should emit call to action type change to visit_website', async () => {
      const buttons = [{ button_type: 'PHONE_NUMBER', country_code: 'BR' }];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const actionTypeSelect = wrapper.findAllComponents(unnnicSelect).at(1);

      actionTypeSelect.vm.$emit('input', 'URL');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [{ button_type: 'URL' }],
        },
      ]);
    });

    it('should emit call to action type change to call_phone_number', async () => {
      const buttons = [{ button_type: 'URL' }];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const actionTypeSelect = wrapper.findAllComponents(unnnicSelect).at(1);

      actionTypeSelect.vm.$emit('input', 'PHONE_NUMBER');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [{ button_type: 'PHONE_NUMBER', country_code: 'BR' }],
        },
      ]);
    });

    it('should emit call to action type change in correct index', async () => {
      const buttons = [
        { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
        { button_type: 'URL', text: 'website name', website_url: 'url.com' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const actionTypeSelect = wrapper.findAllComponents(unnnicSelect).at(3);

      actionTypeSelect.vm.$emit('input', 'PHONE_NUMBER');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            {
              button_type: 'URL',
              text: 'website name',
              website_url: 'url.com',
            },
            { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
          ],
        },
      ]);
    });

    it('should emit action name input change in correct index', async () => {
      const buttons = [
        { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
        { button_type: 'URL', text: 'website name', website_url: 'url.com' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const nameInput = wrapper.findAllComponents(BaseInput).at(1);

      nameInput.vm.$emit('input', 'new website');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
            {
              button_type: 'URL',
              text: 'new website',
              website_url: 'url.com',
            },
          ],
        },
      ]);
    });

    it('should emit phone number input change in correct index', async () => {
      const buttons = [
        { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
        { button_type: 'URL', text: 'website name', website_url: 'url.com' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const nameInput = wrapper.findAllComponents(unnnicInput).at(1);

      nameInput.vm.$emit('input', '456');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '456' },
            {
              button_type: 'URL',
              text: 'website name',
              website_url: 'url.com',
            },
          ],
        },
      ]);
    });

    it('should emit phone number country code input change in correct index', async () => {
      const buttons = [
        { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
        { button_type: 'URL', text: 'website name', website_url: 'url.com' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const countryCodeSelect = wrapper.findAllComponents(unnnicSelect).at(2);

      countryCodeSelect.vm.$emit('input', 'BR');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            {
              button_type: 'PHONE_NUMBER',
              country_code: 'BR',
              country_calling_code: '55',
              text: 'name',
              phone_number: '123',
            },
            {
              button_type: 'URL',
              text: 'website name',
              website_url: 'url.com',
            },
          ],
        },
      ]);
    });

    it('should emit url input change in correct index', async () => {
      const buttons = [
        { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
        { button_type: 'URL', text: 'website name', url: 'url.com' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const nameInput = wrapper.findAllComponents(unnnicInput).at(3);

      nameInput.vm.$emit('input', 'newurl.com');
      await wrapper.vm.$nextTick();

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
            {
              button_type: 'URL',
              text: 'website name',
              url: 'newurl.com',
            },
          ],
        },
      ]);
    });
  });

  describe('removeButton()', () => {
    it('should remove quick_reply button in correct index', async () => {
      const buttons = [
        { button_type: 'QUICK_REPLY', text: 'reply1' },
        { button_type: 'QUICK_REPLY', text: 'reply text' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'quick_reply',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const removeButton = wrapper
        .findAll('.form-tab-content-buttons__replies__remove-button')
        .at(1);

      removeButton.trigger('click');

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [{ button_type: 'QUICK_REPLY', text: 'reply1' }],
        },
      ]);
    });

    it('should remove call_to_action button in correct index', async () => {
      const buttons = [
        { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
        { button_type: 'URL', text: 'website name', website_url: 'url.com' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const removeButton = wrapper
        .findAll('.form-tab-content-buttons__call-actions__button__header__remove-button')
        .at(1);

      removeButton.trigger('click');

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            { button_type: 'PHONE_NUMBER', country_code: 'BR', text: 'name', phone_number: '123' },
          ],
        },
      ]);
    });
  });

  describe('addButton()', () => {
    it('should add new quick_reply button if type is quick_reply', async () => {
      const buttons = [
        { button_type: 'QUICK_REPLY', text: 'reply1' },
        { button_type: 'QUICK_REPLY', text: 'reply text' },
      ];
      const { wrapper } = mountComponent({
        buttonsType: 'quick_reply',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const addButton = wrapper.find('.form-tab-content-buttons__add-button');

      addButton.trigger('click');

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [
            { button_type: 'QUICK_REPLY', text: 'reply1' },
            { button_type: 'QUICK_REPLY', text: 'reply text' },
            { button_type: 'QUICK_REPLY', text: '' },
          ],
        },
      ]);
    });

    it('should add visit_website action type if type is call_to_action and existing one is call_phone_number', async () => {
      const buttons = [{ button_type: 'PHONE_NUMBER', country_code: 'BR' }];
      const { wrapper } = mountComponent({
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const addButton = wrapper.find('.form-tab-content-buttons__add-button');

      addButton.trigger('click');

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [{ button_type: 'PHONE_NUMBER', country_code: 'BR' }, { button_type: 'URL' }],
        },
      ]);
    });

    it('should add PHONE_NUMBER action type if type is call_to_action and existing one is visit_website', async () => {
      const buttons = [{ button_type: 'URL' }];
      const { wrapper } = mountComponent({
        buttonsType: 'call_to_action',
        templateButtons: buttons,
      });
      await wrapper.setData({ buttons });

      const addButton = wrapper.find('.form-tab-content-buttons__add-button');

      addButton.trigger('click');

      const event = wrapper.emitted('input-change');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual([
        {
          fieldName: 'buttons',
          fieldValue: [{ button_type: 'URL' }, { button_type: 'PHONE_NUMBER', country_code: 'BR' }],
        },
      ]);
    });
  });

  describe('handleUrlFocus()', () => {
    it('should set focusedUrlInput as true', async () => {
      const { wrapper } = mountComponent();
      await wrapper.setData({ focusedUrlInput: false });

      wrapper.vm.handleUrlFocus();

      expect(wrapper.vm.focusedUrlInput).toBe(true);
    });
  });

  describe('handleUrlBlur', () => {
    it('should set focusedUrlInput as false', async () => {
      const { wrapper } = mountComponent();
      await wrapper.setData({ focusedUrlInput: true });

      wrapper.vm.handleUrlBlur();

      expect(wrapper.vm.focusedUrlInput).toBe(false);
    });
  });
});
