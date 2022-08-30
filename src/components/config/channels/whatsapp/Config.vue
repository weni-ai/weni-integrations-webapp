<template>
  <div class="config-whatsapp">
    <div class="config-whatsapp__header">
      <div class="config-whatsapp__header__title">
        <div class="config-whatsapp__header__title__icon-container">
          <img class="config-whatsapp__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="config-whatsapp__header__title__name">{{ app.name }}</div>
      </div>
      <span class="config-whatsapp__header__description">
        {{ $t('WhatsApp.config.description.text') }}
        <a :href="documentationLink" target="_blank">
          <span>
            {{ $t('WhatsApp.config.description.link') }}
          </span>
        </a>
      </span>
    </div>

    <unnnic-tab
      v-if="!loadingWhatsAppProfile && !loadingCurrentApp"
      class="config-whatsapp__tabs"
      :tabs="configTabs"
      initialTab="account"
    >
      <template slot="tab-head-account"> {{ $t('WhatsApp.config.tabs.account') }} </template>
      <AccountTab :appInfo="currentApp" slot="tab-panel-account" @close="closeConfig" />

      <template slot="tab-head-profile"> {{ $t('WhatsApp.config.tabs.profile') }} </template>
      <ProfileTab slot="tab-panel-profile" :app="app" :profile="appProfile" @close="closeConfig" />

      <template slot="tab-head-contact_info">
        {{ $t('WhatsApp.config.tabs.contact_info') }}
      </template>
      <ContactInfoTab slot="tab-panel-contact_info" :app="app" @close="closeConfig" />

      <template slot="tab-head-conversations">
        {{ $t('WhatsApp.config.tabs.conversations') }}
      </template>
      <ConversationsTab slot="tab-panel-conversations" :app="app" @close="closeConfig" />
    </unnnic-tab>
    <skeleton-loading v-else />
  </div>
</template>

<script>
  import AccountTab from './components/tabs/AccountTab.vue';
  import ProfileTab from './components/tabs/ProfileTab.vue';
  import ContactInfoTab from './components/tabs/ContactInfoTab.vue';
  import ConversationsTab from './components/tabs/ConversationsTab.vue';
  import skeletonLoading from './loadings/Config.vue';
  import { mapActions, mapState } from 'vuex';
  import { dataUrlToFile } from '@/utils/files';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'whatsapp-config',
    components: {
      skeletonLoading,
      AccountTab,
      ProfileTab,
      ContactInfoTab,
      ConversationsTab,
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
          'pt-br': 'https://docs.weni.ai/l/pt/canais/como-verificar-o-meu-neg-cio',
        },
      };
    },
    async mounted() {
      await this.fetchData();
      this.headerScrollBehavior();
    },
    beforeDestroy() {
      this.resetWppFetchResults();
    },
    computed: {
      ...mapState('WhatsApp', [
        'whatsAppProfile',
        'loadingWhatsAppProfile',
        'errorWhatsAppProfile',
      ]),
      ...mapState({
        currentApp: (state) => state.appType.currentApp,
        loadingCurrentApp: (state) => state.appType.loadingCurrentApp,
        errorCurrentApp: (state) => state.appType.errorCurrentApp,
      }),
      configTabs() {
        return ['account', 'profile', 'contact_info', 'conversations'];
      },
      documentationLink() {
        return this.documentations[this.$i18n.locale] ?? this.documentations['en-us'];
      },
    },
    methods: {
      ...mapActions(['getApp']),
      ...mapActions('WhatsApp', ['fetchWppProfile', 'resetWppFetchResults']),
      /* istanbul ignore next */
      headerScrollBehavior() {
        const tabHeader = document.getElementsByClassName('tab-content')[0];
        if (tabHeader) {
          tabHeader.addEventListener('wheel', (event) => {
            event.preventDefault();

            tabHeader.scrollBy({
              left: event.deltaY < 0 ? -30 : 30,
            });
          });
        }
      },
      closeConfig() {
        this.$emit('closeModal');
      },
      async fetchData() {
        try {
          const options = { code: this.app.code, appUuid: this.app.uuid };
          await this.fetchAppInfo(options);
          await this.fetchProfile(options);
        } catch (error) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.error.data_fetch'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
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
        profile.photoFile = await dataUrlToFile(this.whatsAppProfile.photo_url, 'photo.jpg', true);
        this.appProfile = profile;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .config-whatsapp {
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
    height: -moz-available;
    padding: $unnnic-inset-lg;
    font-family: $unnnic-font-family-secondary;

    &__header {
      display: flex;
      margin-bottom: $unnnic-spacing-stack-nano;
      flex-direction: column;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;

          background-color: rgba(96, 190, 99, 0.2);

          &__icon {
            width: $unnnic-icon-size-md;
            margin: 0 auto;
          }
        }

        &__name {
          align-self: center;
          font-family: $unnnic-font-family-primary;
          font-weight: $unnnic-font-weight-regular;
          font-size: $unnnic-font-size-title-md;
          line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
          color: $unnnic-color-neutral-darkest;

          margin-left: $unnnic-inline-sm;
        }
      }

      &__description {
        display: flex;
        flex-wrap: wrap;

        margin-top: $unnnic-inline-sm;
        padding-bottom: $unnnic-spacing-stack-md;

        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;

        a {
          margin-left: $unnnic-inline-nano;
          font-weight: $unnnic-font-weight-bold;
          color: $unnnic-color-neutral-cloudy;
        }
      }
    }

    &__tabs {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;

      ::v-deep .tab-body {
        display: flex;
        overflow-y: auto;
        height: 100%;
      }
      ::v-deep .tab-panel {
        display: flex;
        flex-direction: column;
        width: -webkit-fill-available;
        width: -moz-available;
      }
      ::v-deep .tab-header {
        .tab-content {
          overflow-y: hidden;
          overflow-x: auto;
        }

        .tab-head {
          white-space: nowrap;
        }

        ::-webkit-scrollbar {
          height: $unnnic-border-width-thick;
        }
        ::-webkit-scrollbar-track {
          background: $unnnic-color-neutral-soft;
        }
        ::-webkit-scrollbar-thumb {
          background: $unnnic-color-neutral-clean;
          border-radius: $unnnic-border-radius-md;
        }
      }
    }
  }
</style>
