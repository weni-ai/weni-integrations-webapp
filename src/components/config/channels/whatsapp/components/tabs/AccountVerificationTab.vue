<template>
  <section class="account-verification">
    <section v-if="isInitialLoading">
      <unnnic-skeleton-loading width="100%" height="40vh" />
    </section>

    <template v-else>
      <unnnic-disclaimer
        v-if="showDisclaimerApproved"
        type="success"
        :title="$t('WhatsApp.config.account_verification.disclaimer_verified.title')"
        :description="$t('WhatsApp.config.account_verification.disclaimer_verified.description')"
      />

      <unnnic-disclaimer
        v-else-if="showDisclaimerPending"
        type="neutral"
        :title="$t('WhatsApp.config.account_verification.disclaimer_reviewing.title')"
        :description="$t('WhatsApp.config.account_verification.disclaimer_reviewing.description')"
      />

      <unnnic-disclaimer
        v-else-if="showDisclaimerBlocked"
        type="error"
        :title="$t('WhatsApp.config.account_verification.disclaimer_limit_reached.title')"
        :description="$t('WhatsApp.config.account_verification.disclaimer_limit_reached.description')"
      />

      <unnnic-disclaimer
        v-else-if="showDisclaimerNotAvailable"
        type="attention"
        :title="$t('WhatsApp.config.account_verification.disclaimer.title')"
        :description="$t('WhatsApp.config.account_verification.disclaimer.description')"
      />

      <template v-else>
        <h3>{{ $t('WhatsApp.config.account_verification.confirm_section_title') }}</h3>

        <section class="checkboxes">
          <unnnic-checkbox
            v-model="confirmations.legalEntity"
            :textRight="$t('WhatsApp.config.account_verification.checkbox_legal_entity')"
          />
          <unnnic-checkbox
            v-model="confirmations.representative"
            :textRight="$t('WhatsApp.config.account_verification.checkbox_representative')"
          />
          <unnnic-checkbox
            v-model="confirmations.compliance"
            :textRight="$t('WhatsApp.config.account_verification.checkbox_compliance')"
          />
        </section>

        <p
          v-if="hasRejectionReasons"
          class="account-verification__rejection-reasons"
        >
          <span class="account-verification__rejection-reasons__label">
            {{ $t('WhatsApp.config.account_verification.rejection_reasons_label') }}:
          </span>
          {{ rejectionReasonsText }}
        </p>

        <h3 class="mt-6">{{ $t('WhatsApp.config.account_verification.upload_section_title') }}</h3>

        <section class="upload-documents">
          <p>{{ $t('WhatsApp.config.account_verification.upload_section_description') }}</p>

          <section
            v-for="(file, index) in documentFiles"
            :key="`${file.name}-${index}`"
            class="upload-documents__file"
          >
            <span class="upload-documents__file-name" :title="file.name">{{ file.name }}</span>

            <unnnic-button
              iconCenter="close"
              type="tertiary"
              size="small"
              class="upload-documents__file-button"
              @click="removeFile(index)"
            />
          </section>

          <input
            ref="fileInput"
            type="file"
            class="upload-documents__input"
            accept=".pdf,.jpeg,.jpg,.png,application/pdf,image/jpeg,image/png"
            multiple
            @change="handleFileInputChange"
          />

          <unnnic-button
            iconLeft="add"
            type="secondary"
            size="large"
            @click="openFilePicker"
          >
            {{ $t('WhatsApp.config.account_verification.upload_files') }}
          </unnnic-button>

          <unnnic-disclaimer
            type="informational"
            :title="$t('WhatsApp.config.account_verification.suggested_documents.title')"
          >
            <template #description>
              <ul>
                <li>{{ $t('WhatsApp.config.account_verification.suggested_documents.item_registration') }}</li>
                <li>{{ $t('WhatsApp.config.account_verification.suggested_documents.item_articles') }}</li>
                <li>{{ $t('WhatsApp.config.account_verification.suggested_documents.item_tax') }}</li>
              </ul>

              <span>{{ $t('WhatsApp.config.account_verification.supported_file_types') }}</span>
            </template>
          </unnnic-disclaimer>

          <a
            href="https://www.facebook.com/business/help/2058515294227817?id=180505742745347"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ $t('WhatsApp.config.account_verification.documentation_link') }}
          </a>
        </section>

        <footer>
          <unnnic-button type="secondary" size="large" @click="handleCancel">
            {{ $t('general.Cancel') }}
          </unnnic-button>

          <unnnic-button
            type="primary"
            size="large"
            :disabled="!canSend"
            :loading="submittingAccountVerification"
            @click="handleSend"
          >
            {{ $t('WhatsApp.config.account_verification.send') }}
          </unnnic-button>
        </footer>
      </template>
    </template>
  </section>
