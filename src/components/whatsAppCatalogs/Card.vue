<template>
  <div
    class="whatsapp-catalog-card"
    v-if="!loadingWhatsAppCloudCatalogs && !errorWhatsAppCloudCatalogs"
  >
    <div v-for="(item, index) in listItems" :key="index" class="whatsapp-catalog-card__wrapper">
      <div class="whatsapp-catalog-card__wrapper__header">
        <div class="whatsapp-catalog-card__wrapper__header__title">
          <span class="u font secondary body-lg color-neutral-darkest bold">
            {{ item.name }}
          </span>
        </div>
        <div class="whatsapp-catalog-card__wrapper__header__description">
          <span class="u font secondary body-md color-neutral-cloudy">
            {{ $t('WhatsApp.catalog.list.identification') }}
          </span>
          <span class="u font secondary body-md color-brand-weni bold">
            {{ item.facebook_catalog_id }}
          </span>
        </div>
      </div>

      <div class="whatsapp-catalog-card__wrapper__actions">
        <unnnic-switch
          :value="item.is_connected"
          size="small"
          :textRight="
            item.is_connected
              ? $t('WhatsApp.catalog.list.actions.enabled_catalog')
              : $t('WhatsApp.catalog.list.actions.disabled_catalog')
          "
          @click.native="modalDisableCatalog()"
        />
        <unnnic-switch
          v-if="item.is_connected"
          :inititalState="false"
          size="small"
          :textRight="
            item.is_connected
              ? $t('WhatsApp.catalog.list.actions.enabled_cart')
              : $t('WhatsApp.catalog.list.actions.disabled_cart')
          "
        />
      </div>
    </div>

    <unnnic-modal-next
      v-if="openModal"
      type="alert"
      icon="alert-circle-1"
      scheme="feedback-red"
      :validate="$t('WhatsApp.catalog.list.disable_modal.placeholder')"
      :validatePlaceholder="$t('WhatsApp.catalog.list.disable_modal.placeholder')"
      :validateLabel="$t('WhatsApp.catalog.list.disable_modal.label')"
      :title="$t('WhatsApp.catalog.list.disable_modal.title')"
      :actionPrimaryLabel="$t('WhatsApp.catalog.list.disable_modal.confirm')"
      :actionSecondaryLabel="$t('general.Cancel')"
      @click-action-secondary="openModal = false"
      @click-action-primary="disableCatalog"
    >
      <template slot="description">
        {{ $t('WhatsApp.catalog.list.disable_modal.description') }}
      </template>
    </unnnic-modal-next>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  /*   import debounce from 'lodash.debounce';
  import { unnnicCallAlert } from '@weni/unnnic-system'; */

  export default {
    name: 'Card',
    data() {
      return {
        openModal: false,
        listCatalog: [
          {
            uuid: '3081a268-fff5-4366-bf44-ee387c8ddcdc',
            name: 'Teste_localizacao',
            facebook_catalog_id: '312538484461506',
            category: 'commerce',
            is_connected: false,
          },
          {
            uuid: 'eaf96431-9be8-4cbd-8541-f4ae08af0d1e',
            name: 'catalogo marketing token',
            facebook_catalog_id: '339959911815729',
            category: 'commerce',
            is_connected: true,
          },
          {
            uuid: 'e7974bfa-14d8-470a-8b1b-669718bc1036',
            name: 'catalogo criado em dev',
            facebook_catalog_id: '664025605666699',
            category: 'commerce',
            is_connected: false,
          },
        ],
      };
    },
    /*     created() {
      this.fetchData();
    }, */
    computed: {
      ...mapState('WhatsAppCloud', [
        'loadingWhatsAppCloudCatalogs',
        'errorWhatsAppCloudCatalogs',
        'whatsAppCloudCatalogs',
      ]),
      listItems() {
        return this.whatsAppCloudCatalogs?.results || [];
      },
    },
    methods: {
      ...mapActions('WhatsAppCloud', ['getWhatsAppCloudCatalogs']),
      /*       fetchData: debounce(async function () {
        const { appUuid } = this.$route.params;

        await this.getWhatsAppCloudCatalogs({ appUuid });

        if (this.errorWhatsAppCloudCatalog) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.fetch_templates'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
          });
        }
      }, 750), */
      modalDisableCatalog() {
        this.openModal = true;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-catalog-card {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    gap: $unnnic-spacing-md;

    &__wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
      border-radius: $unnnic-border-radius-md;
      padding: $unnnic-spacing-md;

      &__actions {
        display: flex;
        gap: $unnnic-spacing-xs;
      }
    }
  }
</style>
