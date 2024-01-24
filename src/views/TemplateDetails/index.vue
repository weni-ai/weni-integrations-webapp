<template>
  <div class="wpp_template_details">
    <!-- Breadcrumb -->
    <div class="wpp_template_details__breadcrumb">
      <unnnic-breadcrumb
        :crumbs="[
          { name: 'Meus aplicativos', path: '/apps/my', meta: 'Meus aplicativos' },
          {
            name: 'Gerenciar templates',
            path: `/apps/my/wpp-cloud/${app_uuid}/templates`,
            meta: 'Gerenciar Templates',
          },
          { name: 'Detalhes do modelo', path: '/', meta: 'Detalhes do modelo' },
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
        if (crumb.meta === 'Detalhes do modelo') return;
        this.$router.push(crumb.path);
      },
    },
  };
</script>
<style lang="scss">
  @import './styles.scss';
</style>
