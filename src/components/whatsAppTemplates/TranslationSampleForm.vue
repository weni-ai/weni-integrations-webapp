<template>
  <div>
    <unnnic-modal
      class="sample-form"
      :text="$t('WhatsApp.templates.sample.title')"
      scheme="feedback-yellow"
      modal-icon="alert-circle-1"
      @close="closeSampleModal"
      @click.stop
    >
      <template #message>
        <div>
          <span>
            {{ $t('WhatsApp.templates.sample.description') }}
          </span>
          <div class="sample-form__container">
            <div class="sample-form__preview__title">
              {{ $t('WhatsApp.templates.sample.preview') }}
            </div>
            <TemplatePreview
              class="sample-form__preview"
              :showTitle="false"
              :bodyOverwrite="formattedBody"
              :headerOverwrite="fileToPreview"
            />

            <div class="sample-form__content">
              <div v-if="hasMedia" class="sample-form__header__wrapper">
                <span class="sample-form__header__title">
                  {{ $t('WhatsApp.templates.sample.header') }}
                </span>
                <unnnic-button type="secondary" @click="() => this.$refs.file.click()">
                  {{ $t('WhatsApp.templates.sample.choose_file') }}
                </unnnic-button>
                <input
                  type="file"
                  ref="file"
                  :accept="supportedFormats"
                  :multiple="false"
                  @input="handleFileChange"
                  style="display: none"
                />
                <span v-if="file" class="sample-form__header__file-name"> {{ file.name }} </span>
              </div>
              <div v-if="hasVariables" class="sample-form__body__wrapper">
                <span class="sample-form__body__title">
                  {{ $t('WhatsApp.templates.sample.body') }}</span
                >
                <unnnic-input
                  v-for="(variable, index) in variableCount"
                  :key="variable"
                  :placeholder="`Enter content for {{${variable}}}`"
                  @input="handleVariableChange(index, $event)"
                />
              </div>
            </div>

            <div class="sample-form__button">
              <unnnic-button type="secondary" @click="saveSample">
                {{ $t('WhatsApp.templates.sample.send') }}
              </unnnic-button>
            </div>
          </div>
          <div class="sample-form__info">{{ $t('WhatsApp.templates.sample.info') }}</div>
        </div>
      </template>
    </unnnic-modal>
  </div>
</template>

