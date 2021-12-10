<template>
  <div>
    <section v-if="!loading" id="app-grid">
      <div v-if="apps.length" class="app-grid__header">
        <unnnic-avatar-icon :icon="sectionIcon.icon" :scheme="sectionIcon.scheme" size="sm" />
        <p class="app-grid__header__title">{{ $t(`apps.discovery.categories.${section}`) }}</p>
      </div>

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
            <unnnic-button slot="trigger" size="small" type="secondary" :iconCenter="cardIcon" />
            <unnnic-dropdown-item
              class="app-grid__content__item__button--action"
              @click="openAppModal(app)"
            >
              <unnnic-icon-svg :icon="actionIcon" size="sm" />
              {{ actionText }}
            </unnnic-dropdown-item>
            <unnnic-dropdown-item
              class="app-grid__content__item__button--details"
              @click="openAppDetails(app.code)"
            >
              <unnnic-icon-svg icon="export-1" size="sm" />
              {{ $t('apps.details.card.see_details') }}
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
  import configModal from './config/ConfigModal.vue';
  import addModal from './AddModal.vue';
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
      apps: {
        type: Array,
        default: null,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        showAddModal: false,
        showRemoveModal: false,
        currentRemoval: null,
      };
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
      }),
      sectionIcon() {
        switch (this.section) {
          case 'channel':
            return { icon: 'messages-bubble-1', scheme: 'aux-purple' };
          case 'ticket':
            return { icon: 'messaging-we-chat-3', scheme: 'aux-blue' };
          case 'configured':
            return { icon: 'cog-1', scheme: 'aux-purple' };
          case 'installed':
            return { icon: 'check-circle-1-1', scheme: 'aux-blue' };
        }
        /* istanbul ignore next */
        return null;
      },
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
      cardIcon() {
        switch (this.type) {
          case 'add':
            return 'add-1';
          case 'config':
            return 'navigation-menu-vertical-1';
          case 'edit':
            return 'navigation-menu-vertical-1';
          /* istanbul ignore next */
          default:
            return null;
        }
      },
      actionText() {
        switch (this.type) {
          case 'config':
            return 'Configure';
          case 'edit':
            return 'Edit';
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
        'getConfiguredApps',
        'getInstalledApps',
        'deleteApp',
      ]),
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
          this.$emit('update');
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
      openAppDetails(code) {
        this.$router.push(`/apps/${code}/details`);
      },
      openAppModal(app) {
        if (this.type === 'add') {
          this.openAppDetails(app.code);
        } else {
          this.$refs.configModal.openModal(app);
        }
      },
      appRatingAverage(app) {
        return app.rating
          ? app.rating.average
            ? parseFloat(app.rating.average.toFixed(2))
            : 0
          : 0;
      },
      appName(app) {
        return `${app.name}${this.type === 'edit' ? ' - ' + app.config.title : ''}`;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-grid {
    &__header {
      display: flex;
      gap: $unnnic-spacing-inline-sm;
      align-items: center;

      &__title {
        color: $unnnic-color-neutral-darkest;
        font-size: $unnnic-font-size-title-sm;
      }
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

          &--action,
          &--details,
          &--remove {
            display: inline-block;
            width: $unnnic-inline-awesome;

            font-family: $unnnic-font-family-secondary;
            font-size: $unnnic-font-size-body-md;
            line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
          }

          &--remove {
            color: $unnnic-color-feedback-red;
          }
        }
      }
    }
  }
</style>
