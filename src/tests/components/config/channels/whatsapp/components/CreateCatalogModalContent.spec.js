import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CreateCatalogModalContent from '@/components/config/channels/whatsapp/components/CreateCatalogModalContent.vue';
import unnnic from '@weni/unnnic-system';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

describe('CreateCatalogModalContent Component', () => {
  let wrapper;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    wrapper = shallowMount(CreateCatalogModalContent, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
    });
  });

  it('should render the modal with VTEX selected by default', () => {
    const vtexOption = wrapper.find({ ref: 'vtexOption' });
    expect(vtexOption.classes()).toContain('selected');
  });

  it('should switch selection to META when clicked', async () => {
    const metaOption = wrapper.find({ ref: 'metaOption' });
    await metaOption.trigger('click');
    expect(metaOption.classes()).toContain('selected');
  });

  it('should emit createCatalog event with correct type when continue is clicked', async () => {
    const createButton = wrapper.findComponent({ ref: 'createButton' });
    expect(createButton.exists()).toBeTruthy();
    await createButton.trigger('click');
    expect(wrapper.emitted().createCatalog[0]).toEqual(['vtex']);

    const metaOption = wrapper.find({ ref: 'metaOption' });
    await metaOption.trigger('click');
    await createButton.trigger('click');
    expect(wrapper.emitted().createCatalog[1]).toEqual(['meta']);
  });

  it('should emit closeModal event when cancel button is clicked', async () => {
    const closeButton = wrapper.findComponent({ ref: 'closeButton' });
    await closeButton.trigger('click');
    expect(wrapper.emitted().closeModal).toBeTruthy();
  });
});
