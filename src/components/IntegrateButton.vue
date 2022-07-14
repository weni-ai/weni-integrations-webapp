<template>
  <div>
    <LoadingButton
      type="secondary"
      loadingPosition="center"
      :size="size"
      :iconCenter="icon"
      :isLoading="loadingCreateApp"
      :disabled="disabled"
      :text="text"
      @clicked="addApp(app)"
    />

    <add-modal ref="addModal" />
    <config-pop-up ref="configPopUp" />
  </div>
</template>

<script>
  import addModal from './AddModal.vue';
  import configPopUp from './config/ConfigPopUp.vue';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import { mapActions, mapGetters, mapState } from 'vuex';
  import LoadingButton from './LoadingButton.vue';

  export default {
    name: 'IntegrateButton',
    components: { configPopUp, addModal, LoadingButton },
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
    data() {
      return {
        loadingCreateApp: false,
      };
    },
    created() {
      window.openWACloudPopUp = this.openWACloudPopUp;
    },
    computed: {
      ...mapGetters(['getSelectedProject']),
      ...mapState({
        createAppResponse: (state) => state.appType.createAppResponse,
        errorCreateApp: (state) => state.appType.errorCreateApp,
      }),
    },
    methods: {
      ...mapActions(['createApp', 'getSharedWabas']),
      async addApp(app) {
        if (app.code === 'wpp-cloud') {
          await this.facebookLoginAppCreation(app);
          return;
        }

        const code = app.code;
        const payload = {
          project_uuid: this.getSelectedProject,
        };
        this.loadingCreateApp = true;
        await this.createApp({ code, payload });
        this.loadingCreateApp = false;

        if (this.errorCreateApp) {
          this.callErrorModal({ text: this.$t('apps.details.status_error') });
          return;
        }

        if (app.config_design === 'popup') {
          app.config = this.createAppResponse.config;
          this.$refs.configPopUp.openPopUp(app);
        } else {
          this.$refs.addModal.toggleModal();
        }
        this.$emit('update');
      },
      openWACloudPopUp(app, input_token) {
        const customData = {
          input_token,
        };
        this.$refs.configPopUp.openPopUp(app, customData);
      },
      callErrorModal({ text }) {
        unnnicCallAlert({
          props: {
            text,
            title: 'Error',
            icon: 'check-circle-1-1',
            scheme: 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },

      /* istanbul ignore next */
      async facebookLoginAppCreation(app) {
        /* eslint-disable no-undef */
        FB.login(
          async function (response) {
            if (response.authResponse) {
              const accessToken = response.authResponse.accessToken;
              this.openWACloudPopUp(app, accessToken);
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
