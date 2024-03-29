<template>
  <div>
    <unnnic-modal
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
            type="tertiary"
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
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import LoadingButton from '../../../LoadingButton/index.vue';
  import getEnv from '../../../..//utils/env';
  import { initFacebookSdk } from '../../../../utils/plugins/fb';

  export default {
    name: 'WhatsAppSetup',
    components: {
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
        phoneNumberId: null,
        wabaId: null,
        onLogin: false,
      };
    },
    async mounted() {
      window.createChannel = this.createChannel;
      window.changeLoginState = this.changeLoginState;
    },
    computed: {
      ...mapState({
        project: (state) => state.auth.project,
      }),
      ...mapState('WhatsAppCloud', ['loadingWhatsAppCloudConfigure', 'errorCloudConfigure']),
    },
    methods: {
      ...mapActions({
        configurePhoneNumber: `WhatsAppCloud/configurePhoneNumber`,
      }),
      changeLoginState(state) {
        this.onLogin = state;
      },
      /* istanbul ignore next */
      async startFacebookLogin() {
        const fbAppId = getEnv('VUE_APP_WHATSAPP_FACEBOOK_APP_ID');
        const configId = getEnv('VUE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID');

        if (!fbAppId) {
          return;
        }

        /* eslint-disable no-undef */
        const loginCallback = async () => {
          this.changeLoginState(true);

          const sessionInfoListener = (event) => {
            if (event.origin !== 'https://www.facebook.com') return;
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'WA_EMBEDDED_SIGNUP') {
                // if user finishes the Embedded Signup flow
                if (data.event === 'FINISH') {
                  const { phone_number_id, waba_id } = data.data;
                  this.phoneNumberId = phone_number_id;
                  this.wabaId = waba_id;
                }
                // if user cancels the Embedded Signup flow
                else {
                  const { current_step } = data.data;
                  console.log(
                    'Session info listener: User cancelled login or did not fully authorize.',
                    current_step,
                  );
                }
              }
            } catch {
              // Don’t parse info that’s not a JSON
              console.log('Non JSON Response', event.data);
            }
          };

          window.addEventListener('message', sessionInfoListener);

          typeof fbq !== 'undefined' &&
            fbq('trackCustom', 'WhatsAppOnboardingStart', {
              appId: fbAppId,
              feature: 'whatsapp_embedded_signup',
            });

          FB.login(
            async function (response) {
              if (response.authResponse) {
                const code = response.authResponse.code;
                await this.createChannel(code);
              } else {
                console.log('User cancelled login or did not fully authorize.');
              }
              this.changeLoginState(false);
            },
            {
              config_id: configId,
              response_type: 'code',
              override_default_response_type: true,
              extras: {
                sessionInfoVersion: 2,
              },
            },
          );
        };

        initFacebookSdk(fbAppId, loginCallback);
      },
      async createChannel(code) {
        if (!this.loadingWhatsAppCloudConfigure) {
          const data = {
            waba_id: this.wabaId,
            phone_number_id: this.phoneNumberId,
            project_uuid: this.project,
            auth_code: code,
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
</style>
