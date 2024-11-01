<template>
  <unnnic-modal :close-icon="false" @click.stop :text="$t(`gmail.setup.title`)">
    <template #icon> <img class="logo" src="../../../../assets/svgs/gmail.svg" alt="" /></template>
    <template #message>
      <div>
        <span v-html="$t(`gmail.setup.description`)"></span>
      </div>
    </template>

    <template #options>
      <div>
        <div class="facebook-setup__buttons">
          <unnnic-button
            class="facebook-setup__buttons__cancel"
            type="tertiary"
            size="large"
            :text="$t('general.Cancel')"
            @click="closePopUp"
          />

          <GoogleLogin prompt auto-login>
            <unnnic-button
              class="app-config-email__settings__buttons__save"
              size="large"
              :text="$t('gmail.setup.buttons.continue')"
            />
          </GoogleLogin>
        </div>
      </div>
    </template>
  </unnnic-modal>
</template>

<script>
  import { GoogleLogin } from 'vue3-google-login';
  export default {
    name: 'gmailSetup',
    components: {
      GoogleLogin,
    },
    data() {
      return {
        gmailCallback: (response) => console.log(response),
      };
    },
    methods: {
      closePopUp() {
        this.$emit('closePopUp');
      },
    },
  };
</script>
