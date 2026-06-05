<template>
  <div class="templates-form">
    <FormHeader v-if="showTitle" />
    <div class="templates-form__content">
      <FormTabs
        :formMode="this.formMode"
        :templateUuid="templateUuid"
        @manual-preview-update="updatePreview"
      />
      <TemplatePreview
        v-if="!isLoading"
        class="templates-form__preview"
        :formMode="this.formMode"
      />
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
      ...mapState(whatsapp_store, ['loadingFetchWhatsAppTemplate', 'loadingWhatsAppTemplates']),
      isLoading() {
        return this.loadingFetchWhatsAppTemplate || this.loadingWhatsAppTemplates;
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
    align-items: stretch;
    gap: $unnnic-space-4;

    &__content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    &__preview {
      top: 0;
      right: 0;
      width: 270px;
      flex: 0 0 270px;
      overflow: auto;
    }
  }
</style>
