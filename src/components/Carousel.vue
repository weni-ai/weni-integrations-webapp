<template>
  <div class="carousel-container" v-if="!loading">
    <vueper-slides :arrows="false" fixed-height="152px" :autoplay="true" :duration="6000">
      <vueper-slide
        v-for="(app, index) in apps"
        :key="index"
        :title="app.name"
        :content="$t(app.summary)"
        :image="appImageBanner(app.assets)"
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
</template>

<script>
  import { VueperSlides, VueperSlide } from 'vueperslides';
  import 'vueperslides/dist/vueperslides.css';
  import { mapActions } from 'vuex';

  export default {
    name: 'Carousel',
    components: { VueperSlides, VueperSlide },
    data() {
      return {
        loading: true,
        apps: [],
      };
    },
    async mounted() {
      await this.loadFeatureds();
    },
    methods: {
      ...mapActions(['fetchFeatured']),
      async loadFeatureds() {
        const { data } = await this.fetchFeatured();
        this.apps = data;
        this.loading = false;
      },
      appImageBanner(assets) {
        const banner = assets.filter((asset) => asset.type == 'image_banner');
        return banner[0].url;
      },
    },
  };
</script>

<style lang="scss">
  .carousel-container {
    margin-bottom: $unnnic-spacing-stack-md;
  }

  .vueperslides {
    &__bullets {
      margin-right: $unnnic-inline-sm;
      margin-bottom: $unnnic-spacing-stack-sm;

      .carousel-container__bullets__wrapper__bullet {
        z-index: 1;
        height: $unnnic-inline-nano;
        width: $unnnic-inline-nano;
        border-radius: 50%;
        display: inline-block;
        background-color: $unnnic-color-neutral-dark;
        opacity: 0.4;
        &--active {
          width: 1rem;
          border-radius: $unnnic-border-radius-sm;
          background-color: $unnnic-color-neutral-dark;
          opacity: 1;
        }
      }

      .carousel-container__bullets__wrapper {
        margin: 0 $unnnic-inline-xs;
        display: flex;
        justify-content: center;
        > * {
          margin-right: $unnnic-inline-xs;
        }
        :last-child {
          margin: 0;
        }
      }
    }

    &__track {
      border-radius: $unnnic-border-radius-md;
    }

    &__parallax-wrapper {
      &::before,
      &::after {
        box-shadow: unset !important;
      }
    }
  }

  .vueperslide {
    &__content-wrapper {
      text-align: left !important;
      align-items: start !important;
      justify-content: flex-end !important;
      max-width: 50%;
      margin-left: $unnnic-inline-md !important;
    }

    &__title {
      font-weight: $unnnic-font-weight-black;
      font-size: $unnnic-font-size-title-lg;
      color: $unnnic-color-neutral-light;
    }

    &__content {
      color: $unnnic-color-neutral-lightest;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
      margin-top: $unnnic-spacing-stack-nano;
      margin-bottom: $unnnic-spacing-stack-md;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
