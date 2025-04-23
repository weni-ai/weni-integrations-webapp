import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import unnnic from '@weni/unnnic-system';
import { app_type } from '@/stores/modules/appType/appType.store';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';

vi.mock('@/utils/files', () => ({
  dataUrlToFile: vi.fn(),
  toBase64: vi.fn(),
}));

describe('wwcConfig Component', () => {
  let wrapper;
  let store;
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);

  beforeEach(() => {
    store = app_type();
    store.currentApp = { config: { title: 'App Teste' } };
    store.loadingUpdateAppConfig = false;
    store.loadingCurrentApp = false;

    wrapper = shallowMount(wwcConfig, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          unnnic,
          $t: (e) => e,
        },
      },
      props: {
        app: {
          config: {
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            mainColor: '#009E96',
            inputTextFieldHint: 'Type here...',
            tooltipMessage: 'Tooltip',
            displayUnreadCount: true,
            showFullScreenButton: true,
            keepHistory: true,
            customCss: '.test { color: red; }',
            profileAvatar: 'avatar.png',
            script: 'https://test.script.url',
            params: {
              storage: 'local',
            },
          },
        },
      },
    });
  });

  it('should compute chatSubtitle correctly', () => {
    expect(wrapper.vm.chatSubtitle).toBe('Test Subtitle');
    wrapper.setData({ enableSubtitle: false });
    expect(wrapper.vm.chatSubtitle).toBe(' ');
  });

  it('should compute scriptCode correctly', () => {
    const expectedScript = `<script>
  (function (weni_d, weni_s, weni_u) {
    let weni_h = weni_d.getElementsByTagName(weni_s)[0], weni_k = weni_d.createElement(weni_s);
    weni_k.onload = function () {
      let weni_l = weni_d.createElement(weni_s); weni_l.src = weni_u; weni_l.async = true;
      weni_h.parentNode.insertBefore(weni_l, weni_k.nextSibling);
    };
    weni_k.async = true; weni_k.src = 'https://storage.googleapis.com/push-webchat/wwc-latest.js';
    weni_h.parentNode.insertBefore(weni_k, weni_h);
  })(document, 'script', 'https://test.script.url');
</script>`;
    expect(wrapper.vm.scriptCode).toBe(expectedScript);
  });

  it('should emit setConfirmation when configProperties change', async () => {
    await wrapper.setData({ mainColor: '#FF0000' });
    expect(wrapper.emitted().setConfirmation).toBeTruthy();
  });

  it('should validate input fields correctly', () => {
    wrapper.setData({ title: '' });
    expect(wrapper.vm.errorFor('title')).toBe('Required fields cannot be empty.');
    wrapper.setData({ title: 'A long title that exceeds the character limit' });
    expect(wrapper.vm.errorFor('title')).toBe('By default, the maximum is 20 characters.');
  });

  it('should start avatar upload progress', async () => {
    const files = [new File(['avatar'], 'avatar.png', { type: 'image/png' })];
    const fileReader = {
      readAsDataURL: vi.fn(),
      onloadstart: vi.fn(),
      onprogress: vi.fn(),
      onload: vi.fn(),
    };

    global.FileReader = vi.fn(() => fileReader);
    await wrapper.vm.handleNewAvatar(files);
    const file = files[0];
    const blob = new Blob([file], { type: file.type });
    expect(fileReader.readAsDataURL).toHaveBeenCalledWith(blob);
  });

  it('should emit closeModal event when closing the config', () => {
    wrapper.vm.closeConfig();
    expect(wrapper.emitted().closeModal).toBeTruthy();
  });

  it('should show error alert if saveConfig validation fails', async () => {
    const spy = vi.spyOn(unnnic, 'unnnicCallAlert');
    wrapper.setData({ title: '' });
    await wrapper.vm.saveConfig();
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({ type: 'error' }),
      }),
    );
  });

  it('should show an error alert if saveConfig fails', async () => {
    const updateConfigSpy = vi
      .spyOn(wrapper.vm, 'updateAppConfig')
      .mockRejectedValue(new Error('Network Error'));

    const alertSpy = vi.spyOn(unnnic, 'unnnicCallAlert');

    await wrapper.vm.saveConfig();

    expect(alertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        props: expect.objectContaining({ type: 'error' }),
      }),
    );

    expect(updateConfigSpy).toHaveBeenCalled();
  });

  it('should call updateAppConfig when saveConfig is triggered', async () => {
    const spyUpdateAppConfig = vi.spyOn(store, 'updateAppConfig');
    wrapper.setData({ title: 'Valid Title' });
    await wrapper.vm.saveConfig();
    expect(spyUpdateAppConfig).toHaveBeenCalled();
  });
});
