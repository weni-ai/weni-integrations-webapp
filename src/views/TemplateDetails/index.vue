<template>
  <div class="wpp_template_details">
    <!-- Breadcrumb -->
    <div class="wpp_template_details__breadcrumb">
      <unnnic-breadcrumb
        :crumbs="[
          {
            name: $t('WhatsApp.template_details.crumbs.my_apps'),
            path: '/apps/my',
            meta: $t('WhatsApp.template_details.crumbs.my_apps'),
          },
          {
            name: $t('WhatsApp.template_details.crumbs.manage_templates'),
            path: `/apps/my/wpp-cloud/${app_uuid}/templates`,
            meta: $t('WhatsApp.template_details.crumbs.manage_templates'),
          },
          {
            name: $t('WhatsApp.template_details.crumbs.model_details'),
            path: '/',
            meta: $t('WhatsApp.template_details.crumbs.model_details'),
          },
        ]"
        @crumbClick="redirectTo"
      />
    </div>
    <!-- Header -->
    <div class="wpp_template_details__header">
      <div class="wpp_template_details__header__title">
        <div class="wpp_template_details__header__title__text">{{ selectedTemplate.name }}</div>
        <div class="wpp_template_details__header__about__title__tag">
          <unnnic-tag scheme="neutral-dark" text="Marketing" />
        </div>
      </div>
      <div class="wpp_insights__header__button">
        <unnnic-button
          text="Editar Modelo"
          ref="wpp_template_details__button__edit"
          type="secondary"
        />
      </div>
    </div>
    <!-- Tabs -->
    <div class="wpp_insights__tabs">
      <unnnic-tab initialTab="first" :tabs="['first', 'second']">
        <template slot="tab-head-first">{{ $t('WhatsApp.template_details.summary') }}</template>
        <template slot="tab-panel-first">
          <Summary />
        </template>
        <template slot="tab-head-second">Insights</template>
        <template slot="tab-panel-second">
          <Insights />
        </template>
      </unnnic-tab>
    </div>
  </div>
</template>

<script>
  import Insights from '../Insights/index.vue';
  import Summary from '../../components/TemplateDetails/Summary.vue';
  import { mapState } from 'vuex';
  export default {
    name: 'AppDetails',
    components: {
      Insights,
      Summary,
    },
    data() {
      return {
        route: this.$route,
        crumb_title: 'Detalhes do modelo',
      };
    },
    computed: {
      ...mapState({
        selectedTemplate: (state) => state.insights.selectedTemplate,
        app_uuid: (state) => state.insights.appUuid,
      }),
    },
    methods: {
      redirectTo(crumb) {
        if (
          crumb.meta === this.$t('WhatsApp.template_details.crumbs.model_details') ||
          crumb.meta === ''
        ) {
          return;
        }
        this.$router.push(crumb.path);
      },
    },
  };
</script>
<style lang="scss">
  @import './styles.scss';
</style>
