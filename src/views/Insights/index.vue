<template>
  <div class="wpp_insights">
    <!-- Breadcrumb -->
    <div class="wpp_insights__breadcrumb" v-if="!hash">
      <unnnic-breadcrumb
        :crumbs="[
          { name: $t('apps.nav.my_apps'), path: '/apps/my', meta: $t('apps.nav.my_apps') },
          { name: 'Insights', path: '/apps/insights', meta: $t('WhatsApp.insights.insights') },
        ]"
        @crumbClick="redirectTo"
      />
    </div>
    <!-- Header -->
    <div class="wpp_insights__header" v-if="!hash">
      <div class="wpp_insights__header__logo">
        <img src="@/assets/svgs/whatsapp-avatar.svg" alt="" />
      </div>
      <div class="wpp_insights__header__about">
        <div class="wpp_insights__header__about__title">Insights</div>
        <div class="wpp_insights__header__about__description">
          {{ $t('WhatsApp.insights.about_description') }}
        </div>
      </div>
      <div class="wpp_insights__header__button" v-if="!isActive">
        <unnnic-button
          :text="$t('WhatsApp.insights.enable_insights')"
          :disabled="isActive"
          ref="wpp_insights__button__close"
          @click="toggleOpenModal"
        />
      </div>
    </div>
    <!-- Filters -->
    <div class="wpp_insights__filters">
      <div class="wpp_insights__filters__time">
        <div class="wpp_insights__filters__time__title">
          {{ $t('WhatsApp.insights.filters.period_of_time') }}
        </div>
        <div class="wpp_insights__filters__time__select">
          <unnnic-input-date-picker
            :value="period"
            size="md"
            format="MM-DD-YYYY"
            @changed="setPeriod"
          />
        </div>
      </div>
      <div class="wpp_insights__filters__model">
        <div class="wpp_insights__filters__model__title">
          {{ $t('WhatsApp.insights.filters.message_templates') }}
        </div>
        <div class="wpp_insights__filters__model__select">
          <unnnic-select-smart
            v-model="model"
            :options="modelOptions"
            multiple
            :disabled="!!hash"
          />
        </div>
      </div>
    </div>
    <!-- Content -->
    <div class="wpp_insights__content">
      <!-- If not active -->
      <div class="wpp_insights__content__empty" v-if="!isActive">
        <div class="wpp_insights__content__empty__image">
          <img src="@/assets/svgs/empty-apps.svg" alt="" />
        </div>
        <div class="wpp_insights__content__empty__text">
          <div class="wpp_insights__content__empty__text__title">
            {{ $t('WhatsApp.insights.disabled') }}
          </div>
          <div class="wpp_insights__content__empty__text__description">
            {{ $t('WhatsApp.insights.about_description') }}
          </div>
        </div>
        <div class="wpp_insights__content__empty__button">
          <unnnic-button
            :text="$t('WhatsApp.insights.enable_insights')"
            ref="wpp_insights__button__close"
            @click="toggleOpenModal"
          />
        </div>
      </div>

      <!-- If active -->
      <div class="wpp_insights__content__active" v-if="isActive">
        <div class="wpp_insights__content__active__chart">
          <unnnic-chart-multi-line
            :data="getChartSent"
            :title="$t('WhatsApp.insights.messages.sent')"
            v-if="!hash"
          />
          <unnnic-chart-multi-line
            :data="getChartDelivered"
            :title="$t('WhatsApp.insights.messages.delivered')"
            v-if="!hash"
          />
          <unnnic-chart-multi-line
            :data="getChartRead"
            :title="$t('WhatsApp.insights.messages.read')"
            v-if="!hash"
          />
          <unnnic-chart-multi-line
            :data="getChartByDay.data"
            :title="$t('WhatsApp.insights.messages.received')"
            v-if="!!hash"
            :fixedMaxValue="getChartByDay.maxValue"
          />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="wpp_insights__modal">
      <unnnic-modal :showModal="showModal" @close="toggleOpenModal" ref="modal">
        <div class="wpp_insights__modal__title">
          <img src="@/assets/svgs/amazoninha-heart.svg" alt="" />
          <p>
            {{ $t('WhatsApp.insights.modal.present_insights') }}
            {{ showModal }}
          </p>
        </div>
        <div class="wpp_insights__modal__content">
          <p class="wpp_insights__modal__content__dark">
            {{ $t('WhatsApp.insights.about_text_1') }}
          </p>
          <p>
            {{ $t('WhatsApp.insights.about_text_2') }}
          </p>
          <p>
            {{ $t('WhatsApp.insights.about_text_3') }}
          </p>
        </div>

        <div class="wpp_insights__modal__buttons">
          <unnnic-button
            :text="$t('general.Close')"
            type="secondary"
            :style="{ width: '289px' }"
            @click="toggleOpenModal"
            ref="wpp_insights__button__close"
          />
          <unnnic-button
            :text="$t('general.confirm')"
            :style="{ width: '289px' }"
            @click="activeTemplate"
            ref="wpp_insights__button__active"
          />
        </div>
      </unnnic-modal>
    </div>
  </div>
