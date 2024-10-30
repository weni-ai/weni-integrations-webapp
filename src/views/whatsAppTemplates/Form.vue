<template>
  <div class="templates-form">
    <div class="templates-form__content">
      <FormHeader :formMode="formMode" :description="description" />
      <FormCategory v-if="formMode === 'create'" @continue="continueToMarketing" />
    </div>

    <TemplatePreview :key="previewKey" class="templates-form__preview" />
  </div>
</template>

<script>
  import { mapActions } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import FormHeader from '@/components/whatsAppTemplates/FormHeader.vue';
  import TemplatePreview from '@/components/whatsAppTemplates/TemplatePreview.vue';
  import FormCategory from '@/components/whatsAppTemplates/FormCategory.vue';

  export default {
    name: 'WhatsAppTemplatesForm',
    components: {
      FormHeader,
      FormCategory,
      TemplatePreview,
    },
    data() {
      return {
        formMode: 'create',
        templateUuid: '',
        previewKey: 0,
        description: this.$t(`WhatsApp.templates.header.create.description`),
      };
    },
    created() {
      const { templateUuid } = this.$route.params;

      if (templateUuid) {
        this.formMode = 'edit';
        this.templateUuid = templateUuid;
        this.description = 'Descrição do edit';
      }
    },
    unmounted() {
      this.clearAllTemplateFormData();
      this.clearTemplateData();
    },
    methods: {
      ...mapActions(whatsapp_store, ['clearAllTemplateFormData', 'clearTemplateData']),
      updatePreview() {
        this.previewKey += 1;
      },
      continueToMarketing() {
        this.description = 'Fill in the fields below to create a new message template.';
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
