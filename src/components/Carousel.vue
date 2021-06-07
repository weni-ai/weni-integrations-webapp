<template>
  <div>
    <div class="carousel-container" :key="currentApp.id">
      <transition name="slide" mode="out-in">
        <img v-bind:src="currentApp.backgroundImage" :key="currentApp.id" />
      </transition>
      <div class="carousel">
        <div class="add">
          <unnnicButton type="terciary" size="small" :text="$t('add')" iconLeft="add-1" />
        </div>
        <div class="content">
          <unnnic-icon icon="arrow-left-1-1" size="ant" @click.native="showPrevElement" />

          <div class="info">
            <p class="title">{{ currentApp.name }}</p>

            <p class="description">
              {{ currentApp.description }}
            </p>

            <p class="users-count">+{{ currentApp.usersCount }} users</p>
          </div>
          <unnnic-icon icon="arrow-right-1-1" size="ant" @click.native="showNextElement" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Carousel',

    data() {
      return {
        currentAppIndex: 0,

        // mocked apps
        apps: [
          {
            id: 1,
            name: 'Weni Webchat',
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
      currentBackground() {
        return {
          '--current-background': `url('${this.currentApp.backgroundImage}')`,
        };
      },
    },

    methods: {
      showNextElement() {
        const newIndex = (this.currentAppIndex + 1) % this.apps.length;

        this.currentAppIndex = newIndex;
      },
      showPrevElement() {
        let newIndex = this.currentAppIndex - 1;
        this.currentAppIndex = newIndex < 0 ? this.apps.length - 1 : newIndex;
      },
    },
  };
</script>

<style lang="scss">
  @import '~@weni/unnnic-system/dist/unnnic.css';
  @import '~@weni/unnnic-system/src/assets/scss/unnnic.scss';

  /* Animações de entrada e saída podem utilizar diferentes  */
  /* funções de duração e de tempo.                          */
  .slide-fade-enter-active {
    transition: all 0.3s ease;
  }
  .slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
  }
  .slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active em versões anteriores a 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }

  .carousel-container {
    display: grid;
    justify-items: start;
    align-items: start;

    height: 235px;
    max-height: 235px;

    margin-bottom: $unnnic-spacing-stack-md;

    // overflow: hidden;
  }

  .carousel-container > * {
    grid-column-start: 1;
    grid-row-start: 1;
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 235px;
  }

  .carousel {
    display: flex;
    flex-direction: column;
    // background-color: #f0f0f0;
    color: $unnnic-color-neutral-light;
    border-radius: $unnnic-border-radius-sm;
    // background-position: center;
    // background-size: 100% auto;
    // background-image: var(--current-background);
    // transition: background-position 0.7s cubic-bezier(0.47, 0.1, 1, 0.63), color 0.2s linear;
    // transition-delay: 0s, 0.15s;
  }

  .add {
    display: inline-flex;
    justify-content: flex-end;

    .unnnic-icon,
    .unnnic-button__label {
      color: $unnnic-color-neutral-light;
      font-size: $unnnic-font-size-title-sm;
    }

    .unnnic-button:hover:enabled {
      border: 0.0625rem solid transparent;
    }
  }

  .content {
    display: flex;
    flex-direction: row;

    .unnnic-icon {
      display: flex;
      align-items: center;
      margin: 0px $unnnic-inline-sm $unnnic-spacing-stack-lg;
    }
  }

  .info {
    flex-grow: 1;
    margin: $unnnic-spacing-stack-md 0 $unnnic-spacing-stack-giant $unnnic-inline-lg;
    min-width: 0;

    .title {
      margin: $unnnic-inset-nano 0;
    }

    .description {
      margin: 0;
      margin-bottom: $unnnic-spacing-stack-xs;
      font-size: $unnnic-font-size-body-lg;
      line-height: calc($unnnic-font-size-body-lg + $unnnic-line-height-md);

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 50%;
    }

    .users-count {
      margin: 0;
      font-size: $unnnic-font-size-body-gt;
      line-height: calc($unnnic-font-size-body-gt + $unnnic-line-height-md);
    }
  }

  .title {
    font-size: $unnnic-font-size-h4;
    line-height: calc($unnnic-font-size-h4 + $unnnic-line-height-md);
    font-weight: $unnnic-font-weight-bold;
  }
</style>