</template>

<script>
  import unnnic from '@weni/unnnic-system';
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import { getLastNDaysRange } from '@/utils/dates';

  const USAGE_THRESHOLD = 50;
  const CONVERSATION_DAYS_RANGE = 90;
  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
  const ALLOWED_FILE_EXTENSIONS = ['pdf', 'jpeg', 'jpg', 'png'];

  export default {
    name: 'AccountVerificationTab',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => ({}),
      },
    },
    data() {
      return {
        confirmations: {
          legalEntity: false,
          representative: false,
          compliance: false,
        },
        documentFiles: [],
        conversationTemplates: {},
        conversationsLoaded: false,
        verificationLoaded: false,
      };
    },
    computed: {
      ...mapState(whatsapp_cloud, [
        'accountVerification',
        'loadingAccountVerification',
        'errorAccountVerification',
        'submittingAccountVerification',
        'errorSubmitAccountVerification',
      ]),
      ...mapState(whatsapp_store, ['loadingConversations', 'errorConversations']),
      uiState() {
        return this.accountVerification?.ui_state ?? 'not_started';
      },
      conversationsSum() {
        const data = this.conversationTemplates;
        return (
          (data.MARKETING || 0) +
          (data.MARKETING_LITE || 0) +
          (data.UTILITY || 0) +
          (data.AUTHENTICATION || 0)
        );
      },
      serviceTemplatesCount() {
        return this.conversationTemplates?.SERVICE || 0;
      },
      meetsUsageThreshold() {
        return (
          this.conversationsSum >= USAGE_THRESHOLD ||
          this.serviceTemplatesCount >= USAGE_THRESHOLD
        );
      },
      showDisclaimerApproved() {
        return this.uiState === 'approved';
      },
      showDisclaimerPending() {
        return this.uiState === 'pending';
      },
      showDisclaimerBlocked() {
        return this.uiState === 'blocked';
      },
      showDisclaimerNotAvailable() {
        const eligibleStates = ['not_started', 'failed'];
        return eligibleStates.includes(this.uiState) && !this.meetsUsageThreshold;
      },
      hasRejectionReasons() {
        return this.uiState === 'failed' && this.accountVerification?.rejection_reasons?.length > 0;
      },
      rejectionReasonsText() {
        return (this.accountVerification?.rejection_reasons || []).join(', ');
      },
      allConfirmationsChecked() {
        return (
          this.confirmations.legalEntity &&
          this.confirmations.representative &&
          this.confirmations.compliance
        );
      },
      canSubmitFromApi() {
        return this.accountVerification?.can_submit !== false;
      },
      canSend() {
        return (
          this.allConfirmationsChecked &&
          this.documentFiles.length >= 1 &&
          !this.submittingAccountVerification &&
          this.canSubmitFromApi
        );
      },
      isInitialLoading() {
        return (
          this.loadingAccountVerification ||
          this.loadingConversations ||
          (!this.verificationLoaded && !this.errorAccountVerification) ||
          (!this.conversationsLoaded && !this.errorConversations)
        );
      },
    },
    watch: {
      'app.uuid': {
        immediate: true,
        handler() {
          if (this.app?.uuid) {
            this.loadData();
          }
        },
      },
    },
    methods: {
      ...mapActions(whatsapp_cloud, ['fetchAccountVerification', 'submitAccountVerification']),
      ...mapActions(whatsapp_store, ['getConversations']),
      async loadData() {
        this.verificationLoaded = false;
        this.conversationsLoaded = false;

        const { start, end } = getLastNDaysRange(CONVERSATION_DAYS_RANGE);

        await Promise.all([
          this.fetchVerification(),
          this.fetchConversations({ start, end }),
        ]);
      },
      async fetchVerification() {
        await this.fetchAccountVerification({ appUuid: this.app.uuid });
        this.verificationLoaded = true;

        if (this.errorAccountVerification) {
          const err =
            this.errorAccountVerification?.error_user_msg ||
            this.$t('WhatsApp.config.account_verification.fetch_error');
          unnnic.unnnicCallAlert({
            props: { text: err, type: 'error' },
            seconds: 6,
          });
        }
      },
      async fetchConversations({ start, end }) {
        await this.getConversations({
          code: this.app.code,
          appUuid: this.app.uuid,
          params: { start, end },
        });
        this.conversationsLoaded = true;

        if (this.errorConversations) {
          this.conversationTemplates = {};
          return;
        }

        const store = whatsapp_store();
        this.conversationTemplates = store.whatsAppConversations?.templates || {};
      },
      openFilePicker() {
        this.$refs.fileInput?.click();
      },
      handleFileInputChange(event) {
        const selectedFiles = Array.from(event.target.files || []);
        event.target.value = '';

        if (!selectedFiles.length) {
          return;
        }

        const validFiles = [];

        selectedFiles.forEach((file) => {
          if (!this.isAllowedFile(file)) {
            this.showFileAlert('WhatsApp.config.account_verification.invalid_file_type');
            return;
          }

          if (file.size > MAX_FILE_SIZE_BYTES) {
            this.showFileAlert('WhatsApp.config.account_verification.file_too_large');
            return;
          }

          const isDuplicate = this.documentFiles.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified,
          );

          if (!isDuplicate) {
            validFiles.push(file);
          }
        });

        if (validFiles.length) {
          this.documentFiles = [...this.documentFiles, ...validFiles];
        }
      },
      isAllowedFile(file) {
        const extension = file.name.split('.').pop()?.toLowerCase();
        return ALLOWED_FILE_EXTENSIONS.includes(extension);
      },
      removeFile(index) {
        this.documentFiles = this.documentFiles.filter((_, fileIndex) => fileIndex !== index);
      },
      showFileAlert(translationKey) {
        unnnic.unnnicCallAlert({
          props: { text: this.$t(translationKey), type: 'error' },
          seconds: 6,
        });
      },
      handleCancel() {
        this.resetForm();
      },
      resetForm() {
        this.confirmations = {
          legalEntity: false,
          representative: false,
          compliance: false,
        };
        this.documentFiles = [];

        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      },
      async handleSend() {
        if (!this.canSend) {
          return;
        }

        try {
          await this.submitAccountVerification({
            appUuid: this.app.uuid,
            documents: this.documentFiles,
          });

          unnnic.unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.account_verification.submit_success'),
              type: 'success',
            },
            seconds: 6,
          });
          this.resetForm();
        } catch {
          const err =
            this.errorSubmitAccountVerification?.error_user_msg ||
            this.$t('WhatsApp.config.account_verification.submit_error');
          unnnic.unnnicCallAlert({
            props: { text: err, type: 'error' },
            seconds: 6,
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .account-verification {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__rejection-reasons {
      font: $unnnic-font-body;
      color: $unnnic-color-fg-base;
      margin: 0 0 $unnnic-space-4;

      &__label {
        font-weight: $unnnic-font-weight-semibold;
      }
    }
  }

  h3 {
    font: $unnnic-font-display-3;
    line-height: 1.5;
    margin: 0;
    margin-bottom: $unnnic-space-4;
    color: $unnnic-color-fg-base;
    font-weight: $unnnic-font-weight-semibold;
  }

  ul {
    margin: 0;
    padding-left: $unnnic-space-5;
    margin-bottom: $unnnic-space-4;
  }

  .checkboxes {
    display: flex;
    flex-direction: column;
    gap: $unnnic-space-4;
  }

  .mt-6 {
    margin-top: $unnnic-space-6;
  }

  .upload-documents {
    display: flex;
    flex-direction: column;
    gap: $unnnic-space-2;

    p {
      margin: 0;
      font: $unnnic-font-body;
      color: $unnnic-color-fg-base;
    }

    &__input {
      display: none;
    }

    &__file {
      display: flex;
      align-items: center;
      gap: $unnnic-space-2;
      justify-content: space-between;
      border: 1px solid $unnnic-color-border-base;
      border-radius: $unnnic-border-radius-md;
      padding: $unnnic-space-3;
    }

    &__file-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font: $unnnic-font-body;
      color: $unnnic-color-fg-base;
    }

    &__file-button {
      flex-shrink: 0;
      margin: -$unnnic-space-2;
    }
  }

  a {
    font: $unnnic-font-body;
    color: $unnnic-color-fg-base;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $unnnic-space-2;
    margin-top: auto;
    padding-top: $unnnic-space-6;
  }
</style>
