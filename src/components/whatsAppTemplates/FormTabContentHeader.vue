<template>
  <div class="form-tab-content-header">
    <unnnic-tag
      class="form-tab-content-header__tag"
      type="default"
      :text="$t('WhatsApp.templates.form_field.header')"
      scheme="neutral-darkest"
    />

    <div class="form-tab-content-header__inputs">
      <unnnic-select
        :disabled="disableInputs"
        :class="{
          'form-tab-content-header__inputs__selector': true,
          'form-tab-content-header__inputs__selector__disabled': disableInputs,
        }"
        :value="headerType"
        @input="handleHeaderTypeChange"
      >
        <option
          v-for="option in headerTypeOptions"
          :key="option.value"
          :value="option.value"
          :label="option.text"
        >
          {{ option.text }}
        </option>
      </unnnic-select>

      <!-- TODO: Handle change in header.text  -->
      <unnnic-input
        class="form-tab-content-header__inputs__text-input"
        v-if="headerType === 'TEXT'"
        :placeholder="$t('WhatsApp.templates.form_field.header_text_placeholder')"
        :disabled="disableInputs"
        :value="headerText"
        @input="handleNewHeaderInput({ text: $event })"
        :maxlength="60"
      />
      <!-- TODO: Set media type on button click -->
      <div v-else class="form-tab-content-header__inputs__buttons">
        <unnnic-button
          :type="buttonType('IMAGE')"
          iconCenter="common-file-horizontal-image-1"
          :disabled="disableInputs || isSelected('IMAGE')"
          @click="handleNewHeaderInput({ mediaType: 'IMAGE' })"
        />
        <unnnic-button
          :type="buttonType('VIDEO')"
          iconCenter="button-play-1"
          :disabled="disableInputs || isSelected('VIDEO')"
          @click="handleNewHeaderInput({ mediaType: 'VIDEO' })"
        />
        <unnnic-button
          :type="buttonType('DOCUMENT')"
          iconCenter="text-left"
          :disabled="disableInputs || isSelected('DOCUMENT')"
          @click="handleNewHeaderInput({ mediaType: 'DOCUMENT' })"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'FormTabContentHeader',
    props: {
      disableInputs: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        headerTypeOptions: [
          {
            value: 'TEXT',
            text: this.$t('WhatsApp.templates.header_type_options.text'),
          },
          {
            value: 'MEDIA',
            text: this.$t('WhatsApp.templates.header_type_options.media'),
          },
        ],
      };
    },
    mounted() {
      this.fillEmptyHeader();
    },
    beforeUpdate() {
      this.fillEmptyHeader();
    },
    computed: {
      ...mapGetters('WhatsApp', ['templateTranslationCurrentForm']),
      headerType() {
        return this.templateTranslationCurrentForm.header?.header_type || 'TEXT';
      },
      headerText() {
        return this.templateTranslationCurrentForm.header?.text || null;
      },
    },
    methods: {
      handleNewHeaderInput(event) {
        this.$emit('input-change', {
          fieldName: 'header',
          fieldValue: { ...this.templateTranslationCurrentForm.header, ...event },
        });
      },
      handleHeaderTypeChange(event) {
        let fieldValue;

        if (event === 'TEXT') {
          fieldValue = { header_type: 'TEXT', text: null };
        } else {
          fieldValue = { header_type: 'MEDIA', mediaType: 'IMAGE' };
        }

        this.$emit('input-change', {
          fieldName: 'header',
          fieldValue,
        });
      },
      buttonType(type) {
        if (this.disableInputs) {
          const selectedMediaType = this.templateTranslationCurrentForm.header?.mediaType;

          if (selectedMediaType !== type) {
            return 'primary';
          }
        }
        return 'secondary';
      },
      isSelected(type) {
        return this.templateTranslationCurrentForm.header?.mediaType === type;
      },
      fillEmptyHeader() {
        const headerType = this.templateTranslationCurrentForm.header?.header_type;
        if (!headerType) {
          this.$emit('input-change', {
            fieldName: 'header',
            fieldValue: { header_type: 'TEXT', text: null },
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-tab-content-header {
    display: flex;
    flex-direction: column;

    &__tag {
      width: fit-content;
      margin-bottom: $unnnic-spacing-stack-sm;
    }

    &__inputs {
      display: flex;
      gap: $unnnic-spacing-inline-md;

      &__selector {
        min-width: fit-content;
        width: 25%;

        &__disabled {
          cursor: default;

          ::v-deep .input,
          ::v-deep .unnnic-icon {
            pointer-events: none;
          }

          ::v-deep .input {
            border: $unnnic-border-width-thinner dashed $unnnic-color-neutral-clean;
            background-color: $unnnic-color-neutral-light;
          }
        }
      }

      &__text-input {
        flex: 1;
      }

      &__buttons {
        display: flex;
        gap: $unnnic-spacing-inline-md;
      }
    }
  }
</style>
