<template>
  <div>
    <section v-if="!loading" id="app-grid">
      <p class="app-grid__title">{{ $t(`apps.discovery.categories.${section}`) }}</p>

      <div class="app-grid__content">
        <unnnic-card
          ref="unnnic-marketplace-card"
          class="app-grid__content__item"
          v-for="(app, index) in apps"
          v-bind:key="index"
          type="marketplace"
          :title="appName(app)"
          :description="$t(app.summary)"
          :icon="app.icon"
          :id="app.id"
          :comments="`${app.comments_count} ${$t('apps.details.card.comments')}`"
          :rating="appRatingAverage(app)"
          :iconSrc="app.icon"
          :typeAction="type"
          clickable
          @openModal="openAppModal(app)"
        >
          <unnnic-button
            class="app-grid__content__item__button--add"
            v-if="type === 'add'"
            slot="actions"
            size="small"
            type="secondary"
            :iconCenter="actionIcon"
            @click.stop="addApp(app.code)"
          />

          <unnnic-dropdown v-else class="app-grid__content__item__dropdown" slot="actions">
            <unnnic-button slot="trigger" size="small" type="secondary" :iconCenter="actionIcon" />
            <unnnic-dropdown-item v-if="type === 'config'" @click="openAppModal(app)">
              Configure
            </unnnic-dropdown-item>
            <unnnic-dropdown-item v-else-if="type === 'edit'" @click="openAppModal(app)">
              Edit
            </unnnic-dropdown-item>
            <unnnic-dropdown-item
              class="app-grid__content__item__button--remove"
              @click="toggleRemoveModal(app)"
            >
              <unnnic-icon-svg icon="bin-1-1" size="sm" scheme="feedback-red" />
              Remove
            </unnnic-dropdown-item>
          </unnnic-dropdown>
        </unnnic-card>
      </div>
    </section>
    <skeleton-loading v-else />

    <unnnic-modal
      ref="unnnic-remove-modal"
      :showModal="showRemoveModal"
      :text="$t('apps.details.actions.remove.title')"
      scheme="feedback-red"
      modal-icon="alert-circle-1"
      @close="toggleRemoveModal"
    >
      <span slot="message" v-html="$t('apps.details.actions.remove.description')"></span>
      <unnnic-button
        ref="unnnic-remove-modal-close-button"
        slot="options"
        type="terciary"
        @click="toggleRemoveModal"
        >{{ $t('general.Cancel') }}</unnnic-button
      >
      <unnnic-button
        ref="unnnic-remove-modal-navigate-button"
        slot="options"
        type="primary"
        @click="removeApp(currentRemoval.code, currentRemoval.uuid)"
        scheme="feedback-red"
      >
        {{ $t('apps.details.actions.remove.remove') }}
      </unnnic-button>
    </unnnic-modal>

    <add-modal ref="addModal" />
    <config-modal ref="configModal" />
  </div>
</template>

<script>
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import configModal from '../components/ConfigModal.vue';
  import addModal from '../components/AddModal.vue';
  import skeletonLoading from './loadings/AppGrid.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'AppGrid',
    components: { configModal, addModal, skeletonLoading },
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
        loading: true,
        showAddModal: false,
        showRemoveModal: false,
        currentRemoval: null,
        apps: [],
      };
    },
    async mounted() {
      await this.loadApps();

      this.$root.$on('updateGrid', async () => {
        await this.loadApps();
      });
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
      }),
      actionIcon() {
        switch (this.type) {
          case 'add':
            return 'add-1';
          case 'config':
            return 'cog-1';
          case 'edit':
            return 'pencil-write-1';
          /* istanbul ignore next */
          default:
            return null;
        }
      },
    },
    methods: {
      ...mapActions([
        'getAllAppTypes',
        'createApp',
        'getApp',
        'getConfiguredApps',
        'getInstalledApps',
        'deleteApp',
      ]),
      async loadApps() {
        this.loading = true;
        try {
          switch (this.type) {
            case 'add': {
              const filter = { category: this.section };
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
          this.loading = false;
        } catch (e) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.grid.status_error'),
              title: 'Error',
              icon: 'check-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        }
      },
      async addApp(code) {
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
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        }
      },
      toggleRemoveModal(app = null) {
        this.currentRemoval = app;
        this.showRemoveModal = !this.showRemoveModal;
      },
      async removeApp(code, appUuid) {
        try {
          await this.deleteApp({ code, appUuid });
          this.toggleRemoveModal();
          unnnicCallAlert({
            props: {
              text: this.$t('apps.details.actions.remove.status_text'),
              title: this.$t('apps.details.status_success'),
              icon: 'check-circle-1-1',
              scheme: 'feedback-green',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
          await this.loadApps();
        } catch (error) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              title: 'Error',
              icon: 'alert-circle-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
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
      appName(app) {
        return `${app.name}${this.type === 'edit' ? ' - ' + app.config.title : ''}`;
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

      &__item {
        &__dropdown {
          font-family: $unnnic-font-family-secondary;
          font-size: $unnnic-font-size-body-md;
          line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
          color: $unnnic-color-neutral-dark;
        }
        &__button {
          &--add {
            height: fit-content;
          }

          &--remove {
            display: inline-block;
            width: max-content;

            font-family: $unnnic-font-family-secondary;
            font-size: $unnnic-font-size-body-md;
            line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
            color: $unnnic-color-feedback-red;
          }
        }
      }
    }
  }
</style>
