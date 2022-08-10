<template>
  <div class="whatsapp-templates">
    <unnnic-breadcrumb :crumbs="crumbs" @crumbClick="handleCrumbClick"></unnnic-breadcrumb>

    <div class="whatsapp-templates__header">
      <div>
        <!-- <img> -->
        <span class="whatsapp-templates__header__title">Whatsapp</span>
      </div>
      <unnnic-button size="small" type="secondary">Novo template</unnnic-button>
    </div>

    <div v-if="loadingWhatsAppTemplates">Carregando...</div>
    <div v-else>
      <unnnic-table :items="whatsAppTemplates.templates">
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
              <div
                :title="item.createdOn"
                class="break-text whatsapp-templates__table__item__month"
              >
                {{ formatDate(item.createdOn) }}
              </div>
            </template>

            <template v-slot:category>
              <div
                :title="item.category"
                class="break-text whatsapp-templates__table__item__category"
              >
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
                <unnnic-dropdown>
                  <div slot="trigger" class="whatsapp-templates__table__item__language-selector">
                    <unnnic-icon-svg
                      class="whatsapp-templates__table__item__language-selector__icon"
                      :icon="getTranslationStatusIcon(item.translations[0])"
                      size="sm"
                      :scheme="getTranslationStatusColor(item.translations[0])"
                    />
                    {{ getTemplateDefaultLanguage(item) }}
                    <unnnic-icon-svg
                      class="whatsapp-templates__table__item__language-selector__icon"
                      icon="arrow-button-down-1"
                      size="sm"
                    />
                  </div>
                  <unnnic-dropdown-item
                    v-for="(translation, index) in item.translations"
                    :key="index"
                  >
                    <unnnic-icon-svg
                      :icon="getTranslationStatusIcon(translation)"
                      size="sm"
                      :scheme="getTranslationStatusColor(translation)"
                    />
                    {{ translation.language }}
                  </unnnic-dropdown-item>
                </unnnic-dropdown>
              </div>
            </template>

            <template v-slot:actions>
              <TableActionButton />
            </template>
          </unnnic-table-row>
        </template>
      </unnnic-table>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import TableActionButton from '@/components/WhatsAppTemplates/TableActionButton';

  export default {
    name: 'WhatsAppTemplatesTable',
    components: {
      TableActionButton,
    },
    data() {
      return {
        crumbs: [{ name: 'Profile', path: '/apps/my' }, { name: 'Manage templates' }],
        translationStatusMap: {
          APPROVED: {
            icon: 'check-circle-1-1-1',
            color: 'feedback-green',
          },
        },
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
            width: '55px',
          },
        ],
      };
    },
    created() {
      const { appCode, appUuid } = this.$route.params;
      this.getWhatsAppTemplates({ code: appCode, appUuid });
    },
    computed: {
      ...mapState('WhatsApp', [
        'loadingWhatsAppTemplates',
        'errorWhatsAppTemplates',
        'whatsAppTemplates',
      ]),
    },
    methods: {
      ...mapActions(['getAppType']),
      ...mapActions({ getWhatsAppTemplates: 'WhatsApp/getWhatsAppTemplates' }),
      handleCrumbClick(crumb) {
        if (crumb.path) {
          this.$router.push(crumb.path);
        }
      },
      getTranslationsLanguages(translations) {
        return translations.map((translation) => translation.language);
      },
      getTemplateDefaultLanguage(template) {
        return template.translations[0].language;
      },
      getTranslationStatusIcon(translation) {
        return this.translationStatusMap[translation.status]?.icon || 'delete-1-1';
      },
      getTranslationStatusColor(translation) {
        return this.translationStatusMap[translation.status]?.color || 'feedback-red';
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
  };
</script>

<style lang="scss" scoped>
  .whatsapp-templates {
    &__header {
      display: flex;
      justify-content: space-between;

      &__title {
        font-family: $unnnic-font-family-primary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-title-md;
        line-height: $unnnic-line-height-md + $unnnic-font-size-title-md;
        color: $unnnic-color-neutral-darkest;
      }
    }

    &__table {
      &__item {
        &__month {
          text-transform: capitalize;
        }

        &__language-selector {
          display: flex;
          flex-wrap: nowrap;
          justify-content: space-between;
          border: 1px solid $unnnic-color-neutral-soft;
          border-radius: $unnnic-border-radius-pill;
          padding: $unnnic-spacing-stack-nano $unnnic-spacing-inline-xs;
          align-items: center;
          width: 100px;
          text-transform: uppercase;
          cursor: pointer;

          &__icon {
            margin-right: $unnnic-spacing-inline-nano;
          }
        }
      }
    }
  }
</style>
