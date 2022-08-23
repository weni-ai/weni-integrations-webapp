<template>
  <div class="whatsapp-templates-table">
    <TableLoading v-if="loadingWhatsAppTemplates" :headers="tableHeaders" />
    <unnnic-table
      v-else
      class="whatsapp-templates-table__table"
      :items="whatsAppTemplates.templates"
    >
      <template v-slot:header>
        <unnnic-table-row :headers="tableHeaders" />
      </template>

      <template v-slot:item="{ item }">
        <unnnic-table-row :headers="tableHeaders">
          <template v-slot:name>
            <div :title="item.name" class="break-text">
              {{ item.name }}
            </div>
          </template>

          <template v-slot:createdOn>
            <div :title="item.createdOn" class="break-text whatsapp-templates-table__item__month">
              {{ formatDate(item.createdOn) }}
            </div>
          </template>

          <template v-slot:category>
            <div :title="item.category" class="break-text whatsapp-templates-table__item__category">
              {{ item.category }}
            </div>
          </template>

          <template v-slot:preview>
            <div :title="item.preview" class="break-text">
              {{ item.preview }}
            </div>
          </template>

          <template v-slot:language>
            <div :title="item.language">
              <LanguageDropdown :template="item" />
            </div>
          </template>

          <template v-slot:actions>
            <TableActionButton />
          </template>
        </unnnic-table-row>
      </template>
    </unnnic-table>

    <div class="whatsapp-templates-table__pagination">
      <span>{{ currentPageStart }} - {{ currentPageCount }} de {{ totalCount }}</span>
      <unnnic-pagination v-model="page" :max="pageCount" :show="5" />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import TableLoading from '@/components/WhatsAppTemplates/loadings/TableLoading.vue';
  import TableActionButton from '@/components/WhatsAppTemplates/TableActionButton';
  import LanguageDropdown from '@/components/WhatsAppTemplates/LanguageDropdown';

  export default {
    name: 'WhatsAppTemplatesTable',
    components: {
      TableLoading,
      TableActionButton,
      LanguageDropdown,
    },
    data() {
      return {
        firstLoad: true,
        page: 1,
        pageLimit: 12,
        tableHeaders: [
          {
            id: 'name',
            text: 'Nome',
            flex: 1,
          },
          {
            id: 'createdOn',
            text: 'Mês',
            flex: 0.5,
          },
          {
            id: 'category',
            text: 'Categoria',
            flex: 1,
          },
          {
            id: 'preview',
            text: 'Pré Visualização',
            flex: 2,
          },
          {
            id: 'language',
            text: 'Idioma',
            flex: 1,
          },
          {
            id: 'actions',
            text: 'Ações',
            width: '40px',
          },
        ],
      };
    },
    created() {
      this.fetchData({ page: this.page });
    },
    computed: {
      ...mapState('WhatsApp', [
        'loadingWhatsAppTemplates',
        'errorWhatsAppTemplates',
        'whatsAppTemplates',
      ]),
      totalCount() {
        return this.whatsAppTemplates?.count || this.pageLimit;
      },
      pageCount() {
        if (this.whatsAppTemplates?.count) {
          return Math.ceil(this.whatsAppTemplates.count / this.pageLimit);
        } else {
          return 1;
        }
      },
      currentPageStart() {
        return (this.page - 1) * this.pageLimit || 1;
      },
      currentPageCount() {
        const value = this.pageLimit * this.page;
        return value > this.whatsAppTemplates?.count ? this.whatsAppTemplates?.count || 0 : value;
      },
    },
    methods: {
      ...mapActions({ getWhatsAppTemplates: 'WhatsApp/getWhatsAppTemplates' }),
      fetchData({ page }) {
        const { appCode, appUuid } = this.$route.params;
        const params = {
          page: page,
          limit: this.pageLimit,
        };
        this.getWhatsAppTemplates({ code: appCode, appUuid, params });
      },
      getTranslationsLanguages(translations) {
        return translations.map((translation) => translation.language);
      },
      formatDate(rawDate) {
        const date = new Date(rawDate);
        return new Intl.DateTimeFormat(this.$i18n.locale, {
          year: 'numeric',
          month: 'short',
        })
          .format(date)
          .replace('de ', '')
          .replace(' ', '/')
          .replace(' ', '')
          .replaceAll('.', '');
      },
    },
    watch: {
      page(page) {
        this.fetchData({ page });
      },
      whatsAppTemplates: {
        handler() {
          this.firstLoad = false;
        },
        deep: true,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-templates-table {
    display: flex;
    flex-direction: column;

    &__table {
      ::v-deep .scroll {
        @media (max-height: 800px) {
          max-height: 60vh;
        }

        @media (min-height: 800px) {
          max-height: 68vh;
        }

        overflow-x: hidden;
        overflow-y: auto;
      }
    }

    &__item {
      &__month {
        text-transform: capitalize;
      }
    }

    &__pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: $unnnic-spacing-stack-md 0;

      span {
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
        color: $unnnic-color-neutral-dark;
      }
    }
  }
</style>
