<template>
  <div class="form-tab-content-header">
    <span class="form-tab-content-header__title">
      {{ $t('WhatsApp.templates.form_field.header') }}
    </span>

    <div class="form-tab-content-header__inputs">
<<<<<<< HEAD
      <unnnic-select
        :disabled="disableInputs"
        :class="{
          'form-tab-content-header__inputs__selector': true,
          'form-tab-content-header__inputs__selector__disabled': disableInputs,
        }"
        :value="headerType"
        :label="$t('WhatsApp.templates.form_field.header__label')"
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
=======
      <div>
        <unnnic-label :label="$t('WhatsApp.templates.form_field.header__label')" />
        <unnnic-select-smart
          :disabled="disableInputs"
          :class="{
            'form-tab-content-header__inputs__selector': true,
            'form-tab-content-header__inputs__selector__disabled': disableInputs,
          }"
          :options="headerTypeOptions"
          :modelValue="selectedHeaderType"
          @update:modelValue="handleHeaderTypeChange"
        />
      </div>

>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
      <unnnic-input
        class="form-tab-content-header__inputs__text-input"
        v-if="headerType === 'TEXT'"
        :placeholder="$t('WhatsApp.templates.form_field.header_text_placeholder')"
        :disabled="disableInputs"
<<<<<<< HEAD
        :value="headerText"
        @input="handleNewHeaderInput({ text: $event })"
=======
        :modelValue="headerText"
        @update:modelValue="handleNewHeaderInput({ text: $event })"
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
  import { mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';

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
<<<<<<< HEAD
        headerTypeOptions: [
          {
            value: 'TEXT',
            text: this.$t('WhatsApp.templates.header_type_options.text'),
          },
          {
            value: 'MEDIA',
            text: this.$t('WhatsApp.templates.header_type_options.media'),
=======
        selectedHeaderType: [],
        headerTypeOptions: [
          {
            value: 'TEXT',
            label: this.$t('WhatsApp.templates.header_type_options.text'),
          },
          {
            value: 'MEDIA',
            label: this.$t('WhatsApp.templates.header_type_options.media'),
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
      ...mapState(whatsapp_store, ['templateTranslationCurrentForm']),
      headerType() {
        return this.templateTranslationCurrentForm.header?.header_type || 'TEXT';
      },
      headerText() {
        return this.templateTranslationCurrentForm.header?.text || null;
      },
    },
    methods: {
      handleNewHeaderInput(event) {
<<<<<<< HEAD
=======
        this.headerText = event.text;
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
        this.$emit('input-change', {
          fieldName: 'header',
          fieldValue: { ...this.templateTranslationCurrentForm.header, ...event },
        });
      },
      handleHeaderTypeChange(event) {
<<<<<<< HEAD
        let fieldValue;

        if (event === 'TEXT') {
=======
        this.selectedHeaderType = event;
        let fieldValue;

        if (event[0].value === 'TEXT') {
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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

    &__title {
      margin-bottom: $unnnic-spacing-stack-sm;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-bold;

      color: $unnnic-color-neutral-darkest;
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
        margin-top: calc($unnnic-spacing-stack-lg + 6px);
      }

      &__buttons {
        display: flex;
        align-items: flex-end;
        gap: $unnnic-spacing-inline-md;
      }
    }
  }
</style>
