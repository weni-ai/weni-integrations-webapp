<template>
  <div class="file-upload">
    <vue-dropzone
      v-if="!loading"
      id="customdropzone"
      ref="myDropzone"
      :options="dropzoneOptions"
      :include-styling="false"
      :useCustomSlot="true"
      @vdropzone-thumbnail="thumbnail"
      @vdropzone-files-added="handleAdd"
      @vdropzone-max-files-exceeded="handleExceeded"
    >
      <div v-if="show === 'drop'" class="dropzone-custom">
        <div class="dropzone-custom__content">
          <unnnic-icon-svg
            class="dropzone-custom__content__icon"
            icon="upload-bottom-1"
            size="md"
            scheme="aux-blue"
          />
          <div class="dropzone-custom__content__text">
            <div class="dropzone-custom__content__text__title">
              {{ $t('Drag_your_file_here_or') }}&nbsp;
              <div class="dropzone-custom__content__text__title__highlight">
                {{ $t('search_it') }}
              </div>
            </div>
            <div class="dropzone-custom__content__text__subtitle">
              {{ `${$t('Supported_formats')}: ${formatsLabel} ` }}
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="show === 'error'" class="dropzone-error">
        <div class="dropzone-error__message">
          <unnnic-icon-svg
            class="dropzone-error__message__icon"
            icon="alert-circle-1"
            size="md"
            scheme="feedback-red"
          />
          <div class="dropzone-error__message__label">{{ $t('Invalid_file') }}</div>
        </div>
        <div class="dropzone-error__action">
          {{ $t('Drag_another_file_or') }}&nbsp;
          <div class="dropzone-error__action__highlight">{{ $t('search_it') }}</div>
        </div>
      </div>
      <div v-else class="dropzone-preview">
        <unnnic-icon-svg
          class="dropzone-preview__icon"
          icon="upload-bottom-1"
          size="md"
          scheme="aux-blue"
        />
        <div class="dropzone-preview__text">{{ $t('Modify') }}</div>
      </div>
    </vue-dropzone>
  </div>
</template>

<script>
  import Vue from 'vue';
  import vue2Dropzone from 'vue2-dropzone';
  import PreviewTemplate from './PreviewTemplate.vue';
  import 'vue2-dropzone/dist/vue2Dropzone.min.css';

  export default {
    name: 'FileUpload',
    props: {
      type: {
        type: String,
        required: true,
        validator(value) {
          return ['image', 'style'].indexOf(value) !== -1;
        },
      },
      maxFilesize: {
        type: Number,
        default: 2,
      },
      formatsLabel: {
        type: String,
        default: '',
      },
    },
    components: {
      vueDropzone: vue2Dropzone,
    },
    data() {
      return {
        loading: true,
        show: 'drop',
        previewHtml: null,
      };
    },
    computed: {
      dropzoneOptions() {
        return {
          // url is mandatory but we will not use it, so set to localhost
          url: 'https://localhost',
          autoProcessQueue: false,
          autoQueue: false,
          previewTemplate: this.previewHtml,
          maxFilesize: 2,
          parallelUploads: 1,
          maxFiles: 1,
          acceptedFiles: this.allowedTypes(),
        };
      },
    },
    created() {
      const ComponentClass = Vue.extend(PreviewTemplate);
      const instance = new ComponentClass({ propsData: { type: this.type } });
      instance.$mount();
      this.previewHtml = instance.$el.outerHTML;
      this.loading = false;
    },
    methods: {
      emitFile(file) {
        this.$emit('newFile', file);
      },
      allowedTypes() {
        if (this.type === 'image') return 'image/png,image/jpeg,image/svg+xml';

        return 'text/css';
      },
      handleExceeded(file = undefined) {
        this.$refs.myDropzone.removeAllFiles(true);
        if (file) {
          this.$refs.myDropzone.addFile(file);
        }
      },
      validateFile(file) {
        let isValid = true;
        let sizeInMB = (file.size / (1024 * 1024)).toFixed(2);

        if (!file.type) {
          isValid = false;
        }

        if (!this.allowedTypes().includes(file.type)) {
          isValid = false;
        }

        if (sizeInMB >= this.maxFilesize) {
          isValid = false;
        }

        if (this.$refs.myDropzone.getAcceptedFiles().includes(file)) {
          isValid = true;
        }

        return isValid;
      },
      handleAdd(files) {
        if (files.length > 1) {
          const validFiles = files.filter((file) => {
            if (this.validateFile(file)) {
              return file;
            }
          });
          if (validFiles.length > 0) {
            const firstFile = validFiles[0];
            setTimeout(() => this.handleExceeded(firstFile), 50);
            this.show = 'preview';
            this.emitFile(firstFile);
          } else {
            this.show = 'error';
            setTimeout(() => this.handleExceeded(), 50);
          }
        } else {
          const incomingFile = files[0];
          if (!this.validateFile(incomingFile)) {
            this.show = 'error';
            setTimeout(() => this.$refs.myDropzone.removeAllFiles(), 50);
          } else {
            this.show = 'preview';
            this.emitFile(incomingFile);
          }
        }
      },
      thumbnail: /* istanbul ignore next */ function (file, dataUrl) {
        let j, len, ref, thumbnailElement;
        if (file.previewElement) {
          file.previewElement.classList.remove('dz-file-preview');
          ref = file.previewElement.querySelectorAll('div.data-dz-thumbnail-bg');
          for (j = 0, len = ref.length; j < len; j++) {
            thumbnailElement = ref[j];
            thumbnailElement.alt = file.name;
            thumbnailElement.style.backgroundImage = 'url("' + dataUrl + '")';
          }
          return setTimeout(
            // eslint-disable-next-line no-unused-vars
            (function (_this) {
              return function () {
                return file.previewElement.classList.add('dz-image-preview');
              };
            })(this),
            1,
          );
        }
      },
    },
  };
