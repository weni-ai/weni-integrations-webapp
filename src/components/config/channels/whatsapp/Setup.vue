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
      <template #options>
        <div>
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
      </template>
    </unnnic-modal>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';
  import { auth_store } from '@/stores/modules/auth.store';
  import unnnic from '@weni/unnnic-system';
  import LoadingButton from '../../../LoadingButton/index.vue';
  import getEnv from '@/utils/env';
  import { initFacebookSdk } from '@/utils/plugins/fb';
  import { captureSentryManualError } from '@/utils/sentry';

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
      window.sendToSentry = this.sendToSentry;
    },
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(whatsapp_cloud, ['loadingWhatsAppCloudConfigure', 'errorCloudConfigure']),
    },
    methods: {
      ...mapActions(whatsapp_cloud, ['configurePhoneNumber']),
      changeLoginState(state) {
        this.onLogin = state;
      },
      sendToSentry(message, extra) {
        const err = new Error(message);
        captureSentryManualError(err, extra);
      },
      /* istanbul ignore next */
      startFacebookLogin() {
        const fbAppId = getEnv('WHATSAPP_FACEBOOK_APP_ID');
        const configId = getEnv('WHATSAPP_FACEBOOK_APP_CONFIG_ID');

        if (!fbAppId) {
          return;
        }

        /* eslint-disable no-undef */
        const loginCallback = () => {
          this.changeLoginState(true);

          const sessionInfoListener = (event) => {
            if (event.origin == null) {
              console.log("Session info listener: Data doesn't have an origin", event.origin);
              this.sendToSentry("Session info listener: Data doesn't have an origin", {
                data: event,
                data_string: JSON.stringify(event),
              });
              return;
            }

            // Make sure the data is coming from facebook.com
            if (!event.origin.endsWith('facebook.com')) {
              console.log(
                'Session info listener: Data is not coming from facebook.com',
                event.origin,
              );
              this.sendToSentry('Session info listener: Data is not coming from facebook.com', {
                data: event,
                data_string: JSON.stringify(event),
              });
              return;
            }

            try {
              const data = JSON.parse(event.data);
              if (data.type === 'WA_EMBEDDED_SIGNUP') {
                // if user finishes the Embedded Signup flow
                if (data.event === 'FINISH') {
                  const { phone_number_id, waba_id } = data.data;
                  this.phoneNumberId = phone_number_id;
                  this.wabaId = waba_id;
                }
                // if user reports an error during the Embedded Signup flow
                else if (data.event === 'ERROR') {
                  const { error_message } = data.data;
                  console.log(
                    'Session info listener: Error during the Embedded Signup flow.',
                    error_message,
                  );
                  this.sendToSentry(
                    'Session info listener: Error during the Embedded Signup flow.',
                    {
                      data: data,
                      data_string: event.data,
                      phone_number_id: this.phoneNumberId,
                      waba_id: this.wabaId,
                    },
                  );
                }
                // if user cancels the Embedded Signup flow
                else {
                  const { current_step } = data.data;
                  console.log(
                    'Session info listener: User cancelled login or did not fully authorize.',
                    current_step,
                  );
                  this.sendToSentry('User cancelled login or did not fully authorize.', {
                    data: data,
                    data_string: event.data,
                    phone_number_id: this.phoneNumberId,
                    waba_id: this.wabaId,
                  });
                }
              }
            } catch {
              // Don’t parse info that’s not a JSON
              console.log('Non JSON Response', event.data);
              this.sendToSentry('Non JSON Response in event.data', {
                data_string: event.data,
                phone_number_id: this.phoneNumberId,
                waba_id: this.wabaId,
              });
            }
          };

          window.addEventListener('message', sessionInfoListener);

          typeof fbq !== 'undefined' &&
            fbq('trackCustom', 'WhatsAppOnboardingStart', {
              appId: fbAppId,
              feature: 'whatsapp_embedded_signup',
            });

          FB.login(
            function (response) {
              if (response.authResponse) {
                const code = response.authResponse.code;
                this.createChannel(code);
              } else {
                console.log('Login Callback: User cancelled login or did not fully authorize');
                this.sendToSentry(
                  'Login Callback: User cancelled login or did not fully authorize',
                  {
                    data: response,
                    data_string: JSON.stringify(response),
                    phone_number_id: this.phoneNumberId,
                    waba_id: this.wabaId,
                  },
                );
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

          const res = await this.configurePhoneNumber({ data });

          if (this.errorCloudConfigure) {
            this.callErrorModal({
              text: this.$t('WhatsAppCloud.config.configure_phone_number.error'),
            });

            this.sendToSentry('Error trying to create WAC channel', {
              data: data,
              data_string: JSON.stringify(data),
              response: res,
              response_string: JSON.stringify(res),
              phone_number_id: this.phoneNumberId,
              waba_id: this.wabaId,
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
        unnnic.unnnicCallAlert({
          props: {
            text: text,
            type: 'error',
          },
          seconds: 15,
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
