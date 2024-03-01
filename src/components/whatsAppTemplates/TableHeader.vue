<template>
  <div class="whatsapp-templates-header">
    <div class="whatsapp-templates-header__wrapper">
      <span class="whatsapp-templates-header__title">
        {{ $t('WhatsApp.templates.table.header.title') }}
      </span>
      <span class="whatsapp-templates-header__description">
        {{ $t('WhatsApp.templates.table.header.description') }}
      </span>
    </div>
    <unnnic-button
      class="whatsapp-templates-header__button"
      type="secondary"
      @click="navigateToCreateTemplate"
    >
      {{ $t('WhatsApp.templates.table.new_template') }}
    </unnnic-button>
  </div>
</template>

<script>
  export default {
    name: 'TableHeader',
    methods: {
      navigateToCreateTemplate() {
        const { appCode, appUuid } = this.$route.params;
        this.$router.push({ path: `/apps/my/${appCode}/${appUuid}/templates/create` });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-templates-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: $unnnic-spacing-stack-md 0;
    margin-bottom: $unnnic-spacing-stack-lg;

    &__wrapper {
      display: flex;
      flex-direction: column;
    }

    &__button {
      width: 255px;
    }

    &__icon {
      display: flex;
      background-color: rgba(72, 172, 76, 0.2);
      border-radius: $unnnic-border-radius-sm;
      justify-content: center;
      margin-right: $unnnic-spacing-inline-sm;

      img {
        height: $unnnic-icon-size-md;
        width: $unnnic-icon-size-md;
        padding: $unnnic-inset-nano;
      }
    }

    &__title {
      font-family: $unnnic-font-family-primary;
      font-weight: $unnnic-font-weight-regular;
      font-size: $unnnic-font-size-title-sm;
      line-height: $unnnic-line-height-md + $unnnic-font-size-title-sm;
      color: $unnnic-color-neutral-darkest;
    }

    &__description {
      font-family: $unnnic-font-family-secondary;
      font-weight: $unnnic-font-weight-regular;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
      color: $unnnic-color-neutral-darkest;
    }
  }
</style>
