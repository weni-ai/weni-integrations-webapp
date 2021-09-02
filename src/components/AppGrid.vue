<template>
  <div>
    <section id="app-grid">
      <p class="app-grid__title">{{ $t(`apps.discovery.categories.${section}`) }}</p>

      <div class="app-grid__content">
        <unnnic-card
          ref="unnnic-marketplace-card"
          class="app-grid__content__item"
          v-for="(app, index) in apps"
          v-bind:key="index"
          type="marketplace"
          :title="app.name"
          :description="app.description"
          :icon="app.icon"
          :id="app.id"
          :comments="`${app.comments_count} ${$t('apps.details.card.comments')}`"
          :rating="appRatingAverage(app)"
          :iconSrc="app.icon"
          :typeAction="type"
          :buttonAction="/* istanbul ignore next */ () => openAddModal(app.code)"
          clickable
          @openModal="openAppModal(app)"
        />
      </div>
    </section>

    <unnnic-modal
      ref="unnnic-add-modal"
      :showModal="showAddModal"
      :text="$t('apps.details.actions.installed.title')"
      scheme="feedback-green"
      modal-icon="check-circle-1-1"
      @close="closeAddModal"
    >
      <span slot="message" v-html="$t('apps.details.actions.installed.description')"></span>
      <unnnic-button
        ref="unnnic-add-modal-close-button"
        slot="options"
        type="terciary"
        @click="closeAddModal"
        >{{ $t('general.Close') }}</unnnic-button
      >
      <unnnic-button
        ref="unnnic-add-modal-navigate-button"
        slot="options"
        type="primary"
        @click="navigateToMyApps()"
      >
        {{ $t('apps.details.actions.installed.access_my_apps') }}
      </unnnic-button>
    </unnnic-modal>

    <config-modal ref="configModal" />
  </div>
</template>

<script>
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import configModal from '../components/ConfigModal.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'AppGrid',
    components: { configModal },
    props: {
      section: {
        type: String,
        default: null,
        validator(value) {
          return ['channel', 'ticket', 'configured', 'installed'].indexOf(value) !== -1;
        },
      },
      type: {
        type: String,
        validator(value) {
          return ['add', 'config', 'edit'].indexOf(value) !== -1;
        },
      },
    },
    data() {
      return {
        showAddModal: false,
        apps: [],
      };
    },
    async mounted() {
      await this.loadApps({ category: this.section });
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
      }),
    },
    methods: {
      ...mapActions(['getAllAppTypes', 'createApp', 'getApp']),
      async loadApps(filter) {
        if (this.type == 'add') {
          const { data } = await this.getAllAppTypes(filter);
          this.apps = data;
        } else {
          this.apps = [
            {
              uuid: '123',
              code: 'wwc',
              name: 'Weni Web Chat',
              description:
                'Ullamco occaecat et id cillum. Amet exercitation nisi amet fugiat mollit minim est. Officia in enim amet ipsum Lorem velit sint pariatur sunt magna cupidatat. Magna non ea qui nisi ut.s',
              summary: 'Ullamco occaecat et id cillum.',
              category: 'channel',
              bg_color: '#00DED333',
              icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/logo-wwc.svg',
              assets: [
                {
                  type: 'image_banner',
                  url: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/Ilustra%C3%A7%C3%A3o%20banner%201.png',
                  description: '',
                },
              ],
              usersCount: 25,
              rating: {
                average: 4.9,
              },
              commentsCount: 3,
              config: {
                title: 'Chat Title',
                subtitle: 'Chat subtitle',
                placeholder: 'Chat placeholder',
                fullScreenButton: false,
                unreadIndicator: false,
                keepHistory: false,
                avatarImage:
                  'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/iconfinder_13-whatsapp_4202050+1.svg',
                customCSS: '',
                primaryColor: '#009E96',
                messageDelay: 1,
              },
            },
          ];
        }
      },
      async openAddModal(code) {
        try {
          const payload = {
            project_uuid: this.getSelectedProject,
          };
          await this.createApp({ code, payload });
          this.showAddModal = true;
        } catch (error) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              title: 'Error',
              icon: 'check-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('close'),
            },
            seconds: 3,
          });
        }
      },
      closeAddModal() {
        this.showAddModal = false;
      },
      navigateToMyApps() {
        this.$router.push('my');
      },
      openAppModal(app) {
        if (this.type === 'add') {
          this.$router.push(`/apps/${app.code}/details`);
        } else {
          this.$refs.configModal.openModal(app);
        }
      },
      appRatingAverage(app) {
        return app.rating ? (app.rating.average ? app.rating.average : 0) : 0;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-grid {
    &__title {
      color: $unnnic-color-neutral-darkest;
      font-size: $unnnic-font-size-title-sm;
    }

    &__content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(256px, 256px));
      grid-gap: $unnnic-spacing-stack-sm;
      align-items: flex-start;
    }
  }
</style>
