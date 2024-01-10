<template>
  <div class="wpp_template_details">
    <!-- Breadcrumb -->
    <div class="wpp_template_details__breadcrumb">
      <unnnic-breadcrumb
        :crumbs="[
          { name: 'Meus aplicativos', path: '/apps' },
          { name: 'Gerenciar templates', path: '/' },
          { name: 'Detalhes do modelo', path: '/' },
        ]"
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
        <template slot="tab-head-first">Resumo</template>
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
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'App Details',
    components: {
      Insights,
      Summary,
    },
    mounted() {
      this.fetchTemplateAnalytics();
    },
    computed: {
      ...mapState({
        selectedTemplate: (state) => state.insights.selectedTemplate,
        templateAnalytics: (state) => state.insights.templateAnalytics,
        app_uuid: (state) =>
          state.myApps.configuredApps.find((item) => item.code === 'wpp-cloud')?.uuid,
      }),
      templateId() {
        return this.selectedTemplate?.translations[0]?.message_template_id || '730081812069736';
      },
    },
    methods: {
      ...mapActions(['getTemplateAnalytics', 'getTemplates']),
      fetchTemplateAnalytics() {
        console.log('entrou');
        const params = {
          app_uuid: this.app_uuid,
          filters: {
            start: this.formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
            end: this.formatDate(new Date()),
            fba_template_ids: [this.templateId],
          },
        };
        this.getTemplateAnalytics(params);
        if (this.errorTemplateAnalytics) {
          alert(this.errorTemplateAnalytics);
        }
      },
      formatDate(date) {
        return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
      },
    },
  };
</script>
<style lang="scss">
  @import './styles.scss';
</style>
