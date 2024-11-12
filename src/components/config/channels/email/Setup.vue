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
  import { googleSdkLoaded } from 'vue3-google-login';
  import getEnv from '../../../..//utils/env';
  import { mapActions, mapState } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  import { email_store } from '@/stores/modules/appType/channels/email.store';
  export default {
    name: 'gmailSetup',
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(email_store, ['loadingTokens', 'tokens']),
    },
    methods: {
      ...mapActions(email_store, ['getTokens']),
      closePopUp() {
        this.$emit('closePopUp');
      },
      login() {
        googleSdkLoaded((google) => {
          google.accounts.oauth2
            .initCodeClient({
              client_id: getEnv('VITE_APP_GOOGLE_CLOUD_ID'),
              scope: 'https://mail.google.com',
              redirect_uri: 'https://integrations.stg.cloud.weni.ai/callback',
              authUrl: `https://accounts.google.com/o/oauth2/auth?`,
              response_type: 'code',
              prompt: 'consent',
              callback: (response) => {
                console.log('❤️', response);
                this.getTokens({ code: response.code });
                console.log('tokens:', this.tokens);
                // this.closePopUp();
                // this.$router.push({ path: `/apps/my` });
              },
            })
            .requestCode();
        });
        // const clientId = getEnv('VITE_APP_GOOGLE_CLOUD_ID');
        // const redirectUri = encodeURIComponent('https://integrations.stg.cloud.weni.ai/callback');
        // const scope = encodeURIComponent('https://mail.google.com');
        // const oauthUrl = `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?access_type=offline&client_id=${clientId}&prompt=consent&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&service=lso&o2v=1&ddm=1&flowName=GeneralOAuthFlow`;

        // window.location.href = oauthUrl;
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
