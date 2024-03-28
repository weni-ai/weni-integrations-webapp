<template>
  <div class="modal">
    <div slot="message" class="modal__content">
      <span class="modal__content__title">{{ $t('vtex.connect_catalog.title') }}</span>

      <div class="modal__content__form">
        <unnnic-input
          class="modal__content__form__input__name"
          v-model="name"
          :label="$t('vtex.connect_catalog.name')"
          :placeholder="$t('vtex.connect_catalog.name_placeholder')"
        />

        <span
          v-html="$t('vtex.connect_catalog.footer')"
          class="modal__content__form__footer"
        ></span>
      </div>
    </div>

    <div class="modal__buttons">
      <unnnic-button slot="options" ref="closeButton" type="tertiary" @click="closeModal">
        {{ $t('general.Cancel') }}
      </unnnic-button>
      <unnnic-button slot="options" ref="connectButton" @click="connectCatalog" :loading="loading">
        {{ $t('general.continue') }}
      </unnnic-button>
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
  .modal {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-md;

    &__buttons {
      display: flex;
      gap: $unnnic-spacing-lg;
      widows: 100%;
      flex: 1;

      ::v-deep .unnnic-button {
        width: 100%;
      }
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
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-sm;

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
