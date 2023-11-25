<template>
  <unnnic-modal
    class="vtex-modal"
    @close="closePopUp"
    @click.stop
    :closeIcon="false"
    :text="$t('vtex.setup.title')"
    :description="$t('vtex.setup.description')"
  >
    <div slot="message" class="vtex-modal__content">
      <div class="vtex-modal__content__form">
        <div>
          <unnnic-label :label="$t('vtex.setup.whatsapp_channel')" />
          <unnnic-select-smart
            v-if="!loadingChannels"
            ref="whatsappChannelSelect"
            v-model="selectedChannel"
            :options="whatsappChannels"
          />
          <unnnic-skeleton-loading v-else tag="div" width="100%" height="42px" />
        </div>

        <unnnic-input
          class="vtex-modal__content__form__input__subdomain"
          v-model="subdomain"
          :label="$t('vtex.setup.subdomain')"
          :placeholder="$t('vtex.setup.subdomain_placeholder')"
        />

        <div class="vtex-modal__content__form__keys">
          <unnnic-input
            class="vtex-modal__content__form__input__subdomain"
            v-model="appKey"
            :label="$t('vtex.setup.appKey')"
            :placeholder="$t('vtex.setup.appKey_placeholder')"
          />

          <unnnic-input
            class="vtex-modal__content__form__input__subdomain"
            v-model="appToken"
            :label="$t('vtex.setup.appToken')"
            :placeholder="$t('vtex.setup.appToken_placeholder')"
          />
        </div>

        <span class="vtex-modal__content__form__guide">
          {{ $t('vtex.setup.guide.question') }}
          <a
            href="https://help.vtex.com/en/tutorial/application-keys--2iffYzlvvz4BDMr6WGUtet"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('vtex.setup.guide.link') }}
          </a>
          {{ $t('vtex.setup.guide.question_end') }}
        </span>
      </div>
    </div>
    <unnnic-button
      ref="unnnic-vtex-modal-close-button"
      slot="options"
      type="tertiary"
      @click="closePopUp"
    >
      {{ $t('general.Cancel') }}
    </unnnic-button>
    <unnnic-button
      ref="unnnic-vtex-modal-setup-button"
      slot="options"
      type="secondary"
      @click="setupVtex"
      :loading="loadingCreateApp"
    >
      {{ $t('general.continue') }}
    </unnnic-button>
  </unnnic-modal>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'VtexModal',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        subdomain: '',
        whatsappChannels: [],
        selectedChannel: [],
        loadingChannels: true,
        appKey: null,
        appToken: null,
      };
    },
    mounted() {
      this.getWhatsAppChannels();
    },
    computed: {
      ...mapState({
        project: (state) => state.auth.project,
        configuredApps: (state) => state.myApps.configuredApps,
        errorConfiguredApps: (state) => state.myApps.errorConfiguredApps,
        loadingCreateApp: (state) => state.appType.loadingCreateApp,
        errorCreateApp: (state) => state.appType.errorCreateApp,
      }),
    },
    methods: {
      ...mapActions(['createApp', 'getConfiguredApps']),
      closePopUp() {
        this.$emit('closePopUp');
      },
      async setupVtex() {
        const data = {
          code: this.app.code,
          payload: {
            project_uuid: this.project,
            domain: this.subdomain,
            app_key: this.appKey,
            app_token: this.appToken,
            whatsapp_channel_uuid: this.selectedChannel[0].value,
          },
        };

        await this.createApp(data);

        if (this.errorCreateApp) {
          if (
            this.errorCreateApp.response.status === 400 &&
            this.errorCreateApp.response.data.detail === 'The credentials provided are invalid.'
          ) {
            this.callModal({ type: 'Error', text: this.$t('vtex.setup.invalid_credentials') });
            return;
          }
          this.callModal({ type: 'Error', text: this.$t('vtex.setup.error') });
          return;
        }

        this.callModal({ type: 'Success', text: this.$t('vtex.setup.success') });
        this.$emit('closePopUp');
        this.$router.push({ name: 'Apps' });
      },
      async getWhatsAppChannels() {
        this.loadingChannels = true;
        const params = {
          project_uuid: this.project,
        };
        await this.getConfiguredApps({ params });

        if (this.errorConfiguredApps) {
          this.callModal({
            type: 'Error',
            text: this.$t('apps.myApps.error.configured'),
          });
          this.closePopUp();
          return;
        }
        this.whatsappChannels = this.configuredApps
          .filter((app) => app.code === 'wpp-cloud')
          .map((wppChannel) => {
            return {
              label: `${wppChannel.config.wa_verified_name} - (${wppChannel.config.title})`,
              value: wppChannel.uuid,
            };
          });

        if (this.whatsappChannels.length === 1) {
          this.selectedChannel = [this.whatsappChannels[0]];
        }

        this.loadingChannels = false;
      },
      callModal({ text, type }) {
        unnnicCallAlert({
          props: {
            text: text,
            title: type === 'Success' ? this.$t('general.success') : this.$t('general.error'),
            icon: type === 'Success' ? 'check-circle-1-1' : 'alert-circle-1',
            scheme: type === 'Success' ? 'feedback-green' : 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .vtex-modal {
    ::v-deep {
      .unnnic-modal-container-background {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0 $unnnic-spacing-md;
        max-height: 95vh;
        cursor: auto;
        box-shadow: none;
      }
      .unnnic-modal-container-background-body {
        border-radius: $unnnic-border-radius-sm $unnnic-border-radius-sm 0px 0px;
        padding-top: $unnnic-spacing-giant;
      }

      .unnnic-modal-container-background-body-title {
        padding-bottom: $unnnic-spacing-xs;
      }

      .unnnic-modal-container-background-body-description-container {
        padding-bottom: $unnnic-spacing-xs;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      margin-top: $unnnic-spacing-md;

      &__title {
        font-family: $unnnic-font-family-secondary;
        color: $unnnic-color-neutral-darkest;
        font-weight: $unnnic-font-weight-black;
        font-size: $unnnic-font-size-title-sm;
        line-height: ($unnnic-font-size-title-sm + $unnnic-line-height-medium);
        margin-bottom: $unnnic-spacing-stack-xs;
      }

      &__description {
        margin-bottom: $unnnic-spacing-stack-md;
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-sm;
        text-align: left;

        &__keys {
          display: inline-flex;
          flex: 1;
          gap: $unnnic-spacing-sm;

          .unnnic-form {
            flex: 1;
          }
        }

        &__guide {
          color: $unnnic-color-neutral-cloudy;
          font-size: $unnnic-font-size-body-gt;
          line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;

          a {
            color: $unnnic-color-neutral-cloudy;
            font-weight: $unnnic-font-weight-bold;
            text-decoration-line: underline;
          }
        }
      }
    }
  }
</style>
