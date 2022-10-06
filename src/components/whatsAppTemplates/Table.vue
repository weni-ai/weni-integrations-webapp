<template>
  <div class="whatsapp-templates-table">
    <unnnic-table
      v-if="!loadingWhatsAppTemplates && !errorWhatsAppTemplates"
      class="whatsapp-templates-table__table"
      :items="whatsAppTemplates.results"
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

          <template v-slot:created_on>
            <div :title="item.created_on" class="break-text whatsapp-templates-table__item__month">
              {{ formatDate(item.created_on) }}
            </div>
          </template>

          <template v-slot:category>
            <div :title="item.category" class="break-text whatsapp-templates-table__item__category">
              {{ item.category }}
            </div>
          </template>

          <template v-slot:text_preview>
            <div :title="item.text_preview" class="break-text">
              {{ item.text_preview }}
            </div>
          </template>

          <template v-slot:language>
            <div :title="item.language">
              <TableLanguageDropdown :template="item" :position="dropdownPosition(item)" />
            </div>
          </template>

          <template v-slot:actions>
            <TableActionButton
              :templateUuid="item.uuid"
              :position="dropdownPosition(item)"
              @refresh-table="() => fetchData({ page })"
            />
          </template>
        </unnnic-table-row>
      </template>
    </unnnic-table>
    <TableLoading v-else :headers="tableHeaders" />

    <div class="whatsapp-templates-table__pagination">
      <span>{{ currentPageStart }} - {{ currentPageCount }} de {{ totalCount }}</span>
      <unnnic-pagination v-model="page" :max="pageCount" :show="5" />
    </div>
  </div>
</template>

<script>
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import { mapActions, mapState } from 'vuex';
  import TableLoading from '@/components/whatsAppTemplates/loadings/TableLoading.vue';
  import TableActionButton from '@/components/whatsAppTemplates/TableActionButton';
  import TableLanguageDropdown from '@/components/whatsAppTemplates/TableLanguageDropdown';

  export default {
    name: 'Table',
    components: {
      TableLoading,
      TableActionButton,
      TableLanguageDropdown,
    },
    data() {
      return {
        firstLoad: true,
        page: 1,
        pageSize: 12,
        tableHeaders: [
          {
            id: 'name',
            text: this.$t('WhatsApp.templates.table.headers.name'),
            flex: 1,
          },
          {
            id: 'created_on',
            text: this.$t('WhatsApp.templates.table.headers.month'),
            flex: 0.5,
          },
          {
            id: 'category',
            text: this.$t('WhatsApp.templates.table.headers.category'),
            flex: 1,
          },
          {
            id: 'text_preview',
            text: this.$t('WhatsApp.templates.table.headers.preview'),
            flex: 2,
          },
          {
            id: 'language',
            text: this.$t('WhatsApp.templates.table.headers.language'),
            flex: 1,
          },
          {
            id: 'actions',
            text: this.$t('WhatsApp.templates.table.headers.actions'),
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
        return this.whatsAppTemplates?.count || this.pageSize;
      },
      pageCount() {
        if (this.whatsAppTemplates?.count) {
          return Math.ceil(this.whatsAppTemplates.count / this.pageSize);
        } else {
          return 1;
        }
      },
      currentPageStart() {
        return (this.page - 1) * this.pageSize || 1;
      },
      currentPageCount() {
        const value = this.pageSize * this.page;
        return value > this.whatsAppTemplates?.count ? this.whatsAppTemplates?.count || 0 : value;
      },
    },
    methods: {
      ...mapActions('WhatsApp', ['getWhatsAppTemplates']),
      async fetchData({ page }) {
        const { appUuid } = this.$route.params;
        const params = {
          page: page,
          page_size: this.pageSize,
        };
        await this.getWhatsAppTemplates({ appUuid, params });

        if (this.errorWhatsAppTemplates) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.templates.error.fetch_templates'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
          });
        }
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
      dropdownPosition(item) {
        const templates = this.whatsAppTemplates.results;
        return templates.findIndex((template) => template.uuid === item.uuid) > 7
          ? 'top-left'
          : 'bottom-left';
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
    // height: calc(100% - 3rem);

    &__table {
      height: 100%;

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
