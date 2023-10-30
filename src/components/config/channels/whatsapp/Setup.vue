<template>
  <div>
    <unnnic-modal
      v-if="stage === 'login'"
      ref="whatsapp-setup-modal"
      class="whatsapp-setup"
      :text="$t('WhatsAppCloud.setup.connect')"
      :description="$t('WhatsAppCloud.setup.description')"
      scheme="feedback-green"
      modal-icon="phone-3"
      :close-icon="false"
      @close="closePopUp"
      @click.stop
    >
      <div slot="options">
        <div class="whatsapp-setup__buttons">
          <unnnic-button
            class="whatsapp-setup__buttons__cancel"
            type="terciary"
            size="large"
            :text="$t('general.Cancel')"
            @click="closePopUp"
          ></unnnic-button>

          <LoadingButton
            class="whatsapp-setup__buttons__start"
            type="secondary"
            size="large"
            :text="$t('WhatsAppCloud.setup.continue')"
            :isLoading="onLogin"
            :disabled="onLogin"
            @clicked="startFacebookLogin"
          />
        </div>
      </div>
    </unnnic-modal>

    <unnnic-modal
      v-else
      ref="phone-number-selection-modal"
      class="phone-number-selection"
      :text="$t('WhatsAppCloud.config.phone_numbers.connect')"
      scheme="feedback-green"
      modal-icon="phone-3"
      :close-icon="false"
      @close="closePopUp"
      @click.stop
    >
      <skeleton-loading
        v-if="forceLoading || loadingPhoneNumbers || loadingDebugToken"
        slot="message"
      />
      <div v-else slot="message">
        <unnnic-select
          :search="false"
          size="sm"
          v-model="selectedNumber"
          placeholder="Select your phone number"
        >
          <option v-for="(number, index) in whatsAppPhoneNumbers" :key="index">
            {{ number.verified_name }} ~ ({{ number.display_phone_number }})
          </option>
        </unnnic-select>
      </div>

      <div class="phone-number-selection__buttons" slot="options">
        <unnnic-button
          class="phone-number-selection__buttons__cancel"
          type="terciary"
          size="large"
          :text="$t('WhatsAppCloud.config.phone_numbers.connect_later')"
          @click="closePopUp"
        ></unnnic-button>
        <!-- eslint-disable -->
        <LoadingButton
          class="phone-number-selection__buttons__save"
          type="terciary"
          size="large"
          :disabled="
            loadingPhoneNumbers || loadingDebugToken || !!errorDebugToken || !!errorPhoneNumbers || loadingWhatsAppCloudConfigure
          "
          :isLoading="loadingWhatsAppCloudConfigure"
          :loadingText="$t('general.loading')"
          :text="$t('WhatsAppCloud.config.phone_numbers.create_channel')"
          @clicked="createChannel"
        />
      </div>
    </unnnic-modal>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import LoadingButton from '../../../LoadingButton.vue';
  import skeletonLoading from './loadings/PhoneNumberSelection.vue';
  import getEnv from '../../../..//utils/env';
  import { initFacebookSdk } from '../../../../utils/plugins/fb';

  export default {
    name: 'WhatsAppSetup',
    components: {
      skeletonLoading,
      LoadingButton,
    },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        stage: 'login',
        selectedNumber: null,
        forceLoading: true,
        accessToken: null,
        onLogin: false,
      };
    },
    async mounted() {
      window.startPhoneNumberSelectionStage = this.startPhoneNumberSelectionStage;
      window.changeLoginState = this.changeLoginState;
    },
    beforeDestroy() {
      this.setSelectedPhoneNumber({ data: null });
    },
    computed: {
      ...mapState({
        project: (state) => state.auth.project,
      }),
      ...mapState('WhatsAppCloud', [
        'loadingPhoneNumbers',
        'loadingDebugToken',
        'loadingWhatsAppCloudConfigure',
        'errorCloudConfigure',
        'errorPhoneNumbers',
        'errorDebugToken',
        'selectedPhoneNumber',
        'wabaId',
        'businessId',
        'whatsAppPhoneNumbers',
      ]),
    },
    methods: {
      ...mapActions({
        setSelectedPhoneNumber: 'WhatsAppCloud/setSelectedPhoneNumber',
        configurePhoneNumber: `WhatsAppCloud/configurePhoneNumber`,
        getDebugToken: 'WhatsAppCloud/getDebugToken',
        getWhatsAppPhoneNumbers: 'WhatsAppCloud/getWhatsAppPhoneNumbers',
      }),
      changeLoginState(state) {
        this.onLogin = state;
      },
      /* istanbul ignore next */
      async startFacebookLogin() {
        const fbAppId = getEnv('VUE_APP_WHATSAPP_FACEBOOK_APP_ID');

        if (!fbAppId) {
          return;
        }

        /* eslint-disable no-undef */
        const loginCallback = async () => {
          this.changeLoginState(true);
          FB.login(
            async function (response) {
              if (response.authResponse && response.authResponse.grantedScopes) {
                const accessToken = response.authResponse.accessToken;
                this.startPhoneNumberSelectionStage(accessToken);
              }
              this.changeLoginState(false);
            },
            {
              return_scopes: true,
              scope: 'business_management,whatsapp_business_management,whatsapp_business_messaging',
              extras: {
                feature: 'whatsapp_embedded_signup',
              },
            },
          );
        };

        initFacebookSdk(fbAppId, loginCallback);
      },
      async startPhoneNumberSelectionStage(accessToken) {
        this.accessToken = accessToken;
        this.stage = 'select-phone-number';

        await this.fetchDebugToken();
        if (this.errorDebugToken) {
          this.callErrorModal({ text: this.$t('WhatsAppCloud.config.debug_token.error') });
          return;
        }

        await this.fetchPhoneNumbers();
        if (this.errorPhoneNumbers) {
          this.callErrorModal({ text: this.$t('WhatsAppCloud.config.phone_numbers.error') });
          return;
        }

        /* istanbul ignore next */
        setTimeout(() => {
          this.forceLoading = false;
        }, 60000);
      },
      async createChannel() {
        if (!this.loadingWhatsAppCloudConfigure) {
          const data = {
            waba_id: this.wabaId,
            business_id: this.businessId,
            phone_number_id: this.selectedPhoneNumber?.id,
            input_token: this.accessToken,
            project_uuid: this.project,
          };

          await this.configurePhoneNumber({ data });

          if (this.errorCloudConfigure) {
            this.callErrorModal({
              text: this.$t('WhatsAppCloud.config.configure_phone_number.error'),
            });
          } else {
            this.$router.replace('/apps/my');
          }
        }
      },
      async fetchDebugToken() {
        const params = {
          input_token: this.accessToken,
        };

        await this.getDebugToken({ params });
      },
      async fetchPhoneNumbers() {
        const params = {
          waba_id: this.wabaId,
        };

        await this.getWhatsAppPhoneNumbers({ params });
      },
      closePopUp() {
        this.$emit('closePopUp');
      },
      callErrorModal({ text }) {
        unnnicCallAlert({
          props: {
            text: text,
            title: this.$t('general.error'),
            icon: 'alert-circle-1',
            scheme: 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },
    },
    watch: {
      selectedNumber(newValue) {
        const newValueDisplayNumber = newValue
          .split('~')[1]
          .replaceAll('(', '')
          .replaceAll(')', '')
          .trim();

        const number = this.whatsAppPhoneNumbers.find(
          (number) => number.display_phone_number === newValueDisplayNumber,
        );

        this.setSelectedPhoneNumber({ data: number });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-setup {
    cursor: default;

    &__buttons {
      display: flex;
      justify-content: space-around;
      gap: $unnnic-spacing-inline-xs;

      &__cancel,
      &__start {
        width: 50%;
      }
    }

    ::v-deep .unnnic-modal-container-background-body-description {
      padding-bottom: $unnnic-spacing-stack-lg;
    }
  }

  .phone-number-selection {
    cursor: default;

    &__buttons {
      display: flex;
      justify-content: space-around;
      gap: $unnnic-spacing-inline-xs;

      &__cancel,
      &__save {
        width: 50%;
      }
    }
  }
</style>
