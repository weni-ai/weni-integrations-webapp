<template>
  <div class="app-config-wwc" :style="cssVars">
    <div class="app-config-wwc__header">
      <div class="app-config-wwc__header__icon-container">
        <img class="app-config-wwc__header__icon-container__icon" :src="app.icon" />
      </div>
      <div class="app-config-wwc__header__title">{{ app.name }}</div>
    </div>

    <unnnic-tab class="app-config-wwc__tabs" :tabs="configTabs" initialTab="settings">
      <template slot="tab-head-settings"> {{ $t('weniWebChat.config.settings') }} </template>
      <template slot="tab-panel-settings">
        <div class="app-config-wwc__tabs__settings-content">
          <unnnic-input
            key="config-title"
            v-model="title"
            type="normal"
            :label="$t('weniWebChat.config.TitleInput.label')"
            :placeholder="$t('weniWebChat.config.TitleInput.placeholder')"
          />

          <unnnic-switch
            v-model="enableSubtitle"
            class="app-config-wwc__tabs__settings-content__switch"
            :inititalState="false"
            size="small"
            :textLeft="$t('weniWebChat.config.SubtitleInput.label')"
          />

          <unnnic-input
            v-if="enableSubtitle"
            v-model="subtitle"
            class="app-config-wwc__tabs__settings-content__input__subtitle"
            type="normal"
            :placeholder="$t('weniWebChat.config.SubtitleInput.placeholder')"
          />

          <unnnic-input
            v-model="inputTextFieldHint"
            class="app-config-wwc__tabs__settings-content__input"
            type="normal"
            :label="$t('weniWebChat.config.PlaceholderInput.label')"
            :placeholder="$t('weniWebChat.config.PlaceholderInput.placeholder')"
          />

          <div class="app-config-wwc__tabs__settings-content__files">
            <div class="app-config-wwc__tabs__settings-content__files__content">
              <div class="app-config-wwc__tabs__settings-content__files__content__label">
                {{ $t('weniWebChat.config.custom_css') }}
              </div>
              <file-upload type="style" formatsLabel=".CSS" @newFile="handleNewCss" />
            </div>
            <div class="app-config-wwc__tabs__settings-content__files__content">
              <div class="app-config-wwc__tabs__settings-content__files__content__label">
                {{ $t('weniWebChat.config.avatar_image') }}
              </div>
              <file-upload
                type="image"
                formatsLabel=".PNG, .JPEG, .SVG"
                @newFile="handleNewAvatar"
              />
            </div>
          </div>

          <div class="app-config-wwc__tabs__settings-content__selectors">
            <div class="app-config-wwc__tabs__settings-content__selectors__switches">
              <unnnic-switch
                v-model="showFullscreenButton"
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
                minLabel="1"
                maxLabel="4"
                @valueChange="handleSliderChange"
              />
            </div>
          </div>

          <div class="app-config-wwc__tabs__settings-content__colors">
            <div class="app-config-wwc__tabs__settings-content__colors__label">
              {{ $t('weniWebChat.config.main_color') }}
            </div>
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
            type="terciary"
            size="large"
            :text="$t('weniWebChat.config.configure_later')"
          ></unnnic-button>

          <unnnic-button
            class="app-config-wwc__tabs__settings-content__buttons__save"
            type="secondary"
            size="large"
            :text="$t('weniWebChat.config.save_changes')"
            @click="saveConfig"
          ></unnnic-button>
        </div>
      </template>

      <template slot="tab-head-script"> {{ $t('weniWebChat.config.script') }} </template>
      <template slot="tab-panel-script">
        <div class="app-config-wwc__tabs__script-content">
          <unnnic-data-area :text="scriptCode">
            <unnnic-toolTip
              slot="buttons"
              :text="$t('weniWebChat.config.copy')"
              :enabled="true"
              side="top"
            >
              <unnnic-button
                class="app-config-wwc__tabs__script-content__copy"
                type="secondary"
                size="large"
                iconCenter="copy-paste-1"
                @click="copyScript"
              ></unnnic-button>
            </unnnic-toolTip>
          </unnnic-data-area>
        </div>
      </template>
    </unnnic-tab>

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
      :showFullscreenButton="showFullscreenButton"
      :displayUnreadCount="displayUnreadCount"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import FileUpload from '../../../FileUpload.vue';
  import ColorPicker from '../../../ColorPicker.vue';
  import wwcSimulator from './Simulator.vue';
  import removeEmpty from '../../../../utils/clean';

  export default {
    name: 'wwc-config',
    components: { FileUpload, ColorPicker, wwcSimulator },
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
        simulatorAvatar: this.app.config.avatarImage ?? null,
        mainColor: this.app.config.mainColor ?? '#009E96',
        title: this.app.config.title,
        subtitle: this.app.config.subtitle,
        inputTextFieldHint: this.app.config.inputTextFieldHint,
        scriptUrl: this.app.config.script ?? '',
        displayUnreadCount: !!this.app.config.displayUnreadCount,
        showFullscreenButton: !!this.app.config.showFullscreenButton,
        keepHistory: !!this.app.config.keepHistory,
        customCss: this.app.config.customCss ?? null,
        timeBetweenMessages: this.app.config.timeBetweenMessages ?? 1,
      };
    },
    watch: {
      displayUnreadCount: function (newDisplayUnreadCount) {
        if (newDisplayUnreadCount && this.$refs.simulator.isOpen) {
          this.$refs.simulator.toggleChat();
        }
      },
    },
    computed: {
      configTabs() {
        return ['settings', 'script'];
      },
      cssVars() {
        return {
          '--config-bg-color': this.app.bg_color,
        };
      },
      chatSubtitle() {
        return this.enableSubtitle ? this.subtitle : ' ';
      },
      scriptCode() {
        const a = `<script>
  (function (d, s, u) {
    let h = d.getElementsByTagName(s)[0], k = d.createElement(s);
    k.onload = function () {
      let l = d.createElement(s); l.src = u; l.async = true;
      h.parentNode.insertBefore(l, k.nextSibling);
    };
    k.async = true; k.src = 'https://storage.googleapis.com/push-webchat/wwc-latest.js';
    h.parentNode.insertBefore(k, h);
  })(document, 'script', '${this.app.config.script}');
<script/>`;
        return a;
      },
    },
    methods: {
      ...mapActions(['updateAppConfig']),
      handleColorChange(color) {
        this.mainColor = color;
      },
      /* istanbul ignore next */
      handleNewAvatar(avatar) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => this.setNewAvatar(event.target.result);
        fileReader.readAsDataURL(avatar);
      },
      /* istanbul ignore next */
      handleNewCss(css) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => this.setNewCss(event.target.result);
        fileReader.readAsText(css);
      },
      setNewAvatar(avatarUrl) {
        this.simulatorAvatar = avatarUrl;
      },
      setNewCss(customCss) {
        this.customCss = customCss;
      },
      toggleSimulator() {
        this.$refs.simulator.toggleChat();
      },
      handleSliderChange(value) {
        this.timeBetweenMessages = parseInt(value);
      },
      /* istanbul ignore next */
      async copyScript() {
        await navigator.clipboard.writeText(this.scriptCode);
      },
      async saveConfig() {
        /* istanbul ignore next */
        const data = removeEmpty({
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            config: {
              title: this.title,
              subtitle: this.enableSubtitle ? this.subtitle : null,
              inputTextFieldHint: this.inputTextFieldHint,
              showFullscreenButton: this.showFullscreenButton,
              displayUnreadCount: this.displayUnreadCount,
              keepHistory: this.keepHistory,
              mainColor: this.mainColor,
              avatarImage: this.simulatorAvatar,
              customCss: this.customCss,
            },
          },
        });

        // remove avatar image if not base64
        /* istanbul ignore next */
        if (
          data.payload.config.avatarImage &&
          !data.payload.config.avatarImage.startsWith('data:image')
        ) {
          delete data.payload.config.avatarImage;
        }
        try {
          await this.updateAppConfig(data);
          unnnicCallAlert({
            props: {
              text: this.$t('apps.config.integration_success'),
              title: 'Success',
              icon: 'check-circle-1-1',
              scheme: 'feedback-green',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } catch (err) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } finally {
          this.$root.$emit('updateGrid');
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-wwc {
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
    height: -moz-available;
    padding: $unnnic-spacing-stack-lg;

    &__header {
      display: flex;
      margin-bottom: $unnnic-spacing-stack-sm;

      &__icon-container {
        display: flex;
        width: $unnnic-avatar-size-sm;
        height: $unnnic-avatar-size-sm;
        border-radius: $unnnic-border-radius-sm;

        background-color: var(--config-bg-color);

        &__icon {
          width: $unnnic-icon-size-md;
          margin: 0 auto;
        }
      }

      &__title {
        align-self: center;
        font-family: $unnnic-font-family-primary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-title-md;
        line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
        color: $unnnic-color-neutral-darkest;

        margin-left: $unnnic-inline-sm;
      }
    }

    &__tabs {
      display: flex;
      flex-direction: column;
      height: -webkit-fill-available;
      height: -moz-available;
      overflow-y: hidden;

      ::v-deep .tab-body {
        display: flex;
        height: -webkit-fill-available;
        height: -moz-available;
        overflow-y: auto;
      }
      ::v-deep .tab-panel {
        width: -webkit-fill-available;
        width: -moz-available;
      }
      &__settings-content {
        padding-right: $unnnic-spacing-inline-xs;
        display: flex;
        flex-direction: column;

        &__input {
          margin-top: $unnnic-spacing-stack-xs;

          &__subtitle {
            margin-top: $unnnic-spacing-stack-xs;
          }
        }

        &__switch {
          margin-top: $unnnic-spacing-stack-sm;
          ::v-deep .unnnic-switch__label {
            font-size: $unnnic-font-size-body-gt;
            color: $unnnic-color-neutral-cloudy;
          }
        }

        &__files {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: $unnnic-inline-sm;
          margin-top: $unnnic-spacing-stack-sm;

          &__content {
            flex-grow: 1;
            flex-basis: 170px;
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

          &__switches,
          &__slider {
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
          }
        }

        &__buttons {
          padding-right: $unnnic-spacing-inline-xs;
          margin-top: $unnnic-spacing-stack-sm;
          display: flex;

          &__cancel,
          &__save {
            flex-grow: 1;
          }
        }
      }

      &__script-content {
        display: flex;
        gap: $unnnic-inline-xs;

        &__input {
          flex: 1;
        }
      }
    }

    &__simulator-switch {
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
    }

    .wwc-simulator {
      position: fixed;
      z-index: 1;
      bottom: 0;
      right: 50%;
      max-width: 293px;
      height: auto;
      margin-right: 10px;
      margin-bottom: 25px;
    }
  }
</style>
