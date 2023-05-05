<template lang="">
  <div>
    <unnnic-modal-next class="onboard" v-if="showModal" @close="closeModal" show-close-button>
      <div class="onboard--title">
        {{ currentModalTitle }}
      </div>

      <div v-if="!currentApp" class="onboard__app-selection">
        <div class="onboard__app-selection--description">
          {{ $t('onboard.modal.app_selection.description') }}
        </div>

        <div class="onboard__app-selection__wrapper">
          <img
            class="onboard__app-selection__app"
            v-for="(app, index) in availableApps"
            :key="index"
            :src="onboardIcons[app]"
            @click="() => (currentApp = app)"
          />
        </div>
      </div>

      <div v-else class="onboard__content">
        <img class="onboard__gif" :src="onboardGifs[currentApp][page]" />

        <span class="onboard__description" v-html="onboardDescriptions[currentApp][page]" />

        <div slot="options" class="onboard__buttons">
          <unnnic-button type="terciary" @click.stop="previousPage" :text="$t('general.back')" />
          <unnnic-button
            type="secondary"
            @click="nextPage"
            :text="page === appPageLimit[currentApp] ? $t('general.start') : $t('general.next')"
          />
        </div>
      </div>
    </unnnic-modal-next>
  </div>
</template>

<script>
  import WhatsAppIcon from '@/assets/logos/whatsapp.png';
  import TelegramIcon from '@/assets/logos/telegram.png';
  import WWCIcon from '@/assets/logos/wwc.png';

  import WhatsAppFirstGif from '@/assets/gifs/whatsapp1.gif';
  import WhatsAppSecondGif from '@/assets/gifs/whatsapp2.gif';
  import WhatsAppThirdGif from '@/assets/gifs/whatsapp3.gif';

  import TelegramFirstGif from '@/assets/gifs/telegram1.gif';
  import TelegramSecondGif from '@/assets/gifs/telegram2.gif';

  import WWCFirstGif from '@/assets/gifs/wwc1.gif';

  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'OnboardModal',
    data() {
      return {
        showModal: false,
        currentApp: null,
        availableApps: ['whatsapp', 'telegram', 'wwc'],
        onboardIcons: {
          whatsapp: WhatsAppIcon,
          telegram: TelegramIcon,
          wwc: WWCIcon,
        },
        onboardGifs: {
          whatsapp: [WhatsAppFirstGif, WhatsAppSecondGif, WhatsAppThirdGif],
          telegram: [TelegramFirstGif, TelegramSecondGif],
          wwc: [WWCFirstGif],
        },
        onboardDescriptions: {
          whatsapp: [
            this.$t('onboard.modal.whatsapp.descriptions.first'),
            this.$t('onboard.modal.whatsapp.descriptions.second'),
            this.$t('onboard.modal.whatsapp.descriptions.third'),
          ],
          telegram: [
            this.$t('onboard.modal.telegram.descriptions.first'),
            this.$t('onboard.modal.telegram.descriptions.second'),
          ],
          wwc: [this.$t('onboard.modal.wwc.descriptions.first')],
        },
        page: 0,
        appPageLimit: {
          whatsapp: 2,
          telegram: 1,
          wwc: 0,
        },
      };
    },
    mounted() {
      this.checkModalCondition();
    },
    computed: {
      ...mapState({
        project: (state) => state.auth.project,
        onboardStatus: (state) => state.appType.onboardStatus,
      }),
      ...mapState({
        configuredApps: (state) => state.myApps.configuredApps,
        errorConfiguredApps: (state) => state.myApps.errorConfiguredApps,
      }),
      currentModalTitle() {
        const titleMap = {
          whatsapp: this.$t('onboard.modal.whatsapp.title'),
          telegram: this.$t('onboard.modal.telegram.title'),
          wwc: this.$t('onboard.modal.wwc.title'),
        };

        return this.currentApp
          ? titleMap[this.currentApp]
          : this.$t('onboard.modal.app_selection.title');
      },
    },
    methods: {
      ...mapActions(['getConfiguredApps', 'setOnboardStatus']),
      async checkModalCondition() {
        const params = {
          project_uuid: this.project,
        };
        await this.getConfiguredApps({ params });

        if (this.errorConfiguredApps || !this.configuredApps) return;

        const hasApp = this.configuredApps.find((app) => app.code != 'wpp-demo');

        if (this.onboardStatus) {
          this.showModal = !hasApp;
        }
      },
      previousPage() {
        if (this.page <= 0) {
          this.currentApp = null;
          this.page = 0;
        } else {
          this.page -= 1;
        }
      },
      nextPage() {
        if (this.page < this.appPageLimit[this.currentApp]) {
          this.page += 1;
        } else {
          this.closeModal();
        }
      },
      closeModal() {
        this.showModal = false;
        this.page = 0;
        this.currentApp = null;
        this.setOnboardStatus({ status: false });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .onboard {
    &--title {
      text-align: center;
      margin-bottom: $unnnic-spacing-stack-sm;
      font-weight: $unnnic-font-weight-black;
      font-size: $unnnic-font-size-title-sm;
      color: $unnnic-color-neutral-darkest;
    }

    &__app-selection {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: $unnnic-spacing-inline-sm;

      &__wrapper {
        display: flex;
        gap: $unnnic-spacing-inline-sm;
        justify-content: center;
      }

      &__app {
        cursor: pointer;
      }

      &--description {
        text-align: center;
        font-size: $unnnic-font-size-body-lg;
        line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
      color: $unnnic-color-neutral-cloudy;
    }

    &__gif {
      height: 167px;
      width: 368px;
      margin: 0 auto;
    }

    &__description {
      text-align: left;
      margin-top: $unnnic-spacing-stack-md;
    }

    &__buttons {
      margin-top: $unnnic-spacing-stack-giant;
      display: flex;
      gap: $unnnic-spacing-inline-lg;

      .unnnic-button {
        width: 100%;
      }
    }
  }
</style>

<style lang="scss">
  ol {
    list-style-type: decimal;
    margin: 0;
    padding-left: $unnnic-spacing-inline-md;
  }
</style>
