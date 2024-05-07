<template>
  <div class="app-config-generic">
    <div class="app-config-generic__header" ref="header">
      <div class="app-config-generic__header__title">
        <div class="app-config-generic__header__title__icon-container">
          <img
            class="app-config-generic__header__title__icon-container__icon"
            :src="app.config.channel_icon_url"
          />
        </div>
        <div class="app-config-generic__header__title__name">
          {{ app.config.channel_name }}
        </div>
      </div>
      <span class="app-config-generic__header__description" v-html="appDescription" />

      <div v-if="callbackChannels.includes(app.config.channel_code) && shouldDisplayCallback">
        <span class="app-config-generic__header__description bold">
          {{ $t('GenericApp.description.callback_url') }}
          <span class="highlight">
            {{
              `https://flows.weni.ai/c/${app.config.channel_code.toLowerCase()}/${
                app.config.channelUuid || currentApp.config.channelUuid
              }/receive`
            }}
          </span>
          <span v-if="app.config.channel_code === 'AC'">
            <br />
            {{ $t('GenericApp.description.callback_url_info_1') }}
            <a
              href="https://docs.weni.ai/l/pt/configura-es/criando-um-canal-do-slack"
              target="_blank"
            >
              {{ $t('GenericApp.description.callback_url_info_2') }}
            </a>
          </span>
        </span>
      </div>
    </div>

    <div class="app-config-generic__settings__content">
      <DynamicForm
        v-if="!loadingCurrentApp && !loadingFormBuild"
        class="app-config-generic__settings__content__form"
        :inputs="appFormInputs"
        @input="updateInputs"
      />
      <unnnic-skeleton-loading
        v-else
        class="app-config-generic__settings__content__form-loading"
        tag="div"
        width="100%"
        height="100%"
      />
    </div>

    <div class="app-config-generic__settings__buttons">
      <unnnic-button
        class="app-config-generic__settings__buttons__cancel"
        type="tertiary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="closeConfig"
      ></unnnic-button>

      <unnnic-button
        class="app-config-generic__settings__buttons__save"
        type="secondary"
        size="large"
        :text="$t('apps.config.save_changes')"
        :loading="loadingUpdateAppConfig"
        :disabled="isConfigured"
        @click="saveConfig"
      ></unnnic-button>
    </div>
  </div>
</template>

