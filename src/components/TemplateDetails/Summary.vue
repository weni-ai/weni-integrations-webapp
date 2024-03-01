<template>
  <div class="whatsapp_template_summary">
    <div class="whatsapp_template_summary__title">
      <div class="whatsapp_template_summary__title__main">
        {{ $t('WhatsApp.template_details.summary.performace_overview') }}
      </div>
      <div class="whatsapp_template_summary__title__subtitle">
        {{ $t('WhatsApp.template_details.summary.last_7_days') }}
      </div>
    </div>
    <div class="whatsapp_template_summary__main">
      <div class="whatsapp_template_summary__main__card">
        <div class="whatsapp_template_summary__main__card__title">
          {{ $t('WhatsApp.template_details.summary.sent_messages') }}
          <unnnic-icon icon="info" size="sm" filled scheme="neutral-cleanest" />
        </div>
        <div class="whatsapp_template_summary__main__card__value">{{ weekValues.sent }}</div>
      </div>
      <div class="whatsapp_template_summary__main__card">
        <div class="whatsapp_template_summary__main__card__title">
          {{ $t('WhatsApp.template_details.summary.delivered_messages') }}
          <unnnic-icon icon="info" size="sm" filled scheme="neutral-cleanest" />
        </div>
        <div class="whatsapp_template_summary__main__card__value">{{ weekValues.delivered }}</div>
      </div>
      <div class="whatsapp_template_summary__main__card">
        <div class="whatsapp_template_summary__main__card__title">
          {{ $t('WhatsApp.template_details.summary.read_messages') }}
          <unnnic-icon icon="info" size="sm" filled scheme="neutral-cleanest" />
        </div>
        <div class="whatsapp_template_summary__main__card__value">
          {{ weekValues.read }} ({{
            Math.floor((weekValues.read / weekValues.sent) * 100) || '--'
          }}%)
        </div>
      </div>
    </div>
    <div class="whatsapp_template_summary__quality">
      <div class="whatsapp_template_summary__quality__title">
        <div class="whatsapp_template_summary__title__main">
          {{ $t('WhatsApp.template_details.summary.quality_overview') }}
        </div>
        <div class="whatsapp_template_summary__title__subtitle">
          {{ $t('WhatsApp.template_details.summary.last_7_days') }}
        </div>
      </div>
      <div class="whatsapp_template_summary__quality__status">
        <div class="whatsapp_template_summary__quality__status__level">
          <div class="whatsapp_template_summary__quality__status__level__title">
            {{ $t('WhatsApp.template_details.summary.current_level') }}
          </div>
          <div class="whatsapp_template_summary__quality__status__level__value">--</div>
        </div>
        <div class="whatsapp_template_summary__quality__status__blocked">
          <div class="whatsapp_template_summary__quality__status__blocked__title">
            {{ $t('WhatsApp.template_details.summary.block_reason') }}
          </div>
          <div class="whatsapp_template_summary__quality__status__blocked__value">--</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'Summary',
    mounted() {
      this.fetchTemplateAnalyticsWeek();
    },
    data() {
      return {
        sevenDays: 7 * 24 * 60 * 60 * 1000,
      };
    },
    computed: {
      ...mapState({
        templateAnalytics: (state) => state.insights.templateAnalytics,
        appUuid: (state) => state.insights.appUuid,
        selectedTemplate: (state) => state.insights.selectedTemplate,
      }),
      weekValues() {
        return (
          this.templateAnalytics?.grand_totals || {
            sent: 0,
            delivered: 0,
            read: 0,
          }
        );
      },
    },
    methods: {
      ...mapActions('insights', ['getTemplateAnalytics', 'getTemplates']),
      fetchTemplateAnalyticsWeek() {
        const params = {
          app_uuid: this.appUuid,
          filters: {
            start: this.formatDate(new Date(Date.now() - this.sevenDays)),
            end: this.formatDate(new Date()),
            fba_template_ids: this.selectedTemplate.translations.map(
              (item) => item.message_template_id,
            ),
          },
        };
        this.getTemplateAnalytics(params);
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
