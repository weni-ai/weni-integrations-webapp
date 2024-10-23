import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import InputEditor from '@/components/whatsAppTemplates/InputEditor.vue';
import { createTestingPinia } from '@pinia/testing';
import { setActivePinia } from 'pinia';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('InputEditor.vue', () => {
  let wrapper;

  beforeEach(() => {
    const pinia = createTestingPinia({ stubActions: false });
    setActivePinia(pinia);

    wrapper = mount(InputEditor, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
      },
    });
  });

  it('should toggle emoji picker visibility on button click', async () => {
    const emojiButton = wrapper.find('.input-editor__emoji-picker__button');
    await emojiButton.trigger('click');

    expect(wrapper.vm.displayEmoji).toBe(true);

    await emojiButton.trigger('click');

    expect(wrapper.vm.displayEmoji).toBe(false);
  });

  it('should hide emoji picker on outside click', async () => {
    await wrapper.vm.toggleEmoji();
    expect(wrapper.vm.displayEmoji).toBe(true);

    await wrapper.vm.hideEmoji();
    expect(wrapper.vm.displayEmoji).toBe(false);
  });

  it('should emit format-event with correct format on button click', async () => {
    const boldButton = wrapper.find('.input-editor__button');
    await boldButton.trigger('click');

    expect(wrapper.emitted('format-event')[0]).toEqual(['*']);

    const italicButton = wrapper.findAll('.input-editor__button')[1];
    await italicButton.trigger('click');

    expect(wrapper.emitted('format-event')[1]).toEqual(['_']);

    const strikeButton = wrapper.find('.input-editor__button__strike');
    await strikeButton.trigger('click');

    expect(wrapper.emitted('format-event')[2]).toEqual(['~']);

    const monoButton = wrapper.find('.input-editor__button__mono');
    await monoButton.trigger('click');

    expect(wrapper.emitted('format-event')[3]).toEqual(['```']);
  });
});
