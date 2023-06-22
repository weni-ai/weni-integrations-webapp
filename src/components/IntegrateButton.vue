<template>
  <div>
    <LoadingButton
      ref="button"
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
  import { mapActions, mapState } from 'vuex';
  import LoadingButton from './LoadingButton.vue';
  import getEnv from '../utils/env';

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
        hasFBLoginList: ['wpp-cloud', 'ig', 'fba'],
        appCodeToFBAppId: {
          'wpp-cloud': getEnv('VUE_APP_WHATSAPP_FACEBOOK_APP_ID'),
          ig: getEnv('VUE_APP_FACEBOOK_APP_ID'),
        },
      };
    },
    created() {
      window.openWACloudPopUp = this.openWACloudPopUp;
    },
    computed: {
      ...mapState({
        createAppResponse: (state) => state.appType.createAppResponse,
        errorCreateApp: (state) => state.appType.errorCreateApp,
        project: (state) => state.auth.project,
      }),
    },
    methods: {
      ...mapActions(['createApp']),
      async addApp(app) {
        if (this.hasFBLoginList.includes(app.code) || app.config_design === 'pre-popup') {
          this.$refs.configPopUp.openPopUp(app);
          return;
        }

        let code = app.code;
        const payload = {
          project_uuid: this.project,
        };
        if (app.generic) {
          code = 'generic';
          payload.channel_code = app.code;
        }
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
            title: this.$t('general.error'),
            icon: 'check-circle-1-1',
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
<style></style>
