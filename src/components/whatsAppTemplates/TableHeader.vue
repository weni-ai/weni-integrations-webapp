<template>
  <div class="whatsapp-templates-header">
    <TableHeaderLoading v-if="loadingCurrentAppType" />
    <div v-else class="whatsapp-templates-header__wrapper">
      <div class="whatsapp-templates-header__icon">
        <img :src="currentAppType.icon" />
      </div>
      <span class="whatsapp-templates-header__title">{{ title }}</span>
    </div>
    <unnnic-button size="small" type="secondary" @click="navigateToCreateTemplate">
      {{ $t('WhatsApp.templates.table.new_template') }}
    </unnnic-button>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import TableHeaderLoading from '@/components/whatsAppTemplates/loadings/TableHeaderLoading';

  export default {
    name: 'TableHeader',
    components: {
      TableHeaderLoading,
    },
    props: {
      title: {
        type: String,
        default: 'WhatsApp',
      },
    },
    created() {
      this.fetchData();
    },
    computed: {
      ...mapState({
        currentAppType: (state) => state.appType.currentAppType,
        loadingCurrentAppType: (state) => state.appType.loadingCurrentAppType,
      }),
    },
    methods: {
      ...mapActions(['getAppType']),
      fetchData() {
        const { appCode } = this.$route.params;
        this.getAppType({ code: appCode, shouldLoad: true });
      },
      navigateToCreateTemplate() {
        const { appCode, appUuid } = this.$route.params;
        this.$router.push({ path: `/apps/my/${appCode}/${appUuid}/templates/create` });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .whatsapp-templates-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: $unnnic-spacing-stack-md auto;

    &__wrapper {
      display: flex;
      align-items: center;
    }

    &__icon {
      display: flex;
      background-color: rgba(72, 172, 76, 0.2);
      border-radius: $unnnic-border-radius-sm;
      justify-content: center;
      margin-right: $unnnic-spacing-inline-sm;

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
  }
</style>
