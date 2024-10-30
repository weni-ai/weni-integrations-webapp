<template>
  <div class="form-header">
    <FormHeaderLoading v-if="loadingCurrentAppType" />
    <div v-else class="form-header__wrapper">
      <div class="form-header__wrapper__title">
        <span class="form-header__wrapper__title__main">{{ title }}</span>
        <span class="form-header__wrapper__title__description">{{ description }}</span>
      </div>
      <unnnic-tag
        ref="tag"
        v-if="templateTranslationCurrentForm.status"
        class="form-header__tag"
        :text="templateStatusTranslation"
        :scheme="templateStatusScheme"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import FormHeaderLoading from '@/components/whatsAppTemplates/loadings/FormHeaderLoading.vue';

  export default {
    name: 'FormHeader',
    props: {
      formMode: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
    },
    components: {
      FormHeaderLoading,
    },
    data() {
      return {
        title: this.$t(`WhatsApp.templates.header.${this.formMode}.title`),
      };
    },
    created() {
      this.fetchData();
    },
    computed: {
      ...mapState(app_type, ['currentAppType', 'loadingCurrentAppType']),
      ...mapState(whatsapp_store, ['templateTranslationCurrentForm']),
      templateStatusScheme() {
        switch (this.templateTranslationCurrentForm.status) {
          case 'APPROVED':
            return 'feedback-green';
          case 'REJECTED':
            return 'feedback-red';
          default:
            return 'feedback-yellow';
        }
      },
      templateStatusTranslation() {
        return this.$t(`WhatsApp.templates.status.${this.templateTranslationCurrentForm.status}`);
      },
    },
    methods: {
      ...mapActions(app_type, ['getAppType']),
      fetchData() {
        const { appCode } = this.$route?.params || {};
        this.getAppType({ code: appCode, shouldLoad: true });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-header {
    display: flex;
    margin: $unnnic-spacing-stack-lg 0;

    &__wrapper {
      display: flex;
      align-items: center;
      gap: $unnnic-spacing-inline-sm;
      &__title {
        display: flex;
        flex-direction: column;
        color: $unnnic-color-neutral-darkest;
        &__main {
          font-family: $unnnic-font-family-primary;
          font-weight: $unnnic-font-weight-bold;
          font-size: $unnnic-font-size-title-md;
          line-height: $unnnic-line-height-md + $unnnic-font-size-title-md;
        }
        &__description {
          font-family: $unnnic-font-family-secondary;
          font-size: $unnnic-font-size-body-gt;
        }
      }
    }

    &__tag {
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-md;
      line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
      color: unnnic-color-neutral-darkest;
    }
  }
</style>
