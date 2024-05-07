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
<<<<<<< HEAD
      @click.stop
=======
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
  import unnnicCallAlert from '@weni/unnnic-system';
=======
  import alert from '@/utils/call';
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
      ...mapState(auth_store, ['project']),
      ...mapState(whatsapp_cloud, ['loadingWhatsAppCloudConfigure', 'errorCloudConfigure']),
    },
    methods: {
      ...mapActions(whatsapp_cloud, ['configurePhoneNumber']),
      changeLoginState(state) {
        this.onLogin = state;
      },
      /* istanbul ignore next */
<<<<<<< HEAD
      async startFacebookLogin() {
        const fbAppId = getEnv('VUE_APP_WHATSAPP_FACEBOOK_APP_ID');
        const configId = getEnv('VUE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID');
=======
      startFacebookLogin() {
        const fbAppId = getEnv('VITE_APP_WHATSAPP_FACEBOOK_APP_ID');
        const configId = getEnv('VITE_APP_WHATSAPP_FACEBOOK_APP_CONFIG_ID');
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800

        if (!fbAppId) {
          return;
        }

        /* eslint-disable no-undef */
<<<<<<< HEAD
        const loginCallback = async () => {
=======
        const loginCallback = () => {
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
            async function (response) {
              if (response.authResponse) {
                const code = response.authResponse.code;
                await this.createChannel(code);
=======
            function (response) {
              if (response.authResponse) {
                const code = response.authResponse.code;
                this.createChannel(code);
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
        unnnicCallAlert({
          props: {
            text: text,
            title: this.$t('general.error'),
            icon: 'alert-circle-1',
            scheme: 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
=======
        alert.callAlert({
          props: {
            text: text,
            type: 'error',
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
