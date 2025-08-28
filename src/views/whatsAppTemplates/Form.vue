<template>
  <div class="templates-form">
    <FormHeader v-if="showTitle" />
    <div class="templates-form__content">
      <FormTabs
        :formMode="this.formMode"
        :templateUuid="templateUuid"
        @manual-preview-update="updatePreview"
      />
      <TemplatePreview v-if="!isLoading" :template="template" class="templates-form__preview" />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import FormHeader from '@/components/whatsAppTemplates/FormHeader.vue';
  import FormTabs from '@/components/whatsAppTemplates/FormTabs.vue';
  import TemplatePreview from '@/components/whatsAppTemplates/TemplatePreview.vue';

  export default {
    name: 'WhatsAppTemplatesForm',
    components: {
      FormHeader,
      FormTabs,
      TemplatePreview,
    },
    data() {
      return {
        formMode: 'create',
        templateUuid: '',
        previewKey: 0,
      };
    },
    props: {
      showTitle: {
        type: Boolean,
        default: true,
      },
    },
    created() {
      const { templateUuid } = this.$route.params;

      if (templateUuid) {
        this.formMode = 'edit';
        this.templateUuid = templateUuid;
      }
    },
    unmounted() {
      this.clearAllTemplateFormData();
      this.clearTemplateData();
    },
    computed: {
      ...mapState(whatsapp_store, [
        'templateTranslationCurrentForm',
        'loadingFetchWhatsAppTemplate',
        'errorFetchWhatsAppTemplate',
        'whatsAppTemplate',
        'whatsAppTemplateSelectLanguages',
        'loadingWhatsAppTemplateSelectLanguages',
        'errorWhatsAppTemplateSelectLanguages',
        'templateForm',
        'errorCreateTemplate',
        'createdTemplateData',
        'errorCreateTemplateTranslation',
        'createdTemplateTranslationData',
        'loadingWhatsAppTemplates',
        'errorUpdateTemplateTranslation',
      ]),
      isLoading() {
        return (
          this.loadingFetchWhatsAppTemplate ||
          this.loadingWhatsAppTemplates ||
          this.dataProcessingLoading
        );
      },
      gridColumns() {
        return this.isLoading ? '1fr' : '9fr 3fr';
      },
    },
    methods: {
      ...mapActions(whatsapp_store, ['clearAllTemplateFormData', 'clearTemplateData']),
      /* istanbul ignore next */
      updatePreview() {
        this.previewKey += 1;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .templates-form {
    display: grid;
    gap: $unnnic-spacing-md;
    height: 100%;
    overflow: hidden;

    &__content {
      display: grid;
      grid-template-columns: v-bind(gridColumns);
      width: 100%;
      height: 100%;
      gap: $unnnic-spacing-md;
      overflow: hidden;
    }

    &__preview {
      position: sticky;
      top: 0;
      height: auto;
    }
  }
</style>
