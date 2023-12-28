<template>
  <div class="wpp_insights">
    <!-- Breadcrumb -->
    <div class="wpp_insights__breadcrumb">
      <unnnic-breadcrumb
        :crumbs="[
          { name: 'Meus aplicativos', path: '/apps' },
          { name: 'Insights', path: '/' },
        ]"
      />
    </div>
    <!-- Header -->
    <div class="wpp_insights__header">
      <div class="wpp_insights__header__logo">
        <unnnic-avatar-icon icon="messaging-whatsapp-1" scheme="feedback-green" />
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
          <unnnic-select searchPlaceholder="Buscar por..." v-model="periodo">
            <option>Semana atual</option>
            <option>Mês atual</option>
            <option>Últimos 60 dias</option>
          </unnnic-select>
        </div>
      </div>
      <div class="wpp_insights__filters__model">
        <div class="wpp_insights__filters__model__title">Modelos de mensagem</div>
        <div class="wpp_insights__filters__model__select">
          <unnnic-select searchPlaceholder="Buscar por..." v-model="model">
            <option>831797345020910</option>
            <option>1515371305882507</option>
            <option>768404021753348</option>
            <option>730081812069736</option>
            <option>Todos</option>
          </unnnic-select>
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
          <!-- <unnnic-chart-multi-line
            :data="getChartDataByDay"
            :title="'Envios por dia'"
            v-if="false"
          /> -->
          <unnnic-chart-multi-line :data="getChartData" :title="'Mensagens enviadas'" />
          <unnnic-chart-multi-line :data="getChartData" :title="'Mensagens entregues'" />
          <unnnic-chart-multi-line :data="getChartData" :title="'Mensagens recebidas'" />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="wpp_insights__modal">
      <unnnic-modal :showModal="showModal" @close="toggleOpenModal">
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
    unnnicAvatarIcon,
    unnnicButton,
    unnnicModal,
    unnnicChartMultiLine,
  } from '@weni/unnnic-system';
  import { mapState, mapActions } from 'vuex';
  export default {
    name: 'Insights',
    components: {
      unnnicBreadcrumb,
      unnnicAvatarIcon,
      unnnicButton,
      unnnicModal,
      unnnicChartMultiLine,
    },
    data() {
      return {
        isActive: true,
        showModal: false,
        model: 'Todos',
        periodo: 'Semana atual',
      };
    },
    mounted() {
      this.fetchTemplateAnalytics();
    },
    computed: {
      ...mapState({
        app_uuid: (state) =>
          state.myApps.configuredApps.find((item) => item.code === 'wpp-cloud')?.uuid,
        errorTemplateAnalytics: (state) => state.insights.errorTemplateAnalytics,
        errorTemplates: (state) => state.insights.errorTemplates,
        templateAnalytics: (state) => state.insights.templateAnalytics,
      }),
      getPeriodo() {
        const today = new Date(Date.now() - 24 * 60 * 60 * 1000);
        switch (this.periodo) {
          case 'Semana atual': {
            const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return {
              end: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`,
              start: `${lastWeek.getMonth() + 1}-${lastWeek.getDate()}-${lastWeek.getFullYear()}`,
            };
          }
          case 'Mês atual': {
            return {
              end: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`,
              start: `${today.getMonth()}-${today.getDate()}-${today.getFullYear()}`,
            };
          }
          case 'Últimos 60 dias': {
            const noventaDias = new Date(Date.now() - 59 * 24 * 60 * 60 * 1000);
            return {
              end: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`,
              start: `${noventaDias.getMonth()}-${noventaDias.getDate()}-${noventaDias.getFullYear()}`,
            };
          }
        }
        return '';
      },
      getChartDataByDay() {
        const data = [
          {
            title: 'Delivered',
            data: this.templateAnalytics?.data?.map((item) => {
              return {
                title: item.start,
                value: item.delivered,
              };
            }),
          },
          {
            title: 'Read',
            data: this.templateAnalytics?.data?.map((item) => {
              return {
                title: item.start,
                value: item.read,
              };
            }),
          },
          {
            title: 'Sent',
            data: this.templateAnalytics?.data?.map((item) => {
              return {
                title: item.start,
                value: item.sent,
              };
            }),
          },
        ];
        return data || [];
      },
      getChartData() {
        const data = this.templateAnalytics?.data?.map((template) => {
          return {
            title: template.template_name ?? template.template_id,
            data: template.dates.map((item) => {
              return {
                title: item.start,
                value: item.delivered,
              };
            }),
          };
        });
        return data ?? [];
      },
    },
    watch: {
      getPeriodo() {
        this.fetchTemplateAnalytics();
      },
      model(newVal, oldVal) {
        if (newVal != oldVal) {
          this.fetchTemplateAnalytics();
        }
      },
    },
    methods: {
      ...mapActions(['getTemplateAnalytics', 'getTemplates']),
      fetchTemplateAnalytics() {
        const params = {
          app_uuid: this.app_uuid,
          filters: {
            start: this.getPeriodo.start,
            end: this.getPeriodo.end,
            fba_template_ids: this.model,
          },
        };
        this.getTemplateAnalytics(params);
        if (this.errorTemplateAnalytics) {
          alert(this.errorTemplateAnalytics);
        }
      },
      toggleOpenModal() {
        this.showModal = !this.showModal;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
