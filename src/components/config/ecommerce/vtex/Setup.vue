<template>
  <unnnic-modal class="vtex-modal" @close="closePopUp" @click.stop :closeIcon="false">
    <div slot="message" class="vtex-modal__content">
      <StepIndicator :steps="['vtex.setup.step1', 'vtex.setup.step2']" :currentStep="currentStep" />

      <div v-if="currentStep == 0">
        <header class="vtex-modal__header">
          <span class="vtex-modal__header__title">
            {{ $t('vtex.setup.title') }}
          </span>
          <span class="vtex-modal__header__description">
            {{ $t('vtex.setup.description') }}
          </span>
        </header>

        <div class="vtex-modal__content__form">
          <div>
            <unnnic-label :label="$t('vtex.setup.whatsapp_channel')" />
            <unnnic-select-smart
              v-if="!loadingChannels"
              ref="whatsappChannelSelect"
              v-model="selectedChannel"
              :options="whatsappChannels"
            />
            <unnnic-skeleton-loading v-else tag="div" width="100%" height="42px" />
          </div>

          <unnnic-input
            class="vtex-modal__content__form__input"
            v-model="storeDomain"
            :label="$t('vtex.setup.storeDomain')"
            :placeholder="$t('vtex.setup.storedomain_placeholder')"
          />

          <unnnic-input
            class="vtex-modal__content__form__input"
            v-model="apiDomain"
            :label="$t('vtex.setup.apiSubdomain')"
            :placeholder="$t('vtex.setup.subdomain_placeholder')"
          />

          <div class="vtex-modal__content__form__keys">
            <unnnic-input
              class="vtex-modal__content__form__input"
              v-model="appKey"
              :label="$t('vtex.setup.appKey')"
              :placeholder="$t('vtex.setup.appKey_placeholder')"
            />

            <unnnic-input
              class="vtex-modal__content__form__input"
              v-model="appToken"
              :label="$t('vtex.setup.appToken')"
              :placeholder="$t('vtex.setup.appToken_placeholder')"
            />
          </div>

          <span class="vtex-modal__content__form__guide">
            {{ $t('vtex.setup.guide.question') }}
            <a
              href="https://help.vtex.com/en/tutorial/application-keys--2iffYzlvvz4BDMr6WGUtet"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ $t('vtex.setup.guide.link') }}
            </a>
            {{ $t('vtex.setup.guide.question_end') }}
          </span>
        </div>
      </div>

      <div v-if="currentStep == 1" slot="message" class="vtex-modal__content">
        <header class="vtex-modal__header">
          <span class="vtex-modal__header__title">
            {{ $t('vtex.setup.affiliate_title') }}
          </span>
          <span class="vtex-modal__header__description">
            {{ $t('vtex.setup.affiliate_description') }}
          </span>
        </header>

        <div class="vtex-modal__content__section_wrapper">
          <section class="vtex-modal__content__section">
            <span class="vtex-modal__content__section__number">1</span>
            <div class="vtex-modal__content__section__content">
              <span class="vtex-modal__content__section__content__title">
                {{ $t('vtex.setup.affiliate_step1.title') }}
              </span>
              <p
                class="vtex-modal__content__section__content__description"
                v-html="$t('vtex.setup.affiliate_step1.description')"
              ></p>
            </div>
          </section>

          <section class="vtex-modal__content__section">
            <span class="vtex-modal__content__section__number">2</span>
            <div class="vtex-modal__content__section__content">
              <span class="vtex-modal__content__section__content__title">
                {{ $t('vtex.setup.affiliate_step2.title') }}
              </span>
              <p
                class="vtex-modal__content__section__content__description"
                v-html="$t('vtex.setup.affiliate_step2.description')"
              ></p>
            </div>
          </section>

          <section class="vtex-modal__content__section">
            <span class="vtex-modal__content__section__number">3</span>
            <div class="vtex-modal__content__section__content">
              <span class="vtex-modal__content__section__content__title">
                {{ $t('vtex.setup.affiliate_step3.title') }}
              </span>
              <p
                class="vtex-modal__content__section__content__description"
                v-html="$t('vtex.setup.affiliate_step3.description')"
              ></p>
            </div>
          </section>

          <section class="vtex-modal__content__section">
            <span class="vtex-modal__content__section__number">4</span>
            <div class="vtex-modal__content__section__content">
              <span class="vtex-modal__content__section__content__title">
                {{ $t('vtex.setup.affiliate_step4.title') }}
              </span>
              <p
                class="vtex-modal__content__section__content__description"
                v-html="$t('vtex.setup.affiliate_step4.description')"
              ></p>

              <div class="vtex-modal__content__section__content__url-wrapper">
                <unnnic-input
                  class="vtex-vtex-modal__content__section__content__url-input"
                  :value="webhookUrl"
                />

                <unnnic-button
                  ref="vtex-copy-button"
                  class="vtex-modal__content__section__content__url-wrapper__button"
                  type="secondary"
                  iconLeft="content_copy"
                  text="Copiar"
                  @click="copyWebhookUrl"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <unnnic-button
      ref="unnnic-vtex-modal-close-button"
      slot="options"
      type="tertiary"
      @click="closePopUp"
    >
      {{ $t('general.Cancel') }}
    </unnnic-button>
    <unnnic-button
      ref="unnnic-vtex-modal-setup-button"
      slot="options"
      type="primary"
      @click="continueSetup"
      :loading="loadingCreateApp"
    >
      {{ $t('general.continue') }}
    </unnnic-button>
  </unnnic-modal>
