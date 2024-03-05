<template>
  <div>
    <LoadingButton
      ref="button"
      type="secondary"
      :loadingPosition="loadingPosition"
      :size="size"
      :iconCenter="loadingPosition == 'center' ? icon : null"
      :iconLeft="loadingPosition == 'left' ? icon : null"
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
  import addModal from '../AddModal/index.vue';
  import configPopUp from '../config/ConfigPopUp.vue';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import LoadingButton from '../LoadingButton/index.vue';
  import getEnv from '../../utils/env';
  import { app_type } from '@/src/stores/modules/appType/appType.store';
  import { auth_store } from '@/stores/modules/auth.store';

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
      loadingPosition: {
        type: String,
        default: 'center',
        validator(value) {
          return ['left', 'center'].indexOf(value) !== -1;
        },
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
      appTypeState() {
        return {
          createAppResponse: app_type().createAppResponse,
          errorCreateApp: app_type().errorCreateApp,
        };
      },
      project() {
        return auth_store().project;
      },
    },
    methods: {
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
        await app_type().createApp({ code, payload });
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