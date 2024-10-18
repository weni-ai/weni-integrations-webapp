import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProfileTab from '@/components/config/channels/whatsapp/components/tabs/ProfileTab.vue';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';

describe('ProfileTab.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = mount(ProfileTab, {
      props: {
        app: { code: 'wpp', uuid: 'some-uuid' },
        profile: {
          photoFile: null,
          status: 'Online',
          business: { description: '', vertical: '', vertical_choices: [] },
        },
      },
      global: {
        plugins: [i18n, UnnnicSystem, pinia],
      },
    });
  });

  it('renders loading state when loadingContactInfo is true', async () => {
    const skeletonLoading = wrapper.findComponent({ ref: 'skeleton' });
    wrapper.vm.loadingContactInfo = true;
    await wrapper.vm.$nextTick();
    expect(skeletonLoading.exists()).toBe(true);
  });

  it('renders profile and contact info forms when loadingContactInfo is false', async () => {
    const store = whatsapp_store();
    store.loadingContactInfo = false;

    await wrapper.vm.$nextTick();
    const contentForm = wrapper.findComponent({ ref: 'contentForm' });
    const infoForm = wrapper.findComponent({ ref: 'infoForm' });

    expect(wrapper.vm.loadingContactInfo).toBe(false);
    expect(contentForm.exists()).toBe(true);
    expect(infoForm.exists()).toBe(true);
  });

  it('updates profile inputs correctly', async () => {
    const inputData = { index: 0, value: ['new-image.jpg'] };
    await wrapper.vm.updateProfileInputs(inputData);
    expect(wrapper.vm.profileInputs[0].value).toEqual(inputData.value);
  });

  it('updates contact info inputs and validates email correctly', async () => {
    const inputData = { index: 2, value: 'invalid-email' };
    await wrapper.vm.updateContactInfoInputs(inputData);
    expect(wrapper.vm.contactInfoInputs[inputData.index].error).toBe(true);

    const validInputData = { index: 2, value: 'valid.email@example.com' };
    await wrapper.vm.updateContactInfoInputs(validInputData);
    expect(wrapper.vm.contactInfoInputs[validInputData.index].error).toBe(false);
  });

  it('calls saveProfile and saveContactInfo methods on handleSave', async () => {
    const saveProfileSpy = vi.spyOn(wrapper.vm, 'saveProfile');
    const saveContactInfoSpy = vi.spyOn(wrapper.vm, 'saveContactInfo');

    await wrapper.vm.handleSave();

    expect(saveProfileSpy).toHaveBeenCalled();
    expect(saveContactInfoSpy).toHaveBeenCalled();
  });

  it('emits "close" event on cancel button click', async () => {
    await wrapper.find('.profile-content__buttons__cancel').trigger('click');
    expect(wrapper.emitted().close).toBeTruthy();
  });

  it('disables the save button when inputs are not modified', async () => {
    const saveButton = wrapper.findComponent({ ref: 'save' });
    expect(saveButton.exists()).toBe(true);
    expect(saveButton.props().disabled).toBe(true);
  });

  it('enables the save button when inputs are modified', async () => {
    const inputData = { index: 0, value: ['new-image.jpg'] };
    const save = wrapper.findComponent({ ref: 'save' });
    expect(save.exists()).toBe(true);
    await wrapper.vm.updateProfileInputs(inputData);
    expect(save.props().disabled).toBe(true);
  });
});
