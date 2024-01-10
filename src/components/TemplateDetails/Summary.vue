<template>
  <div class="whatsapp_template_summary">
    <div class="whatsapp_template_summary__title">
      <div class="whatsapp_template_summary__title__main">Visão geral do desempenho</div>
      <div class="whatsapp_template_summary__title__subtitle">últimos 7 dias</div>
    </div>
    <div class="whatsapp_template_summary__main">
      <div class="whatsapp_template_summary__main__card">
        <div class="whatsapp_template_summary__main__card__title">
          Mensagens enviadas
          <unnnic-icon icon="info" size="sm" filled scheme="neutral-cleanest" />
        </div>
        <div class="whatsapp_template_summary__main__card__value">
          {{ templateAnalytics.data[0].totals.sent || 0 }}
        </div>
      </div>
      <div class="whatsapp_template_summary__main__card">
        <div class="whatsapp_template_summary__main__card__title">
          Mensagens entregues
          <unnnic-icon icon="info" size="sm" filled scheme="neutral-cleanest" />
        </div>
        <div class="whatsapp_template_summary__main__card__value">
          {{ templateAnalytics.data[0].totals.delivered || 0 }}
        </div>
      </div>
      <div class="whatsapp_template_summary__main__card">
        <div class="whatsapp_template_summary__main__card__title">
          Mensagens lidas
          <unnnic-icon icon="info" size="sm" filled scheme="neutral-cleanest" />
        </div>
        <div class="whatsapp_template_summary__main__card__value">
          {{ templateAnalytics.data[0].totals.read || 0 }} ({{
            Math.floor(
              (templateAnalytics.data[0].totals.read / templateAnalytics.data[0].totals.sent) * 100,
            ) || '--'
          }}
          %)
        </div>
      </div>
    </div>
    <div class="whatsapp_template_summary__quality">
      <div class="whatsapp_template_summary__quality__title">
        <div class="whatsapp_template_summary__title__main">Visão geral da qualidade</div>
        <div class="whatsapp_template_summary__title__subtitle">Últimos 7 dias</div>
      </div>
      <div class="whatsapp_template_summary__quality__status">
        <div class="whatsapp_template_summary__quality__status__level">
          <div class="whatsapp_template_summary__quality__status__level__title">Nível atual</div>
          <div class="whatsapp_template_summary__quality__status__level__value">--</div>
        </div>
        <div class="whatsapp_template_summary__quality__status__blocked">
          <div class="whatsapp_template_summary__quality__status__blocked__title">
            Principal motivo do bloqueio
          </div>
          <div class="whatsapp_template_summary__quality__status__blocked__value">--</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  export default {
    name: 'Summary',
    computed: {
      ...mapState({
        templateAnalytics: (state) => state.insights.templateAnalytics,
      }),
    },
  };
</script>

<style lang="scss">
  @import './styles.scss';
</style>
