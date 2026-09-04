<template>
  <div class="account-tab">
    <div class="account-tab__content">
      <UnnnicDisclaimer
        v-if="showBrlBillingDisclaimer"
        class="account-tab__content__brl-disclaimer"
        type="informational"
        :title="$t('WhatsApp.config.billing.brl_disclaimer.title')"
        :description="
          $t('WhatsApp.config.billing.brl_disclaimer.description', {
            migrationDate: brlMigrationDate,
          })
        "
      />

      <section
        v-if="isProjectWithVoiceCalling"
        :class="[
          'account-tab__voice-calling',
          {
            'account-tab__voice-calling--disabled': updatingVoiceCallingStatus,
          },
        ]"
      >
        <UnnnicSwitch
          v-model="voiceCallingEnabled"
          :textRight="$t('WhatsApp.config.account.config.voice_calling.label')"
          @update:model-value="handleVoiceCallingChange"
        />
      </section>

      <section class="account-tab__content__section">
        <section class="account-tab__content__section__title">
          {{ $t('WhatsApp.config.manage_content') }}
        </section>

        <section class="account-tab__content__templates__buttons">
          <UnnnicButton
            type="secondary"
            @click="navigateToTemplates"
          >
            {{ $t('WhatsApp.config.templates.button') }}
          </UnnnicButton>

          <UnnnicButton
            v-if="hasCatalog || hasVtexCatalogConnected"
            ref="catalogButton"
            type="secondary"
            @click="handleCatalogButtonClick"
          >
            {{ $t('WhatsApp.config.catalog.button') }}
          </UnnnicButton>
        </section>
      </section>

      <section
        v-for="(section, index) in accountSections"
        :key="index"
        class="account-tab__content__section"
      >
        <section class="account-tab__content__section__title">
          {{ $t(`WhatsApp.config.${section.name}.title`) }}
        </section>

        <section class="account-tab__content__section__fields">
          <div
            v-for="(field, i) in section.fields"
            :key="i"
            class="account-tab__content__section__fields__field"
          >
            <div class="account-tab__content__section__fields__field__key">
              {{ $t(field.label) }}
            </div>
            <div class="account-tab__content__section__fields__field__value">
              <template v-if="field.name === 'phone_number'">
                <span>{{ field.value }}</span>
                <div
                  class="account-tab__content__section__fields__field__actions"
                >
                  <UnnnicButton
                    class="account-tab__content__section__fields__field__copy"
                    type="tertiary"
                    size="small"
                    iconCenter="content_copy"
                    @click="copyPhoneNumber"
                  />
                  <UnnnicButton
                    class="account-tab__content__section__fields__field__open"
                    type="tertiary"
                    size="small"
                    iconCenter="arrow_outward"
                    @click="openWAUrl"
                  />
                </div>
              </template>
              <template v-else>
                {{ field.value }}
              </template>
            </div>
          </div>
        </section>
      </section>

      <div class="account-tab__content__mmlite">
        <UnnnicButton
          v-if="!activeMMLite"
          class="account-tab__content__mmlite__button"
          :loading="loadingMMLite"
          :disabled="inProgressMMLite"
          type="secondary"
          size="small"
          @click="enableMMLite"
        >
          <template v-if="mmliteStatus === 'in_progress'">
            {{ $t('WhatsApp.config.mmlite.button_updating') }}
          </template>
          <template v-else>
            {{ $t('WhatsApp.config.mmlite.button') }}
          </template>
        </UnnnicButton>

        <UnnnicDisclaimer
          v-if="activeMMLite"
          class="account-tab__content__mmlite__disclaimer"
          :title="$t('WhatsApp.config.mmlite.disclaimer')"
          type="neutral"
        />
      </div>
    </div>

    <UnnnicDialog
      class="catalog-modal"
      :open="showCreateCatalogModal || showConnectCatalogModal"
      @update:open="handleCatalogDialogOpenUpdate"
    >
      <UnnnicDialogContent
        size="large"
        @interact-outside.prevent
      >
        <UnnnicDialogHeader :closeButton="false">
          <UnnnicDialogTitle>
            {{
              showCreateCatalogModal
                ? $t('whatsapp.create_catalog.title')
                : $t('vtex.connect_catalog.title')
            }}
          </UnnnicDialogTitle>
        </UnnnicDialogHeader>

        <CreateCatalogModalContent
          v-if="showCreateCatalogModal"
          ref="createCatalogModalContent"
          @close-modal="showCreateCatalogModal = false"
          @create-catalog="handleCatalogCreateModalContinue"
        />

        <ConnectCatalogModalContent
          v-if="showConnectCatalogModal"
          ref="connectCatalogModalContent"
          :loading="loadingConnectVtexCatalog"
          @close-modal="showConnectCatalogModal = false"
          @connect-catalog="handleCatalogConnect"
        />

        <UnnnicDialogFooter>
          <UnnnicButton
            type="tertiary"
            :text="$t('general.Cancel')"
            @click="closeCatalogDialog"
          />
          <UnnnicButton
            v-if="showCreateCatalogModal"
            :text="$t('general.continue')"
            @click="submitCreateCatalog"
          />
          <UnnnicButton
            v-else
            :text="$t('general.continue')"
            :loading="loadingConnectVtexCatalog"
            @click="submitConnectCatalog"
          />
        </UnnnicDialogFooter>
      </UnnnicDialogContent>
    </UnnnicDialog>
  </div>
