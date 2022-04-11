<template>
  <div class="profile-content">
    <dynamic-form class="profile-content__form" :inputs="profileInputs" @input="updateInputs" />

    <div class="profile-content__buttons">
      <unnnic-button
        class="profile-content__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('WhatsApp.config.profile.configure_later')"
        @click="() => this.$emit('close')"
      />

      <unnnic-button
        class="profile-content__buttons__save"
        type="secondary"
        size="large"
        :text="$t('WhatsApp.config.profile.save_changes')"
        @click="() => this.$emit('save')"
      />
    </div>
  </div>
</template>

<script>
  import DynamicForm from '../../../../DynamicForm';

  export default {
    name: 'ProfileTab',
    components: { DynamicForm },
    data() {
      return {
        profileInputs: [
          {
            type: 'upload',
            name: 'profile_image',
            label: 'WhatsApp.config.profile.profile_image.label',
            value: null,
            props: {
              acceptMultiple: false,
              supportedFormats: '.png,.jpeg',
              maximumUploads: 1,
              filesProgress: [],
              isUploading: false,
              canImport: true,
              canDelete: true,
            },
          },
          {
            type: 'input',
            name: 'status',
            label: 'WhatsApp.config.profile.status.label',
            placeholder: 'WhatsApp.config.profile.status.placeholder',
            value: null,
          },
          {
            type: 'input',
            name: 'description',
            label: 'WhatsApp.config.profile.description.label',
            placeholder: 'WhatsApp.config.profile.description.placeholder',
            value: null,
          },
          {
            type: 'select',
            name: 'sector',
            label: 'WhatsApp.config.profile.sector.label',
            placeholder: 'WhatsApp.config.profile.sector.placeholder',
            value: null,
            options: [
              { value: '1', text: 'option1' },
              { value: '2', text: 'option2' },
              { value: '3', text: 'option3' },
              { value: '4', text: 'option4' },
              { value: '5', text: 'option5' },
            ],
          },
        ],
      };
    },
    methods: {
      updateInputs(inputData) {
        this.profileInputs[inputData.index].value = inputData.value;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .profile-content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-inline-xs;
    height: 100%;

    &__form {
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      flex: 1;
    }

    &__buttons {
      margin-top: $unnnic-spacing-stack-sm;
      display: flex;

      &__cancel,
      &__save {
        flex-grow: 1;
      }
    }

    &__text {
      color: $unnnic-color-neutral-dark;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
    }
  }
</style>
