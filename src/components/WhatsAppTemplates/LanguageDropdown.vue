<template>
  <unnnic-dropdown>
    <div slot="trigger" class="template-language-dropdown">
      <unnnic-icon-svg
        class="template-language-dropdown__icon"
        :icon="getTranslationStatusIcon(template.translations[0])"
        size="sm"
        :scheme="getTranslationStatusColor(template.translations[0])"
      />
      {{ getTemplateDefaultLanguage(template) }}
      <unnnic-icon-svg
        class="template-language-dropdown__icon"
        icon="arrow-button-down-1"
        size="sm"
      />
    </div>
    <unnnic-dropdown-item
      class="template-language-dropdown__item"
      v-for="(translation, index) in template.translations"
      :key="index"
    >
      <unnnic-icon-svg
        class="template-language-dropdown__item__icon"
        :icon="getTranslationStatusIcon(translation)"
        size="sm"
        :scheme="getTranslationStatusColor(translation)"
      />
      {{ translation.language }}
    </unnnic-dropdown-item>
  </unnnic-dropdown>
</template>

<script>
  export default {
    name: 'LanguageDropdown',
    props: {
      template: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        translationStatusMap: {
          APPROVED: {
            icon: 'check-circle-1-1-1',
            color: 'feedback-green',
          },
        },
      };
    },
    methods: {
      getTemplateDefaultLanguage(template) {
        return template.translations[0].language;
      },
      getTranslationStatusIcon(translation) {
        return this.translationStatusMap[translation.status]?.icon || 'delete-1-1';
      },
      getTranslationStatusColor(translation) {
        return this.translationStatusMap[translation.status]?.color || 'feedback-red';
      },
    },
  };
</script>

<style lang="scss" scoped>
  .template-language-dropdown {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
    border-radius: $unnnic-border-radius-pill;
    padding: $unnnic-spacing-stack-nano $unnnic-spacing-inline-xs;
    align-items: center;
    width: 100px;
    text-transform: uppercase;
    cursor: pointer;

    &__icon {
      margin-right: $unnnic-spacing-inline-nano;
    }

    &__item {
      width: 80px;
      text-transform: uppercase;

      &__icon {
        margin-right: $unnnic-spacing-inline-nano;
      }
    }
  }
</style>
