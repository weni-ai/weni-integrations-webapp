<template>
  <div class="form-header">
    <FormHeaderLoading v-if="loadingCurrentAppType" />
    <div v-else class="form-header__wrapper">
      <div class="form-header__icon">
        <img :src="currentAppType.icon" />
      </div>
      <span class="form-header__title">{{ title }}</span>
      <unnnic-tag
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
  import FormHeaderLoading from '@/components/whatsAppTemplates/loadings/FormHeaderLoading';

  export default {
    name: 'FormHeader',
    components: {
      FormHeaderLoading,
    },
    data() {
      return {
        title: 'WhatsApp Templates',
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
        const { appCode } = this.$route.params;
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
    }

    &__icon {
      display: flex;
      background-color: rgba(72, 172, 76, 0.2);
      border-radius: $unnnic-border-radius-sm;
      justify-content: center;

      img {
        height: $unnnic-icon-size-md;
        width: $unnnic-icon-size-md;
        padding: $unnnic-inset-nano;
      }
    }

    &__title {
      font-family: $unnnic-font-family-primary;
      font-weight: $unnnic-font-weight-regular;
      font-size: $unnnic-font-size-title-md;
      line-height: $unnnic-line-height-md + $unnnic-font-size-title-md;
      color: $unnnic-color-neutral-darkest;
    }

    &__tag {
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-md;
      line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
      color: unnnic-color-neutral-darkest;
    }
  }
</style>
