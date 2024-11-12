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
          @click="login"
          :loading="loadingTokens"
        />
      </div>
    </template>
  </unnnic-modal>
</template>

<script>
  // import { googleSdkLoaded } from 'vue3-google-login';
  // import getEnv from '../../../..//utils/env';
  import { mapActions, mapState } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  import { email_store } from '@/stores/modules/appType/channels/email.store';
  import setLocal from '@/utils/storage';
  export default {
    name: 'gmailSetup',
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(email_store, ['loadingTokens', 'tokens', 'code']),
    },
    mounted() {
      setLocal('code', 'teste');
      window.addEventListener('localStorage', this.onStorageChange);
    },
    beforeUnmount() {
      window.removeEventListener('localStorage', this.onStorageChange);
    },
    methods: {
      ...mapActions(email_store, ['getTokens']),
      closePopUp() {
        this.$emit('closePopUp');
      },
      login() {
        // googleSdkLoaded((google) => {
        //   google.accounts.oauth2
        //     .initCodeClient({
        //       client_id: getEnv('VITE_APP_GOOGLE_CLOUD_ID'),
        //       scope: 'https://mail.google.com',
        //       redirect_uri: 'https://integrations.stg.cloud.weni.ai/callback/',
        //       auth_url: `https://accounts.google.com/o/oauth2/auth?`,
        //       response_type: 'code',
        //       prompt: 'consent',
        //       callback: (response) => {
        //         console.log('❤️', response);
        //         this.getTokens({ code: response.code });
        //         console.log('tokens:', this.tokens);
        //         // this.closePopUp();
        //         // this.$router.push({ path: `/apps/my` });
        //       },
        //     })
        //     .requestCode();
        // });
        setLocal('code', 'login');
        const clientId = '744930724959-va8jvj4int13gas44abp0p8b3qkkuu9p.apps.googleusercontent.com';
        const redirectUri = 'https://integrations.stg.cloud.weni.ai/callback/';
        const scope = 'https://mail.google.com';
        const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

        const link = document.createElement('a');
        link.href = authUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer'; // Segurança extra
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      callSucess() {
        console.log('logado');
      },
      onStorageChange(event) {
        if (event.key === 'code' && event.newValue) {
          this.callSucess();
        }
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
