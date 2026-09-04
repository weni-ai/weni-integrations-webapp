<template>
  <unnnic-dialog
    ref="unnnic-chatgpt-modal"
    class="chatgpt-modal"
    :open="true"
    @update:open="handleOpenUpdate"
  >
    <unnnic-dialog-content size="medium" @interact-outside.prevent>
      <unnnic-dialog-header :close-button="false">
        <unnnic-dialog-title>
          {{ $t('ChatGPT.setup.title') }}
        </unnnic-dialog-title>
      </unnnic-dialog-header>

      <section class="chatgpt-modal__description">
        {{ $t('ChatGPT.setup.description') }}
      </section>

      <div class="chatgpt-modal__content">
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

      <unnnic-dialog-footer>
        <unnnic-button
          ref="unnnic-chatgpt-modal-close-button"
          type="tertiary"
          :text="$t('general.Cancel')"
          @click="closePopUp"
        />
        <unnnic-button
          ref="unnnic-chatgpt-modal-navigate-button"
          type="secondary"
          :text="$t('general.continue')"
          :loading="loadingCreateApp"
          @click="setupChatGptService"
        />
      </unnnic-dialog-footer>
    </unnnic-dialog-content>
  </unnnic-dialog>
</template>

<script>
  import { mapState, mapActions } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import unnnic from '@weni/unnnic-system';

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
        versions: ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo'],
      };
    },
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(app_type, ['loadingCreateApp', 'errorCreateApp']),
    },
    methods: {
      ...mapActions(app_type, ['createApp']),
      handleOpenUpdate(open) {
        if (!open) {
          this.closePopUp();
        }
      },
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
            type: 'error',
            text: this.$t(`ChatGPT.setup.create_app.error`),
          });
          return;
        }

        this.callModal({ type: 'success', text: this.$t(`ChatGPT.setup.success`) });
        this.$router.replace('/apps/my');
      },
      callModal({ text, type }) {
        unnnic.unnnicCallAlert({
          props: {
            text,
            type,
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .chatgpt-modal {
    &__description {
      padding: $unnnic-space-4;
      padding-bottom: 0;
      color: $unnnic-color-fg-base;
    }

    &__content {
      display: flex;
      flex-direction: column;
      overflow: auto;
      padding: $unnnic-space-4;

      &__form {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-lg;
        text-align: left;

        &__version-wrapper {
          display: flex;
          flex-direction: column;
          gap: $unnnic-spacing-stack-xs;
          color: $unnnic-color-fg-base;
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
