<template>
  <div ref="appGrid">
    <section v-if="!loading" id="app-grid" maxLength="255" disabled="false">
      <div v-if="apps && apps.length" class="app-grid__header">
        <unnnic-avatar-icon
          :icon="avatar.icon"
          :scheme="avatar.scheme"
          :filled="avatar.filled"
          :opacity="avatar.opacity"
          size="sm"
          class="app-grid__header__icon"
        />
        <p class="app-grid__header__title">{{ $t(`apps.discovery.categories.${section}`) }}</p>
      </div>

      <div class="app-grid__content">
        <unnnic-card
          ref="unnnic-marketplace-card"
          :class="[
            'app-grid__content__item',
            { 'app-grid__content__item--generic': app.generic && type === 'add' },
          ]"
          v-for="(app, index) in currentGridApps"
          v-bind:key="index"
          type="marketplace"
          :title="appName(app)"
          :description="app.generic ? $t(`${getTranslation(app)}`) : $t(app.summary)"
          :id="app.id"
          :comments="`${app.comments_count} ${$t('apps.details.card.comments')}`"
          :rating="appRatingAverage(app)"
          :iconSrc="appIcon(app)"
          :typeAction="app.generic ? (type === 'add' ? 'edit' : typeAction) : typeAction"
          :clickable="
            (!app.generic && app.code !== 'email' && app.code !== 'gmail') || (type !== 'add' && app.code !== 'gmail')
          "
          @openModal="openAppModal(app)"
        >
          <template #actions>
            <integrate-button
              :ref="`integrate-button-${app.code}`"
              v-if="type === 'add'"
              :app="app"
              :icon="action"
              :disabled="!app.generic && !app.can_add && false"
            />

            <unnnic-dropdown v-else-if="type !== 'view'" class="app-grid__content__item__dropdown">
              <template #trigger>
                <unnnic-button size="small" type="tertiary" :iconCenter="card" />
              </template>
              <unnnic-dropdown-item
                v-if="!['gmail'].includes(app.code)"
                class="app-grid__content__item__button--action"
                @click="openAppModal(app)"
              >
                <unnnic-icon-svg :icon="action" size="sm" />
                {{ $t(`apps.discovery.action.${type}`) }}
              </unnnic-dropdown-item>
              <unnnic-dropdown-item
                v-if="!['wpp', 'gmail'].includes(app.code)"
                class="app-grid__content__item__button--details"
                id="openAppDetails"
                ref="openAppDetails"
                @click="openAppDetails(app.code)"
              >
                <unnnic-icon-svg icon="export-1" size="sm" />
                {{ $t('apps.details.card.see_details') }}
              </unnnic-dropdown-item>
              <unnnic-dropdown-item
                class="app-grid__content__item__button--details"
                @click="copyToClipboard(app.uuid)"
              >
                <unnnic-icon-svg icon="copy-paste-1" size="sm" />
                {{ $t('apps.details.card.copy_uuid') }}
              </unnnic-dropdown-item>
              <unnnic-dropdown-item
                v-if="app.code !== 'wpp' && app.code !== 'wpp-cloud'"
                class="app-grid__content__item__button--remove"
                @click="toggleRemoveModal(app)"
              >
                <unnnic-icon-svg icon="bin-1-1" size="sm" scheme="feedback-red" />
                {{ $t('general.Remove') }}
              </unnnic-dropdown-item>
            </unnnic-dropdown>
          </template>
        </unnnic-card>
      </div>

      <div v-if="apps && apps.length > gridSize" class="app-grid__pagination">
        <span>{{ currentPageStart }} - {{ currentPageCount }} de {{ apps.length }}</span>
        <unnnic-pagination
          :style="{ marginRight: `${paginationMarginOffset}px` }"
          :modelValue="currentPage"
          @update:modelValue="onPageChange"
          :max="maxGridPages"
          :show="6"
        />
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
      <template #message>
        <span v-html="$t('apps.details.actions.remove.description')"></span>
      </template>
      <template #options>
        <unnnic-button
          ref="unnnic-remove-modal-close-button"
          type="tertiary"
          @click="toggleRemoveModal"
          >{{ $t('general.Cancel') }}</unnnic-button
        >

        <LoadingButton
          ref="unnnic-remove-modal-navigate-button"
          type="primary"
          :isLoading="loadingDeleteApp"
          :loadingText="$t('general.loading')"
          :text="$t('apps.details.actions.remove.remove')"
          @clicked="removeApp(currentRemoval.code, currentRemoval.uuid)"
        />
      </template>
    </unnnic-modal>

    <config-modal ref="configModal" />
  </div>
</template>

