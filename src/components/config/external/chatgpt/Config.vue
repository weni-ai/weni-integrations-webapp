<template>
  <div class="config-chatgpt">
    <div class="config-chatgpt__header">
      <div class="config-chatgpt__header__title">
        <div class="config-chatgpt__header__title__icon-container">
          <img class="config-chatgpt__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="config-chatgpt__header__title__name">{{ app.name }}</div>

        <unnnic-button
          class="config-chatgpt__header__title__close"
          type="tertiary"
          icon-center="close-1"
          size="small"
          @click="closeConfig"
        />
      </div>
      <span class="config-chatgpt__header__description" v-html="$t('ChatGPT.config.description')" />
    </div>

    <div class="config-chatgpt__settings__content">
      <unnnic-tab class="config-chatgpt__tabs" :tabs="tabs" initialTab="flows">
        <template slot="tab-head-flows"> {{ $t('ChatGPT.config.tabs.flows.title') }} </template>
        <div slot="tab-panel-flows">
          <div class="config-chatgpt__settings__content__scroll">
            <span class="config-chatgpt__settings__content__description">
              {{ $t('ChatGPT.config.tabs.flows.description') }}
            </span>

            <unnnic-text-area
              ref="rules-input"
              v-model="rules"
              class="config-chatgpt__settings__content__inputs__rules"
              type="normal"
              :label="$t('ChatGPT.config.tabs.flows.inputs.rules_label')"
            />
            <unnnic-text-area
              ref="base-input"
              v-model="knowledgeBase"
              class="config-chatgpt__settings__content__inputs__knowledge"
              type="normal"
              :label="$t('ChatGPT.config.tabs.flows.inputs.knowledge_label')"
            />
            <unnnic-label
              :label="$t('ChatGPT.config.tabs.flows.inputs.conversation_style_label')"
            />
            <unnnic-select-smart v-model="selectedConversationStyle" :options="stylesList" />
            <unnnic-label :label="$t('ChatGPT.config.tabs.flows.inputs.voice_tone_label')" />
            <unnnic-select-smart v-model="selectedVoiceTone" :options="voiceToneList">
            </unnnic-select-smart>
            <unnnic-input
              ref="prompt-input"
              v-model="prompt"
              class="config-chatgpt__settings__content__inputs__prompt"
              type="normal"
              :label="$t('ChatGPT.config.tabs.flows.inputs.prompt_label')"
              :placeholder="$t('ChatGPT.config.tabs.flows.inputs.prompt_placeholder')"
              @keyup.enter="addPrompt"
              iconRight="keyboard-enter-1"
            />

            <unnnic-label
              v-if="availablePrompts.length > 0 && !loadingGetPrompts"
              :label="$t('ChatGPT.config.tabs.flows.prompts_list')"
            />
            <unnnic-skeleton-loading
              v-else-if="loadingGetPrompts"
              tag="div"
              height="25px"
              width="75px"
            />
            <div class="config-chatgpt__settings__content__prompts-wrapper">
              <unnnic-toolTip
                v-for="(prompt, index) in availablePrompts"
                :key="index"
                class="config-chatgpt__settings__content__prompt config-chatgpt__settings__content__prompts__tooltip"
                :text="prompt.text"
                :enabled="true"
                side="top"
                maxWidth="350px"
              >
                <unnnic-tag
                  :text="prompt.text"
                  scheme="neutral-cloudy"
                  hasCloseIcon
                  @close="removePrompt(prompt)"
                  :ref="`tag-${index}`"
                />
              </unnnic-toolTip>
            </div>
          </div>

          <div class="config-chatgpt__settings__buttons">
            <unnnic-button
              class="config-chatgpt__settings__buttons__cancel"
              type="tertiary"
              size="large"
              :text="$t('apps.config.cancel')"
              @click="closeConfig"
            />

            <unnnic-button
              class="config-chatgpt__settings__buttons__save"
              type="secondary"
              size="large"
              :text="$t('ChatGPT.config.save_modifications')"
              :disabled="!hasChanges"
              :loading="loadingUpdateApp"
              @click="saveConfig"
            />
          </div>
        </div>

        <template slot="tab-head-general"> {{ $t('ChatGPT.config.tabs.general.title') }} </template>
        <div slot="tab-panel-general" class="config-chatgpt__general">
          <div class="config-chatgpt__settings__content__version-wrapper">
            <div>
              {{ $t('ChatGPT.setup.version') }}

              <unnnic-toolTip
                class="config-chatgpt__settings__content__version__tooltip"
                :text="$t('ChatGPT.setup.version_tooltip')"
                :enabled="true"
                side="right"
                maxWidth="350px"
              >
                <unnnic-icon-svg
                  class="config-chatgpt__settings__content__version__icon"
                  icon="information-circle-4"
                  size="sm"
                  scheme="neutral-soft"
                />
              </unnnic-toolTip>
            </div>

            <div class="config-chatgpt__settings__content__version-wrapper__options">
              <unnnic-radio
                v-for="(version, index) in availableVersions"
                :key="index"
                v-model="selectedVersion"
                :options="availableVersions"
                :value="version"
                :label="$t('ChatGPT.setup.version')"
              >
                {{ version }}
              </unnnic-radio>
            </div>
          </div>

          <div class="config-chatgpt__general__field">
            <span>API-Token</span>
            <span> {{ token }}</span>
          </div>
        </div>
      </unnnic-tab>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce';
  import { mapActions, mapState } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'chatgpt-config',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        selectedVersion: this.app.config?.ai_model ?? 'gpt-3.5-turbo-16k',
        name: this.app.config?.name ?? null,
        rules: this.app.config?.rules ?? null,
        knowledgeBase: this.app.config?.knowledge_base ?? null,
        token: this.app.config?.api_key ?? null,
        prompt: '',
        tabs: ['flows', 'general'],
        availableVersions: ['gpt-3.5-turbo-16k', 'gpt-3.5-turbo'],
        availablePrompts: [],
        toAddPrompts: [],
        toRemovePrompts: [],
        hasChanges: false,
        selectedConversationStyle: this.app.config?.conversation_style,
        stylesList: [
          {
            value: '0.2,0.1',
            label: this.$t('ChatGPT.config.tabs.flows.selects.necessary_label'),
            description: this.$t('ChatGPT.config.tabs.flows.selects.necessary_description'),
          },
          {
            value: '0.5,0.5',
            label: this.$t('ChatGPT.config.tabs.flows.selects.balanced_label'),
            description: this.$t('ChatGPT.config.tabs.flows.selects.balanced_description'),
          },
          {
            value: '0.7,0.8',
            label: this.$t('ChatGPT.config.tabs.flows.selects.creative_label'),
            description: this.$t('ChatGPT.config.tabs.flows.selects.creative_description'),
          },
        ],
        selectedVoiceTone: this.app.config?.voice_tone,
        voiceToneList: [
          {
            value: '1',
            label: this.$t('ChatGPT.config.tabs.flows.selects.none_label'),
          },
          {
            value: '2',
            label: this.$t('ChatGPT.config.tabs.flows.selects.neutral_label'),
          },
          {
            value: '3',
            label: this.$t('ChatGPT.config.tabs.flows.selects.happy_label'),
          },
          {
            value: '4',
            label: this.$t('ChatGPT.config.tabs.flows.selects.trusting_label'),
          },
          {
            value: '5',
            label: this.$t('ChatGPT.config.tabs.flows.selects.formal_label'),
          },
          {
            value: '6',
            label: this.$t('ChatGPT.config.tabs.flows.selects.humble_label'),
          },
          {
            value: '7',
            label: this.$t('ChatGPT.config.tabs.flows.selects.informal_label'),
          },
          {
            value: '8',
            label: this.$t('ChatGPT.config.tabs.flows.selects.helpful_label'),
          },
        ],
      };
    },
    async mounted() {
      await this.reloadPrompts();
    },
    computed: {
      ...mapState({
        project: (state) => state.auth.project,
        loadingUpdateApp: (state) => state.appType.loadingUpdateApp,
        errorUpdateApp: (state) => state.appType.errorUpdateApp,
      }),
      ...mapState('externals', [
        'loadingCreatePrompt',
        'errorCreatePrompt',
        'createPromptsResult',
        'loadingGetPrompts',
        'errorGetPrompts',
        'getPromptsResult',
        'loadingDeletePrompts',
        'errorDeletePrompts',
        'deletePromptsResult',
      ]),
    },
    methods: {
      ...mapActions(['updateApp']),
      ...mapActions('externals', ['createPrompts', 'getPrompts', 'deletePrompts']),
      async reloadPrompts() {
        await this.getPrompts({ code: this.app.code, appUuid: this.app.uuid });

        if (this.errorGetPrompts) {
          this.callModal({ type: 'Error', text: this.$t('ChatGPT.errors.get_prompts') });
        }

        this.availablePrompts = this.getPromptsResult || [];
        this.toAddPrompts = [];
        this.toRemovePrompts = [];
      },
      addPrompt() {
        if (this.prompt.trim()) {
          const newPrompt = { text: this.prompt.trim() };
          this.availablePrompts.push(newPrompt);
          this.toAddPrompts.push(newPrompt);
          this.prompt = '';

          this.hasChanges = true;
        }
      },
      removePrompt(prompt) {
        const checkPrompt = (p) => {
          if (prompt.uuid) {
            return p.uuid !== prompt.uuid;
          } else {
            if (p.uuid) return true;

            return p.text !== prompt.text;
          }
        };

        if (prompt.uuid) {
          this.toRemovePrompts.push(prompt);
        }

        this.availablePrompts = this.availablePrompts.filter(checkPrompt);
        this.toAddPrompts = this.toAddPrompts.filter(checkPrompt);

        this.hasChanges = true;
      },
      async handleUpdateApp() {
        const [temperature, top_p] = this.selectedConversationStyle[0].value.split(',');
        const voice_tone = `Em tom ${this.selectedVoiceTone[0].label}`;
        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            config: {
              ai_model: this.selectedVersion,
              rules: this.rules,
              knowledge_base: this.knowledgeBase,
              voice_tone,
              temperature,
              top_p,
            },
          },
        };

        await this.updateApp(data);

        if (this.errorUpdateApp) {
          this.callModal({ type: 'Error', text: this.$t('ChatGPT.errors.configure') });
          return true;
        }
      },
      async handleAddPrompts() {
        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            project_uuid: this.project,
            prompts: this.toAddPrompts,
          },
        };

        await this.createPrompts(data);

        if (this.errorCreatePrompt) {
          this.callModal({ type: 'Error', text: this.$t('ChatGPT.errors.create_prompt') });
          return true;
        }

        this.reloadPrompts();
      },
      async handleRemovePrompts() {
        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            project_uuid: this.project,
            prompts: this.toRemovePrompts.map((p) => p.uuid),
          },
        };

        await this.deletePrompts(data);

        if (this.errorDeletePrompts) {
          this.callModal({ type: 'Error', text: this.$t('ChatGPT.errors.delete_prompt') });
          return true;
        }

        this.reloadPrompts();
      },
      async saveConfig() {
        if (
          this.rules !== this.app.config.rules ||
          this.knowledgeBase !== this.app.config.knowledge_base ||
          this.selectedVersion !== this.app.config.ai_model ||
          this.selectedVoiceTone !== this.app.config.voice_tone ||
          this.selectedConversationStyle != this.app.config.conversation_style
        ) {
          let err = await this.handleUpdateApp();
          if (err) return;
        }

        if (this.toAddPrompts.length > 0) {
          let err = await this.handleAddPrompts();
          if (err) return;
        }

        if (this.toRemovePrompts.length > 0) {
          let err = await this.handleRemovePrompts();
          if (err) return;
        }

        this.callModal({ type: 'Success', text: this.$t('ChatGPT.success.configure') });
        this.$root.$emit('updateGrid');
      },
      closeConfig() {
        this.$emit('closeModal');
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
    watch: {
      selectedVersion: {
        handler: debounce(async function () {
          let err = await this.handleUpdateApp();
          if (!err) {
            this.callModal({ type: 'Success', text: this.$t('ChatGPT.success.configure') });
            this.$root.$emit('updateGrid');
          }
        }, 1000),
      },
      rules() {
        this.hasChanges = true;
      },
      knowledgeBase() {
        this.hasChanges = true;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .config-chatgpt {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__tabs {
      display: flex;
      flex-direction: column;
      height: -webkit-fill-available;
      height: -moz-available;
      overflow-y: hidden;
      width: 100%;

      ::v-deep .tab-body {
        display: flex;
        height: -webkit-fill-available;
        height: -moz-available;
        overflow-y: auto;
      }
      ::v-deep .tab-panel {
        width: 100%;

        display: flex;
        flex-direction: column;
        height: 100%;

        > div {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
      }
    }

    &__header {
      display: flex;
      flex-direction: column;
      margin: 2rem;
      margin-bottom: 1.5rem;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;
          align-items: center;

          background-color: rgba(0, 158, 150, 0.16);

          &__icon {
            width: $unnnic-icon-size-md;
            height: $unnnic-icon-size-md;
            margin: 0 auto;
          }
        }

        &__name {
          align-self: center;
          font-family: $unnnic-font-family-primary;
          font-weight: $unnnic-font-weight-regular;
          font-size: $unnnic-font-size-title-md;
          line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
          color: $unnnic-color-neutral-darkest;

          margin-left: $unnnic-inline-sm;
        }

        &__close {
          margin-left: auto;
          align-self: center;
        }
      }

      &__description {
        margin-top: $unnnic-inline-sm;
        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;

        ::v-deep {
          a {
            font-weight: $unnnic-font-weight-bold;
            color: $unnnic-color-neutral-cloudy;
          }
        }
      }
    }

    &__settings {
      display: flex;
      flex-direction: column;
      height: -webkit-fill-available;
      height: -moz-available;
      overflow-y: hidden;

      &__content {
        overflow: auto;
        display: flex;
        flex-direction: column;
        flex: 1;
        color: $unnnic-color-neutral-cloudy;
        font-size: $unnnic-font-size-body-gt;
        line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
        margin: 0 2rem 2rem 2rem;

        &__description {
          font-weight: $unnnic-font-weight-bold;
          font-size: $unnnic-font-size-body-gt;
          line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
          color: $unnnic-color-neutral-cloudy;
        }

        &__scroll {
          padding-right: $unnnic-spacing-inline-xs;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: auto;
          overflow-x: hidden;
          gap: $unnnic-spacing-stack-sm;
          margin-bottom: 2rem;
        }

        &__inputs {
          display: flex;
          flex-direction: row;
          gap: $unnnic-spacing-inline-xs;

          ::v-deep .unnnic-text-area {
            textarea {
              border-color: #e2e6ed;

              &:focus {
                border-color: #9caccc;
              }
            }
          }
        }

        &__prompts-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: $unnnic-spacing-inline-sm;
        }

        &__prompt {
          max-width: 100%;
          ::v-deep .unnnic-tag__label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      &__buttons {
        padding-right: $unnnic-spacing-inline-xs;
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        gap: $unnnic-spacing-inline-md;

        &__cancel,
        &__save {
          flex: 1;
        }
      }
    }

    &__general {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-stack-sm;

      &__field {
        display: flex;
        gap: $unnnic-spacing-inline-sm;
        justify-content: space-between;
      }
    }

    ::v-deep .unnnic-form__label {
      margin: 0 0 0.25rem;
    }

    ::v-deep .unnnic-label__label {
      margin: 5px 0px -10px;
    }
  }
</style>
