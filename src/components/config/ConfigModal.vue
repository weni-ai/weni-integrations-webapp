<template>
  <div>
    <UnnnicDrawerNext
      v-if="show"
      :open="show"
      size="large"
      @update:open="onDrawerOpenChange"
    >
      <UnnnicDrawerContent size="large">
        <UnnnicDrawerHeader>
          <UnnnicDrawerTitle>
            <div class="config-drawer__title">
              <img
                v-if="showHeaderIcon"
                class="config-drawer__title__icon"
                :src="headerIcon"
                alt=""
              />
              <span>{{ headerTitle }}</span>
            </div>
          </UnnnicDrawerTitle>
        </UnnnicDrawerHeader>
        <div class="config-drawer__body">
          <component
            :is="currentComponent"
            class="config-drawer__component"
            :app="currentApp"
            :isConfigured="isConfigured"
            @close-modal="closeModal"
            @set-confirmation="setConfirmation"
          />
        </div>
      </UnnnicDrawerContent>
    </UnnnicDrawerNext>

    <UnnnicDialog
      ref="unnnic-confirmation-modal"
      class="config-confirmation-dialog"
      :open="showConfirmationModal"
      @update:open="handleConfirmationOpenUpdate"
    >
      <UnnnicDialogContent size="medium">
        <UnnnicDialogHeader type="attention">
          <UnnnicDialogTitle>
            {{ $t('apps.config.confirmation.title') }}
          </UnnnicDialogTitle>
        </UnnnicDialogHeader>

        <section
          class="config-confirmation-dialog__description"
          v-html="$t('apps.config.confirmation.description')"
        />

        <UnnnicDialogFooter>
          <UnnnicDialogClose>
            <UnnnicButton
              ref="unnnic-remove-modal-close-button"
              type="tertiary"
              :text="$t('apps.config.confirmation.goBackToConfig')"
            />
          </UnnnicDialogClose>
          <UnnnicButton
            ref="unnnic-remove-modal-navigate-button"
            type="primary"
            :text="$t('general.confirm')"
            @click="confirmClose()"
          />
        </UnnnicDialogFooter>
      </UnnnicDialogContent>
    </UnnnicDialog>
  </div>
</template>

<script>
import wwcConfig from '@/components/config/channels/WWC/Config.vue';
import telegramConfig from '@/components/config/channels/telegram/Config.vue';
import wppDemoPreview from '@/components/config/channels/wpp_demo/Preview.vue';
import whatsappConfig from '@/components/config/channels/whatsapp/Config.vue';
import genericTypeConfig from '@/components/config/channels/generic/Config.vue';
import instagramConfig from '@/components/config/channels/instagram/Config.vue';
import facebookConfig from '@/components/config/channels/facebook/Config.vue';
import omieConfig from '@/components/config/external/omie/Config.vue';
import chatGptConfig from '@/components/config/external/chatgpt/Config.vue';
import vtexConfig from '@/components/config/ecommerce/vtex/Config.vue';
import emailConfig from '@/components/config/channels/email/Config.vue';
import { getAppDisplayName, WHATSAPP_CODES } from '@/utils/apps';
import { markRaw } from 'vue';
import {
  UnnnicDrawerNext,
  UnnnicDrawerContent,
  UnnnicDrawerHeader,
  UnnnicDrawerTitle,
} from '@weni/unnnic-system';

const CODES_WITHOUT_HEADER_ICON = [...WHATSAPP_CODES, 'wwc'];

export default {
  name: 'Modal',
  components: {
    UnnnicDrawerNext,
    UnnnicDrawerContent,
    UnnnicDrawerHeader,
    UnnnicDrawerTitle,
  },
  emits: ['close'],
  data() {
    return {
      show: false,
      type: '',
      currentApp: {},
      isConfigured: false,
      showConfirmationModal: false,
      needConfirmation: false,
      componentMapping: markRaw({
        wwc: wwcConfig,
        tg: telegramConfig,
        wpp: whatsappConfig,
        'wpp-cloud': whatsappConfig,
        'wpp-demo': wppDemoPreview,
        ig: instagramConfig,
        fba: facebookConfig,
        omie: omieConfig,
        chatgpt: chatGptConfig,
        vtex: vtexConfig,
        email: emailConfig,
      }),
    };
  },
  computed: {
    currentComponent() {
      return this.componentMapping[this.type] || genericTypeConfig;
    },
    isGenericApp() {
      return !this.componentMapping[this.type];
    },
    showHeaderIcon() {
      if (CODES_WITHOUT_HEADER_ICON.includes(this.type)) {
        return false;
      }
      return Boolean(this.headerIcon);
    },
    headerIcon() {
      if (this.isGenericApp) {
        return this.currentApp.config?.channel_icon_url;
      }
      return this.currentApp.icon;
    },
    headerTitle() {
      if (this.isGenericApp) {
        return this.currentApp.config?.channel_name || this.currentApp.name;
      }
      return getAppDisplayName(this.currentApp, this.$t.bind(this));
    },
  },
  methods: {
    onDrawerOpenChange(open) {
      if (open) {
        this.show = true;
        return;
      }
      this.closeModal();
    },
    closeModal() {
      if (this.needConfirmation) {
        this.showConfirmationModal = true;
        return;
      }
      this.show = false;
      this.$emit('close');
    },
    openModal({ app, isConfigured }) {
      this.type = app.code;
      this.currentApp = app;
      this.isConfigured = isConfigured;
      this.show = true;
    },
    setConfirmation(value) {
      this.needConfirmation = value;
    },
    handleConfirmationOpenUpdate(open) {
      if (!open) {
        this.showConfirmationModal = false;
      }
    },
    toggleConfirmationModal() {
      this.showConfirmationModal = !this.showConfirmationModal;
    },
    confirmClose() {
      this.needConfirmation = false;
      this.showConfirmationModal = false;
      this.show = false;
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.config-drawer {
  &__title {
    display: flex;
    align-items: center;
    gap: $unnnic-inline-sm;

    &__icon {
      width: $unnnic-icon-size-md;
      height: $unnnic-icon-size-md;
      object-fit: contain;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: auto;
  }

  &__component {
    height: 100%;
  }
}

.config-confirmation-dialog {
  &__description {
    padding: $unnnic-space-4;
    color: $unnnic-color-fg-base;
  }
}
</style>