<script>
  import unnnic from '@weni/unnnic-system';
  import configModal from '../config/ConfigModal.vue';
  import skeletonLoading from '../loadings/AppGrid.vue';
  import IntegrateButton from '../IntegrateButton/index.vue';
  import LoadingButton from '../LoadingButton/index.vue';
  import { avatarIcons, actionIcons, cardIcons } from '../../views/data/icons';
  import { mapActions, mapState } from 'pinia';
  import { app_type } from '../../stores/modules/appType/appType.store';
  import { storeToRefs } from 'pinia';
  export default {
    name: 'AppGrid',
    components: { configModal, IntegrateButton, LoadingButton, skeletonLoading },
    props: {
      section: {
        type: String,
        default: null,
        validator(value) {
          return (
            [
              'channel',
              'ticket',
              'ecommerce',
              'external',
              'bi-tools',
              'configured',
              'installed',
              'recommended',
            ].indexOf(value) !== -1
          );
        },
      },
      type: {
        type: String,
        validator(value) {
          return ['add', 'config', 'edit', 'view'].indexOf(value) !== -1;
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
        currentPage: 1,
        gridSize: 10,
        paginationMarginOffset: 0,
        avatar: avatarIcons[this.section],
        action: actionIcons[this.type],
        card: cardIcons[this.type],
        appType: storeToRefs(app_type()),
      };
    },
    /* istanbul ignore next */
    mounted() {
      this.updateGridSize();
      window.addEventListener('resize', this.updateGridSize);
    },
    /* istanbul ignore next */
    unmounted() {
      window.removeEventListener('resize', this.updateGridSize);
    },
    computed: {
      ...mapState(app_type, ['loadingDeleteApp', 'errorDeleteApp']),
      typeAction() {
        if (this.type === 'view') {
          return 'edit';
        }
        return this.type;
      },
      currentPageStart() {
        return (this.currentPage - 1) * this.gridSize || 1;
      },
      currentPageCount() {
        const value = this.gridSize * this.currentPage;
        return value > this.apps?.length ? this.apps?.length || 0 : value;
      },
      maxGridPages() {
        return Math.ceil(this.apps?.length / this.gridSize) || 0;
      },
      currentGridApps() {
        if (this.apps) {
          const pageStart = (this.currentPage - 1) * this.gridSize;
          return this.apps.slice(pageStart, pageStart + this.gridSize);
        }

        return [];
      },
    },
    methods: {
      ...mapActions(app_type, ['deleteApp', 'setAppUuid']),
      toggleRemoveModal(app = null) {
        this.currentRemoval = app;
        this.showRemoveModal = !this.showRemoveModal;
      },
      async removeApp(code, appUuid) {
        await this.deleteApp({ code, appUuid });

        if (this.errorDeleteApp) {
          this.callErrorModal({ text: this.$t('apps.details.status_error') });
          return;
        }

        this.toggleRemoveModal();
        unnnic.unnnicCallAlert({
          props: {
            text: this.$t('apps.details.actions.remove.status_text'),
            type: 'success',
          },
          seconds: 3,
        });
        this.$emit('update');
      },
      callErrorModal({ text }) {
        unnnic.unnnicCallAlert({
          props: {
            text: text,
            type: 'error',
          },
          seconds: 6,
        });
      },
      openAppDetails(code) {
        this.$router.push(`/${code}/details`);
      },
      openAppModal(app) {
        this.setAppUuid(app.uuid);
        if ((this.type === 'add' && app.generic) || app.code === 'gmail') {
          return;
        }

        if (this.type === 'add' && app.code !== 'email' && app.code !== 'gmail') {
          this.openAppDetails(app.code);
        } else {
          this.$refs.configModal.openModal({ app, isConfigured: this.type === 'edit' });
        }
      },
      appRatingAverage(app) {
        return app.rating
          ? app.rating.average
            ? parseFloat(app.rating.average.toFixed(2))
            : 0
          : 0;
      },
      /* istanbul ignore next */
      appName(app) {
        if (app.generic && this.type !== 'add') {
          return `${app.config.channel_name}${
            this.type === 'edit' ? ' - ' + app.config.title : ''
          }`;
        }

        return `${app.name}${
          this.type === 'edit' ? ' - ' + (app.config.title || app.config.name) : ''
        }`;
      },
      /* istanbul ignore next */
      updateGridSize() {
        const gridWidth = this.$refs.appGrid?.clientWidth;
        if (gridWidth) {
          const maxWidthItems = Math.floor((gridWidth + 16) / 272) || 1;

          this.paginationMarginOffset =
            gridWidth - (maxWidthItems * 256 + (maxWidthItems - 1) * 16);
          this.gridSize = maxWidthItems * 2;
        }
      },
      /* istanbul ignore next */
      appIcon(app) {
        if (app.generic && this.type !== 'add') {
          return app.config.channel_icon_url;
        }

        return app.icon;
      },
      /* istanbul ignore next */
      copyToClipboard(content) {
        navigator.clipboard.writeText(content);
        unnnic.unnnicCallAlert({
          props: {
            text: this.$t('apps.details.actions.copy.sucess', { uuid: content }),
            type: 'success',
          },
          seconds: 6,
        });
      },
      onPageChange(value) {
        this.currentPage = value;
      },
      //TODO: return app code
      getTranslation(app) {
        const code = app.code === 'generic' ? app.config.channel_code : app.code;
        let i18nkey =
          app.generic === true ? `channels.${code}` : `GenericApp.configuration_guide.${app.code}`;
        return this.$te(i18nkey) ? this.$t(i18nkey) : app.summary;
      },
    },
    watch: {
      /* istanbul ignore next */
      loading(newState) {
        if (newState === false) {
          this.updateGridSize();
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles/grid.scss';
</style>
