<template>
  <unnnic-dropdown class="table-action__dropdown">
    <unnnic-button
      slot="trigger"
      size="small"
      type="terciary"
      iconCenter="navigation-menu-vertical-1"
    />

    <unnnic-dropdown-item
      :class="['table-action__dropdown__item', `table-action__dropdown__item--${option.id}`]"
      v-for="option in options"
      :key="option.id"
      @click="() => option.action()"
    >
      <unnnic-icon-svg :icon="option.icon" size="sm" :scheme="option.scheme" />
      {{ option.title }}
    </unnnic-dropdown-item>
  </unnnic-dropdown>
</template>

<script>
  export default {
    name: 'TableActionButton',
    data() {
      return {
        options: [
          {
            id: 'add_language',
            title: this.$t('WhatsApp.templates.table.actions.add_language'),
            icon: 'add-circle-1',
            scheme: 'neutral-darkest',
            action: () => {
              /* istanbul ignore next */
              console.log('add language');
            },
          },
          {
            id: 'duplicate_language',
            title: this.$t('WhatsApp.templates.table.actions.duplicate_language'),
            icon: 'copy-paste-1',
            scheme: 'neutral-darkest',
            action: () => {
              /* istanbul ignore next */
              console.log('duplicate language');
            },
          },
          {
            id: 'delete_language',
            title: this.$t('WhatsApp.templates.table.actions.delete_language'),
            icon: 'bin-1-1',
            scheme: 'feedback-red',
            action: () => {
              /* istanbul ignore next */
              console.log('delete language');
            },
          },
        ],
      };
    },
  };
</script>

<style lang="scss" scoped>
  .table-action {
    &__dropdown {
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-md;
      line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
      color: $unnnic-color-neutral-dark;

      ::v-deep .unnnic-dropdown__content {
        width: max-content;
      }

      &__item {
        &--delete_language {
          color: $unnnic-color-feedback-red;
        }
      }
    }
  }
</style>
