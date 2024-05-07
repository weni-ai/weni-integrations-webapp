<template>
  <div class="app-config-wwc">
    <div class="app-config-wwc__header">
      <div class="app-config-wwc__header__icon-container">
        <img class="app-config-wwc__header__icon-container__icon" :src="app.icon" />
      </div>
      <div class="app-config-wwc__header__title">{{ selectedApp.name }}</div>
      <div class="app-config-wwc__header__close">
        <unnnic-button
          size="small"
          iconLeft="close-1"
          type="tertiary"
          class="app-config-wwc__header__close__button"
          @click="closeConfig"
        />
      </div>
    </div>

    <div class="app-config-wwc__content">
      <unnnic-tab class="app-config-wwc__tabs" :tabs="configTabs" initialTab="settings">
        <template slot="tab-head-settings"> {{ $t('weniWebChat.config.settings') }} </template>
        <template slot="tab-panel-settings">
          <div class="app-config-wwc__tabs__settings-content">
            <div class="app-config-wwc__tabs__settings-content__scroll">
              <unnnic-input
                class="app-config-wwc__tabs__settings-content__input__title"
                key="config-title"
                v-model="title"
                :type="errorFor('title') ? 'error' : 'normal'"
                :label="`${$t('weniWebChat.config.TitleInput.label')}`"
                :placeholder="$t('weniWebChat.config.TitleInput.placeholder')"
                :message="errorFor('title') || ''"
              />

              <div class="app-config-wwc__tabs__settings-content__input__subtitle-container">
                <unnnic-switch
                  v-model="enableSubtitle"
                  class="app-config-wwc__tabs__settings-content__switch"
                  :inititalState="false"
                  size="small"
                  :textLeft="$t('weniWebChat.config.SubtitleInput.label')"
                />

                <unnnic-input
                  v-model="subtitle"
                  class="app-config-wwc__tabs__settings-content__input__subtitle"
                  type="normal"
                  :placeholder="$t('weniWebChat.config.SubtitleInput.placeholder')"
                  :disabled="!enableSubtitle"
                />
              </div>

              <div class="app-config-wwc__tabs__settings-content__initPayload">
                <div class="app-config-wwc__tabs__settings-content__initPayload__horizontal">
                  <unnnic-switch
                    v-model="enableInitPayload"
                    class="app-config-wwc__tabs__settings-content__switch"
                    :inititalState="false"
                    size="small"
                    :textLeft="$t('weniWebChat.config.initPayloadInput.label')"
                  />
                  <unnnic-toolTip
                    class="app-config-wwc__tabs__settings-content__initPayload__tooltip"
                    slot="buttons"
                    :text="$t('weniWebChat.config.initPayloadToolTip')"
                    :enabled="true"
                    side="right"
                    maxWidth="300px"
                  >
                    <unnnic-icon-svg
                      class="app-config-wwc__tabs__settings-content__initPayload__icon"
                      icon="information-circle-4"
                      size="sm"
                      scheme="neutral-soft"
                    />
                  </unnnic-toolTip>
                </div>

                <transition name="fade">
                  <unnnic-input
                    v-if="enableInitPayload"
                    v-model="initPayload"
                    class="app-config-wwc__tabs__settings-content__input__payload"
                    type="normal"
                    :placeholder="$t('weniWebChat.config.initPayloadInput.placeholder')"
                  />
                </transition>
              </div>

              <div class="app-config-wwc__tabs__settings-content__input__tooltip-container">
                <unnnic-switch
                  v-model="enableTooltipMessage"
                  class="app-config-wwc__tabs__settings-content__switch"
                  :inititalState="false"
                  size="small"
                  :textLeft="$t('weniWebChat.config.TooltipInput.label')"
                />

                <transition name="fade">
                  <unnnic-input
                    v-if="enableTooltipMessage"
                    v-model="tooltipMessage"
                    class="app-config-wwc__tabs__settings-content__input__tooltip"
                    type="normal"
                    :placeholder="$t('weniWebChat.config.TooltipInput.placeholder')"
                  />
                </transition>
              </div>

              <unnnic-input
                v-model="inputTextFieldHint"
                class="app-config-wwc__tabs__settings-content__input"
                type="normal"
                :label="$t('weniWebChat.config.PlaceholderInput.label')"
                :placeholder="$t('weniWebChat.config.PlaceholderInput.placeholder')"
              />

              <div class="app-config-wwc__tabs__settings-content__selectors">
                <div class="app-config-wwc__tabs__settings-content__selectors__switches">
                  <unnnic-switch
                    v-model="showFullScreenButton"
                    :inititalState="false"
                    size="small"
                    :textRight="$t('weniWebChat.config.show_fullscreen_button')"
                  />
                  <unnnic-switch
                    v-model="displayUnreadCount"
                    :inititalState="false"
                    size="small"
                    :textRight="$t('weniWebChat.config.unread_messages_indicator')"
                  />
                  <unnnic-switch
                    v-model="keepHistory"
                    :inititalState="false"
                    size="small"
                    :textRight="$t('weniWebChat.config.keep_chat_history')"
                  />
                </div>
                <div class="app-config-wwc__tabs__settings-content__selectors__slider">
                  <div class="app-config-wwc__tabs__settings-content__selectors__slider__label">
                    {{ $t('weniWebChat.config.time_between_messages') }}
                  </div>
                  <unnnic-slider
                    :initialValue="timeBetweenMessages"
                    :minValue="1"
                    :maxValue="4"
                    minLabel="1s"
                    maxLabel="4s"
                    @valueChange="handleSliderChange"
                  />
                </div>
              </div>
            </div>

            <div class="app-config-wwc__tabs__settings-content__buttons">
              <unnnic-button
                class="app-config-wwc__tabs__settings-content__buttons__cancel"
                type="tertiary"
                size="large"
                :text="$t('general.Cancel')"
                @click="closeConfig"
              ></unnnic-button>

              <unnnic-button
                class="app-config-wwc__tabs__settings-content__buttons__save"
                type="primary"
                size="large"
                :text="$t('apps.config.save_changes')"
                :loading="loadingSave"
                @click="saveConfig"
              ></unnnic-button>
            </div>
          </div>
        </template>

        <template slot="tab-head-appearance"> {{ $t('weniWebChat.config.appearance') }} </template>
        <template slot="tab-panel-appearance">
          <div class="app-config-wwc__tabs__settings-content">
            <div class="app-config-wwc__tabs__settings-content__scroll">
              <div class="app-config-wwc__tabs__settings-content__files__content">
                <unnnic-label :label="$t('weniWebChat.config.custom_css')" />
                <unnnic-upload-area
                  v-model="customCssFiles"
                  :acceptMultiple="false"
                  supportedFormats=".css"
                  :maximumUploads="1"
                  :filesProgress="[cssUploadProgress]"
                  :isUploading="cssUploadState"
                  :canImport="true"
                  :canDelete="true"
                  :maxFileSize="2"
                  @fileChange="handleNewCss"
                />
              </div>
              <div class="app-config-wwc__tabs__settings-content__files__content">
                <unnnic-label :label="$t('weniWebChat.config.avatar_image')" />
                <unnnic-upload-area
                  v-model="avatarFiles"
                  :acceptMultiple="false"
                  supportedFormats=".png,.jpg,.jpeg"
                  :maximumUploads="1"
                  :filesProgress="[avatarUploadProgress]"
                  :isUploading="avatarUploadState"
                  :canImport="true"
                  :canDelete="true"
                  :maxFileSize="10"
                />
              </div>
              <div class="app-config-wwc__tabs__settings-content__files__content">
                <unnnic-label :label="$t('weniWebChat.config.main_color')" />
                <color-picker
                  ref="color-picker"
                  class="app-config-wwc__tabs__settings-content__colors__picker"
                  @colorChange="handleColorChange"
                />
              </div>
            </div>
            <div class="app-config-wwc__tabs__settings-content__buttons">
              <unnnic-button
                class="app-config-wwc__tabs__settings-content__buttons__cancel"
                type="tertiary"
                size="large"
                :text="$t('general.Cancel')"
                @click="closeConfig"
              ></unnnic-button>

              <unnnic-button
                class="app-config-wwc__tabs__settings-content__buttons__save"
                type="primary"
                size="large"
                :text="$t('apps.config.save_changes')"
                :loading="loadingSave"
                @click="saveConfig"
              ></unnnic-button>
            </div>
          </div>
        </template>

        <template slot="tab-head-script"> {{ $t('weniWebChat.config.script') }} </template>
        <template slot="tab-panel-script">
          <div class="app-config-wwc__tabs__script-content">
            <div
              class="app-config-wwc__tabs__script-content__text"
              v-html="$t('weniWebChat.config.script_tutorial')"
            />

            <unnnic-data-area :text="scriptCode" hoverText="">
              <unnnic-toolTip
                slot="buttons"
                :text="$t('weniWebChat.config.download')"
                :enabled="true"
                side="top"
              >
                <unnnic-button
                  class="app-config-wwc__tabs__script-content__download"
                  type="secondary"
                  size="large"
                  iconCenter="download-bottom-1"
                  @click="downloadScript"
                  :disabled="scriptCode ? false : true"
                ></unnnic-button>
              </unnnic-toolTip>
            </unnnic-data-area>
          </div>
        </template>
      </unnnic-tab>
    </div>

    <div ref="simulator-switch" class="app-config-wwc__simulator-switch" @click="toggleSimulator">
      <unnnic-icon-svg
        class="app-config-wwc__simulator-switch__icon"
        icon="view-1-1"
        size="xl"
        scheme="brand-weni-soft"
      />
    </div>
    <wwc-simulator
      ref="simulator"
      :avatar="simulatorAvatar"
      :mainColor="mainColor"
      :title="title"
      :subtitle="chatSubtitle"
      :placeholder="inputTextFieldHint"
      :showFullScreenButton="showFullScreenButton"
      :displayUnreadCount="displayUnreadCount"
    />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import alert from '@/utils/call';
  import { dataUrlToFile, toBase64 } from '../../../../utils/files';
  import ColorPicker from '../../../ColorPicker/index.vue';
  import wwcSimulator from './Simulator.vue';
  import removeEmpty from '../../../../utils/clean';

  export default {
    name: 'wwc-config',
    components: { ColorPicker, wwcSimulator },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    /* istanbul ignore next */
    data() {
      return {
        enableSubtitle: !!this.app.config.subtitle,
        simulatorAvatar: this.app.config.profileAvatar ?? null,
        mainColor: this.app.config.mainColor ?? '#009E96',
        title: this.app.config.title,
        subtitle: this.app.config.subtitle,
        inputTextFieldHint: this.app.config.inputTextFieldHint,
        scriptUrl: this.app.config.script ?? '',
        displayUnreadCount: !!this.app.config.displayUnreadCount,
        showFullScreenButton: !!this.app.config.showFullScreenButton,
        keepHistory: !!this.app.config.keepHistory,
        customCss: this.app.config.customCss ?? null,
        timeBetweenMessages: this.app.config.timeBetweenMessages ?? 1,
        initPayload: this.app.config.initPayload,
        enableInitPayload: !!this.app.config.initPayload,
        enableTooltipMessage: !!this.app.config.tooltipMessage,
        tooltipMessage: this.app.config.tooltipMessage,

        avatarFile: this.app.config.profileAvatar ?? null,
        customCssFile: this.app.config.customCss ?? null,

        cssUploadState: false,
        cssUploadProgress: 0,

        avatarUploadState: false,
        avatarUploadProgress: 0,
        selectedApp: this.app,
      };
    },
    watch: {
      displayUnreadCount: function (newDisplayUnreadCount) {
        if (newDisplayUnreadCount && this.$refs.simulator.isOpen) {
          this.$refs.simulator.toggleChat();
        }
      },
      configProperties() {
        this.$emit('setConfirmation', true);
      },
    },
    /* istanbul ignore next */
    async mounted() {
      if (this.selectedApp.config.profileAvatar) {
        this.avatarFile = await dataUrlToFile(this.selectedApp.config.profileAvatar, 'avatar.png');
        setTimeout(() => {
          this.$emit('setConfirmation', false);
        }, 250);
      }
      if (this.selectedApp.config.customCss) {
        const file = await dataUrlToFile(this.selectedApp.config.customCss, 'style.css');
        if (file) {
          await this.handleNewCss([file]);
          setTimeout(() => {
            this.$emit('setConfirmation', false);
          }, 250);
        }
      }
    },
    computed: {
      ...mapState(app_type, [
        'loadingUpdateAppConfig',
        'errorUpdateAppConfig',
        'currentApp',
        'loadingCurrentApp',
        'errorCurrentApp',
      ]),
      avatarFiles: {
        get() {
          return this.avatarFile ? [this.avatarFile] : [];
        },
        set(files) {
          this.handleNewAvatar(files);
        },
      },
      customCssFiles: {
        get() {
          return this.customCssFile ? [this.customCssFile] : [];
        },
        set(files) {
          this.handleNewCss(files);
        },
      },
      configTabs() {
        return ['settings', 'appearance', 'script'];
      },
      chatSubtitle() {
        return this.enableSubtitle ? this.subtitle : ' ';
      },
      chatInitPayload() {
        return this.enableInitPayload ? this.initPayload : null;
      },
      chatTooltipMessage() {
        return this.enableTooltipMessage ? this.tooltipMessage : null;
      },
      scriptCode() {
        const code = `<script>
  (function (d, s, u) {
    let h = d.getElementsByTagName(s)[0], k = d.createElement(s);
    k.onload = function () {
      let l = d.createElement(s); l.src = u; l.async = true;
      h.parentNode.insertBefore(l, k.nextSibling);
    };
    k.async = true; k.src = 'https://storage.googleapis.com/push-webchat/wwc-latest.js';
    h.parentNode.insertBefore(k, h);
  })(document, 'script', '${this.selectedApp.config.script}');
<${'/'}script>`;
        return this.selectedApp.config.script ? code : '';
      },
      cssForUpload() {
        return this.customCss;
      },
      configProperties() {
        return `
            ${this.mainColor}|
            ${this.title}|
            ${this.subtitle}|
            ${this.inputTextFieldHint}|
            ${this.tooltipMessage}|
            ${this.displayUnreadCount}|
            ${this.showFullScreenButton}|
            ${this.keepHistory}|
            ${this.customCss}|
            ${this.timeBetweenMessages}|
            ${this.initPayload}|
            ${this.simulatorAvatar}|
            ${this.avatarFile}|
            ${this.customCssFile}
            `;
      },
      loadingSave() {
        return this.loadingUpdateAppConfig || this.loadingCurrentApp;
      },
    },
    methods: {
      ...mapActions(app_type, ['updateAppConfig', 'getApp']),
      handleColorChange(color) {
        this.mainColor = color;
      },
      async imageForUpload() {
        return await toBase64(this.avatarFile);
      },
      /* istanbul ignore next */
      handleNewAvatar(files) {
        if (files.length < 1) {
          this.setNewAvatar(null, null, null);
          return;
        }

        const file = files[0];
        const fileReader = new FileReader();
        FileReader.onloadstart = this.startAvatarUploadProgress();
        fileReader.onprogress = (event) => this.updateAvatarUploadProgress(event);
        fileReader.onload = (event) => this.setNewAvatar(event.target.result, file.name);

        fileReader.readAsDataURL(file);
      },
      /* istanbul ignore next */
      handleNewCss(files) {
        if (files.length < 1) {
          this.setNewCss(null, null);
          return;
        }

        const file = files[0];
        const fileReader = new FileReader();
        FileReader.onloadstart = this.startCssUploadProgress();
        fileReader.onprogress = (event) => this.updateCssUploadProgress(event);
        fileReader.onload = (event) => this.setNewCss(event.target.result, file);

        fileReader.readAsText(file);
      },
      startCssUploadProgress() {
        this.cssUploadState = true;
        this.cssUploadProgress = 0;
      },
      updateCssUploadProgress(event) {
        this.cssUploadProgress = parseInt((event.loaded / event.total) * 100);
      },
      stopCssUploadProgress() {
        this.cssUploadState = false;
        this.cssUploadProgress = 0;
      },
      startAvatarUploadProgress() {
        this.avatarUploadState = true;
        this.avatarUploadProgress = 0;
      },
      updateAvatarUploadProgress(event) {
        this.avatarUploadProgress = parseInt((event.loaded / event.total) * 100);
      },
      stopAvatarUploadProgress() {
        this.avatarUploadState = false;
        this.avatarUploadProgress = 0;
      },
      async setNewAvatar(b64Avatar, fileName) {
        if (!b64Avatar) {
          this.avatarFile = null;
          this.simulatorAvatar = null;
          return;
        }

        const fileType = this.getFileType(b64Avatar);
        this.avatarFile = await dataUrlToFile(b64Avatar, fileName, fileType);
        this.simulatorAvatar = b64Avatar;
        this.stopAvatarUploadProgress();
      },
      setNewCss(customCss, file) {
        this.customCssFile = file;
        this.customCss = customCss;
        this.stopCssUploadProgress();
      },
      toggleSimulator() {
        this.$refs.simulator.toggleChat();
      },
      handleSliderChange(value) {
        this.timeBetweenMessages = parseInt(value);
      },
      clearAvatars() {
        this.simulatorAvatar = null;
        this.avatarFile = {};
      },
      clearCssFile() {
        this.customCss = null;
        this.customCssFile = {};
      },
      getFileType(b64File) {
        return b64File.split(';')[0].split(':')[1];
      },
      /* istanbul ignore next */
      async downloadScript() {
        let element = document.createElement('a');
        element.setAttribute(
          'href',
          'data:text/plain;charset=utf-8, ' + encodeURIComponent(this.scriptCode),
        );
        element.setAttribute('download', `wwc-script-${this.title}.html`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
      errorFor(key) {
        const value = this.$data[key];
        if (key === 'title') {
          if (!(value && value.trim())) {
            return this.$t('errors.empty_input');
          }
          if (value.length > 20) {
            return 'By default, the maximum is 20 characters.';
          }
        }
      },
      validConfig() {
        let valid = true;

        Object.entries(this.$data).forEach(([key]) => {
          const error = this.errorFor(key);
          if (error) {
            alert.callAlert({
              props: {
                text: error,
                type: 'error',
              },
              seconds: 3,
            });
            valid = false;
          }
        });
        return valid;
      },
      async saveConfig() {
        if (!this.validConfig()) {
          return;
        }

        /* istanbul ignore next */
        const reqData = removeEmpty({
          code: this.selectedApp.code,
          appUuid: this.selectedApp.uuid,
          payload: {
            config: {
              title: this.title,
              subtitle: this.enableSubtitle ? this.subtitle : null,
              initPayload: this.chatInitPayload,
              tooltipMessage: this.chatTooltipMessage,
              inputTextFieldHint: this.inputTextFieldHint,
              showFullScreenButton: this.showFullScreenButton,
              displayUnreadCount: this.displayUnreadCount,
              timeBetweenMessages: this.timeBetweenMessages,
              keepHistory: this.keepHistory,
              mainColor: this.mainColor,
              profileAvatar: await this.imageForUpload(),
              customCss: this.cssForUpload,
            },
          },
        });

        try {
          const firstSave = !this.scriptCode;
          await this.updateAppConfig(reqData);

          if (this.errorUpdateAppConfig) {
            throw new Error(this.errorUpdateAppConfig);
          }

          await this.getApp({ code: this.selectedApp.code, appUuid: this.selectedApp.uuid });

          if (this.errorCurrentApp) {
            throw new Error(this.errorCurrentApp);
          }

          this.selectedApp.config = this.currentApp.config;
          this.$emit('setConfirmation', false);
          alert.callAlert({
            props: {
              text: /* istanbul ignore next */ firstSave
                ? this.$t('apps.config.first_integration_success')
                : this.$t('apps.config.integration_success'),
              type: 'success',
            },
            seconds: /* istanbul ignore next */ firstSave ? 8 : 3,
          });
        } catch (err) {
          alert.callAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              type: 'error',
            },
            seconds: 3,
          });
        } finally {
          this.$root.$emit('updateGrid');
        }
      },
      closeConfig() {
        this.$emit('closeModal');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .fade-enter-active .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter .fade-leave-to {
    opacity: 0;
  }

  .app-config-wwc {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__content {
      overflow: auto;
      display: flex;
      width: 100%;
      flex-direction: column;
      flex: 1;
      color: $unnnic-color-neutral-cloudy;
      font-size: $unnnic-font-size-body-gt;
      line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
      margin: $unnnic-spacing-inset-lg;
      margin-top: 0;
    }

    &__header {
      display: flex;
      width: 95%;
      margin: $unnnic-spacing-inset-lg;
      margin-bottom: $unnnic-spacing-stack-sm;

      &__icon-container {
        display: flex;
        justify-self: flex-start;
        width: $unnnic-avatar-size-sm;
        height: $unnnic-avatar-size-sm;
        border-radius: $unnnic-border-radius-sm;

        background-color: rgba(0, 222, 211, 0.2);

        &__icon {
          margin: $unnnic-inline-nano;
          width: 40px;
        }
      }

      &__title {
        display: flex;
        justify-self: flex-start;
        align-self: center;
        font-family: $unnnic-font-family-primary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-title-md;
        line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
        color: $unnnic-color-neutral-darkest;
        margin-left: $unnnic-inline-sm;
        width: 432px;
      }

      &__close {
        display: flex;
        justify-content: flex-end;
        justify-self: flex-end;
        width: 100%;
        padding-right: $unnnic-spacing-inline-xs;
        &__button {
          justify-self: flex-end;
          display: flex;
        }
      }
    }

    &__tabs {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: hidden;
      width: 100%;

      ::v-deep .tab-body {
        display: flex;
        height: 100%;
        overflow-y: auto;
      }
      ::v-deep .tab-panel {
        width: 100%;

        display: flex;
        flex-direction: column;
        height: 100%;

        > div {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
      }
      &__settings-content {
        padding-right: $unnnic-spacing-inline-lg;
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 95%;
        overflow: hidden;

        &__scroll {
          display: flex;
          flex-direction: column;
          overflow: auto;
          padding-right: $unnnic-spacing-stack-sm;
        }

        ::v-deep .unnnic-form__message {
          color: $unnnic-color-feedback-red;
        }

        &__input {
          margin-top: $unnnic-spacing-stack-xs;

          &__title {
            ::v-deep .unnnic-form-input {
              /* Chrome, Firefox, Opera, Safari 10.1+ */
              ::placeholder {
                color: $unnnic-color-feedback-red;
                opacity: 1; /* Firefox */
              }

              /* Internet Explorer 10-11 */
              :-ms-input-placeholder {
                color: $unnnic-color-feedback-red;
              }

              /* Microsoft Edge */
              ::-ms-input-placeholder {
                color: $unnnic-color-feedback-red;
              }
            }
          }

          &__subtitle-container {
            margin-top: $unnnic-spacing-stack-sm;
          }

          &__subtitle {
            margin-top: $unnnic-spacing-stack-nano;
          }

          &__payload {
            flex: 1;
            margin-top: $unnnic-spacing-stack-xs;

            ::v-deep .unnnic-form-input {
              margin-top: $unnnic-spacing-stack-xs;
            }
          }

          &__tooltip-container {
            margin-top: $unnnic-spacing-stack-sm;
          }

          &__tooltip {
            margin-top: $unnnic-spacing-stack-nano;
          }
        }

        &__initPayload {
          margin-top: $unnnic-spacing-stack-sm;

          &__horizontal {
            display: flex;
          }
          &__label {
            font-family: $unnnic-font-family-secondary;
            font-weight: $unnnic-font-weight-regular;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
            color: $unnnic-color-neutral-cloudy;
          }

          &__icon {
            margin-top: $unnnic-spacing-stack-nano;
            margin-left: $unnnic-inline-nano;
          }
        }

        &__switch {
          ::v-deep .unnnic-switch__label {
            font-size: $unnnic-font-size-body-gt;
            color: $unnnic-color-neutral-cloudy;
          }
        }

        &__horizontal-input {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: $unnnic-inline-sm;
        }

        &__files {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: $unnnic-inline-sm;
          margin-top: $unnnic-spacing-stack-sm;

          &__content {
            flex-grow: 1;
            color: $unnnic-color-neutral-cloudy;
            font-family: $unnnic-font-family-secondary;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

            &__label {
              margin-bottom: $unnnic-spacing-stack-xs;
            }
          }
        }

        &__selectors {
          display: flex;
          justify-content: space-between;
          gap: $unnnic-inline-sm;
          margin-top: $unnnic-spacing-stack-md;
          flex-wrap: wrap;
          margin-bottom: auto;

          &__switches &__slider {
            flex-grow: 1;
          }

          &__switches {
            display: flex;
            flex-direction: column;
            gap: $unnnic-spacing-stack-xs;
          }

          &__slider {
            &__label {
              color: $unnnic-color-neutral-cloudy;
              font-family: $unnnic-font-family-secondary;
              font-size: $unnnic-font-size-body-gt;
              line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
            }
          }
        }

        &__colors {
          margin-top: $unnnic-spacing-stack-sm;

          &__label {
            color: $unnnic-color-neutral-cloudy;
            font-family: $unnnic-font-family-secondary;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
          }

          &__picker {
            margin-top: $unnnic-spacing-stack-xs;
            cursor: pointer;
          }
        }

        &__buttons {
          margin-top: $unnnic-spacing-stack-sm;
          display: flex;
          width: 95%;
          gap: $unnnic-spacing-inline-xs;
          justify-content: center;

          &__cancel &__save {
            flex-grow: 1;
            width: 250px;
            margin: $unnnic-spacing-inline-xs;
          }
        }
      }

      &__script-content {
        display: flex;
        width: 95%;
        flex-direction: column;
        gap: $unnnic-inline-xs;

        &__text {
          color: $unnnic-color-neutral-dark;
          font-family: $unnnic-font-family-secondary;
          font-size: $unnnic-font-size-body-lg;
          line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
        }

        .data-area-container {
          width: 95%;
        }
      }
    }

    &__simulator-switch {
      cursor: pointer;
      position: fixed;
      z-index: 2;
      bottom: 50%;
      right: calc(50% - 31px);
      background-color: $unnnic-color-neutral-snow;
      border-radius: $unnnic-border-radius-pill;
      width: 62px;
      height: 62px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: $unnnic-shadow-level-near;
      transition: all 0.5s;

      &:hover {
        background-color: $unnnic-color-neutral-lightest;
      }
    }

    .wwc-simulator {
      position: fixed;
      z-index: 1;
      bottom: 0;
      right: 50%;
      max-width: 293px;
      height: auto;
      margin-right: $unnnic-spacing-inline-sm;
      margin-bottom: $unnnic-spacing-stack-md;
    }
  }
</style>

<style lang="scss">
  .unnnic-upload-area__dropzone {
    cursor: pointer;
  }
</style>
