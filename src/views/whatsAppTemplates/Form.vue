<template>
  <div class="templates-form">
    <div class="templates-form__content">
      <FormHeader />
      <FormTabs
        :formMode="this.formMode"
        :templateUuid="templateUuid"
        @manual-preview-update="updatePreview"
      />
    </div>

    <TemplatePreview :key="previewKey" class="templates-form__preview" />
  </div>
</template>

<script>
  import { mapActions } from 'pinia';
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
    display: flex;
    height: 100%;

    &__content {
      flex: 1;
      max-width: calc(100vw - 310px);
      overflow: auto;
      display: flex;
      flex-direction: column;
    }

    &__preview {
      position: fixed;
      top: 0;
      right: 0;
      width: 270px;
      flex: 0 0 270px;
      height: 100vh;
      overflow: auto;
    }
  }
</style>
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store'; whatsapp_store,
