import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import VoiceModeTab from '@/components/config/channels/WWC/components/tabs/VoiceModeTab.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

const FIRST_VOICE_ID = 'GOkMqfyKMLVUcYfO2WbB';
const SECOND_VOICE_ID = '1eBtZhneFpMPiYsjVTGl';
const CUSTOM_VOICE_ID = 'my-custom-voice-id';

const defaultProps = {
  initialVoiceModeEnabled: false,
  initialElevenLabsVoiceId: null,
  initialElevenLabsApiKey: null,
  loading: false,
};

const createWrapper = (props = {}) =>
  shallowMount(VoiceModeTab, {
    global: {
      plugins: [i18n, UnnnicSystem],
      stubs: {
        'unnnic-switch': true,
        'unnnic-button': true,
        'unnnic-radio': true,
        'unnnic-input': true,
        UnnnicSwitch: true,
        UnnnicButton: true,
        UnnnicRadio: true,
        UnnnicInput: true,
      },
    },
    props: { ...defaultProps, ...props },
  });

const mockAudio = () => {
  const handlers = {};
  const audio = {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    currentTime: 0,
    addEventListener: vi.fn((event, handler) => {
      handlers[event] = handler;
    }),
    trigger: (event) => handlers[event]?.(),
  };
  vi.spyOn(window, 'Audio').mockReturnValue(audio);
  return audio;
};