</template>

<script>
import CreateCatalogModalContent from '../CreateCatalogModalContent.vue';
import ConnectCatalogModalContent from '../../../../ecommerce/vtex/ConnectCatalogModalContent.vue';
import { mapActions, mapState } from 'pinia';
import unnnic, { unnnicToastManager } from '@weni/unnnic-system';
import { app_type } from '@/stores/modules/appType/appType.store';
import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
import { whatsapp_cloud } from '@/stores/modules/appType/channels/whatsapp_cloud.store';
import { auth_store } from '@/stores/modules/auth.store';
import { my_apps } from '@/stores/modules/myApps.store';
import { initFacebookSdk } from '@/utils/plugins/fb';
import getEnv from '@/utils/env';

export default {
  name: 'AccountTab',
  components: {
    CreateCatalogModalContent,
    ConnectCatalogModalContent,
  },
  props: {
    appInfo: {
      type: Object,
      default: /* istanbul ignore next */ () => {},
    },
    hasCatalog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      voiceCallingEnabled: false,
      loadingMMLite: false,
      showCreateCatalogModal: false,
      showConnectCatalogModal: false,
      vtexApp: null,
      localMMLiteStatus: null,
    };
  },
  async mounted() {
    this.voiceCallingEnabled = this.appInfo?.config?.has_calling === true;

    window.changeMMLiteLoadingState = this.changeMMLiteLoadingState;
    window.setMMLiteToInProgress = this.setMMLiteToInProgress;

    await this.fetchVtexApp();
  },
  methods: {
    ...mapActions(my_apps, ['getConfiguredApps']),
    ...mapActions(ecommerce_store, ['connectVtexCatalog']),
    ...mapActions(whatsapp_cloud, [
      'updateMMLiteStatus',
      'changeVoiceCallingStatus',
    ]),
    emitClose() {
      this.$emit('close');
    },
    fieldHandler(field) {
      return field ?? `-`;
    },
    /* istanbul ignore next */
    openWAUrl() {
      window.open(this.WAUrl, '_blank').focus();
    },
    async copyPhoneNumber() {
      try {
        await navigator.clipboard.writeText(
          this.phoneNumber.display_phone_number,
        );
        unnnicToastManager.success(this.$t('apps.config.copy_success'));
      } catch {
        unnnicToastManager.error(this.$t('apps.config.copy_error'));
      }
    },
    navigateToTemplates() {
      const { code, uuid } = this.appInfo;
      this.$router.push({ path: `/apps/my/${code}/${uuid}/templates` });
    },
    handleCatalogButtonClick() {
      const { code, uuid } = this.appInfo;
      this.$router.push({ path: `/apps/my/${code}/${uuid}/catalogs` });
    },
    handleCatalogDialogOpenUpdate(open) {
      if (!open) {
        this.closeCatalogDialog();
      }
    },
    closeCatalogDialog() {
      this.showCreateCatalogModal = false;
      this.showConnectCatalogModal = false;
    },
    submitCreateCatalog() {
      this.$refs.createCatalogModalContent?.createCatalog();
    },
    submitConnectCatalog() {
      this.$refs.connectCatalogModalContent?.connectCatalog();
    },
    handleCatalogCreateModalContinue(type) {
      if (type === 'vtex') {
        this.showCreateCatalogModal = false;
        this.showConnectCatalogModal = true;
      } else if (type === 'meta') {
        window
          .open(
            `https://business.facebook.com/settings/product-catalogs?business_id=${this.appInfo.config.wa_business_id}`,
            '_blank',
          )
          .focus();

        this.showCreateCatalogModal = false;
        this.showConnectCatalogModal = false;
      }
    },
    async handleCatalogConnect(eventData) {
      if (!this.vtexApp) {
        this.callAlert({
          type: 'Error',
          text: this.$t('WhatsApp.config.catalog.error.missing_vtex_app'),
        });
        return;
      }

      const data = {
        code: this.appInfo.code,
        appUuid: this.appInfo.uuid,
        payload: {
          catalog_id: eventData.name,
        },
      };

      await this.connectVtexCatalog(data);

      if (this.errorConnectVtexCatalog) {
        this.callAlert({
          type: 'error',
          text: this.$t('vtex.errors.connect_catalog'),
        });
        return;
      }

      this.showConnectCatalogModal = false;
      this.callAlert({
        type: 'success',
        text: this.$t('vtex.success.connect_catalog'),
      });

      await this.fetchVtexApp();
    },
    async fetchVtexApp() {
      if (!this.configuredApps || !this.configuredApps?.length) {
        const params = {
          project_uuid: this.project,
        };
        await this.getConfiguredApps({ params, skipLoading: true });

        if (!this.configuredApps) return;
      }

      this.vtexApp = this.configuredApps.find((app) => app.code === 'vtex');
    },
    callAlert({ text, type }) {
      unnnic.unnnicCallAlert({
        props: {
          text: text,
          type: type,
        },
        seconds: 6,
      });
    },
    changeMMLiteLoadingState(state) {
      this.loadingMMLite = state;
    },
    async setMMLiteToInProgress() {
      await this.updateMMLiteStatus({
        appUuid: this.appInfo.uuid,
        data: {
          status: 'in_progress',
        },
      });

      this.$emit('updateApp');
      this.localMMLiteStatus = 'in_progress';

      setTimeout(() => {
        this.$emit('updateApp');
      }, 10000);
    },
    async enableMMLite() {
      const fbAppId = getEnv('WHATSAPP_FACEBOOK_APP_ID');
      const configId = getEnv('WHATSAPP_MMLITE_CONFIG_ID');

      const embeddedCallback = () => {
        this.changeMMLiteLoadingState(true);

        /* eslint-disable-next-line no-undef */
        FB.login(
          function (response) {
            this.changeMMLiteLoadingState(false);
            if (response.authResponse && response.authResponse.code) {
              this.setMMLiteToInProgress();
            }
          },
          {
            config_id: configId,
            response_type: 'code',
            override_default_response_type: true,
            extras: {
              sessionInfoVersion: '3',
              features: [
                {
                  name: 'marketing_messages_lite',
                },
              ],
              version: 'v2',
            },
          },
        );
      };

      initFacebookSdk(fbAppId, embeddedCallback);
    },

    async handleVoiceCallingChange(isEnabling) {
      const action = isEnabling ? 'enabled' : 'disabled';

      let successText = this.$t(
        `WhatsApp.config.account.config.voice_calling.feedback.${action}.success`,
      );
      let defaultErrorText = this.$t(
        `WhatsApp.config.account.config.voice_calling.feedback.${action}.error`,
      );

      try {
        await this.changeVoiceCallingStatus({
          appUuid: this.appInfo.uuid,
          data: { isEnabled: isEnabling },
        });
        this.callAlert({ type: 'success', text: successText });
      } catch (error) {
        this.callAlert({
          type: 'error',
          text: this.errorVoiceCallingStatus || defaultErrorText,
        });
        this.voiceCallingEnabled = !isEnabling;
      }
    },
  },
  computed: {
    ...mapState(auth_store, ['project']),
    ...mapState(whatsapp_cloud, [
      'updatingVoiceCallingStatus',
      'errorVoiceCallingStatus',
    ]),
    ...mapState(app_type, ['configuredApps']),
    ...mapState(ecommerce_store, [
      'loadingConnectVtexCatalog',
      'errorConnectVtexCatalog',
    ]),
    WAUrl() {
      const cleanNumber = this.phoneNumber.display_phone_number?.replace(
        /\D/g,
        '',
      );
      return `https://wa.me/${cleanNumber}`;
    },
    phoneNumber() {
      return this.appInfo?.config?.phone_number ?? {};
    },
    wabaInfo() {
      return this.appInfo?.config?.waba ?? {};
    },
    appConfig() {
      return (
        this.appInfo?.config ?? {
          phone_number: {},
          certificate: null,
          default_template_language: null,
          consent_status: null,
        }
      );
    },
    brlMigrationIsoDate() {
      return this.appInfo?.config?.currency_migration?.migration_date || '';
    },
    showBrlBillingDisclaimer() {
      const migration = this.appInfo?.config?.currency_migration;
      if (!migration || typeof migration !== 'object') {
        return false;
      }

      if (!migration.migration_date || !migration.old_waba_id) {
        return false;
      }

      const migrationTime = new Date(migration.migration_date).getTime();
      if (Number.isNaN(migrationTime)) return false;

      const elapsedMs = Date.now() - migrationTime;
      const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

      return elapsedMs >= 0 && elapsedMs <= thirtyDaysMs;
    },
    brlMigrationDate() {
      const iso = this.brlMigrationIsoDate;
      if (!iso) return '';

      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '';

      return new Intl.DateTimeFormat(this.$i18n.locale, {
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC',
        year: 'numeric',
      }).format(date);
    },
    hasVtexCatalogConnected() {
      return this.vtexApp?.config?.connected_catalog ?? false;
    },
    inProgressMMLite() {
      if (this.localMMLiteStatus === 'in_progress') return true;

      if (!this.appInfo?.config?.mmlite_status) return false;

      return this.appInfo?.config?.mmlite_status === 'in_progress';
    },
    activeMMLite() {
      if (this.localMMLiteStatus === 'in_progress') return false;

      if (!this.appInfo?.config?.mmlite_status) return false;

      return this.appInfo?.config?.mmlite_status === 'active';
    },
    mmliteStatus() {
      if (this.localMMLiteStatus === 'in_progress') return 'in_progress';

      if (!this.appInfo?.config?.mmlite_status) return 'inactive';

      return this.appInfo?.config?.mmlite_status;
    },
    accountSections() {
      return [
        {
          name: 'channel',
          status: 'green',
          fields: [
            {
              type: 'text',
              name: 'phone_number',
              label: 'WhatsApp.config.channel.fields.phone_number',
              value: this.fieldHandler(this.phoneNumber.display_phone_number),
            },
            {
              type: 'text',
              name: 'whatsapp_display_name',
              label: 'WhatsApp.config.channel.fields.whatsapp_display_name',
              value: this.fieldHandler(this.phoneNumber.display_name),
            },
            {
              type: 'text',
              name: 'default_language_for_templates',
              label:
                'WhatsApp.config.channel.fields.default_language_for_templates',
              value: this.fieldHandler(
                this.appConfig.default_template_language,
              ),
            },
            {
              type: 'text',
              name: 'certificate',
              label: 'WhatsApp.config.channel.fields.certificate',
              value: this.appConfig.certificate ?? 'N/A',
            },
            {
              type: 'text',
              name: 'consent_status',
              label: 'WhatsApp.config.channel.fields.consent_status',
              value: this.fieldHandler(this.appConfig.consent_status),
            },
          ],
        },
        {
          name: 'business_account',
          status: 'yellow',
          fields: [
            {
              type: 'text',
              name: 'waba_name',
              label: 'WhatsApp.config.business_account.fields.waba_name',
              value: this.fieldHandler(this.wabaInfo.name),
            },
            {
              type: 'text',
              name: 'waba_id',
              label: 'WhatsApp.config.business_account.fields.waba_id',
              value: this.fieldHandler(this.wabaInfo.id),
            },
            {
              type: 'text',
              name: 'message_on_behalf_of',
              label:
                'WhatsApp.config.business_account.fields.message_on_behalf_of',
              value: this.fieldHandler(this.wabaInfo.message_behalf_name),
            },
            {
              type: 'text',
              name: 'timezone_id',
              label: 'WhatsApp.config.business_account.fields.timezone_id',
              value: this.fieldHandler(this.wabaInfo.timezone),
            },
            {
              type: 'text',
              name: 'namespace',
              label: 'WhatsApp.config.business_account.fields.namespace',
              value: this.fieldHandler(this.wabaInfo.namespace),
            },
          ],
        },
      ];
    },

    isProjectWithVoiceCalling() {
      const projectsWithVoiceCalling = String(
        getEnv('PROJECTS_WITH_VOICE_CALLING'),
      ).split(',');
      return projectsWithVoiceCalling.includes(this.project);
    },
  },
};
</script>

