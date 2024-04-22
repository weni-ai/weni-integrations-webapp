<template>
  <div class="whatsapp-templates-table">
    <div class="whatsapp-templates-table__filters">
      <div class="whatsapp-templates-table__filters__date">
        <div class="whatsapp-templates-table__filters__date__label">
          {{ $t('WhatsApp.templates.table.filters.date.label') }}
        </div>
        <unnnicInputDatePicker
          v-model="datePickerDates"
          :days="['D', 'S', 'T', 'Q', 'Q', 'S', 'S']"
          :months="months"
          :options="options"
          @submit="handleDateFilter"
        />
      </div>
      <unnnic-select-smart
        class="whatsapp-templates-table__filters__category"
        v-model="selectedCategory"
        :options="categoryOptions"
      />
      <unnnic-input
        v-model="searchTerm"
        class="whatsapp-templates-table__filters__search"
        :placeholder="$t('WhatsApp.templates.table.filters.search')"
        icon-left="search-1"
      />
    </div>

    <unnnic-table
      v-if="!loadingWhatsAppTemplates && !errorWhatsAppTemplates"
      class="whatsapp-templates-table__table"
      :items="tableItems"
    >
      <template v-slot:header>
        <unnnic-table-row :headers="tableHeaders">
          <template v-slot:name>
            <span class="break-text whatsapp-templates-table__table__header">
              {{ $t('WhatsApp.templates.table.headers.name') }}
              <table-sort
                class="whatsapp-templates-table__table__header__name"
                :sort-direction="nameSortDirection"
                @sort="handleNameSort"
              />
            </span>
          </template>

          <template v-slot:created_on>
            <div class="break-text whatsapp-templates-table__table__header">
              {{ $t('WhatsApp.templates.table.headers.date') }}
              <table-sort
                class="whatsapp-templates-table__table__header__date"
                :sort-direction="dateSortDirection"
                @sort="handleDateSort"
              />
            </div>
          </template>
        </unnnic-table-row>
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
              :data="item"
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
      <unnnic-pagination :value="page" @input="onPageChange" :max="pageCount" :show="5" />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce';
  import unnnicCallAlert from '@weni/unnnic-system';
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import TableLoading from '@/components/whatsAppTemplates/loadings/TableLoading.vue';
  import TableActionButton from '@/components/whatsAppTemplates/TableActionButton.vue';
  import TableLanguageDropdown from '@/components/whatsAppTemplates/TableLanguageDropdown.vue';
  import TableSort from '@/components/whatsAppTemplates/TableSort.vue';

  export default {
    // eslint-disable-next-line vue/no-reserved-component-names
    name: 'Table',
    components: {
      TableLoading,
      TableActionButton,
      TableLanguageDropdown,
      TableSort,
    },
    data() {
      return {
        firstLoad: true,
        page: 1,
        pageSize: 15,
        showDateFilter: false,
        startDate: null,
        endDate: null,
        searchTerm: '',
        selectedCategory: 'ANY',
        nameSortDirection: 'NONE',
        dateSortDirection: 'NONE',
        categoryOptions: [
          {
            value: 'ANY',
            label: this.$t('WhatsApp.data.templates.category.any'),
          },
          {
            value: 'UTILITY',
            label: this.$t('WhatsApp.data.templates.category.utility'),
          },
          {
            value: 'MARKETING',
            label: this.$t('WhatsApp.data.templates.category.marketing'),
          },
          {
            value: 'AUTHENTICATION',
            label: this.$t('WhatsApp.data.templates.category.authentication'),
          },
        ],
        tableHeaders: [
          {
            id: 'name',
            text: this.$t('WhatsApp.templates.table.headers.name'),
            flex: 1,
          },
          {
            id: 'created_on',
            text: this.$t('WhatsApp.templates.table.headers.date'),
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
            width: '55px',
          },
        ],
        months: [
          this.$t('date.months.january'),
          this.$t('date.months.february'),
          this.$t('date.months.march'),
          this.$t('date.months.april'),
          this.$t('date.months.may'),
          this.$t('date.months.june'),
          this.$t('date.months.july'),
          this.$t('date.months.august'),
          this.$t('date.months.september'),
          this.$t('date.months.october'),
          this.$t('date.months.november'),
          this.$t('date.months.december'),
        ],
        options: [
          { name: this.$t('date.options.seven_days'), id: 'last-7-days' },
          { name: this.$t('date.options.fourteen_days'), id: 'last-14-days' },
          { name: this.$t('date.options.thirty_days'), id: 'last-30-days' },
          { name: this.$t('date.options.twelve_months'), id: 'last-12-months' },
          { name: this.$t('date.options.current_month'), id: 'current-month' },
          { name: this.$t('date.options.personalize'), id: 'custom' },
        ],
      };
    },
    created() {
      this.fetchData({ page: this.page });

      /* istanbul ignore next */
      window.addEventListener('click', (event) => {
        if (event.target.closest('.whatsapp-templates-table__filters__date')) {
          return false;
        }
        this.showDateFilter = false;
      });
    },
    computed: {
      ...mapState(whatsapp_store, [
        'loadingWhatsAppTemplates',
        'errorWhatsAppTemplates',
        'whatsAppTemplates',
      ]),
      tableItems() {
        return this.whatsAppTemplates?.results || [];
      },
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
      startDateObject() {
        return this.startDate && new Date(this.startDate.replace('-', ' '));
      },
      endDateObject() {
        return this.endDate && new Date(this.endDate.replace('-', ' '));
      },
      datePickerDates() {
        return { start: this.startDateObject, end: this.endDateObject };
      },
      filterState() {
        return `${this.selectedCategory[0]?.value}-${this.startDate}-${this.endDate}-${this.searchTerm}-${this.nameSortDirection}-${this.dateSortDirection}`;
      },
    },
    methods: {
      ...mapActions(whatsapp_store, ['getWhatsAppTemplates']),
      fetchData: debounce(async function ({ page }) {
        const { appUuid } = this.$route.params;
        const params = {
          page: page,
          page_size: this.pageSize,
        };

        if (this.selectedCategory[0].value !== 'ANY') {
          params.category = this.selectedCategory[0].value;
        }

        if (this.startDate) {
          params.start = this.startDate;
        }

        if (this.endDate) {
          params.end = this.endDate;
        }

        if (this.searchTerm && this.searchTerm.trim()) {
          params.name = this.searchTerm.trim();
        }

        if (this.nameSortDirection !== 'NONE') {
          if (this.nameSortDirection === 'ASC') {
            params.sort = 'name';
          } else {
            params.sort = '-name';
          }
        }

        if (this.dateSortDirection !== 'NONE') {
          if (this.dateSortDirection === 'ASC') {
            params.sort = 'created_on';
          } else {
            params.sort = '-created_on';
          }
        }

        await this.getWhatsAppTemplates({ appUuid, params });

        if (this.errorWhatsAppTemplates) {
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
      }, 750),
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
        const templates = this.whatsAppTemplates?.results || [];
        return templates.findIndex((template) => template.uuid === item.uuid) > 1
          ? 'top-left'
          : 'bottom-left';
      },
      handleCategoryChange(event) {
        this.selectedCategory = event;
      },
      handleDateFilter: debounce(async function (event) {
        this.startDate = event.startDate;
        this.endDate = event.endDate;

        this.showDateFilter = false;
      }, 750),
      handleNameSort(sortDirection) {
        this.nameSortDirection = sortDirection;
        this.dateSortDirection = 'NONE';
      },
      handleDateSort(sortDirection) {
        this.dateSortDirection = sortDirection;
        this.nameSortDirection = 'NONE';
      },
      onPageChange(value) {
        this.currentPage = value;
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
      filterState: {
        handler() {
          if (this.page === 1) {
            this.fetchData({ page: this.page });
          } else {
            this.page = 1;
          }
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
    flex: 1;
    overflow: hidden;

    &__table {
      height: inherit;
      flex: 1;
      overflow-x: hidden;
      overflow-y: auto;

      ::v-deep .scroll {
        overflow-x: hidden;
        flex: none;
        min-height: 248px;

        padding-right: unset;
      }

      &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
      margin-top: $unnnic-spacing-stack-md;

      span {
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
        color: $unnnic-color-neutral-dark;
      }
    }

    &__filters {
      display: flex;
      align-items: center;
      gap: $unnnic-spacing-inline-sm;
      margin-bottom: $unnnic-spacing-stack-lg;

      &__date {
        display: flex;
        flex-direction: column;

        &__dropdown-date {
          position: absolute;
          z-index: 1;
          margin-top: $unnnic-spacing-stack-awesome + $unnnic-spacing-stack-xs;
        }

        &__selector {
          flex: 1;
          width: 260px;
          max-width: 300px;

          ::v-deep {
            .input {
              padding: $unnnic-squish-xs;
              font-size: $unnnic-font-size-body-gt;
              line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
            }
            .icon-left {
              transform: translateY(30%);
            }
          }
        }

        &__label {
          font-size: $unnnic-font-size-body-gt;
          line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
          color: $unnnic-color-neutral-cloudy;
          margin: $unnnic-spacing-inline-xs 0;
        }
      }

      &__category {
        flex: 1;
        min-width: 150px;
        max-width: 200px;
        align-self: end;
      }

      &__search {
        margin-top: 38px;
        flex: 4;
      }
    }
  }
</style>
