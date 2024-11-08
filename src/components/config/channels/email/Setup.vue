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
        />
      </div>
    </template>
  </unnnic-modal>
</template>

<script>
  import { googleSdkLoaded } from 'vue3-google-login';
  import getEnv from '../../../..//utils/env';
  import { mapState } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  export default {
    name: 'gmailSetup',
    data() {
      return {
        gmailCallback: (response) => console.log(response),
      };
    },
    computed: {
      ...mapState(auth_store, ['project']),
    },
    methods: {
      closePopUp() {
        this.$emit('closePopUp');
      },
      login() {
        console.log('aloo');
        googleSdkLoaded((google) => {
          google.accounts.oauth2
            .initCodeClient({
              client_id: getEnv('VITE_APP_GOOGLE_CLOUD_ID'),
              scope: 'email profile openid',
              redirect_uri: 'https://dash.stg.cloud.weni.ai/auth/callback',
              callback: (response) => {
                console.log(response);
              },
            })
            .requestCode();
        });
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
