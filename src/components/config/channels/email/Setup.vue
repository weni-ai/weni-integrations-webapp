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
  import { mapActions, mapState } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  import { email_store } from '@/stores/modules/appType/channels/email.store';
  import setLocal from '@/utils/storage';
  import getEnv from '@/utils/env';
  export default {
    name: 'gmailSetup',
    data() {
      return {
        code: localStorage.getItem('nomeDaChaveQueEuQuero'),
        intervalId: null,
      };
    },
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(email_store, ['loadingTokens', 'tokens', 'code']),
    },
    mounted() {
      console.log('setInterval foi configurado.');
      this.intervalId = setInterval(this.checkStorageChange(), 1000);
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
    },
    methods: {
      ...mapActions(email_store, ['getTokens']),
      closePopUp() {
        this.$emit('closePopUp');
      },
      login() {
        setLocal('code', '');
        const clientId = getEnv('VITE_APP_GOOGLE_CLOUD_ID');
        const redirectUri = 'https://integrations.stg.cloud.weni.ai/callback/';
        const scope = 'https://mail.google.com';
        const authUrl = `https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

        const popup = window.open(authUrl, 'GoogleAuthPopup', 'width=500,height=600');

        if (!popup || popup.closed || typeof popup.closed == 'undefined') {
          alert('Por favor, permita pop-ups para este site.');
          return;
        }
      },
      callSucess() {
        console.log('logado');
        this.getTokens({ code: this.code });
      },
      addTokens(event) {
        console.log('storage atualizada', event);
      },
      checkStorageChange() {
        const valorAtual = localStorage.getItem('code');
        console.log('checando...');
        if (valorAtual !== this.code) {
          this.code === valorAtual;
          this.addTokens(valorAtual);
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
