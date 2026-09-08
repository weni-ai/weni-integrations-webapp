<template>
  <UnnnicDropdown :position="position">
    <template #trigger>
      <div class="template-language-dropdown">
        <UnnnicIconSvg
          class="template-language-dropdown__icon"
          :icon="getTranslationStatusIcon(template.translations[0])"
          size="sm"
          :scheme="getTranslationStatusColor(template.translations[0])"
        />
        {{ templateDefaultLanguage }}
        <UnnnicIconSvg
          class="template-language-dropdown__icon"
          icon="arrow-button-down-1"
          size="sm"
        />
      </div>
    </template>
    <UnnnicDropdownItem
      v-for="(translation, index) in template.translations"
      :key="index"
      class="template-language-dropdown__item"
    >
      <UnnnicIconSvg
        class="template-language-dropdown__item__icon"
        :icon="getTranslationStatusIcon(translation)"
        size="sm"
        :scheme="getTranslationStatusColor(translation)"
      />
      {{ translation.language }}
    </UnnnicDropdownItem>
  </UnnnicDropdown>
</template>

<script>
export default {
  name: 'TableLanguageDropdown',
  props: {
    template: {
      type: Object,
      required: true,
    },
    position: {
      type: String,
      default: 'bottom-left',
      validator(value) {
        return (
          ['bottom-left', 'bottom-right', 'top-left', 'top-right'].indexOf(
            value,
          ) !== -1
        );
      },
    },
  },
  data() {
    return {
      translationStatusMap: {
        APPROVED: {
          icon: 'check-circle-1-1-1',
          color: 'feedback-green',
        },
        PENDING: {
          icon: 'alert-circle-1-1',
          color: 'feedback-yellow',
        },
      },
    };
  },
  computed: {
    templateDefaultLanguage() {
      return this.template.translations[0]?.language || '-';
    },
  },
  methods: {
    getTranslationStatusIcon(translation) {
      return (
        this.translationStatusMap[translation?.status]?.icon || 'delete-2-1'
      );
    },
    getTranslationStatusColor(translation) {
      return (
        this.translationStatusMap[translation?.status]?.color || 'feedback-red'
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.template-language-dropdown {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  border: 1px solid $unnnic-color-border-base;
  border-radius: $unnnic-border-radius-pill;
  padding: $unnnic-spacing-stack-nano $unnnic-spacing-inline-xs;
  align-items: center;
  width: 80px;
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
