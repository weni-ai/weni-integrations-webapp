<template>
  <unnnic-modal
    ref="unnnic-chatgpt-modal"
    class="chatgpt-modal"
    @close="closePopUp"
    @click.stop
    :closeIcon="false"
  >
    <div slot="message" class="chatgpt-modal__content">
      <span class="chatgpt-modal__content__title">{{ $t('ChatGPT.setup.title') }}</span>
      <span class="chatgpt-modal__content__description">{{ $t('ChatGPT.setup.description') }}</span>

      <div class="chatgpt-modal__content__form">
        <unnnic-input
          class="chatgpt-modal__content__form__input__name"
          v-model="name"
          :label="$t('ChatGPT.setup.name')"
          :placeholder="$t('ChatGPT.setup.name_placeholder')"
        />

        <unnnic-input
          class="chatgpt-modal__content__form__input__token"
          v-model="token"
          :label="$t('ChatGPT.setup.token')"
          :placeholder="$t('ChatGPT.setup.token_placeholder')"
        />

        <div class="chatgpt-modal__content__form__version-wrapper">
          <div>
            {{ $t('ChatGPT.setup.version') }}

            <unnnic-toolTip
              class="chatgpt-modal__content__form__version__tooltip"
              :text="$t('ChatGPT.setup.version_tooltip')"
              :enabled="true"
              side="right"
              maxWidth="350px"
            >
              <unnnic-icon-svg
                class="chatgpt-modal__content__form__version__icon"
                icon="information-circle-4"
                size="sm"
                scheme="neutral-soft"
              />
            </unnnic-toolTip>
          </div>

          <div class="chatgpt-modal__content__form__version-wrapper__options">
            <unnnic-radio
              v-for="(version, index) in versions"
              :key="index"
              v-model="selectedVersion"
              :options="versions"
              :value="version"
              :label="$t('ChatGPT.setup.version')"
            >
              {{ version }}
            </unnnic-radio>
          </div>
        </div>
      </div>
    </div>
    <unnnic-button
      ref="unnnic-chatgpt-modal-close-button"
      slot="options"
      type="terciary"
      @click="closePopUp"
    >
      {{ $t('general.Cancel') }}
    </unnnic-button>
    <unnnic-button
      ref="unnnic-chatgpt-modal-navigate-button"
      slot="options"
      type="secondary"
      @click="setupChatGptService"
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
    name: 'ChatGPTModal',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        name: '',
        token: '',
        selectedVersion: 'gpt-3.5-turbo-16k',
        versions: ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo', 'gpt-4'],
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
      async setupChatGptService() {
        const payload = {
          project_uuid: this.project,
          name: this.name,
          api_key: this.token,
          ai_model: this.selectedVersion,
        };

        await this.createApp({ code: this.app.code, payload });

        if (this.errorCreateApp) {
          this.callModal({
            type: 'Error',
            text: this.$t(`ChatGPT.setup.create_app.error`),
          });
          return;
        }

        this.callModal({ type: 'Success', text: this.$t(`ChatGPT.setup.success`) });
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
  .chatgpt-modal {
    ::v-deep .unnnic-modal-container-background-body-description {
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
        padding: $unnnic-spacing-stack-md 0;
      }

      &__description {
        margin-bottom: $unnnic-spacing-stack-lg;
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-lg;
        text-align: left;

        &__version-wrapper {
          display: flex;
          flex-direction: column;
          gap: $unnnic-spacing-stack-xs;
          color: $unnnic-color-neutral-cloudy;
          font-size: $unnnic-font-size-body-gt;
          line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);

          &__options {
            display: flex;
            gap: $unnnic-spacing-stack-lg;
          }
        }
      }
    }
  }
</style>
