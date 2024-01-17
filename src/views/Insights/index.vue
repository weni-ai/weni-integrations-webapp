<template>
  <div class="wpp_insights">
    <!-- Breadcrumb -->
    <div class="wpp_insights__breadcrumb" v-if="!hash">
      <unnnic-breadcrumb
        :crumbs="[
          { name: 'Meus aplicativos', path: '/apps/my', meta: 'Meus aplicativos' },
          { name: 'Insights', path: '/apps/insights', meta: 'Insights' },
        ]"
        @crumbClick="redirectTo"
      />
    </div>
    <!-- Header -->
    <div class="wpp_insights__header">
      <div class="wpp_insights__header__logo">
        <img src="../../assets/svgs/whatsapp-avatar.svg" alt="" />
      </div>
      <div class="wpp_insights__header__about">
        <div class="wpp_insights__header__about__title">Insights</div>
        <div class="wpp_insights__header__about__description">
          Veja dados mais detalhados relacionados a envio, entrega e leitura dos modelos de mensagem
          disparados
        </div>
      </div>
      <div class="wpp_insights__header__button">
        <unnnic-button
          text="Ativar insights"
          :disabled="isActive"
          ref="wpp_insights__button__close"
          @click="toggleOpenModal"
        />
      </div>
    </div>
    <!-- Filters -->
    <div class="wpp_insights__filters">
      <div class="wpp_insights__filters__time">
        <div class="wpp_insights__filters__time__title">Periodo de Tempo</div>
        <div class="wpp_insights__filters__time__select">
          <unnnic-input-date-picker
            :value="periodo"
            size="md"
            @changed="setPeriodo"
            format="MM-DD-YYYY"
          />
        </div>
      </div>
      <div class="wpp_insights__filters__model">
        <div class="wpp_insights__filters__model__title">Modelos de mensagem</div>
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
          <img src="../../assets/svgs/empty-apps.svg" alt="" />
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
            text="Ativar insights"
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
            :title="'Mensagens enviadas'"
            v-if="!hash"
          />
          <unnnic-chart-multi-line
            :data="getChartDelivered"
            :title="'Mensagens entregues'"
            v-if="!hash"
          />
          <unnnic-chart-multi-line
            :data="getChartRead"
            :title="'Mensagens recebidas'"
            v-if="!hash"
          />
          <unnnic-chart-multi-line
            :data="getChartByDay.data"
            :title="'Mensagens recebidas'"
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
          <img src="../../assets/svgs/amazoninha-heart.svg" alt="" />
          <p>Apresentamos novos insights</p>
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
            text="Cancelar"
            type="secondary"
            :style="{ width: '289px' }"
            @click="toggleOpenModal"
            ref="wpp_insights__button__close"
          />
          <unnnic-button text="Confirmar" :style="{ width: '289px' }" />
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
        isActive: true,
        showModal: false,
        model: [],
        periodo: {
          start: this.formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
          end: this.formatDate(new Date()),
        },
        hash: this.$route?.hash,
        ...mapState({
          selectedTemplate: (state) => state.insights.selectedTemplate,
        }),
        crumb_title: 'Insights',
      };
    },
    mounted() {
      this.fetchTemplateAnalytics();
      this.fetchTemplates();
      if (this.hash) {
        this.model = [this.selectedTemplate.translations[0].message_template_id];
      } else {
        this.model = [
          {
            value: '720749078794724',
            label: 'Modelo 1',
          },
        ];
      }
    },
    computed: {
      ...mapState({
        app_uuid: (state) =>
          state.myApps?.configuredApps.find((item) => item.code === 'wpp-cloud')?.uuid,
        errorTemplateAnalytics: (state) => state.insights.errorTemplateAnalytics,
        errorTemplates: (state) => state.insights.errorTemplates,
        templateAnalytics: (state) => state.insights?.templateAnalytics,
        selectedTemplate: (state) => state.insights.selectedTemplate,
        templates: (state) =>
          state.insights?.templates.results?.map((item) => {
            return {
              value: item.uuid,
              label: item.name,
            };
          }),
      }),
      modelOptions() {
        if (this.templates?.length > 0) {
          return this.templates;
        }
        return [
          {
            value: '720749078794724',
            label: 'Modelo 1',
          },
        ];
      },
      getChartByDay() {
        const sent = this.getChartByType('sent')[0].data;
        const delivered = this.getChartByType('delievered')[0].data;
        const read = this.getChartByType('read')[0].data;
        let chart = [
          {
            title: 'Sent',
            data: sent,
          },
          {
            title: 'Delivered',
            data: delivered,
          },
          {
            title: 'Read',
            data: read,
          },
        ];
        const maxValue = this.findMax(sent);

        return {
          data: chart,
          maxValue: maxValue,
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
      model(newVal, oldVal) {
        if (newVal != oldVal) {
          this.fetchTemplateAnalytics();
        }
        if (newVal.length > 10) {
          this.model = this.model.slice(0, 10);
        }
      },
    },
    methods: {
      ...mapActions(['getTemplateAnalytics', 'getTemplates']),
      fetchTemplateAnalytics() {
        const models = this.model?.map((item) => item.value);
        const params = {
          app_uuid: this.app_uuid,
          filters: {
            start: this.periodo?.start,
            end: this.periodo?.end,
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
      setPeriodo(e) {
        this.periodo = {
          start: e.start,
          end: e.end,
        };
        this.fetchTemplateAnalytics();
      },
      formatDate(date) {
        return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
      },
      getChartByType(type) {
        const data = this.templateAnalytics?.data?.map((template) => {
          return {
            title: template.template_name ?? template.template_id,
            data: template.dates?.map((item) => {
              return {
                title: item.start,
                value: item[type],
              };
            }),
          };
        });
        return data ?? [];
      },
      findMax(array) {
        return Math.max(...array.map(({ value }) => value));
      },
      redirectTo(crumb) {
        if (crumb?.meta === this.$route.name) return;
        this.$router.push(crumb.path);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
