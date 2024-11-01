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

        <GoogleLogin prompt auto-login :callback="gmailCallback">
          <unnnic-button
            class="gmail-setup__buttons__continue"
            size="large"
            :text="$t('gmail.setup.buttons.continue')"
          />
        </GoogleLogin>
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
