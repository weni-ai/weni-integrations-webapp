<template>
  <div class="config-whatsapp">
    <div class="config-whatsapp__header">
      <span class="config-whatsapp__header__description">
        {{ $t('WhatsApp.config.description.text') }}
        <span>
          <a
            :href="documentationLink"
            target="_blank"
          >
            {{ $t('WhatsApp.config.description.link') }}
          </a>
        </span>
      </span>
    </div>

    <div class="config-whatsapp__content">
      <UnnnicTab
        v-if="
          skipLoad ||
          (!loadingWhatsAppProfile &&
            !loadingCurrentApp &&
            !loadingWhatsAppCloudCatalogs)
        "
        ref="tab"
        class="config-whatsapp__tabs"
        :tabs="configTabs"
        initialTab="account"
        type="md"
      >
        <template #tab-head-account>
          {{ $t('WhatsApp.config.tabs.account') }}
        </template>
        <template #tab-panel-account>
          <AccountTab
            :appInfo="currentApp"
            :hasCatalog="
              whatsAppCloudCatalogs && whatsAppCloudCatalogs.count > 0
            "
            @close="closeConfig"
            @update-app="
              () =>
                fetchAppInfo({
                  code: app.code,
                  appUuid: app.uuid,
                  loading: false,
                })
            "
          />
        </template>

        <template #tab-head-profile>
          {{ $t('WhatsApp.config.tabs.profile') }}
        </template>
        <template #tab-panel-profile>
          <ProfileTab
            :app="app"
            :profile="appProfile"
            @close="closeConfig"
            @save="() => fetchData({ skipLoad: true })"
          />
        </template>

        <template #tab-head-webhook_info>
          {{ $t('WhatsApp.config.tabs.webhook_info') }}
        </template>
        <template #tab-panel-webhook_info>
          <WebhookTab
            :app="app"
            @close="closeConfig"
          />
        </template>

        <template #tab-head-conversations>
          {{ $t('WhatsApp.config.tabs.conversations') }}
        </template>
        <template #tab-panel-conversations>
          <ConversationsTab
            :app="app"
            @close="closeConfig"
          />
        </template>

        <template #tab-head-account_verification>
          {{ $t('WhatsApp.config.tabs.account_verification') }}
        </template>
        <template #tab-panel-account_verification>
          <AccountVerificationTab :app="app" />
        </template>
      </UnnnicTab>
      <SkeletonLoading v-else />
    </div>
  </div>
</template>

<script>
import AccountTab from './components/tabs/AccountTab.vue';
import AccountVerificationTab from './components/tabs/AccountVerificationTab.vue';
import ConversationsTab from './components/tabs/ConversationsTab.vue';
import ProfileTab from './components/tabs/ProfileTab.vue';
import WebhookTab from './components/tabs/WebhookTab.vue';
import SkeletonLoading from './loadings/Config.vue';
import { mapActions, mapState } from 'pinia';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';
import { app_type } from '@/stores/modules/appType/appType.store';
import { dataUrlToFile } from '@/utils/files';
import unnnic from '@weni/unnnic-system';