</script>

<style lang="scss">
  .dropzone-custom {
    &__content {
      display: flex;
      align-items: center;
      justify-content: center;

      &__icon {
        margin-right: $unnnic-inline-nano;
      }

      &__text {
        text-align: center;
        white-space: nowrap;
        font-family: $unnnic-font-family-secondary;
        font-size: $unnnic-font-size-body-md;
        font-weight: $unnnic-font-weight-bold;
        line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
        &__title {
          display: flex;
          justify-content: center;
          color: $unnnic-color-neutral-darkest;
          &__highlight {
            font-weight: $unnnic-font-weight-regular;
            color: $unnnic-color-brand-weni;
            cursor: pointer;
          }
        }

        &__subtitle {
          color: $unnnic-color-neutral-cloudy;
        }
      }
    }
  }

  .dropzone-preview {
    display: flex;
    cursor: pointer;
    align-items: center;
    border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-clean;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-md;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
    &__icon {
      margin-right: $unnnic-inline-nano;
    }
  }

  .dropzone-error {
    white-space: nowrap;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-md;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
    &__message {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__action {
      display: flex;
      justify-content: center;
      color: $unnnic-color-neutral-darkest;
      &__highlight {
        color: initial;
        cursor: pointer;
      }
    }
  }

  #customdropzone {
    background-color: $unnnic-color-background-carpet;
    border: $unnnic-border-width-thin dashed $unnnic-color-neutral-clean;
    border-radius: $unnnic-border-radius-sm;
    padding: 8px 16px;
    min-height: 40px;

    &.dz-started {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      align-items: center;
      justify-content: center;

      .dz-message {
        margin-left: auto;
        color: $unnnic-color-neutral-cloudy;
      }

      .dz-preview {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;

        .dz-image {
          width: $unnnic-icon-size-xl;
          height: $unnnic-icon-size-xl;

          .data-dz-thumbnail-bg {
            width: inherit;
            height: inherit;
            border-radius: 50%;
            background-size: contain;
          }
        }
        .dz-details {
          margin-left: $unnnic-inline-xs;
          color: $unnnic-color-neutral-cloudy;
        }
      }
    }
  }
</style>
