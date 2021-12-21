<template>
  <div class="app-details-about">
    <div class="app-details-about__content">
      <div class="app-details-about__content__title">
        {{ $t('apps.details.about.about_the_app') }}
      </div>
      <div class="app-details-about__content__description" v-html="$t(description)" />
    </div>
    <div v-if="links.length" class="app-details-about__links">
      <div class="app-details-about__links__title">{{ $t('apps.details.about.useful_links') }}</div>
      <div class="app-details-about__links__content">
        <a
          v-for="(link, index) in links"
          :key="index"
          :href="link.url"
          class="app-details-about__links__content__link"
          >{{ link.description }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AppDetailsAbout',
    props: {
      description: {
        type: String,
        default: null,
      },
      links: {
        type: Array,
        default: null,
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-details-about {
    font-family: $unnnic-font-family-secondary;
    &__content {
      &__title {
        font-weight: $unnnic-font-weight-bold;
        font-size: $unnnic-font-size-title-sm;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
        color: $unnnic-color-neutral-darkest;
      }

      &__description {
        margin-top: $unnnic-spacing-stack-sm;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-lg;
        line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;
      }
    }

    &__links {
      margin-top: $unnnic-spacing-stack-md;
      &__title {
        font-weight: $unnnic-font-weight-bold;
        font-size: $unnnic-font-size-title-sm;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
        color: $unnnic-color-neutral-darkest;
      }

      &__content {
        margin-top: $unnnic-spacing-stack-sm;
        &__link {
          font-weight: $unnnic-font-weight-regular;
          font-size: $unnnic-font-size-body-lg;
          line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
          color: $unnnic-color-neutral-cloudy;
          margin-right: $unnnic-inline-lg;
        }
      }
    }
  }
</style>
