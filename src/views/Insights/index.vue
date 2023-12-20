<!-- eslint-disable vue/multi-word-component-names -->
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
          :disable="!isActive"
          ref="wpp_insights__button"
          @click="toggleOpenModal"
        />
      </div>
    </div>
    <!-- Filters -->
    <div class="wpp_insights__filters">
      <div class="wpp_insights__filters__time">
        <div class="wpp_insights__filters__time__title">Periodo de Tempo</div>
        <div class="wpp_insights__filters__time__select">
          <unnnic-select searchPlaceholder="Buscar por...">
            <div slot="header">header</div>
            <option>Semana atual</option>
          </unnnic-select>
        </div>
      </div>
      <div class="wpp_insights__filters__model">
        <div class="wpp_insights__filters__model__title">Modelos de mensagem</div>
        <div class="wpp_insights__filters__model__select">
          <unnnic-select searchPlaceholder="Buscar por...">
            <div slot="header">header</div>
            <option>Semana atual</option>
          </unnnic-select>
        </div>
      </div>
    </div>
    <!-- Content -->
    <div class="wpp_insights__content">
      <!-- If not active -->
      <div class="wpp_insights__content__empty" v-if="!isActive">
        <div class="wpp_insights__content__empty__image">
          <img src="../assets/insights-empty.svg" alt="" />
        </div>
        <div class="wpp_insights__content__empty__text">
          <div class="wpp_insights__content__empty__text__title">Você não ativou os insights</div>
          <div class="wpp_insights__content__empty__text__description">
            Os insights ajudam a acompanhar, entender e aprimorar seus modelos de mensagem de
            marketing.
          </div>
        </div>
        <div class="wpp_insights__content__empty__button">
          <unnnic-button
            text="Ativar insights"
            ref="wpp_insights__button"
            @click="toggleOpenModal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { unnnicBreadcrumb, unnnicAvatarIcon, unnnicButton } from '@weni/unnnic-system';
  export default {
    name: 'Insights',
    components: {
      unnnicBreadcrumb,
      unnnicAvatarIcon,
      unnnicButton,
    },
    data() {
      return {
        isActive: false,
      };
    },
    methods: {
      toggleOpenModal() {
        return alert('Modal aberto');
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
