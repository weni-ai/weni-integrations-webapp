<template>
  <unnnic-modal ref="modal" @close="closePopUp" @click.stop :closeIcon="false">
    <template #message>
      <div class="vtex-modal">
        <aside class="vtex-modal__menu">
          <div class="vtex-modal__menu__header">
            <p class="vtex-modal__menu__header__title">Vtex Integrations</p>
            <p class="vtex-modal__menu__header__description">
              Follow the steps bellow to integrate the Store on your project.
            </p>
          </div>
          <div class="vtex-modal__menu__steps">
            <button class="vtex-modal__menu__steps__step">1. Connect the store</button>
            <button class="vtex-modal__menu__steps__step">2. Setup affiliate</button>
          </div>
        </aside>
        <div class="vtex-modal__content">
          <ConnectCatalogModalContent v-if="step === 1" @connectCatalog="connectCatalog" />
          <AffiliateSetupModalContent v-if="step === 2" />
        </div>
      </div>
    </template>
  </unnnic-modal>
</template>

<script>
  import ConnectCatalogModalContent from './ConnectCatalogModalContent.vue';
  import AffiliateSetupModalContent from './AffiliateSetupModalContent.vue';

  export default {
    name: 'ConnectStoreModal',
    components: {
      ConnectCatalogModalContent,
      AffiliateSetupModalContent,
    },
    data() {
      return {
        step: 1,
      };
    },
    methods: {
      selectStep(step) {
        this.step = step;
      },
      connectCatalog() {
        this.step = 2;
      },
    },
  };
</script>

<style lang="scss" scoped>
  :deep(.unnnic-modal-container-background) {
    width: 850px;
    margin: 0 !important;
    padding: 0 !important;
    border-radius: 8px;
  }

  :deep(.unnnic-modal-container-background-body-description) {
    text-align: start;
  }

  :deep(.unnnic-modal-container-background-body-description-container) {
    margin: 0 !important;
    padding: 0 !important;
  }

  :deep(.unnnic-modal-container-background-body) {
    margin: 0 !important;
    padding: 0 !important;
  }

  :deep(.unnnic-modal-container-background-body-title) {
    display: none;
  }

  .vtex-modal {
    display: flex;
    flex: 1;
    flex-direction: row;
    height: 586px;

    &__menu {
      display: flex;
      padding: 24px;
      width: 250px;
      flex-shrink: 0;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      align-self: stretch;
      background: $unnnic-color-neutral-black;
      justify-content: space-between;

      &__header {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-xs;

        &__title {
          color: $unnnic-color-neutral-white;
          font-family: Lato;
          font-size: 20px;
          font-style: normal;
          font-weight: 900;
          line-height: 28px;
          padding: 0;
          margin: 0;
        }

        &__description {
          color: $unnnic-color-neutral-white;

          text-align: start;
          font-family: Lato;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 22px;
        }
      }

      &__steps {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0 $unnnic-spacing-xs;
        gap: $unnnic-spacing-xs;
        color: $unnnic-color-neutral-clean;
        font-family: Lato;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;

        button {
          background: transparent;
          border: none;
          color: $unnnic-color-neutral-clean;
          font-family: Lato;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
    }
  }
</style>
