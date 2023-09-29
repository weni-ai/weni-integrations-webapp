<template>
  <div class="whatsapp-catalog-table">
    <div class="whatsapp-catalog-table__header">
      <div class="whatsapp-catalog-table__header__title">
        <unnnic-card
          class="whatsapp-catalog-table__header__title__text"
          type="title"
          :title="$t('WhatsApp.catalog.list.title')"
          :hasInformationIcon="false"
          icon="house-1-1"
          scheme="brand-weni-soft"
        />
        <span class="u font secondary body-gt color-neutral-darkest">
          {{ $t('WhatsApp.catalog.list.description') }}
        </span>
      </div>
      <div class="whatsapp-catalog-table__header__button">
        <unnnic-button-next type="terciary" size="large">
          {{ $t('WhatsApp.catalog.list.advanced_settings') }}
        </unnnic-button-next>
      </div>
    </div>
    <Card />
  </div>
</template>

<script>
  import Card from '@/components/whatsAppCatalogs/Card';

  export default {
    name: 'Table',
    components: {
      Card,
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-catalog-table {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    margin-top: $unnnic-spacing-lg;

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $unnnic-spacing-md;

      &__title {
        display: flex;
        flex-direction: column;

        &__text {
          margin-bottom: $unnnic-spacing-xs;
        }
      }
    }
  }
</style>
