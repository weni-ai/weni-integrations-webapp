<template>
  <div class="app-config-wwc" :style="cssVars">
    <div class="app-config-wwc__header">
      <div class="app-config-wwc__header__icon-container">
        <img class="app-config-wwc__header__icon-container__icon" :src="app.icon" />
      </div>
      <div class="app-config-wwc__header__title">{{ app.name }}</div>
    </div>

    <unnnic-tab class="app-config-wwc__tabs" :tabs="configTabs" initialTab="settings">
      <template slot="tab-head-settings"> {{ $t('Settings') }} </template>
      <template slot="tab-panel-settings">
        <div class="app-config-wwc__tabs__settings-content">
          <unnnic-input
            v-model="simulatorTitle"
            type="normal"
            :label="$t('Chat_title')"
            :placeholder="app.config.placeholder || $t('Title')"
          />

          <unnnic-switch
            v-model="enableSubtitle"
            class="app-config-wwc__tabs__settings-content__switch"
            :inititalState="false"
            size="small"
            :textLeft="$t('Chat_subtitle')"
          />

          <unnnic-input
            v-if="enableSubtitle"
            v-model="simulatorSubtitle"
            class="app-config-wwc__tabs__settings-content__input__subtitle"
            type="normal"
            :placeholder="app.config.placeholder || $t('Title')"
          />

          <unnnic-input
            v-model="simulatorPlaceholder"
            class="app-config-wwc__tabs__settings-content__input"
            type="normal"
            :label="$t('Placeholder_text')"
            :placeholder="app.config.placeholder || $t('Title')"
          />

          <div class="app-config-wwc__tabs__settings-content__files">
            <div class="app-config-wwc__tabs__settings-content__files__content">
              <div class="app-config-wwc__tabs__settings-content__files__content__label">
                {{ $t('Custom_CSS') }}
              </div>
              <file-upload type="style" formatsLabel=".CSS" />
            </div>
            <div class="app-config-wwc__tabs__settings-content__files__content">
              <div class="app-config-wwc__tabs__settings-content__files__content__label">
                {{ $t('Avatar_image') }}
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
                :inititalState="false"
                size="small"
                :textRight="$t('Show_fullscreen_button')"
              />
              <unnnic-switch
                :inititalState="false"
                size="small"
                :textRight="$t('Unread_messages_indicator')"
              />
              <unnnic-switch
                :inititalState="false"
                size="small"
                :textRight="$t('Keep_chat_history')"
              />
            </div>
            <div class="app-config-wwc__tabs__settings-content__selectors__slider">
              <div class="app-config-wwc__tabs__settings-content__selectors__slider__label">
                {{ $t('Time_between_messages') }}
              </div>
              <unnnic-slider
                :initialValue="1"
                :minValue="1"
                :maxValue="4"
                minLabel="1"
                maxLabel="4"
              />
            </div>
          </div>

          <div class="app-config-wwc__tabs__settings-content__colors">
            <div class="app-config-wwc__tabs__settings-content__colors__label">
              {{ $t('Main_color') }}
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
            :text="$t('Configure_later')"
          ></unnnic-button>

          <unnnic-button
            class="app-config-wwc__tabs__settings-content__buttons__save"
            type="primary"
            size="large"
            :text="$t('Save_changes')"
          ></unnnic-button>
        </div>
      </template>

      <template slot="tab-head-script"> Script </template>
      <template slot="tab-panel-script">
        <div class="app-config-wwc__tabs__script-content">
          <unnnic-input
            v-model="script"
            class="app-config-wwc__tabs__script-content__input"
            type="normal"
            :placeholder="$t('Script_placeholder')"
          >
          </unnnic-input>
          <unnnic-toolTip :text="$t('Copy')" :enabled="true" side="top">
            <unnnic-button
              class="app-config-wwc__tabs__script-content__copy"
              type="secondary"
              size="large"
              iconCenter="copy-paste-1"
            ></unnnic-button>
          </unnnic-toolTip>
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
      :mainColor="simulatorColor"
      :title="simulatorTitle"
      :subtitle="simulatorSubtitle"
      :placeholder="simulatorPlaceholder"
    />
  </div>
</template>

<script>
  /* istanbul ignore next */
  import FileUpload from '../../../FileUpload.vue';
  import ColorPicker from '../../../ColorPicker.vue';
  import wwcSimulator from './Simulator.vue';

  export default {
    name: 'wwc-config',
    components: { FileUpload, ColorPicker, wwcSimulator },
    props: {
      app: {
        type: Object,
        default: () => {},
      },
    },
    data() {
      return {
        enableSubtitle: false,
        simulatorAvatar: null,
        simulatorColor: '#009E96',
        simulatorTitle: null,
        simulatorSubtitle: null,
        simulatorPlaceholder: null,
        script: '',
      };
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
    },
    methods: {
      handleColorChange(color) {
        this.simulatorColor = color;
      },
      /* istanbul ignore next */
      handleNewAvatar(avatar) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => this.setNewAvatar(event.target.result);
        fileReader.readAsDataURL(avatar);
      },
      setNewAvatar(avatarUrl) {
        this.simulatorAvatar = avatarUrl;
      },
      toggleSimulator() {
        this.$refs.simulator.toggleChat();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-wwc {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: $unnnic-spacing-stack-lg;
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
      flex: 1;
      max-height: 95%;

      ::v-deep .tab-body {
        display: flex;
        flex: 1;
        height: 100%;
      }
      ::v-deep .tab-panel {
        flex-direction: column;
        display: flex;
        flex: 1;
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
          margin-top: $unnnic-spacing-stack-md;

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
          margin-top: $unnnic-spacing-stack-sm;
          display: flex;
          justify-content: space-between;
          align-content: flex-end;

          &__cancel,
          &__save {
            flex-grow: 1;
          }

          &__save {
            background-color: $unnnic-color-brand-weni-soft;
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
      max-height: 461px;
      margin-right: 10px;
      margin-bottom: 25px;
    }
  }
</style>
