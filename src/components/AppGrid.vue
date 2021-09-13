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

    <add-modal ref="addModal" />
    <config-modal ref="configModal" />
  </div>
</template>

<script>
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import configModal from '../components/ConfigModal.vue';
  import addModal from '../components/AddModal.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'AppGrid',
    components: { configModal, addModal },
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
      ...mapActions([
        'getAllAppTypes',
        'createApp',
        'getApp',
        'getConfiguredApps',
        'getInstalledApps',
      ]),
      async loadApps(filter) {
        switch (this.type) {
          case 'add': {
            const { data } = await this.getAllAppTypes(filter);
            this.apps = data;
            break;
          }
          case 'config': {
            const params = {
              project_uuid: this.getSelectedProject,
            };
            const { data } = await this.getInstalledApps({ params });
            this.apps = data;
            break;
          }
          case 'edit': {
            const params = {
              project_uuid: this.getSelectedProject,
            };
            const { data } = await this.getConfiguredApps({ params });
            this.apps = data;
            break;
          }
        }
      },
      async openAddModal(code) {
        try {
          const payload = {
            project_uuid: this.getSelectedProject,
          };
          await this.createApp({ code, payload });
          this.$refs.addModal.toggleModal();
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
