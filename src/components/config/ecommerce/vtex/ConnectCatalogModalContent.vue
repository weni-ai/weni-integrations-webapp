<template>
  <div class="modal">
    <div slot="message" class="modal__content">
      <span class="modal__content__title">{{ $t('vtex.connect_catalog.title') }}</span>
      <div class="divider" />

      <div class="modal__content__form">
        <div class="modal__content__form__whatsapp-number">
          <unnnic-label :label="$t('vtex.connect_catalog.whatsapp_number')" />
          <unnnic-select-smart
            class="modal__content__form__whatsapp-number__input"
            v-model="name"
            :options="[]"
          />
        </div>
        <div class="modal__content__form__website-link">
          <unnnic-label :label="$t('vtex.connect_catalog.website_link')" />
          <unnnic-input class="modal__content__form__website-link__input" v-model="name" />
        </div>

        <div class="modal__content__form__api-subdomain">
          <unnnic-label :label="$t('vtex.connect_catalog.api_subdomain')" />
          <unnnic-input class="modal__content__form__api-subdomain__input" v-model="name" />
        </div>

        <div class="modal__content__form__app-key-token">
          <div class="modal__content__form__app-key-token__item">
            <unnnic-label :label="$t('vtex.connect_catalog.app_key')" />
            <unnnic-input class="modal__content__form__app-key__input" v-model="name" />
          </div>

          <div class="modal__content__form__app-key-token__item">
            <unnnic-label :label="$t('vtex.connect_catalog.app_token')" />
            <unnnic-input class="modal__content__form__app-token__input" v-model="name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ConnectCatalogModalContent',
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        name: '',
      };
    },
    methods: {
      connectCatalog() {
        this.$emit('connectCatalog', {
          name: this.name,
        });

        this.closeModal();
      },
      closeModal() {
        this.$emit('closeModal');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .divider {
    margin: 0;
    padding: 0;
    border-top: 1px solid $unnnic-color-neutral-soft;
  }
  .modal {
    display: flex;
    flex-direction: column;
    padding: 0 24px;

    &__buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      justify-content: space-around;
    }

    &__content {
      display: flex;
      flex-direction: column;
      text-align: left;

      &__title {
        color: $unnnic-color-neutral-darkest;

        font-family: Lato;
        font-size: $unnnic-font-size-title-sm;
        font-weight: $unnnic-font-weight-black;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-medium;
        margin-bottom: $unnnic-spacing-xs;
        padding: 24px;
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-sm;
        padding: 24px;

        &__whatsapp-number {
          display: flex;
          flex-direction: column;
        }

        &__website-link {
          display: flex;
          flex-direction: column;
        }

        &__api-subdomain {
          display: flex;
          flex-direction: column;
        }

        &__app-key-token {
          display: flex;
          flex-direction: row;
          width: 100%;
          gap: $unnnic-spacing-md;

          &__item {
            display: flex;
            flex-direction: column;
            width: 50%;
          }
        }

        &__footer {
          margin-top: $unnnic-spacing-stack-xs;
          color: $unnnic-color-neutral-cloudy;
          font-size: $unnnic-font-size-body-gt;
          line-height: $unnnic-font-size-body-gt + $unnnic-line-height-medium;
        }
      }
    }
  }
</style>
