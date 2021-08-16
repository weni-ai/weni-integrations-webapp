<template>
  <div>
    <section id="app-grid">
      <p class="app-grid__title">{{ $t(section) }}</p>

      <div class="app-grid__content">
        <unnnic-card
          ref="unnnic-marketplace-card"
          class="app-grid__content__item"
          v-for="app in apps"
          v-bind:key="app.id"
          type="marketplace"
          :title="app.name"
          :description="app.description"
          :icon="app.icon"
          :id="app.id"
          :comments="`${app.comments_count} ${$t('comments')}`"
          :rating="app.rating.average || 0"
          :iconSrc="app.icon"
          :typeAction="type"
          :buttonAction="/* istanbul ignore next */ () => openAddModal(app.id, app.name)"
          clickable
          @openModal="openAppModal(app.code)"
        />
      </div>
    </section>

    <unnnic-modal
      ref="unnnic-add-modal"
      :showModal="showAddModal"
      :text="$t('installed_app_title')"
      scheme="feedback-green"
      modal-icon="check-circle-1-1"
      @close="closeAddModal"
    >
      <span slot="message" v-html="$t('installed_app_description')"></span>
      <unnnic-button
        ref="unnnic-add-modal-close-button"
        slot="options"
        type="terciary"
        @click="closeAddModal"
        >{{ $t('close') }}</unnnic-button
      >
      <unnnic-button
        ref="unnnic-add-modal-navigate-button"
        slot="options"
        type="primary"
        @click="navigateToMyApps()"
      >
        {{ $t('access_my_apps') }}
      </unnnic-button>
    </unnnic-modal>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  export default {
    name: 'AppGrid',
    props: {
      section: {
        type: String,
        default: null,
        validator(value) {
          return (
            [
              'communication_channels',
              'attendance_managers',
              'configured_apps',
              'installed_apps',
            ].indexOf(value) !== -1
          );
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
      const category = this.getCategory(this.section);
      this.loadApps({ category });
    },
    methods: {
      ...mapActions(['getAllAppTypes']),
      async loadApps(filter) {
        if (this.type == 'add') {
          const { data } = await this.getAllAppTypes(filter);
          this.apps = data;
        } else {
          this.apps = [
            {
              code: 'wwc',
              name: 'Weni Web Chat MOCK',
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
      getCategory(section) {
        const categories = {
          communication_channels: 'channel',
          attendance_managers: 'ticket',
          configured_apps: null,
          installed_apps: null,
        };
        return categories[section];
      },
      openAddModal() {
        this.showAddModal = true;
      },
      closeAddModal() {
        this.showAddModal = false;
      },
      navigateToMyApps() {
        this.$router.push('apps');
      },
      openAppModal(code) {
        this.$router.push(`/apps/${code}/details`);
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
