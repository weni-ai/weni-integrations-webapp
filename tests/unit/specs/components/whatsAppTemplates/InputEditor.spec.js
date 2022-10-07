import Vuex from 'vuex';
import { mount, createLocalVue } from '@vue/test-utils';
import InputEditor from '@/components/whatsAppTemplates/InputEditor.vue';
import i18n from '@/utils/plugins/i18n';

const localVue = createLocalVue();
localVue.use(Vuex);

const mountComponent = () => {
  const wrapper = mount(InputEditor, {
    localVue,

    i18n,
    stubs: {
      UnnnicToolTip: true,
      UnnnicButton: true,
      VEmojiPicker: true,
    },
  });

  return { wrapper };
};

describe('components/whatsAppTemplates/InputEditor.vue', () => {
  it('should be rendered properly', () => {
    const { wrapper } = mountComponent();
    expect(wrapper).toMatchSnapshot();
  });

  describe('toggleEmoji()', () => {
    it('should toggle displayEmoji variable', () => {
      const { wrapper } = mountComponent();

      expect(wrapper.vm.displayEmoji).toEqual(false);

      wrapper.vm.toggleEmoji();

      expect(wrapper.vm.displayEmoji).toEqual(true);
    });
  });

  describe('selectEmoji()', () => {
    it('should emit emoji-event and set displayEmoji to false', () => {
      const { wrapper } = mountComponent();

      wrapper.vm.displayEmoji = true;
      expect(wrapper.vm.displayEmoji).toEqual(true);

      wrapper.vm.selectEmoji('👍');

      expect(wrapper.vm.displayEmoji).toEqual(false);
      const event = wrapper.emitted('emoji-event');
      expect(event).toBeTruthy();
      expect(event.length).toBe(1);
      expect(event[0]).toEqual(['👍']);
    });
  });
});
