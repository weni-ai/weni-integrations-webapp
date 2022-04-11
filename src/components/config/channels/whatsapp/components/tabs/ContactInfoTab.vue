<template>
  <div class="contact-info">
    <dynamic-form class="contact-info__form" :inputs="contactInfoInputs" @input="updateInputs" />

    <div class="contact-info__buttons">
      <unnnic-button
        class="contact-info__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('WhatsApp.config.contact_info.configure_later')"
        @click="() => this.$emit('close')"
      ></unnnic-button>

      <unnnic-button
        class="contact-info__buttons__save"
        type="secondary"
        size="large"
        :text="$t('WhatsApp.config.contact_info.save_changes')"
        @click="() => this.$emit('save')"
      ></unnnic-button>
    </div>
  </div>
</template>

<script>
  import DynamicForm from '../../../../DynamicForm';

  export default {
    name: 'ContactInfoTab',
    components: { DynamicForm },
    data() {
      return {
        contactInfoInputs: [
          {
            type: 'input',
            name: 'website_url',
            label: 'WhatsApp.config.contact_info.website_url.label',
            value: null,
          },
          { name: 'website_url_alternative', label: null, value: null, type: 'input' },
          {
            type: 'input',
            name: 'corporate_email',
            label: 'WhatsApp.config.contact_info.corporate_email.label',
            placeholder: 'WhatsApp.config.contact_info.corporate_email.placeholder',
            value: null,
          },
        ],
      };
    },
    methods: {
      updateInputs(inputData) {
        this.contactInfoInputs[inputData.index].value = inputData.value;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .contact-info {
    display: flex;
    flex-direction: column;
    flex: 1;

    &__form {
      flex: 1;
    }

    &__buttons {
      // padding-right: $unnnic-spacing-inline-xs;
      margin-top: $unnnic-spacing-stack-sm;
      display: flex;

      &__cancel,
      &__save {
        flex-grow: 1;
      }
    }
  }
</style>