<script>
  import alert from '@/utils/call';
  import { mapActions, mapState } from 'pinia';
  import DynamicForm from '@/components/config/DynamicForm.vue';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { generic_store } from '@/stores/modules/appType/channels/generic.store';

  export default {
    name: 'generic-config',
    components: {
      DynamicForm,
    },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
      isConfigured: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        callbackChannels: ['SL', 'AC', 'CT', 'TMS'],
        appFormInputs: [],
        inputTypeMapping: {
          text: 'input',
          number: 'input',
          url: 'input',
          select: 'select',
          checkbox: 'checkbox',
        },
        loadingFormBuild: true,
        showCallback: false,
      };
    },
    async mounted() {
      const anchorsInHeader = this.$refs.header.getElementsByTagName('a');
      for (let i = anchorsInHeader.length; i--; ) {
        anchorsInHeader[i].setAttribute('target', '_blank');
      }

      await this.fetchAppData();
    },
    computed: {
      ...mapState(app_type, [
        'currentApp',
        'loadingCurrentApp',
        'errorCurrentApp',
        'loadingUpdateAppConfig',
        'errorUpdateAppConfig',
      ]),
      ...mapState(generic_store, ['errorAppForm', 'genericAppForm']),
      appDescription() {
        const i18nkey = `GenericApp.configuration_guide.${this.app.config.channel_code}`;
        return this.$te(i18nkey) ? this.$t(i18nkey) : this.app.config.channel_claim_blurb;
      },
      shouldDisplayCallback() {
        return this.isConfigured || this.showCallback;
      },
    },
    methods: {
      ...mapActions(app_type, ['getApp', 'updateAppConfig']),
      ...mapActions(generic_store, ['getAppForm']),
      async fetchAppData() {
        this.loadingFormBuild = true;
        await app_type().getApp({ code: this.app.code, appUuid: this.app.uuid });
        await generic_store().getAppForm({ channelCode: this.app.config.channel_code });

        if (this.errorCurrentApp || this.errorAppForm) {
          this.callModal({
            type: 'error',
            text: this.$t('GenericApp.preview.errors.fetch_app'),
          });
        }

        this.appFormInputs = this.genericAppForm.flatMap((input) => {
          const mappedInputType = this.inputTypeMapping[input.type];
          if (!mappedInputType) {
            return [];
          }

          let formattedInput = {
            type: mappedInputType,
            name: input.name,
            label: input.label || input.help_text || input.name,
            message: input.label ? input.help_text : null,
            value: this.currentApp.config[input.name] || null,
          };

          if (input.type === 'select') {
            let formattedOptions = input.choices.map((choice) => {
              return {
                value: choice[0],
                text: choice[1],
              };
            });

            formattedInput.options = formattedOptions;
          }
          return [formattedInput];
        });

        this.loadingFormBuild = false;
      },
      updateInputs(inputData) {
        if (inputData?.value) {
          this.appFormInputs[inputData.index].value = inputData.value;
        }
      },
      async saveConfig() {
        let payloadConfig = {};

        this.appFormInputs.forEach((input) => {
          payloadConfig[input.name] = input.value;
        });

        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            config: payloadConfig,
            channel_code: this.app.config.channel_code,
          },
        };

        await this.updateAppConfig(data);

        if (this.errorUpdateAppConfig) {
          this.callModal({ type: 'error', text: this.$t('apps.details.status_error') });
        } else {
          this.callModal({ type: 'success', text: this.$t('apps.config.integration_success') });

          await this.fetchAppData();
          this.showCallback = true;
        }

        this.$root.$emit('updateGrid');
      },
      closeConfig() {
        this.$emit('closeModal');
      },
      callModal({ text, type }) {
        alert.callAlert({
          props: {
            text: text,
            type: type,
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-config-generic {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__header {
      display: flex;
      margin: $unnnic-spacing-inset-lg;
      margin-bottom: $unnnic-spacing-stack-sm;
      flex-direction: column;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;

          &__icon {
            width: $unnnic-avatar-size-sm;
            margin: 0 auto;
          }
        }

        &__name {
          align-self: center;
          font-family: $unnnic-font-family-primary;
          font-weight: $unnnic-font-weight-regular;
          font-size: $unnnic-font-size-title-md;
          line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
          color: $unnnic-color-neutral-darkest;

          margin-left: $unnnic-inline-sm;
        }
      }

      &__description {
        &.bold {
          font-weight: $unnnic-font-weight-bold;
        }

        margin-top: $unnnic-inline-sm;
        padding-bottom: $unnnic-inline-md;

        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;

        ::v-deep {
          a {
            font-weight: $unnnic-font-weight-bold;
            color: $unnnic-color-neutral-cloudy;
          }

          .highlight {
            color: $unnnic-color-brand-weni-soft;
            background-color: $unnnic-color-background-solo;
            padding: $unnnic-spacing-stack-nano $unnnic-spacing-inline-nano;
            border-radius: $unnnic-border-radius-sm;
          }
        }
      }
    }

    &__settings {
      display: flex;
      flex-direction: column;
      height: 100%;

      &__content {
        border-top: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

        padding-right: $unnnic-spacing-inline-xs;
        display: flex;
        flex-direction: column;
        overflow: auto;
        flex: 1;

        height: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;
        flex: 1;
        color: $unnnic-color-neutral-cloudy;
        font-size: $unnnic-font-size-body-gt;
        line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
        margin: 0 $unnnic-spacing-inset-lg;

        &__form {
          display: flex;
          flex-direction: column;
          margin-top: $unnnic-spacing-stack-sm;
        }

        &__form-loading {
          margin-top: $unnnic-spacing-stack-sm;
          display: flex;
          flex: 1;
        }
      }
      &__buttons {
        padding-right: $unnnic-spacing-inline-xs;
        margin: $unnnic-spacing-inset-lg;
        display: flex;

        &__cancel,
        &__save {
          flex-grow: 1;
        }
      }
    }
  }

  @media screen and (max-width: 700px) {
    .app-config-generic {
      &__header {
        &__description {
          max-height: 600px;
          overflow: auto;
        }
      }
    }
  }
</style>
