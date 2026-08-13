import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ConnectNewWhatsAppAccountModal from '@/components/config/channels/whatsapp/ConnectNewWhatsAppAccountModal.vue';
import i18n from '@/utils/plugins/i18n';

const DialogStub = {
  name: 'unnnic-dialog',
  props: {
    open: { type: Boolean, default: false },
  },
  emits: ['update:open'],
  template: '<div class="unnnic-dialog-stub"><slot /></div>',
};

const DialogContentStub = {
  name: 'unnnic-dialog-content',
  props: {
    size: { type: String, default: 'medium' },
  },
  template: '<div class="unnnic-dialog-content-stub"><slot /></div>',
};

const DialogHeaderStub = {
  name: 'unnnic-dialog-header',
  props: {
    type: { type: String, default: 'default' },
  },
  template: '<div class="unnnic-dialog-header-stub"><slot /></div>',
};

const DialogTitleStub = {
  name: 'unnnic-dialog-title',
  template: '<div class="unnnic-dialog-title-stub"><slot /></div>',
};

const DialogFooterStub = {
  name: 'unnnic-dialog-footer',
  template: '<div class="unnnic-dialog-footer-stub"><slot /></div>',
};

const ButtonStub = {
  name: 'unnnic-button',
  props: {
    text: { type: String, default: '' },
    type: { type: String, default: 'primary' },
    size: { type: String, default: 'large' },
  },
  emits: ['click'],
  template: '<button class="unnnic-button-stub" @click="$emit(\'click\')">{{ text }}</button>',
};

describe('ConnectNewWhatsAppAccountModal.vue', () => {
  let wrapper;

  const mountModal = (props = {}) =>
    mount(ConnectNewWhatsAppAccountModal, {
      props: {
        show: true,
        ...props,
      },
      global: {
        plugins: [i18n],
        stubs: {
          'unnnic-dialog': DialogStub,
          'unnnic-dialog-content': DialogContentStub,
          'unnnic-dialog-header': DialogHeaderStub,
          'unnnic-dialog-title': DialogTitleStub,
          'unnnic-dialog-footer': DialogFooterStub,
          'unnnic-button': ButtonStub,
        },
      },
    });

  beforeEach(() => {
    wrapper = mountModal();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders the dialog with title, description, and try again button', () => {
    expect(wrapper.find('.connect-new-whatsapp-account-modal').exists()).toBe(true);
    expect(wrapper.text()).toContain('Connect new WhatsApp account');
    expect(wrapper.find('.connect-new-whatsapp-account-modal__description').exists()).toBe(true);
    expect(wrapper.find('.connect-new-whatsapp-account-modal__description').html()).toContain(
      'Create a <b>new WhatsApp Business Account</b>',
    );

    const button = wrapper.findComponent({ name: 'unnnic-button' });
    expect(button.exists()).toBe(true);
    expect(button.props('text')).toBe('Try again');
    expect(button.props('type')).toBe('primary');
  });

  it('binds the show prop to the dialog open state', async () => {
    const dialog = wrapper.findComponent({ name: 'unnnic-dialog' });
    expect(dialog.exists()).toBe(true);
    expect(dialog.props('open')).toBe(true);

    await wrapper.setProps({ show: false });
    expect(dialog.props('open')).toBe(false);
  });

  it('defaults show to false', () => {
    const closedWrapper = mount(ConnectNewWhatsAppAccountModal, {
      global: {
        plugins: [i18n],
        stubs: {
          'unnnic-dialog': DialogStub,
          'unnnic-dialog-content': DialogContentStub,
          'unnnic-dialog-header': DialogHeaderStub,
          'unnnic-dialog-title': DialogTitleStub,
          'unnnic-dialog-footer': DialogFooterStub,
          'unnnic-button': ButtonStub,
        },
      },
    });

    expect(closedWrapper.props('show')).toBe(false);
    closedWrapper.unmount();
  });

  it('emits close when the dialog requests to close', async () => {
    const dialog = wrapper.findComponent({ name: 'unnnic-dialog' });

    await dialog.vm.$emit('update:open', false);

    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('try-again')).toBeFalsy();
  });

  it('does not emit close when the dialog opens', async () => {
    await wrapper.setProps({ show: false });
    const dialog = wrapper.findComponent({ name: 'unnnic-dialog' });

    await dialog.vm.$emit('update:open', true);

    expect(wrapper.emitted('close')).toBeFalsy();
  });

  it('emits try-again and close when Try again is clicked', async () => {
    const button = wrapper.findComponent({ name: 'unnnic-button' });

    await button.trigger('click');

    expect(wrapper.emitted('try-again')).toBeTruthy();
    expect(wrapper.emitted('try-again')).toHaveLength(1);
    expect(wrapper.emitted('close')).toBeTruthy();
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('uses a warning dialog header', () => {
    const header = wrapper.findComponent({ name: 'unnnic-dialog-header' });
    expect(header.exists()).toBe(true);
    expect(header.props('type')).toBe('warning');
  });
});