export default {
  name: 'WhatsappConfig',
  components: {
    AccountTab,
    AccountVerificationTab,
    ConversationsTab,
    ProfileTab,
    WebhookTab,
    SkeletonLoading,
  },
  props: {
    app: {
      type: Object,
      default: /* istanbul ignore next */ () => {},
    },
  },
  data() {
    return {
      appProfile: null,
      documentations: {
        'en-us': 'https://docs.weni.ai/l/en/channels/how-to-verify-my-business',
        'pt-br':
          'https://docs.weni.ai/l/pt/canais/como-verificar-o-meu-neg-cio',
      },
      skipLoad: false,
    };
  },
  async mounted() {
    await this.fetchData();
    this.headerScrollBehavior();
  },
  beforeUnmount() {
    window.removeEventListener('wheel', this.handleWheelEvent);
  },
  computed: {
    ...mapState(whatsapp_store, [
      'whatsAppProfile',
      'loadingWhatsAppProfile',
      'errorWhatsAppProfile',
    ]),
    ...mapState(whatsapp_cloud, [
      'loadingWhatsAppCloudCatalogs',
      'errorWhatsAppCloudCatalogs',
      'whatsAppCloudCatalogs',
    ]),
    ...mapState(app_type, [
      'currentApp',
      'loadingCurrentApp',
      'errorCurrentApp',
    ]),
    configTabs() {
      return [
        'account',
        'profile',
        'webhook_info',
        'conversations',
        'account_verification',
      ];
    },
    documentationLink() {
      return (
        this.documentations[this.$i18n.locale] ?? this.documentations['en-us']
      );
    },
  },
  methods: {
    ...mapActions(app_type, ['getApp']),
    ...mapActions(whatsapp_store, ['fetchWppProfile', 'resetWppFetchResults']),
    ...mapActions(whatsapp_cloud, ['getWhatsAppCloudCatalogs']),
    /* istanbul ignore next */
    headerScrollBehavior() {
      const tabHeader = document.getElementsByClassName('tab-content')[0];
      if (tabHeader) {
        this.handleWheelEvent(tabHeader);
      }
    },
    handleWheelEvent(component) {
      component.addEventListener(
        'wheel',
        (event) => {
          event.preventDefault();

          component.scrollBy({
            left: event.deltaY < 0 ? -30 : 30,
          });
        },
        { passive: true },
      );
    },
    closeConfig() {
      this.$emit('closeModal');
    },
    async fetchData({ skipLoad = false } = {}) {
      try {
        const options = { code: this.app.code, appUuid: this.app.uuid };
        this.skipLoad = skipLoad;
        await this.fetchAppInfo(options);
        await this.fetchProfile(options);
        await this.getWhatsAppCloudCatalogs({ appUuid: this.app.uuid });
        this.skipLoad = false;
      } catch (error) {
        let err =
          error.response?.data.error?.error_user_msg ||
          this.$t('WhatsApp.config.error.data_fetch');
        unnnic.unnnicCallAlert({
          props: {
            text: err,
            type: 'error',
          },
          seconds: 15,
        });
      }
    },
    async fetchAppInfo(options) {
      await this.getApp(options);

      if (this.errorCurrentApp) {
        throw new Error(this.errorCurrentApp);
      }
    },
    async fetchProfile(options) {
      await this.fetchWppProfile(options);

      if (this.errorWhatsAppProfile) {
        throw new Error(this.errorWhatsAppProfile);
      }

      let profile = this.whatsAppProfile;
      profile.photoFile = await dataUrlToFile(
        this.whatsAppProfile.photo_url,
        'photo.jpg',
        true,
      );
      this.appProfile = profile;
    },
  },
};
</script>

<style lang="scss" scoped>
.config-whatsapp {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: $unnnic-font-family-secondary;

  &__content {
    overflow: auto;
    display: flex;
    flex-direction: column;
    flex: 1;
    color: $unnnic-color-fg-base;
    font-size: $unnnic-font-size-body-gt;
    line-height: ($unnnic-font-size-body-gt + $unnnic-line-height-medium);
    margin: $unnnic-spacing-inset-lg;
    margin-top: 0;
  }

  &__header {
    display: flex;
    margin-bottom: $unnnic-spacing-stack-nano;
    flex-direction: column;
    margin: $unnnic-spacing-inset-lg;

    &__description {
      font-weight: $unnnic-font-weight-regular;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      color: $unnnic-color-fg-base;

      a {
        font-weight: $unnnic-font-weight-bold;
        color: $unnnic-color-fg-base;
      }
    }
  }

  &__tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: hidden;
    width: 100%;

    :deep(.tab-body) {
      display: flex;
      height: 100%;
      overflow-y: auto;
    }
    :deep(.tab-panel) {
      width: 100%;

      display: flex;
      flex-direction: column;
      height: 100%;

      > div {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    }
    :deep(.tab-header) {
      .tab-content {
        overflow-y: hidden;
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .tab-head {
        white-space: nowrap;
      }

      ::-webkit-scrollbar {
        height: $unnnic-border-width-thick;
      }
      ::-webkit-scrollbar-track {
        background: $unnnic-color-bg-muted;
      }
      ::-webkit-scrollbar-thumb {
        background: $unnnic-color-gray-7;
        border-radius: $unnnic-border-radius-md;
      }
    }

    &__template {
      display: flex;
      align-items: center;
      gap: $unnnic-spacing-inline-nano;

      .unnnic-icon {
        :deep(path) {
          fill: $unnnic-color-fg-base;
        }
      }
    }
  }
}
</style>
