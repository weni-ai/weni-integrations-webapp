<template>
  <div class="form-category">
    <unnnic-tab class="form-category__tab" :tabs="categories">
      <template #tab-head-marketing> Marketing </template>
      <template #tab-panel-marketing>
        <div>
          <div class="form-category__tab__options">
            <unnnic-radio
              v-for="(version, index) in typeOptions"
              :key="index"
              v-model="selectedType"
              :options="typeOptions"
              :value="version"
              :label="$t('ChatGPT.setup.version')"
            >
              <p class="form-category__tab__options__title">
                {{ $t(`WhatsApp.templates.category.marketing.options.${version}.title`) }}
              </p>
              <p class="form-category__tab__options__description">
                {{ $t(`WhatsApp.templates.category.marketing.options.${version}.description`) }}
              </p>
            </unnnic-radio>
          </div>
        </div>
      </template>
    </unnnic-tab>

    <div class="form-category__buttons">
      <unnnic-button class="form-category__buttons__cancel" type="secondary"
        >Cancelar</unnnic-button
      >
      <unnnic-button class="form-category__buttons__confirm" @click="navigateToForm"
        >Continuar</unnnic-button
      >
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FormCategory',
    data() {
      return {
        categories: ['marketing', 'Utilidade'],
        typeOptions: ['custom', 'catalog'],
        selectedType: 'custom',
      };
    },
    methods: {
      navigateToForm() {
        if (this.selectedType) {
          this.$emit('continue');
        }
      },
    },
  };
</script>
<style lang="scss">
  .form-category {
    display: flex;
    flex: 1;
    flex-direction: column;
    &__tab {
      &__options {
        display: flex;
        gap: $unnnic-spacing-inline-md;
        margin: $unnnic-spacing-lg 0;
        flex-direction: column;
        font-family: $unnnic-font-family-secondary;

        &__title {
          margin: 0;
          font-size: $unnnic-font-size-body-gt;
          color: $unnnic-color-neutral-darkest;
        }

        &__description {
          margin: 0;
          font-size: $unnnic-font-size-body-md;
          color: $unnnic-color-neutral-cloudy;
        }
      }
    }

    &__buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      height: -webkit-fill-available;
      align-items: flex-end;
      gap: $unnnic-spacing-inline-md;
      &__cancel &__confirm {
        display: flex;
      }
    }
  }
</style>
