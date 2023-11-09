<template>
  <unnnic-modal class="vtex-modal" @close="closePopUp" @click.stop :closeIcon="false">
    <div slot="message" class="vtex-modal__content">
      <span class="vtex-modal__content__title">{{ $t('vtex.setup.title') }}</span>
      <span class="vtex-modal__content__description">{{ $t('vtex.setup.description') }}</span>

      <div class="vtex-modal__content__form">
        <unnnic-input
          class="vtex-modal__content__form__input__subdomain"
          v-model="subdomain"
          :label="$t('vtex.setup.subdomain')"
          :placeholder="$t('vtex.setup.subdomain_placeholder')"
        />
      </div>
    </div>
    <unnnic-button
      ref="unnnic-vtex-modal-close-button"
      slot="options"
      type="tertiary"
      @click="closePopUp"
    >
      {{ $t('general.Cancel') }}
    </unnnic-button>
    <unnnic-button
      ref="unnnic-vtex-modal-navigate-button"
      slot="options"
      type="secondary"
      @click="setupVtex"
      :loading="loadingCreateApp"
    >
      {{ $t('general.continue') }}
    </unnnic-button>
  </unnnic-modal>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'VtexModal',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        subdomain: '',
      };
    },
    computed: {
      ...mapState({
        project: (state) => state.auth.project,
        loadingCreateApp: (state) => state.appType.loadingCreateApp,
        errorCreateApp: (state) => state.appType.errorCreateApp,
      }),
    },
    methods: {
      ...mapActions(['createApp']),
      closePopUp() {
        this.$emit('closePopUp');
      },
      async setupVtex() {
        console.log('Setup vtex', this.subdomain);
        this.$router.replace('/apps/my');
      },
      callModal({ text, type }) {
        unnnicCallAlert({
          props: {
            text: text,
            title: type === 'Success' ? this.$t('general.success') : this.$t('general.error'),
            icon: type === 'Success' ? 'check-circle-1-1' : 'alert-circle-1',
            scheme: type === 'Success' ? 'feedback-green' : 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .vtex-modal {
    ::v-deep .unnnic-modal-container-background-body-description-container {
      padding-bottom: $unnnic-spacing-stack-xs;
    }

    &__content {
      display: flex;
      flex-direction: column;

      &__title {
        font-family: $unnnic-font-family-secondary;
        color: $unnnic-color-neutral-darkest;
        font-weight: $unnnic-font-weight-black;
        font-size: $unnnic-font-size-title-sm;
        line-height: ($unnnic-font-size-title-sm + $unnnic-line-height-medium);
        margin-bottom: $unnnic-spacing-stack-xs;
      }

      &__description {
        margin-bottom: $unnnic-spacing-stack-md;
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-lg;
        text-align: left;
      }
    }
  }
</style>
