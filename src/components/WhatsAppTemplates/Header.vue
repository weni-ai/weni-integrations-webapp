<template>
  <div class="whatsapp-templates-header">
    <div class="whatsapp-templates-header__wrapper">
      <div class="whatsapp-templates-header__icon">
        <img :src="icon" />
      </div>
      <span class="whatsapp-templates-header__title">{{ title }}</span>
    </div>
    <unnnic-button size="small" type="secondary">Novo template</unnnic-button>
  </div>
</template>

<script>
  export default {
    name: 'WhatsAppTemplatesHeader',
    props: {
      title: {
        type: String,
        default: 'WhatsApp',
      },
      icon: {
        type: String,
        default: 'https://weni-sp-integrations-production.s3.amazonaws.com/wpp_oficial_YaNXiFt.svg',
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-templates-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: $unnnic-spacing-stack-md auto;

    &__wrapper {
      display: flex;
      align-items: center;
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
      font-size: $unnnic-font-size-title-md;
      line-height: $unnnic-line-height-md + $unnnic-font-size-title-md;
      color: $unnnic-color-neutral-darkest;
    }
  }
</style>
