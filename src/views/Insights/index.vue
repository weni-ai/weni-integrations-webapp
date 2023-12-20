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
          <img src="../../assets/svgs/empty-apps.svg" alt="" />
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
            ref="wpp_insights__button__close"
            @click="toggleOpenModal"
          />
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="wpp_insights__modal">
      <unnnic-modal :showModal="showModal" @close="toggleOpenModal">
        <div class="wpp_insights__modal__title">
          <img src="../assets/amazoninha-heart.svg" alt="" />
          <p>Apresentamos novos insights</p>
        </div>
        <div class="wpp_insights__modal__content">
          <p class="wpp_insights__modal__content__dark">
            Estamos apresentando mais insights sobre o desempenho para ajudar você a rastrear,
            entender e aprimorar seus modelos de mensagens. Os modelos de marketing também mostrarão
            insights sobre o engajamento com o botão. Para migrar para a nova estrutura de insights,
            os dados existentes para "mensagens enviadas" serão apagados. O rastreamento recomeçará
            na data em que você clicar em Confirmar.
          </p>
          <p>
            Ao clicar em Confirmar, você instrui a Meta a adicionar insights à sua conta do WhatsApp
            Business. Esses insights incluem rastreamento de link para relatar os cliques no site.
            Você pode desativar o rastreamento de link em cada modelo de mensagem
          </p>
          <p>
            Ao clicar em Confirmar, você também instrui a Meta a coletar e anonimizar dados dos seus
            bate-papos com clientes. A Meta anonimizará esses dados para melhorar os serviços que
            presta a você e a outras empresas.
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
  } from '@weni/unnnic-system';
  export default {
    name: 'Insights',
    components: {
      unnnicBreadcrumb,
      unnnicAvatarIcon,
      unnnicButton,
      unnnicModal,
    },
    data() {
      return {
        isActive: false,
        showModal: false,
      };
    },
    methods: {
      toggleOpenModal() {
        this.showModal = !this.showModal;
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
