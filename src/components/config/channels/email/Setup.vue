<template>
  <unnnic-modal class="gmail-setup" :close-icon="false" @click.stop :text="$t(`gmail.setup.title`)">
    <template #icon> <img class="logo" src="../../../../assets/svgs/gmail.svg" alt="" /></template>
    <template #message>
      <div>
        <span v-html="$t(`gmail.setup.description`)"></span>
      </div>
    </template>

    <template #options>
      <div class="gmail-setup__buttons">
        <unnnic-button
          class="gmail-setup__buttons__cancel"
          type="tertiary"
          size="large"
          :text="$t('general.Cancel')"
          @click="closePopUp"
        />

        <unnnic-button
          class="gmail-setup__buttons__continue"
          size="large"
          :text="$t('gmail.setup.buttons.continue')"
          @click="saveConfig"
          :loading="loadingTokens"
        />
      </div>
    </template>
  </unnnic-modal>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  import { email_store } from '@/stores/modules/appType/channels/email.store';
  import getEnv from '@/utils/env';

  const OAUTH_MESSAGE_SOURCE = 'weni-gmail-oauth';

  export default {
    name: 'gmailSetup',
    data() {
      return {
        intervalId: null,
        username: {
          value: null,
          error: null,
        },

        password: {
          value: null,
          error: null,
        },
      };
    },
    mounted() {
      window.addEventListener('message', this.handleAuthMessage);
      this.setLogin(false);
    },
    beforeUnmount() {
      window.removeEventListener('message', this.handleAuthMessage);
    },
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(email_store, ['loadingTokens', 'tokens', 'code', 'loggedIn']),
      // Origin of the OAuth callback page. The popup runs on this origin,
      // which may differ from the host app's origin under Module Federation.
      // We use it to validate inbound postMessage events.
      callbackOrigin() {
        try {
          return new URL(getEnv('GOOGLE_REDIRECT_URI')).origin;
        } catch {
          return null;
        }
      },
    },
    watch: {
      loggedIn() {
        if (this.loggedIn) {
          this.closePopUp();
          this.$emit('toggleIntegratedAppModal');
        }
      },
    },
    methods: {
      ...mapActions(email_store, ['getTokens', 'setCode', 'setLogin']),
      closePopUp() {
        this.$emit('closePopUp');
      },
      saveConfig() {
        if (this.loggedIn) {
          return;
        }
        this.login();
      },
      login() {
        const clientId = getEnv('GOOGLE_CLOUD_ID');
        const redirectUri = getEnv('GOOGLE_REDIRECT_URI');
        const scope =
          'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/gmail.readonly';
        const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

        const popup = window.open(authUrl, 'GoogleAuthPopup', 'width=500,height=600');

        if (!popup || popup.closed || typeof popup.closed == 'undefined') {
          alert('Por favor, permita pop-ups para este site.');
          return;
        }
      },
      handleAuthMessage(event) {
        if (!this.callbackOrigin || event.origin !== this.callbackOrigin) {
          return;
        }
        const data = event.data;
        if (!data || data.source !== OAUTH_MESSAGE_SOURCE || !data.code) {
          return;
        }
        this.setCode({ code: data.code });
        this.getTokens({ code: data.code });
      },
      errorFor(key) {
        const item = this.$data[key];
        if (item.value === null && this.disableValidate) {
          return;
        }
        if (!(item.value !== null && item.value.trim())) {
          this.$data[key].error = this.$t('errors.empty_input');
          return;
        }
        if (item.value.length > 20) {
          this.$data[key].error = 'By default, the maximum is 20 characters.';
          return;
        }
        this.$data[key].error = null;
      },
      updateValue(key, value) {
        this.$data[key].value = value;
        if (value && !this.app.config.token) {
          this.disableValidate = false;
        }
        this.errorFor(key);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .gmail-setup {
    &__buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-content: space-around;
      gap: $unnnic-spacing-inline-xs;

      &__cancel,
      &__continue {
        width: 100%;
      }
    }
  }
</style>
