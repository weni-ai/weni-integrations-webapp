<template>
  <div class="whatsapp-templates-header">
    <div class="whatsapp-templates-header__wrapper">
      <span class="whatsapp-templates-header__title">
        {{ $t('WhatsApp.templates.table.header.title') }}
      </span>
      <span class="whatsapp-templates-header__description">
        {{ $t('WhatsApp.templates.table.header.description') }}
      </span>
    </div>
    <div class="whatsapp-templates-header__actions">
      <UnnnicToolTip
        class="whatsapp-templates-header__sync-button-wrapper"
        :text="syncCooldownTooltip"
        :enabled="isSyncOnCooldown"
        side="top"
        maxWidth="15rem"
      >
        <UnnnicButton
          class="whatsapp-templates-header__sync-button"
          type="tertiary"
          iconLeft="refresh"
          :loading="loadingSyncWhatsAppTemplates"
          :disabled="isSyncOnCooldown"
          @click="syncTemplates"
        >
          {{ $t('WhatsApp.templates.table.sync_templates') }}
        </UnnnicButton>
      </UnnnicToolTip>
      <UnnnicButton
        class="whatsapp-templates-header__button"
        type="secondary"
        @click="navigateToCreateTemplate"
      >
        {{ $t('WhatsApp.templates.table.new_template') }}
      </UnnnicButton>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia';
import unnnic from '@weni/unnnic-system';
import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';

const TEMPLATES_SYNC_COOLDOWN_MS = 60 * 60 * 1000;
const REMAINING_TICK_MS = 60 * 1000;

export default {
  name: 'TableHeader',
  data() {
    return {
      nowMs: Date.now(),
      remainingTickId: null,
    };
  },
  computed: {
    ...mapState(whatsapp_store, [
      'templatesLastSyncedAt',
      'loadingSyncWhatsAppTemplates',
      'errorSyncWhatsAppTemplates',
    ]),
    remainingMs() {
      if (!this.templatesLastSyncedAt) {
        return 0;
      }
      const lastSyncedMs = Date.parse(this.templatesLastSyncedAt);
      if (Number.isNaN(lastSyncedMs)) {
        return 0;
      }
      return Math.max(
        0,
        lastSyncedMs + TEMPLATES_SYNC_COOLDOWN_MS - this.nowMs,
      );
    },
    isSyncOnCooldown() {
      return this.remainingMs > 0;
    },
    remainingMinutes() {
      return Math.max(1, Math.ceil(this.remainingMs / 60000));
    },
    syncCooldownTooltip() {
      return this.$t(
        'WhatsApp.templates.table.sync_templates_cooldown_tooltip',
        {
          remaining: this.remainingMinutes,
        },
      );
    },
  },
  mounted() {
    this.fetchSyncStatus();
    this.remainingTickId = setInterval(() => {
      this.nowMs = Date.now();
    }, REMAINING_TICK_MS);
  },
  beforeUnmount() {
    if (this.remainingTickId) {
      clearInterval(this.remainingTickId);
    }
  },
  methods: {
    ...mapActions(whatsapp_store, [
      'getWhatsAppTemplatesSyncStatus',
      'syncWhatsAppTemplates',
    ]),
    fetchSyncStatus() {
      const { appUuid } = this.$route.params;
      if (!appUuid) {
        return;
      }
      this.getWhatsAppTemplatesSyncStatus({ appUuid });
    },
    navigateToCreateTemplate() {
      const { appCode, appUuid } = this.$route.params;
      this.$router.push({
        path: `/apps/my/${appCode}/${appUuid}/templates/create`,
      });
    },
    async syncTemplates() {
      if (this.isSyncOnCooldown || this.loadingSyncWhatsAppTemplates) {
        return;
      }
      const { appUuid } = this.$route.params;
      await this.syncWhatsAppTemplates({ appUuid });
      this.nowMs = Date.now();

      if (this.errorSyncWhatsAppTemplates) {
        unnnic.unnnicCallAlert({
          props: {
            text: this.$t('WhatsApp.templates.error.sync_templates'),
            type: 'error',
          },
          seconds: 8,
        });
        return;
      }

      unnnic.unnnicCallAlert({
        props: {
          text: this.$t('WhatsApp.templates.success.sync_templates'),
          type: 'success',
        },
        seconds: 8,
      });
      this.$emit('templates-synced');
    },
  },
};
</script>

<style lang="scss" scoped>
.whatsapp-templates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: $unnnic-spacing-stack-md 0;
  margin-bottom: $unnnic-spacing-stack-lg;

  &__wrapper {
    display: flex;
    flex-direction: column;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $unnnic-space-2;
  }

  &__sync-button-wrapper {
    display: inline-block;
  }

  &__button {
    width: 255px;
  }

  &__title {
    font-family: $unnnic-font-family-primary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-title-sm;
    line-height: $unnnic-line-height-md + $unnnic-font-size-title-sm;
    color: $unnnic-color-fg-emphasized;
  }

  &__description {
    font-family: $unnnic-font-family-secondary;
    font-weight: $unnnic-font-weight-regular;
    font-size: $unnnic-font-size-body-gt;
    line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
    color: $unnnic-color-fg-emphasized;
  }
}
</style>