</template>

<script>
  import { mapState, mapActions } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { my_apps } from '@/stores/modules/myApps.store';
  import { auth_store } from '@/stores/modules/auth.store';
  import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
  import alert from '@/utils/call';
  import StepIndicator from '../../../StepIndicator.vue';
  import getEnv from '../../../../utils/env';

  export default {
    name: 'VtexModal',
    components: {
      StepIndicator,
    },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        storeDomain: '',
        apiDomain: '',
        whatsappChannels: [],
        selectedChannel: [],
        loadingChannels: true,
        appKey: null,
        appToken: null,
        currentStep: 0,
      };
    },
    mounted() {
      this.getWhatsAppChannels();
      this.getVtexAppUuid({ code: this.app.code });
    },
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(my_apps, ['configuredApps', 'errorConfiguredApps']),
      ...mapState(app_type, ['loadingCreateApp', 'errorCreateApp']),
      ...mapState(ecommerce_store, ['generatedVtexAppUuid', 'errorVtexAppUuid']),
      webhookUrl() {
        const backendUrl = getEnv('VUE_APP_API_BASE_URL');
        return `${backendUrl}/api/v1/webhook/vtex/${this.generatedVtexAppUuid}/products-update/api/notification/`;
      },
    },
    methods: {
      ...mapActions(app_type, ['createApp', 'getConfiguredApps']),
      ...mapActions(ecommerce_store, ['getVtexAppUuid']),
      closePopUp() {
        this.$emit('closePopUp');
      },
      continueSetup() {
        if (this.currentStep === 0) {
          if (
            !this.storeDomain.trim() ||
            !this.apiDomain.trim() ||
            !this.appKey.trim() ||
            !this.appToken.trim()
          ) {
            this.callModal({ type: 'error', text: this.$t('vtex.setup.error_missing_fields') });
            return;
          }
          this.currentStep = 1;
          return;
        }
        this.setupVtex();
      },
      async setupVtex() {
        const data = {
          code: this.app.code,
          payload: {
            project_uuid: this.project,
            domain: this.apiDomain.trim(),
            store_domain: this.storeDomain.trim(),
            app_key: this.appKey.trim(),
            app_token: this.appToken.trim(),
            wpp_cloud_uuid: this.selectedChannel[0].value,
            uuid: this.generatedVtexAppUuid,
          },
        };

        await this.createApp(data);

        if (this.errorCreateApp) {
          if (
            this.errorCreateApp.response.status === 400 &&
            this.errorCreateApp.response.data.detail === 'The credentials provided are invalid.'
          ) {
            this.callModal({ type: 'error', text: this.$t('vtex.setup.invalid_credentials') });
            return;
          }
          this.callModal({ type: 'error', text: this.$t('vtex.setup.error') });
          return;
        }

        this.callModal({ type: 'success', text: this.$t('vtex.setup.success') });
        this.$emit('closePopUp');
        this.$router.push({ name: 'Apps' });
      },
      async getWhatsAppChannels() {
        this.loadingChannels = true;
        const params = {
          project_uuid: this.project,
        };
        await this.getConfiguredApps({ params });

        if (this.errorConfiguredApps) {
          this.callModal({
            type: 'error',
            text: this.$t('apps.myApps.error.configured'),
          });
          this.closePopUp();
          return;
        }
        this.whatsappChannels = this.configuredApps
          .filter((app) => app.code === 'wpp-cloud')
          .map((wppChannel) => {
            return {
              label: `${wppChannel.config.wa_verified_name} - (${wppChannel.config.title})`,
              value: wppChannel.uuid,
            };
          });

        if (this.whatsappChannels.length === 1) {
          this.selectedChannel = [this.whatsappChannels[0]];
        }

        this.loadingChannels = false;
      },
      async copyWebhookUrl() {
        navigator.clipboard.writeText(this.webhookUrl);
        alert.callAlert({
          props: {
            text: this.$t('apps.config.copy_success'),
            type: 'success',
          },
          seconds: 3,
        });
      },
      callModal({ text, type }) {
        alert.callAlert({
          props: {
            text,
            type,
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .vtex-modal {
    ::v-deep {
      .unnnic-modal-container-background {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 0 $unnnic-spacing-md;
        max-height: 95vh;
        cursor: auto;
        box-shadow: none;
        width: 750px;
      }
      .unnnic-modal-container-background-body {
        border-radius: $unnnic-border-radius-sm $unnnic-border-radius-sm 0px 0px;
      }

      .unnnic-modal-container-background-body-title {
        padding-bottom: $unnnic-spacing-xs;
      }

      .unnnic-modal-container-background-body-description-container {
        padding-bottom: $unnnic-spacing-xs;
      }
    }

    &__header {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-xs;
      text-align: left;
      margin-top: $unnnic-spacing-md;
      margin-bottom: $unnnic-spacing-sm;

      &__title {
        color: $unnnic-color-neutral-darkest;
        font-size: $unnnic-font-size-title-sm;
        font-weight: $unnnic-font-weight-black;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;

      &__title {
        font-family: $unnnic-font-family-secondary;
        color: $unnnic-color-neutral-darkest;
        font-weight: $unnnic-font-weight-black;
        font-size: $unnnic-font-size-title-sm;
        line-height: ($unnnic-font-size-title-sm + $unnnic-line-height-medium);
        margin-bottom: $unnnic-spacing-stack-xs;
      }

      &__description {
        margin-bottom: $unnnic-spacing-stack-md;
      }

      &__form {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-sm;
        text-align: left;

        &__keys {
          display: inline-flex;
          flex: 1;
          gap: $unnnic-spacing-sm;

          .unnnic-form {
            flex: 1;
          }
        }

        &__guide {
          color: $unnnic-color-neutral-cloudy;
          font-size: $unnnic-font-size-body-gt;
          line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;

          a {
            color: $unnnic-color-neutral-cloudy;
            font-weight: $unnnic-font-weight-bold;
            text-decoration-line: underline;
          }
        }
      }

      &__section_wrapper {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-sm;
      }

      &__section {
        display: flex;
        text-align: left;
        flex: 1;
        gap: $unnnic-spacing-stack-xs;

        &__number {
          display: flex;
          min-width: 31px;
          min-height: 31px;
          max-width: 31px;
          max-height: 31px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          border-radius: $unnnic-border-radius-pill;
          background: $unnnic-color-weni-200;
        }

        &__content {
          display: flex;
          flex-direction: column;
          gap: $unnnic-spacing-stack-nano;
          margin-top: 2px;

          &__title {
            color: $unnnic-color-neutral-darkest;
            font-size: $unnnic-font-size-body-lg;
            font-weight: $unnnic-font-weight-bold;
            line-height: $unnnic-line-height-md + $unnnic-font-size-body-lg;
          }

          &__description {
            margin: unset;
            color: $unnnic-color-neutral-dark;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

            ::v-deep {
              .highlight {
                color: $unnnic-color-neutral-dark;
                border-radius: $unnnic-border-radius-sm;
                background: $unnnic-color-neutral-soft;
                padding: 2px $unnnic-spacing-nano;
              }

              ul {
                margin: unset;
                padding: unset;

                padding-left: 20px;
              }
            }
          }

          &__url-wrapper {
            display: flex;
            gap: $unnnic-spacing-xs;
            align-items: center;

            &__button {
              min-width: 110px;
            }
          }
        }
      }
    }
  }
</style>
