<template>
  <header class="form-header">
    <FormHeaderLoading v-if="loadingCurrentAppType" />
    <section v-else class="form-header__wrapper">
      <unnnic-icon icon="arrow_back" size="ant" clickable @click="goBack" />
      <h1 class="form-header__title">{{ title }}</h1>
    </section>
  </header>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import FormHeaderLoading from '@/components/whatsAppTemplates/loadings/FormHeaderLoading.vue';

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
      ...mapState(app_type, ['loadingCurrentAppType']),
    },
    methods: {
      ...mapActions(app_type, ['getAppType']),
      fetchData() {
        const { appCode } = this.$route?.params || {};
        this.getAppType({ code: appCode, shouldLoad: true });
      },
      goBack() {
        this.$router.back();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-header {
    display: flex;
    align-items: center;
    gap: $unnnic-spacing-sm;

    &__wrapper {
      display: flex;
      align-items: center;
      gap: $unnnic-spacing-inline-sm;
    }

    &__title {
      margin: 0;
      font-family: $unnnic-font-family-secondary;
      font-weight: $unnnic-font-weight-bold;
      font-size: $unnnic-font-size-title-sm;
      line-height: $unnnic-line-height-md + $unnnic-font-size-title-sm;
      color: $unnnic-color-neutral-darkest;
    }
  }
</style>
