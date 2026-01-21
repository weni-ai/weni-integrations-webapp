<template>
  <div class="account-tab">
    <div class="account-tab__content">
      <section
        v-if="isProjectWithVoiceCalling"
        :class="[
          'account-tab__voice-calling',
          { 'account-tab__voice-calling--disabled': updatingVoiceCallingStatus },
        ]"
      >
        <unnnic-switch
          v-model="voiceCallingEnabled"
          :textRight="$t('WhatsApp.config.account.config.voice_calling.label')"
          @update:modelValue="handleVoiceCallingChange"
        />
      </section>

      <div class="account-tab__content__info">
        <div class="account-tab__content__info__templates">
          <div class="account-tab__content__info__templates__buttons">
            <div class="account-tab__content__info__templates__buttons__title">
              {{ $t('WhatsApp.config.templates.title') }}
            </div>

            <unnnic-button
              class="account-tab__content__info__templates__buttons__button"
              @click="navigateToTemplates"
              type="secondary"
              size="small"
              scheme="feedback-green"
            >
              {{ $t('WhatsApp.config.templates.button') }}
            </unnnic-button>
          </div>
          <div
            v-if="hasCatalog || hasVtexCatalogConnected"
            class="account-tab__content__info__templates__buttons"
          >
            <div class="account-tab__content__info__templates__buttons__title">
              {{ $t('WhatsApp.config.catalog.title') }}
            </div>

            <unnnic-button
              ref="catalogButton"
              class="account-tab__content__info__templates__buttons__button"
              @click="handleCatalogButtonClick"
              type="primary"
              size="small"
            >
              {{ $t('WhatsApp.config.catalog.button') }}
            </unnnic-button>
          </div>
        </div>

        <div class="account-tab__content__info__qr">
          <div class="account-tab__content__info__qr__title">
            {{ $t('WhatsApp.config.qr.title') }}
          </div>
          <div class="account-tab__content__info__qr__wrapper">
            <img class="account-tab__content__info__qr__img" :src="QRCodeUrl" />

            <div class="account-tab__content__info__qr__content">
              <span class="account-tab__content__info__qr__content__info">{{
                $t('WhatsApp.config.qr.info')
              }}</span>
              <unnnic-button
                class="account-tab__content__info__qr__content__button"
                type="secondary"
                :text="$t('WhatsApp.config.qr.button')"
                iconLeft="export-1"
                size="small"
                @click="openWAUrl"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        v-for="(section, index) in accountSections"
        :key="index"
        class="account-tab__content__section"
      >
        <div class="account-tab__content__section__title">
          <span class="account-tab__content__section__title__name">
            {{ $t(`WhatsApp.config.${section.name}.title`) }}
          </span>
        </div>

        <div
          v-for="(field, i) in section.fields"
          :key="i"
          class="account-tab__content__section__field"
        >
          <div class="account-tab__content__section__field__key">
            {{ $t(field.label) }}
          </div>
          <div class="account-tab__content__section__field__value">
            {{ field.value }}
          </div>
        </div>
      </div>

      <div class="account-tab__content__mmlite">
        <unnnic-button
          v-if="!activeMMLite"
          class="account-tab__content__mmlite__button"
          @click="enableMMLite"
          :loading="loadingMMLite"
          :disabled="inProgressMMLite"
          type="secondary"
          size="small"
        >
          <template v-if="mmliteStatus === 'in_progress'">
            {{ $t('WhatsApp.config.mmlite.button_updating') }}
          </template>
          <template v-else>
            {{ $t('WhatsApp.config.mmlite.button') }}
          </template>
        </unnnic-button>

        <unnnic-disclaimer
          v-if="activeMMLite"
          class="account-tab__content__mmlite__disclaimer"
          :text="$t('WhatsApp.config.mmlite.disclaimer')"
          icon="alert-circle-1"
        />
      </div>
    </div>

    <unnnic-modal
      v-if="showCreateCatalogModal || showConnectCatalogModal"
      class="catalog-modal"
      @close="showCreateCatalogModal = false"
      :closeIcon="false"
      @click.stop
    >
      <CreateCatalogModalContent
        ref="createCatalogModalContent"
        v-if="showCreateCatalogModal"
        @closeModal="showCreateCatalogModal = false"
        @createCatalog="handleCatalogCreateModalContinue"
      />

      <ConnectCatalogModalContent
        v-if="showConnectCatalogModal"
        :loading="loadingConnectVtexCatalog"
        @closeModal="showConnectCatalogModal = false"
        @connectCatalog="handleCatalogConnect"
      />
    </unnnic-modal>
  </div>
</template>