</template>

<script>
  import {
    unnnicBreadcrumb,
    unnnicButton,
    unnnicModal,
    unnnicChartMultiLine,
  } from '@weni/unnnic-system';
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'Insights',
    components: {
      unnnicBreadcrumb,
      unnnicButton,
      unnnicModal,
      unnnicChartMultiLine,
    },
    data() {
      return {
        showModal: false,
        model: [],
        period: {
          start: this.formatDate(new Date(Date.now() - 604800000)),
          end: this.formatDate(new Date()),
        },
        hash: this.$route.hash,
        crumb_title: 'Insights',
      };
    },
    /* istanbul ignore next */
    mounted() {
      this.fetchTemplates();
      if (this.hash) {
        this.model = [
          {
            value: this.selectedTemplate.translations[0].message_template_id,
            label: this.selectedTemplate.name,
          },
        ];
      }
      this.fetchTemplateAnalytics();
    },
    computed: {
      ...mapState({
        app_uuid: (state) => state.insights.appUuid,
        errorTemplateAnalytics: (state) => state.insights.errorTemplateAnalytics,
        errorTemplates: (state) => state.insights.errorTemplates,
        templateAnalytics: (state) => state.insights.templateAnalytics,
        selectedTemplate: (state) => state.insights.selectedTemplate,
        templates: (state) => state.insights.templates.results?.map((item) => item),
        isActive: (state) => !!state.insights.isActive,
      }),
      modelOptions() {
        if (this.templates?.length > 0) {
          const templateList = [];
          this.templates.forEach((item) => {
            item.translations.forEach((translation) => {
              const obj = {
                value: translation.message_template_id,
                label: `${item.name} (${translation.language})`,
              };
              templateList.push(obj);
            });
          });
          return templateList;
        }
        return [];
      },
      getChartByDay() {
        const sent = this.getChartByType('sent').map(({ data }) => data);
        const delivered = this.getChartByType('delivered').map(({ data }) => data);
        const read = this.getChartByType('read').map(({ data }) => data);
        return {
          data: [
            {
              title: this.$t('WhatsApp.insights.messages.sent'),
              data: sent[0],
            },
            {
              title: this.$t('WhatsApp.insights.messages.delivered'),
              data: delivered[0],
            },
            {
              title: this.$t('WhatsApp.insights.messages.read'),
              data: read[0],
            },
          ],
          maxValue: this.findMax(sent),
        };
      },
      getChartSent() {
        return this.getChartByType('sent');
      },
      getChartDelivered() {
        return this.getChartByType('delivered');
      },
      getChartRead() {
        return this.getChartByType('read');
      },
    },
    watch: {
      /* istanbul ignore next */
      model(newVal, oldVal) {
        if (newVal.length > 10) {
          this.model = this.model.slice(0, 10);
        }
        if (newVal != oldVal) {
          this.fetchTemplateAnalytics();
        }
      },
    },
    methods: {
      ...mapActions('insights', ['getTemplateAnalytics', 'getTemplates', 'setActiveProject']),
      fetchTemplateAnalytics() {
        let models = this.model.map((item) => item.value);
        const params = {
          app_uuid: this.app_uuid,
          filters: {
            start: this.period.start,
            end: this.period.end,
            fba_template_ids: models,
          },
        };
        this.getTemplateAnalytics(params);
      },
      fetchTemplates() {
        this.getTemplates({ app_uuid: this.app_uuid });
      },
      toggleOpenModal() {
        this.showModal = !this.showModal;
      },
      setPeriod(e) {
        this.period = e;
        this.fetchTemplateAnalytics();
      },
      formatDate(date) {
        return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
      },
      getChartByType(type) {
        const data = this.templateAnalytics?.data.map((template) => {
          return {
            title: template.template_name || template.template_id,
            data: template.dates.map((item) => {
              return {
                title: item.start,
                value: item[type],
              };
            }),
          };
        });
        return data || [];
      },
      findMax(array) {
        return Math.max(...array.map(({ value }) => value));
      },
      redirectTo(crumb) {
        /* istanbul ignore next */
        if (crumb.meta === this.$route.name) return;
        this.$router.push(crumb.path);
      },
      async activeTemplate() {
        this.showModal = false;
        await this.setActiveProject({ app_uuid: this.app_uuid });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
