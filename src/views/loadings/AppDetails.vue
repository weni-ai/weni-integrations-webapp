<template>
  <div class="loading-app-details">
    <unnnic-skeleton-loading tag="div" height="150px" width="100%" />

    <div class="loading-app-details__title">
      <unnnic-skeleton-loading tag="div" height="70px" width="70px" />
      <unnnic-skeleton-loading tag="div" height="48px" width="160px" />
    </div>

    <unnnic-skeleton-loading tag="div" height="130px" width="100%" />

    <div class="loading-app-details__description">
      <unnnic-skeleton-loading tag="div" height="207px" width="65vw" />
      <unnnic-skeleton-loading tag="div" height="207px" width="25vw" />
    </div>
    <!-- <app-images-banner class="app-details__section" :images="app.banners" />
    <app-details-header
      class="app-details__section"
      :title="app.name"
      :description="app.summary"
      :icon="app.icon"
      :iconbgColor="app.bg_color"
      :appCode="app.code"
    />
    <unnnic-banner
      :key="bannerKey"
      type="info"
      :firstTitle="$t('apps.details.info')"
      :firstDescription="appMetrics"
      :secondTitle="$t('apps.details.integrated_into')"
      :secondDescription="appIntegrationsCount"
      :subtitle="$t('apps.details.organizations')"
      :thirdTitle="$t('apps.details.rating')"
      :thirdDescription="appRatingString"
      :rating="appRatingAverage"
      @ratingAction="handleRating"
    />
    <div class="app-details__section app-details__section__columns">
      <app-details-about :description="app.description" :links="appLinks" />
      <app-details-recommended class="app-details__section__columns__recommended" />
    </div>
    <app-details-comments :appCode="app.code" /> -->
  </div>
</template>

<script>
  export default {};
</script>

<style lang="scss" scoped>
  .loading-app-details {
    width: 100%;
    margin-top: $unnnic-spacing-stack-xl;

    &__title {
      display: flex;
      justify-content: space-between;
      margin: $unnnic-spacing-stack-md 0;
    }

    &__description {
      display: flex;
      justify-content: space-between;
      margin-top: $unnnic-spacing-stack-xl;
    }
  }
</style>
