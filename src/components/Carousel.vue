<template>
  <div class="carousel-container">
    <vueper-slides :arrows="false" fixed-height="235px" :autoplay="true" :duration="6000">
      <vueper-slide
        v-for="app in apps"
        :key="app.id"
        :title="app.name"
        :content="app.description"
        :image="app.backgroundImage"
      />
    </vueper-slides>
  </div>
</template>

<script>
  import { VueperSlides, VueperSlide } from 'vueperslides';
  import 'vueperslides/dist/vueperslides.css';
  export default {
    name: 'Carousel',

    components: { VueperSlides, VueperSlide },

    data() {
      return {
        currentAppIndex: 0,

        // mocked apps
        apps: [
          {
            id: 1,
            name: 'Weni Web Chat',
            description:
              'Ullamco occaecat et id cillum. Amet exercitation nisi amet fugiat mollit minim est. Officia in enim amet ipsum Lorem velit sint pariatur sunt magna cupidatat. Magna non ea qui nisi ut.s',
            usersCount: 25,
            backgroundImage:
              'https://images.unsplash.com/photo-1523474438810-b04a2480633c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
          },
          {
            id: 2,
            name: 'Whatsapp',
            description:
              'Sint in minim consequat est velit in aliquip dolor consequat esse veniam magna. Exercitation est duis esse id dolor id enim magna. Ad laborum ea dolor proident ullamco minim deserunt laborum nulla laboris labore adipisicing labore.',
            usersCount: 590,
            backgroundImage:
              'https://images.unsplash.com/photo-1603145733146-ae562a55031e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
          },
          {
            id: 3,
            name: 'Telegram',
            description:
              'Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.',
            usersCount: 57,
            backgroundImage:
              'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          },
        ],
      };
    },

    computed: {
      currentApp() {
        return this.apps[Math.abs(this.currentAppIndex)];
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
      left: inherit;
      margin-right: $unnnic-inline-sm;
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
      line-height: calc($unnnic-font-size-body-lg + $unnnic-line-height-md);
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