<style lang="scss" scoped>
.account-tab {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__voice-calling {
    margin-bottom: $unnnic-space-4;

    &--disabled {
      pointer-events: none;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-space-6;
    padding-right: $unnnic-spacing-inline-md;
    margin-top: $unnnic-space-4;
    overflow-x: hidden;
    flex: 1;

    &__brl-disclaimer {
      min-height: auto;
    }

    &__section {
      display: flex;
      flex-direction: column;
      gap: $unnnic-space-3;

      &__title {
        font: $unnnic-font-display-3;
        color: $unnnic-color-fg-emphasized;
      }

      &__fields {
        display: flex;
        flex-direction: column;
        gap: $unnnic-space-1;

        &__field {
          display: flex;
          gap: $unnnic-space-6;

          &__key,
          &__value,
          &__edit {
            flex: 1;
            width: 50%;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
            color: $unnnic-color-fg-base;
            margin: auto 0;
            word-wrap: anywhere;
          }

          &__key {
            font: $unnnic-font-emphasis;
            color: $unnnic-color-fg-emphasized;
          }

          &__value {
            display: inline-flex;
            align-items: center;
            gap: $unnnic-space-2;
          }

          &__actions {
            display: inline-flex;
            align-items: center;
            gap: $unnnic-space-05;
          }

          &__edit {
            display: inline-flex;
            gap: $unnnic-spacing-inline-xs;
            align-items: center;

            &__input {
              height: 29px;
              max-width: 70%;

              :deep(.input) {
                height: 29px;
              }
            }
          }
        }
      }
    }

    &__templates {
      &__buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(12.5rem, 1fr));
        gap: $unnnic-space-3;
      }
    }

    &__mmlite {
      display: flex;

      &__button {
        width: 100%;
      }

      &__disclaimer {
        width: 100%;
      }
    }
  }

  &__close-button {
    margin-top: $unnnic-spacing-stack-lg;
  }
}
</style>
