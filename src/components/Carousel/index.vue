<template>
  <div class="carousel-container" v-if="!loadingFeaturedApps">
    <vueper-slides :arrows="false" fixed-height="152px" :autoplay="hasAutoPlay" :duration="6000">
      <vueper-slide
        v-for="(app, index) in featuredApps"
        :key="index"
        :title="app.name"
        :content="$t(app.summary)"
        :image="appImageBanner(app.assets)"
        @click="openAppDetails(app.code)"
      />

      <template #bullets="{ bulletIndexes, goToSlide, currentSlide }">
        <div class="carousel-container__bullets__wrapper">
          <span
            v-for="(slideIndex, i) in bulletIndexes"
            :key="i"
            :class="{
              'carousel-container__bullets__wrapper__bullet': true,
              'carousel-container__bullets__wrapper__bullet--active': currentSlide === slideIndex,
            }"
            @click="goToSlide(slideIndex)"
          />
        </div>
      </template>
    </vueper-slides>
  </div>
  <!-- <skeleton-loading /> -->
</template>

<script>
  // import skeletonLoading from '../loadings/Carousel.vue';
  import { VueperSlides, VueperSlide } from 'vueperslides';
  import 'vueperslides/dist/vueperslides.css';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { mapActions, mapState } from 'pinia';

  export default {
    name: 'Carousel',
    components: { VueperSlides, VueperSlide },
    async mounted() {
      await this.fetchFeatured();
    },
    methods: {
      ...mapActions(app_type, ['fetchFeatured']),
      appImageBanner(assets) {
        const banner = assets.filter((asset) => asset.type == 'IB');
        return banner[0] ? banner[0].url : null;
      },
      openAppDetails(code) {
        this.$router.push(`/apps/${code}/details`);
      },
    },
    computed: {
      ...mapState(app_type, ['featuredApps', 'loadingFeaturedApps']),
      hasAutoPlay() {
        return this.featuredApps?.length > 1 ? true : false;
      },
    },
  };
</script>

<style lang="scss">
  @import './styles.scss';
</style>