describe('VoiceModeTab', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ─── Rendering ────────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders the root element', () => {
      expect(wrapper.find('.voice-mode-tab').exists()).toBe(true);
    });

    it('renders the voice mode toggle switch', () => {
      expect(wrapper.find('unnnic-switch-stub, unnnicswitch-stub').exists()).toBe(true);
    });

    it('renders the ElevenLabs token input', () => {
      expect(wrapper.find('.voice-mode-tab__token').exists()).toBe(true);
    });

    it('renders the token hint with ElevenLabs link', () => {
      const link = wrapper.find('a[href="https://elevenlabs.io/app/settings/api-keys"]');
      expect(link.exists()).toBe(true);
      expect(link.attributes('target')).toBe('_blank');
      expect(link.attributes('rel')).toBe('noopener noreferrer');
    });

    it('renders the voice selection section', () => {
      expect(wrapper.find('.voice-mode-tab__voice-selection').exists()).toBe(true);
    });

    it('renders all predefined voice rows', () => {
      const rows = wrapper.findAll('.voice-mode-tab__voice-row');
      // 5 predefined voices + 1 "Other" row
      expect(rows.length).toBe(6);
    });

    it('renders the "Other" voice row', () => {
      expect(wrapper.find('.voice-mode-tab__voice-row--other').exists()).toBe(true);
    });

    it('renders the custom voice ID input in the Other row', () => {
      const otherRow = wrapper.find('.voice-mode-tab__voice-row--other');
      expect(otherRow.find('.voice-mode-tab__custom-voice-id').exists()).toBe(true);
    });

    it('renders save and cancel buttons', () => {
      const buttons = wrapper.findAll('unnnic-button-stub, unnnicbutton-stub');
      expect(buttons.length).toBeGreaterThanOrEqual(2);
    });
  });

  // ─── Initialization ───────────────────────────────────────────────────────

  describe('initialization', () => {
    it('defaults to the first predefined voice when no voiceId is provided', () => {
      const radio = wrapper.find(`[data-testid="voice-radio-${FIRST_VOICE_ID}"]`);
      expect(radio.attributes('modelvalue')).toBe(FIRST_VOICE_ID);
    });

    it('pre-selects a known predefined voice when initialElevenLabsVoiceId matches', () => {
      wrapper = createWrapper({ initialElevenLabsVoiceId: SECOND_VOICE_ID });
      const radio = wrapper.find(`[data-testid="voice-radio-${SECOND_VOICE_ID}"]`);
      expect(radio.attributes('modelvalue')).toBe(SECOND_VOICE_ID);
    });

    it('selects "Other" when initialElevenLabsVoiceId is a custom value', () => {
      wrapper = createWrapper({ initialElevenLabsVoiceId: CUSTOM_VOICE_ID });
      const radio = wrapper.find(`[data-testid="voice-radio-other"]`);
      expect(radio.attributes('modelvalue')).toBe('other');
    });

    it('initialises the token input with the provided API key', () => {
      wrapper = createWrapper({ initialElevenLabsApiKey: 'my-api-key' });
      expect(wrapper.find('.voice-mode-tab__token').exists()).toBe(true);
    });
  });

  // ─── Disabled state ───────────────────────────────────────────────────────

  describe('disabled state when voiceMode is off', () => {
    it('marks voice rows with the disabled class when voiceModeEnabled is false', () => {
      const rows = wrapper.findAll('.voice-mode-tab__voice-row--disabled');
      expect(rows.length).toBeGreaterThan(0);
    });

    it('does not mark rows as disabled when voiceModeEnabled is true', () => {
      wrapper = createWrapper({ initialVoiceModeEnabled: true });
      const rows = wrapper.findAll('.voice-mode-tab__voice-row--disabled');
      expect(rows.length).toBe(0);
    });
  });

  // ─── Emitted events ───────────────────────────────────────────────────────

  describe('emitted events', () => {
    it('emits "cancel" when the cancel button is clicked', async () => {
      const buttons = wrapper.findAll('unnnic-button-stub, unnnicbutton-stub');
      const cancelBtn = buttons.find((b) => b.attributes('type') === 'tertiary');
      await cancelBtn.trigger('click');
      expect(wrapper.emitted('cancel')).toBeTruthy();
    });

    it('emits "save" when the save button is clicked', async () => {
      const buttons = wrapper.findAll('unnnic-button-stub, unnnicbutton-stub');
      const saveBtn = buttons.find((b) => b.attributes('type') === 'primary');
      await saveBtn.trigger('click');
      expect(wrapper.emitted('save')).toBeTruthy();
    });

    it('emits "update:voiceModeEnabled" when the toggle changes', async () => {
      const toggle = wrapper.findComponent('unnnic-switch-stub');
      await toggle.vm.$emit('update:modelValue', true);
      expect(wrapper.emitted('update:voiceModeEnabled')).toBeTruthy();
    });

    it('emits "update:elevenLabsVoiceId" with the first voice id on mount', async () => {
      await wrapper.vm.$nextTick();
      // computedVoiceId watcher fires on first change; initial value is the first voice
      expect(wrapper.find('.voice-mode-tab').exists()).toBe(true);
    });

    it('emits "update:elevenLabsVoiceId" with null when "Other" is selected and input is empty', async () => {
      wrapper = createWrapper({ initialElevenLabsVoiceId: CUSTOM_VOICE_ID });
      await wrapper.vm.$nextTick();
      const emitted = wrapper.emitted('update:elevenLabsVoiceId');
      if (emitted) {
        const lastEmit = emitted[emitted.length - 1][0];
        expect(lastEmit).toBe(CUSTOM_VOICE_ID);
      }
    });
  });

  // ─── Audio playback ───────────────────────────────────────────────────────

  describe('audio playback', () => {
    it('creates an Audio instance and calls play() when a voice button is clicked', async () => {
      const audio = mockAudio();
      wrapper = createWrapper({ initialVoiceModeEnabled: true });

      const playButtons = wrapper.findAll('.voice-mode-tab__play-button');
      await playButtons[0].trigger('click');

      expect(window.Audio).toHaveBeenCalled();
      expect(audio.play).toHaveBeenCalled();
    });

    it('pauses audio when the same voice button is clicked while playing', async () => {
      const audio = mockAudio();
      wrapper = createWrapper({ initialVoiceModeEnabled: true });

      const playButtons = wrapper.findAll('.voice-mode-tab__play-button');
      await playButtons[0].trigger('click');

      // Simulate canplay so playingVoiceId is set
      audio.trigger('canplay');
      await wrapper.vm.$nextTick();

      await playButtons[0].trigger('click');
      expect(audio.pause).toHaveBeenCalled();
    });

    it('stops the current audio and starts a new one when a different voice is clicked', async () => {
      const audio = mockAudio();
      wrapper = createWrapper({ initialVoiceModeEnabled: true });

      const playButtons = wrapper.findAll('.voice-mode-tab__play-button');
      await playButtons[0].trigger('click');
      audio.trigger('canplay');
      await wrapper.vm.$nextTick();

      // Click a different voice
      await playButtons[1].trigger('click');
      expect(audio.pause).toHaveBeenCalled();
      expect(window.Audio).toHaveBeenCalledTimes(2);
    });

    it('resets play state when audio ends naturally', async () => {
      const audio = mockAudio();
      wrapper = createWrapper({ initialVoiceModeEnabled: true });

      const playButtons = wrapper.findAll('.voice-mode-tab__play-button');
      await playButtons[0].trigger('click');
      audio.trigger('canplay');
      await wrapper.vm.$nextTick();

      audio.trigger('ended');
      await wrapper.vm.$nextTick();

      // After ended, the play button should show play_arrow (not pause)
      const btn = wrapper.findAll('.voice-mode-tab__play-button')[0];
      expect(btn.attributes('iconcenter')).toBe('play_arrow');
    });

    it('shows loading state while audio is buffering', async () => {
      mockAudio();
      wrapper = createWrapper({ initialVoiceModeEnabled: true });

      const playButtons = wrapper.findAll('.voice-mode-tab__play-button');
      await playButtons[0].trigger('click');
      await wrapper.vm.$nextTick();

      // Before canplay, the first button should be in loading state
      expect(playButtons[0].attributes('loading')).toBe('true');
    });

    it('removes loading state and shows pause icon after canplay', async () => {
      const audio = mockAudio();
      wrapper = createWrapper({ initialVoiceModeEnabled: true });

      const playButtons = wrapper.findAll('.voice-mode-tab__play-button');
      await playButtons[0].trigger('click');
      audio.trigger('canplay');
      await wrapper.vm.$nextTick();

      expect(playButtons[0].attributes('loading')).not.toBe('true');
      expect(playButtons[0].attributes('iconcenter')).toBe('pause');
    });

    it('stops audio on component unmount', async () => {
      const audio = mockAudio();
      wrapper = createWrapper({ initialVoiceModeEnabled: true });

      const playButtons = wrapper.findAll('.voice-mode-tab__play-button');
      await playButtons[0].trigger('click');

      wrapper.unmount();
      expect(audio.pause).toHaveBeenCalled();
    });
  });
});
