<template>
  <div class="webhook-info">
    <div class="webhook-info__content">
      <div class="webhook-info__content__inline">
        <div>
          <unnnic-label :label="$t('WhatsApp.config.webhook_info.method.label')" />
          <unnnic-select-smart
            class="webhook-info__content__method"
            v-model="selectedMethod"
            :options="methodsList"
          />
        </div>
        <unnnic-input
          class="webhook-info__content__url"
          v-model="webhookUrl"
          ref="webhookUrl"
          placeholder="URL"
          :label="$t('WhatsApp.config.webhook_info.input.label')"
          :type="validUrl ? 'normal' : 'error'"
          nativeType="url"
          pattern="https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)"
        />
      </div>

      <div>
        <unnnic-label :label="$t('WhatsApp.config.webhook_info.headers.label')" />
        <div class="webhook-info__content__headers-container">
          <div
            class="webhook-info__content__headers-element"
            v-for="(header, index) in headers"
            :key="index"
          >
            <unnnic-input
              class="webhook-info__content__headers-element--key"
              @update:modelValue="($event) => handleHeaderKeyChange(index, $event)"
              :placeholder="$t('WhatsApp.config.webhook_info.header_key.placeholder')"
              :modelValue="header.key"
            />
            <unnnic-input
              class="webhook-info__content__headers-element--value"
              @update:modelValue="($event) => handleHeaderValueChange(index, $event)"
              :placeholder="$t('WhatsApp.config.webhook_info.header_value.placeholder')"
              :modelValue="header.value"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="webhook-info__buttons">
      <unnnic-button
        class="webhook-info__buttons__cancel"
        type="tertiary"
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
        :loading="loadingUpdateWebhookInfo"
      />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import unnnic from '@weni/unnnic-system';

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
        webhookUrl: this.app.config?.webhook?.url || '',
        selectedMethod: [],
        headers: [],
        methodsList: [
          {
            value: 'GET',
            label: 'GET',
          },
          {
            value: 'POST',
            label: 'POST',
          },
          {
            value: 'PUT',
            label: 'PUT',
          },
          {
            value: 'PATCH',
            label: 'PATCH',
          },
          {
            value: 'DELETE',
            label: 'DELETE',
          },
        ],
        validUrl: true,
      };
    },
    /* istanbul ignore next */
    mounted() {
      if (this.app.config?.webhook?.method) {
        this.selectedMethod = [
          { value: this.app.config?.webhook?.method, label: this.app.config?.webhook?.method },
        ];
      }
      this.mountHeaders();

      if (!this.hasEmptyHeader()) {
        this.createEmptyHeader();
      }
    },
    /* istanbul ignore next */
    updated() {
      this.removeExtraEmptyHeader();

      if (!this.hasEmptyHeader()) {
        this.createEmptyHeader();
      }

      const urlInput = this.getUrlInputElement();
      if (urlInput !== undefined) {
        this.validUrl = this.checkURLValidity(urlInput);
      }
    },
    computed: {
      ...mapState(whatsapp_store, ['loadingUpdateWebhookInfo', 'errorUpdateWebhookInfo']),
    },
    methods: {
      ...mapActions(whatsapp_store, ['updateWppWebhookInfo']),
      /* istanbul ignore next */
      mountHeaders() {
        if (this.app.config?.webhook?.headers) {
          this.headers = Object.keys(this.app.config.webhook.headers).map((header) => {
            return { key: header, value: this.app.config.webhook.headers[header] };
          });
        }
      },
      /* istanbul ignore next */
      getUrlInputElement() {
        let urlInput;
        urlInput = this.$refs.webhookUrl?.modelValue || '';

        return urlInput;
      },
      hasEmptyHeader() {
        return this.headers.find((header) => {
          if (!header.key.trim() || !header.value.trim()) {
            return true;
          }
        });
      },
      removeExtraEmptyHeader() {
        let count = 0;
        let firstEmpty;
        this.headers.forEach((header, index) => {
          if (!header.key.trim() && !header.value.trim()) {
            count += 1;
            if (firstEmpty === undefined) {
              firstEmpty = index;
            }
          }
        });

        if (count > 1) {
          this.headers.splice(firstEmpty, 1);
        }
      },
      createEmptyHeader() {
        this.headers.push({ key: '', value: '' });
      },
      handleHeaderKeyChange(index, event) {
        this.headers[index].key = event;
      },
      handleHeaderValueChange(index, event) {
        this.headers[index].value = event;
      },
      buildHeadersPayload() {
        const result = {};

        this.headers.forEach((header) => {
          if (header.key.trim() && header.value.trim()) {
            result[header.key] = header.value;
          }
        });

        return result;
      },
      async saveWebhookInfo() {
        const urlInput = this.getUrlInputElement();
        if (!this.checkURLValidity(urlInput)) {
          this.callModal({
            type: 'error',
            text: this.$t('WhatsApp.config.error.invalid_url'),
          });
          return;
        }

        const headers = this.buildHeadersPayload();

        const data = {
          code: this.app.code,
          appUuid: this.app.uuid,
          payload: {
            config: {
              webhook: {
                url: this.webhookUrl,
                method: this.selectedMethod,
                headers,
              },
            },
          },
        };

        await this.updateWppWebhookInfo(data);

        if (this.errorUpdateWebhookInfo) {
          const err =
            this.errorUpdateWebhookInfo?.error_user_msg ||
            this.$t('WhatsApp.config.error.webhook_update');
          this.callModal({
            type: 'error',
            text: err,
          });

          return;
        }

        this.callModal({
          type: 'error',
          text: this.$t('WhatsApp.config.success.webhook_update'),
        });

        this.$root.$emit('updateGrid');
      },

      checkURLValidity(value) {
        const urlRegex = /^(https?:\/\/)?(www\.)?([^\s/$.?#].[^\s]*)$/i;

        return urlRegex.test(value);
      },
      callModal({ text, type }) {
        unnnic.unnnicCallAlert({
          props: {
            text: text,
            type: type,
          },
          seconds: 6,
        });
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
    margin-top: $unnnic-spacing-inline-xs;

    &__content {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: $unnnic-spacing-stack-md;

      &__inline {
        display: flex;
        gap: $unnnic-spacing-inline-sm;
      }

      &__method {
        min-width: 170px;
        width: 25%;
      }

      &__url {
        flex: 1;
      }

      &__headers-container {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-inline-sm;
      }

      &__headers-element {
        display: flex;
        flex: 1;
        gap: $unnnic-spacing-inline-sm;

        &--key,
        &--value {
          flex: 1;
        }
      }
    }

    &__buttons {
      margin-top: $unnnic-spacing-stack-sm;
      display: flex;
      gap: $unnnic-spacing-inline-sm;

      &__cancel,
      &__save {
        flex-grow: 1;
      }
    }
  }
</style>
