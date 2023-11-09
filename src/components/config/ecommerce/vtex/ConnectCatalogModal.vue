<template>
  <unnnic-modal class="modal" @close="closeModal" @click.stop :closeIcon="false">
    <div slot="message" class="modal__content">
      <span class="modal__content__title">{{ $t('vtex.connect_catalog.title') }}</span>

      <div class="modal__content__form">
        <unnnic-input
          class="modal__content__form__input__name"
          v-model="name"
          :label="$t('vtex.connect_catalog.name')"
          :placeholder="$t('vtex.connect_catalog.name_placeholder')"
        />

        <div>
          <unnnic-label :label="$t('vtex.connect_catalog.business_type')" />

          <unnnic-select-smart
            ref="businessTypeSelect"
            v-model="businessType"
            :options="availableBusinessTypes"
          />
        </div>

        <span
          v-html="$t('vtex.connect_catalog.footer')"
          class="modal__content__form__footer"
        ></span>
      </div>
    </div>
    <unnnic-button slot="options" type="tertiary" @click="closeModal">
      {{ $t('general.Cancel') }}
    </unnnic-button>
    <unnnic-button slot="options" @click="connectCatalog">
      {{ $t('general.continue') }}
    </unnnic-button>
  </unnnic-modal>
</template>

<script>
  export default {
    name: 'ConnectCatalogModal',
    data() {
      return {
        name: '',
        businessType: [],
        availableBusinessTypes: [
          {
            label: this.$t('vtex.connect_modal.categories.placeholder'),
            value: '',
          },
          {
            label: this.$t('vtex.connect_modal.categories.supermarket_and_groceries'),
            value: 'supermarket_and_groceries',
          },
          {
            label: this.$t('vtex.connect_modal.categories.clothes_store'),
            value: 'clothes',
          },
          {
            label: this.$t('vtex.connect_modal.categories.pharmacies_and_drugstores'),
            value: 'pharmacies_and_drugstores',
          },
          {
            label: this.$t('vtex.connect_modal.categories.restaurants_and_cafes'),
            value: 'restaurants_and_cafes',
          },
          {
            label: this.$t('vtex.connect_modal.categories.electronics_stores'),
            value: 'electronics',
          },
          {
            label: this.$t('vtex.connect_modal.categories.bookstores_and_stationery'),
            value: 'bookstores_and_stationery',
          },
          {
            label: this.$t('vtex.connect_modal.categories.furniture_and_decoration'),
            value: 'furniture_and_decoration',
          },
          {
            label: this.$t('vtex.connect_modal.categories.building_materials_and_hardware'),
            value: 'building_materials_and_hardware',
          },
          {
            label: this.$t('vtex.connect_modal.categories.sporting_goods'),
            value: 'sporting_goods',
          },
          {
            label: this.$t('vtex.connect_modal.categories.shoe_stores'),
            value: 'shoe_stores',
          },
          {
            label: this.$t('vtex.connect_modal.categories.auto_parts'),
            value: 'auto_parts',
          },
          {
            label: this.$t('vtex.connect_modal.categories.other'),
            value: 'other',
          },
        ],
      };
    },
    mounted() {
      this.$nextTick(() => {
        this.setDropdownPosition();
      });
    },
    methods: {
      connectCatalog() {
        this.$emit('connectCatalog');
      },
      closeModal() {
        this.$emit('closeModal');
      },
      setDropdownPosition() {
        const dropdown =
          this.$refs.businessTypeSelect.$el.getElementsByClassName('dropdown-data')[0];

        dropdown.setAttribute(
          'style',
          `position: fixed !important; top: ${dropdown.style.top} !important;`,
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .modal {
    ::v-deep .unnnic-modal-container-background {
      width: 750px;
      max-width: 90%;
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
