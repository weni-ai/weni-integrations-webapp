<template>
  <div class="config-whatsapp">
    <div class="config-whatsapp__header">
      <div class="config-whatsapp__header__title">
        <div class="config-whatsapp__header__title__icon-container">
          <img class="config-whatsapp__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="config-whatsapp__header__title__name">{{ app.name }}</div>
      </div>
      <div class="config-whatsapp__header__description">
        {{ $t('WhatsApp.config.description.text') }}
      </div>
    </div>

    <unnnic-tab class="config-whatsapp__tabs" :tabs="configTabs" initialTab="conversations">
      <template slot="tab-head-general"> {{ $t('WhatsApp.config.tabs.general') }} </template>
      <GeneralTab slot="tab-panel-general" @close="closeConfig" />

      <template slot="tab-head-profile"> {{ $t('WhatsApp.config.tabs.profile') }} </template>
      <ProfileTab slot="tab-panel-profile" @close="closeConfig" @save="saveConfig" />

      <template slot="tab-head-contact_info">
        {{ $t('WhatsApp.config.tabs.contact_info') }}
      </template>
      <ContactInfoTab slot="tab-panel-contact_info" />

      <template slot="tab-head-conversations">
        {{ $t('WhatsApp.config.tabs.conversations') }}
      </template>
      <ConversationsTab slot="tab-panel-conversations" :app="app" />
    </unnnic-tab>
  </div>
</template>

<script>
  import GeneralTab from './components/tabs/GeneralTab.vue';
  import ProfileTab from './components/tabs/ProfileTab.vue';
  import ContactInfoTab from './components/tabs/ContactInfoTab.vue';
  import ConversationsTab from './components/tabs/ConversationsTab.vue';

  export default {
    name: 'whatsapp-config',
    components: {
      GeneralTab,
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
      return {};
    },
    computed: {
      configTabs() {
        return ['conversations'];
      },
    },
    methods: {
      closeConfig() {
        this.$emit('closeModal');
      },
      /* istanbul ignore next */
      saveConfig() {
        console.log('saved');
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

          background-color: rgba(3, 155, 229, 0.2);

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
    }
  }
</style>
