<template>
  <div>
    <unnnic-button
      ref="button"
      :size="size"
      type="secondary"
      :iconCenter="icon"
      @click.stop="addApp(app)"
      :disabled="disabled"
    >
      {{ text }}
    </unnnic-button>

    <add-modal ref="addModal" />
    <config-pop-up ref="configPopUp" />
  </div>
</template>

<script>
  import addModal from './AddModal.vue';
  import configPopUp from './config/ConfigPopUp.vue';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'IntegrateButton',
    components: { configPopUp, addModal },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
      icon: {
        type: String,
        default: null,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
      text: {
        type: String,
        default: null,
      },
      size: {
        type: String,
        default: 'small',
      },
    },
    created() {
      window.openWACloudPopUp = this.openWACloudPopUp;
    },
    computed: {
      ...mapState(['getSelectedProject']),
    },
    methods: {
      ...mapActions(['createApp', 'getSharedWabas']),
      async addApp(app) {
        if (app.code === 'wpp-cloud') {
          await this.facebookLoginAppCreation(app);
          return;
        }

        try {
          const code = app.code;
          const payload = {
            project_uuid: this.getSelectedProject,
          };
          const res = await this.createApp({ code, payload });
          if (app.config_design === 'popup') {
            app.config = res.data.config;
            this.$refs.configPopUp.openPopUp(app);
          } else {
            this.$refs.addModal.toggleModal();
          }
        } catch (error) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              title: 'Error',
              icon: 'check-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } finally {
          this.$emit('update');
        }
      },
      openWACloudPopUp(input_token) {
        const customData = {
          input_token,
        };
        this.$refs.configPopUp.openPopUp(this.app, customData);
      },

      /* istanbul ignore next */
      async facebookLoginAppCreation() {
        /* eslint-disable no-undef */
        FB.login(
          async function (response) {
            if (response.authResponse) {
              const accessToken = response.authResponse.accessToken;
              this.openWACloudPopUp(accessToken);
            }
          },
          {
            scope: 'business_management,whatsapp_business_management,whatsapp_business_messaging',
            extras: {
              feature: 'whatsapp_embedded_signup',
            },
          },
        );
      },
    },
  };
</script>
<style></style>