<script>
  import { mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import TemplatePreview from '@/components/whatsAppTemplates/TemplatePreview.vue';

  import { countVariables } from '@/utils/countTemplateVariables.js';
  import { toBase64 } from '@/utils/files.js';

  export default {
    name: 'TranslationSampleForm',
    components: { TemplatePreview },
    props: {
      hasMedia: {
        type: Boolean,
        default: false,
      },
      hasVariables: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        variablesData: [],
        formattedBody: '',
        file: null,
        fileToPreview: null,
      };
    },
    created() {
      this.formattedBody = this.templateTranslationCurrentForm.body;
    },
    computed: {
      ...mapState(whatsapp_store, ['templateTranslationCurrentForm']),
      variableCount() {
        return countVariables(this.templateTranslationCurrentForm.body);
      },
      supportedFormats() {
        const formatsMap = {
          IMAGE: '.png,.jpg,.jpeg',
          VIDEO: '.mp4',
          DOCUMENT: '.pdf',
        };
        return formatsMap[this.templateTranslationCurrentForm.header.mediaType] || '';
      },
    },
    methods: {
      closeSampleModal() {
        this.$emit('close-modal');
      },
      handleVariableChange(index, event) {
        this.variablesData[index] = event;
        let newBody = this.templateTranslationCurrentForm.body;
        this.variablesData.forEach((variable, index) => {
          newBody = newBody.replaceAll(`{{${index + 1}}}`, variable);
        });
        this.formattedBody = newBody;
      },
      validFormat(files) {
        const formats = this.supportedFormats.replaceAll('.', '').split(',');
        const isValid = Array.from(files).find((file) => {
          const validFormat = formats.find((format) => {
            return file.type.toLowerCase().includes(format.toLowerCase());
          });
          return validFormat;
        });
        return isValid;
      },
      validSize(files) {
        const maxFileSize = 16; // 16Mb
        const isValid = Array.from(files).find((file) => {
          const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
          return sizeInMB < maxFileSize;
        });
        return isValid;
      },
      validateFiles(files) {
        if (!files.length || files.length !== 1) {
          return false;
        }

        if (!this.validFormat(files)) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.invalid_file_format') });
          return false;
        }
        if (!this.validSize(files)) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.invalid_file_size') });
          return false;
        }
        return true;
      },
      async handleFileChange(event) {
        const { files } = event.target;
        if (this.validateFiles(files)) {
          this.file = files[0];

          if (this.templateTranslationCurrentForm.header.mediaType === 'IMAGE') {
            this.fileToPreview = await toBase64(files[0]);
          } else {
            this.fileToPreview = null;
          }
        }
        /* istanbul ignore next */
        if (this.$refs.file) {
          this.$refs.file.value = '';
        }
      },
      async saveSample() {
        if (this.hasVariables && this.variablesData.length !== this.variableCount) {
          this.callErrorModal({
            text: this.$t('WhatsApp.templates.error.missing_variable_example'),
          });
          return;
        }

        if (this.hasMedia && this.file === null) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.missing_media_example') });
          return;
        }

        const fileData = await toBase64(this.file);
        const sampleForm = {
          variables: this.variablesData,
          headerFile: fileData,
        };

        this.$emit('sample-submission', sampleForm);
        this.$emit('close-modal');
      },
      callErrorModal({ text }) {
        unnnicCallAlert({
          props: {
            text,
            title: this.$t('general.error'),
            icon: 'check-circle-1-1',
            scheme: 'feedback-red',
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
  .sample-form {
    &__container {
      max-height: 50vh;
      overflow-x: hidden;
      padding: 0 16px;
      overflow-y: auto;
    }

    &__content {
      overflow: auto;
      margin: $unnnic-spacing-stack-sm 0;
      padding-right: $unnnic-spacing-inline-xs;
    }

    &__preview {
      max-height: 30vh;
      overflow: auto;

      &__title {
        margin-bottom: $unnnic-spacing-stack-xs;
        text-align: left;
      }

      margin: 0 (-$unnnic-spacing-inline-md);
      padding: $unnnic-spacing-stack-nano $unnnic-spacing-inline-md;

      ::v-deep .template-preview__content,
      ::v-deep .template-preview__buttons {
        margin: $unnnic-spacing-stack-xs 0;
      }

      ::v-deep .template-preview__content {
        width: 210px;
        margin-bottom: $unnnic-spacing-stack-nano;
      }

      ::v-deep .template-preview__buttons {
        width: 225px;
        margin-top: $unnnic-spacing-stack-nano;
      }
    }

    &__body,
    &__header {
      &__wrapper {
        display: flex;
        flex-direction: column;
        text-align: left;
        gap: $unnnic-spacing-stack-xs;
        width: 75%;
      }
    }

    &__header {
      &__wrapper {
        margin-bottom: $unnnic-spacing-stack-sm;
      }

      &__file-name {
        color: $unnnic-color-neutral-clean;
        font-size: $unnnic-font-size-body-gt;
        font-weight: $unnnic-font-weight-bold;
      }
    }

    &__button {
      text-align: right;
      margin-bottom: $unnnic-spacing-stack-sm;

      .unnnic-button {
        width: 50%;
      }
    }

    &__info {
      background-color: $unnnic-color-neutral-soft;
      margin: 0 (-$unnnic-spacing-inline-md);
      margin-bottom: (-$unnnic-spacing-stack-giant);
      padding: $unnnic-spacing-inline-md;
    }
  }
</style>
