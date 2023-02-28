<template>
  <div class="webhook-info">
    <div class="webhook-info__content">
      <unnnic-input
        class="webhook-info__content__input"
        v-model="webhookUrl"
        :label="$t('WhatsApp.config.webhook_info.input.label')"
      />
    </div>

    <div class="webhook-info__buttons">
      <unnnic-button
        class="webhook-info__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('WhatsApp.config.contact_info.configure_later')"
        @click="() => this.$emit('close')"
      />

      <unnnic-button
        class="webhook-info__buttons__save"
        type="secondary"
        size="large"
        :text="$t('WhatsApp.config.contact_info.save_changes')"
        @click="saveWebhookInfo"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'WebhookTab',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        webhookUrl: this.app.config?.webhookUrl || '',
      };
    },
    methods: {
      ...mapActions({
        updateWppWebhookInfo: 'WhatsApp/updateWppWebhookInfo',
      }),

      async saveWebhookInfo() {
        try {
          const data = {
            code: this.app.code,
            appUuid: this.app.uuid,
            payload: {
              webhookUrl: this.webhookUrl,
            },
          };

          await this.updateWppWebhookInfo(data);

          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.success.webhook_update'),
              title: 'Success',
              icon: 'check-circle-1-1',
              scheme: 'feedback-green',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } catch (err) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.error.webhook_update'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 6,
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .webhook-info {
    display: flex;
    flex-direction: column;
    gap: $unnnic-inline-xs;
    flex: 1;

    &__content {
      flex: 1;
    }

    &__buttons {
      margin-top: $unnnic-spacing-stack-sm;
      display: flex;

      &__cancel,
      &__save {
        flex-grow: 1;
      }
    }
  }
</style>
