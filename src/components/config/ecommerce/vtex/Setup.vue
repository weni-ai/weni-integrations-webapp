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
        <unnnic-input
          class="vtex-modal__content__form__input__subdomain"
          v-model="subdomain"
          :label="$t('vtex.setup.subdomain')"
          :placeholder="$t('vtex.setup.subdomain_placeholder')"
        />

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
      ref="unnnic-vtex-modal-navigate-button"
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
        loadingConfiguredApps: (state) => state.myApps.loadingConfiguredApps,
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
        this.$router.replace('/apps/my');
      },
      async getWhatsAppChannels() {
        this.loadingChannels = true;
        const params = {
          project_uuid: this.project,
        };
        await this.getConfiguredApps({ params });

        if (this.errorConfiguredApps) {
          this.callErrorModal({ text: this.$t('apps.myApps.error.configured') });
          return;
        }
        this.whatsappChannels = this.configuredApps
          .filter((app) => app.code === 'wpp-cloud' || app.code === 'wpp')
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
      .container {
        padding: $unnnic-squish-md !important;
      }
      .header {
        margin-bottom: $unnnic-spacing-stack-nano !important;
      }
      .unnnic-modal-container-background {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0 $unnnic-spacing-md;
        max-height: 95vh;
      }
      .unnnic-modal-container-background-body {
        border-radius: $unnnic-border-radius-sm $unnnic-border-radius-sm 0px 0px;
      }
      .unnnic-modal-container-background-body-description-container {
        padding-bottom: $unnnic-spacing-md;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;

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
      }
    }
  }
</style>
