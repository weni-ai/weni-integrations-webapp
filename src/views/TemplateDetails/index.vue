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
    <div class="wpp_template_details__header">
      <div class="wpp_template_detais__header__title">
        <div class="wpp_template_details__header__about__title">Insights</div>
      </div>
      <div class="wpp_insights__header__button">
        <unnnic-button
          text="Editar Modelo"
          ref="wpp_template_details__button__edit"
          type="secondary"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'App Details',
  };
</script>
<style lang="scss">
  @import './styles.scss';
</style>
