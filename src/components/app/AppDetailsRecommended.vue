<template>
  <div class="app-details-recommended">
    <div class="app-details-recommended__header">
      <div class="app-details-recommended__header__title">
        {{ $t('apps.details.recommended.title') }}
      </div>
      <div class="app-details-recommended__header__buttons">
        <unnnic-button
          class="app-details-recommended__header__buttons__prev"
          type="tertiary"
          icon-center="arrow-left-1-1"
          size="small"
          @click="prevRecommendation"
        />
        <unnnic-button
          class="app-details-recommended__header__buttons__next"
          type="tertiary"
          icon-center="arrow-right-1-1"
          size="small"
          @click="nextRecommendation"
        />
      </div>
    </div>
    <unnnic-card
      ref="unnnic-card-marketplace"
      class="app-details-recommended__card"
      type="marketplace"
      :title="currentRecommended.name"
      :description="currentRecommended.description"
      :icon="currentRecommended.icon"
      :id="currentRecommended.id"
      :comments="`${currentRecommended.commentsCount} ${$t('apps.details.recommended.comments')}`"
      :rating="currentRecommended.rating"
      :iconSrc="currentRecommended.icon"
      typeAction="add"
      clickable
      @openModal="openApp(currentRecommended.id)"
    />
  </div>
</template>

<script>
  export default {
    name: 'AppDetailsRecommended',
    data() {
      return {
        currentRecommendedIndex: 0,
      };
    },
    computed: {
      recommendedApps() {
        return [
          {
            id: 5,
            name: 'Slack',
            description:
              'Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.',
            usersCount: 57,
            backgroundImage:
              'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            rating: 4.1,
            commentsCount: 2,
            icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/slack+1.svg',
          },
          {
            id: 6,
            name: 'Gmail',
            description:
              'Id officia aliquip officia irure nisi ut aliqua nulla magna nisi. Magna Lorem cillum cupidatat excepteur. Veniam anim eu ad veniam ullamco pariatur labore veniam incididunt. Cupidatat incididunt ex qui Lorem cupidatat. Labore sint Lorem magna magna reprehenderit fugiat id consequat mollit aliquip nulla labore ea ex.',
            usersCount: 57,
            backgroundImage:
              'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            rating: 4.6,
            commentsCount: 0,
            icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/iconfinder_google-gmail_7089163+1.svg',
          },
          {
            id: 7,
            name: 'Dropbox',
            description:
              'Fugiat eiusmod duis nulla ipsum duis exercitation culpa adipisicing nostrud sit. Ex consectetur laboris ea commodo excepteur amet deserunt non sunt sint incididunt. Ad reprehenderit veniam tempor aliquip. Incididunt laborum do anim enim dolor nostrud proident nisi culpa elit veniam nisi.',
            usersCount: 57,
            backgroundImage:
              'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            rating: 3.6,
            commentsCount: 7,
            icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/iconfinder_dropbox_social_network_logo_1920522+1.svg',
          },
        ];
      },
      currentRecommended() {
        return this.recommendedApps[this.currentRecommendedIndex];
      },
    },
    methods: {
      nextRecommendation() {
        const newIndex = (this.currentRecommendedIndex + 1) % this.recommendedApps.length;
        this.currentRecommendedIndex = newIndex;
      },
      prevRecommendation() {
        let newIndex = this.currentRecommendedIndex - 1;
        this.currentRecommendedIndex = newIndex < 0 ? this.recommendedApps.length - 1 : newIndex;
      },
      openApp(id) {
        let path = `/apps/${id}/details`;
        if (this.$route.path !== path) this.$router.push(path);
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-details-recommended {
    &__header {
      display: flex;
      margin-bottom: $unnnic-spacing-stack-xs;

      &__title {
        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-bold;
        font-size: $unnnic-font-size-title-sm;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
        color: $unnnic-color-neutral-darkest;

        align-self: center;
      }

      &__buttons {
        margin-left: auto;
      }

      &__prev {
        margin-right: $unnnic-spacing-inline-nano;
      }
    }
  }
</style>

<style lang="scss">
  .app-details-recommended {
    .unnnic-card-marketplace__icons__button {
      display: none;
    }
  }
</style>