<script>
  import CreateCatalogModalContent from '../CreateCatalogModalContent.vue';
  import ConnectCatalogModalContent from '../../../../ecommerce/vtex/ConnectCatalogModalContent.vue';
  import { mapActions, mapState } from 'pinia';
  import unnnic from '@weni/unnnic-system';
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
    async mounted() {
      this.voiceCallingEnabled = this.appInfo?.config?.has_calling === true;

      window.changeMMLiteLoadingState = this.changeMMLiteLoadingState;
      window.setMMLiteToInProgress = this.setMMLiteToInProgress;

      await this.fetchVtexApp();
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
    methods: {
      ...mapActions(my_apps, ['getConfiguredApps']),
      ...mapActions(ecommerce_store, ['connectVtexCatalog']),
      ...mapActions(whatsapp_cloud, ['updateMMLiteStatus', 'changeVoiceCallingStatus']),
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
      navigateToTemplates() {
        const { code, uuid } = this.appInfo;
        this.$router.push({ path: `/apps/my/${code}/${uuid}/templates` });
      },
      handleCatalogButtonClick() {
        const { code, uuid } = this.appInfo;
        this.$router.push({ path: `/apps/my/${code}/${uuid}/catalogs` });
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
          this.callAlert({ type: 'error', text: this.$t('vtex.errors.connect_catalog') });
          return;
        }

        this.showConnectCatalogModal = false;
        this.callAlert({ type: 'success', text: this.$t('vtex.success.connect_catalog') });

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
          this.callAlert({ type: 'error', text: this.errorVoiceCallingStatus || defaultErrorText });
          this.voiceCallingEnabled = !isEnabling;
        }
      },
    },
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(whatsapp_cloud, ['updatingVoiceCallingStatus', 'errorVoiceCallingStatus']),
      ...mapState(app_type, ['configuredApps']),
      ...mapState(ecommerce_store, ['loadingConnectVtexCatalog', 'errorConnectVtexCatalog']),
      QRCodeUrl() {
        return `https://api.qrserver.com/v1/create-qr-code/?size=74x74&data=${encodeURI(
          this.WAUrl,
        )}`;
      },
      WAUrl() {
        const cleanNumber = this.phoneNumber.display_phone_number?.replace(/\D/g, '');
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
                label: 'WhatsApp.config.channel.fields.default_language_for_templates',
                value: this.fieldHandler(this.appConfig.default_template_language),
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
                name: 'message_on_behalf_of',
                label: 'WhatsApp.config.business_account.fields.message_on_behalf_of',
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
                name: 'waba_id',
                label: 'WhatsApp.config.business_account.fields.waba_id',
                value: this.fieldHandler(this.wabaInfo.id),
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
        const projectsWithVoiceCalling = String(getEnv('PROJECTS_WITH_VOICE_CALLING')).split(',');
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
      margin-bottom: $unnnic-spacing-stack-sm;

      &--disabled {
        pointer-events: none;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      padding-right: $unnnic-spacing-inline-md;
      margin-top: $unnnic-spacing-stack-sm;
      overflow-x: hidden;
      flex: 1;

      &__info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: $unnnic-spacing-stack-lg;

        &__templates {
          display: flex;
          justify-content: space-between;
          gap: $unnnic-spacing-stack-sm;

          &__buttons {
            width: 100%;

            &__title {
              font-weight: $unnnic-font-weight-bold;
              font-size: $unnnic-font-size-body-lg;
              line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
              color: $unnnic-color-neutral-darkest;
              margin-bottom: $unnnic-spacing-sm;
            }
            &__button {
              width: 100%;
            }
          }
        }

        &__qr {
          &__wrapper {
            display: flex;
            gap: $unnnic-spacing-inline-sm;
          }

          &__title {
            font-weight: $unnnic-font-weight-black;
            font-size: $unnnic-font-size-body-lg;
            line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
            color: $unnnic-color-neutral-darkest;

            margin-bottom: $unnnic-spacing-stack-sm;
          }

          &__content {
            display: flex;
            flex-direction: column;
            width: 100%;
            justify-content: space-between;

            &__info {
              font-size: $unnnic-font-size-body-gt;
              line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
              color: $unnnic-color-neutral-cloudy;
            }
          }
        }
      }

      &__section {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-inline-sm;

        &__title {
          display: flex;
          margin-bottom: $unnnic-spacing-stack-nano;
          margin-top: $unnnic-spacing-stack-lg;
          gap: $unnnic-inline-xs;

          &__name {
            font-weight: $unnnic-font-weight-black;
            font-size: $unnnic-font-size-body-lg;
            line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
            color: $unnnic-color-neutral-darkest;
          }
        }

        &__field {
          display: inline-flex;

          &__key,
          &__value,
          &__edit {
            flex: 1;
            width: 50%;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
            color: $unnnic-color-neutral-cloudy;
            margin: auto 0;
            word-wrap: anywhere;
          }

          &__edit {
            display: inline-flex;
            gap: $unnnic-spacing-inline-xs;
            align-items: center;

            &__input {
              height: 29px;
              max-width: 70%;

              ::v-deep .input {
                height: 29px;
              }
            }
          }
        }
      }

      &__mmlite {
        display: flex;
        margin-top: $unnnic-spacing-stack-lg;

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

  .catalog-modal {
    ::v-deep .unnnic-modal-container-background {
      width: 750px;
      max-width: 90%;
    }
  }
</style>
