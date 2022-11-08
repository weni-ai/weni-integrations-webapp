<template>
  <div class="app-preview-wpp_demo">
    <div class="app-preview-wpp_demo__header">
      <div class="app-preview-wpp_demo__header__title">
        <div class="app-preview-wpp_demo__header__title__icon-container">
          <img class="app-preview-wpp_demo__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="app-preview-wpp_demo__header__title__name">{{ app.name }}</div>
      </div>
      <div class="app-preview-wpp_demo__header__description">
        {{ $t('WhatsAppDemo.preview.description') }}
      </div>
    </div>

    <div class="app-preview-wpp_demo__settings__content">
      <div class="app-preview-wpp_demo__settings__content__qr">
        <img :src="QRCodeUrl" />
      </div>

      <unnnic-data-area :text="url">
        <unnnic-button
          slot="buttons"
          class="app-preview-wpp_demo__settings__content__button"
          type="primary"
          size="large"
          iconCenter="export-1"
          @click="openWppLink"
        ></unnnic-button>
      </unnnic-data-area>

      <unnnicMultiSelect
        v-if="!dataProcessLoading"
        ref="flowSelector"
        class="app-preview-wpp_demo__settings__content__flow-select"
        :groups="flowGroups"
        @change="handleFlowChange"
        :hideGroupTitle="true"
        :inputTitle="selectTitle"
        :unselectable="true"
      />
      <unnnic-skeleton-loading
        v-else
        class="app-preview-wpp_demo__settings__content__flow-select"
        tag="div"
        width="100%"
        height="3rem"
      />
    </div>

    <div class="app-preview-wpp_demo__settings__buttons">
      <unnnic-button
        class="app-preview-wpp_demo__settings__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('apps.config.cancel')"
        @click="closePreview"
      />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'wpp-demo-preview',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        url: this.app.config.redirect_url ?? null,
        selectTitle: '',
        flowGroups: [],
        dataProcessLoading: true,
      };
    },
    async created() {
      await this.getFlowGroups();
    },
    computed: {
      ...mapState({
        currentApp: (state) => state.appType.currentApp,
        errorCurrentApp: (state) => state.appType.errorCurrentApp,
        errorUpdateApp: (state) => state.appType.errorUpdateApp,
      }),
      QRCodeUrl() {
        return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURI(
          this.url,
        )}`;
      },
    },
    methods: {
      ...mapActions(['getApp', 'updateApp']),
      closePreview() {
        this.$emit('closeModal');
      },
      /* istanbul ignore next */
      copyUrl() {
        navigator.clipboard.writeText(this.url);

        unnnicCallAlert({
          props: {
            text: this.$t('apps.config.copy_success'),
            title: 'Success',
            icon: 'check-circle-1-1',
            scheme: 'feedback-green',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 3,
        });
      },
      /* istanbul ignore next */
      openWppLink() {
        window.open(this.app.config.redirect_url, '_blank');
      },
      async getFlowGroups() {
        this.dataProcessLoading = true;
        await this.getApp({ code: this.app.code, appUuid: this.app.uuid });

        if (this.errorCurrentApp) {
          this.callErrorModal({ text: this.$t('WhatsAppDemo.preview.errors.fetch_app') });
          return;
        }

        if (!this.currentApp.flows_starts) {
          this.callErrorModal({
            text: this.$t('WhatsAppDemo.preview.errors.missing_trigger_data'),
          });
          return;
        }

        const items = this.currentApp.flows_starts.map((flow) => {
          let isSelected = -1;
          if (this.currentApp.config.flows_starts) {
            isSelected = this.currentApp.config.flows_starts.findIndex((configured_flow) => {
              return configured_flow.uuid === flow.uuid;
            });
          }

          return {
            selected: isSelected !== -1 ? 0 : -1,
            items: [
              {
                ...flow,
                title: flow.name,
              },
            ],
          };
        });

        const selectedQuantity = this.selectedQuantity(items);
        this.selectTitle = selectedQuantity
          ? `${selectedQuantity} ${this.$t('WhatsAppDemo.preview.flows_selected')}`
          : this.$t('WhatsAppDemo.preview.select_flow');

        this.flowGroups = items;
        this.dataProcessLoading = false;
      },
      async handleFlowChange(event) {
        const selectedQuantity = this.selectedQuantity(event);
        if (selectedQuantity > 3) {
          this.callErrorModal({
            text: this.$t('WhatsAppDemo.preview.errors.max_flow_selected'),
          });
          return;
        }

        this.flowGroups = event;
        this.selectTitle = `${selectedQuantity} ${this.$t('WhatsAppDemo.preview.flows_selected')}`;

        await this.updateFlows();
      },
      updateFlows: debounce(async function () {
        const result = {
          code: this.currentApp.code,
          appUuid: this.currentApp.uuid,
          payload: {
            flows_starts: this.flowGroups.flatMap((group) => {
              if (group.selected === 0) {
                return group.items;
              }
              return [];
            }),
          },
        };

        await this.updateApp(result);

        if (this.errorUpdateApp) {
          this.callErrorModal({ text: this.$t('WhatsAppDemo.preview.errors.update_app') });
          return;
        }

        this.callSuccessModal({ text: this.$t('WhatsAppDemo.preview.success.update_app') });
        this.$refs.flowSelector.active = false;
      }, 750),
      selectedQuantity(flows) {
        return flows.reduce((acc, group) => {
          return acc + +(group.selected != -1);
        }, 0);
      },
      callErrorModal({ text }) {
        unnnicCallAlert({
          props: {
            text: text,
            title: 'Error',
            icon: 'alert-circle-1',
            scheme: 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },
      callSuccessModal({ text }) {
        unnnicCallAlert({
          props: {
            text,
            title: 'Success',
            icon: 'check-circle-1-1',
            scheme: 'feedback-green',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 8,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .app-preview-wpp_demo {
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
    height: -moz-available;
    padding: $unnnic-inset-lg;
    flex: 1;

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

          background: rgba(209, 252, 201, 0.8);

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

        font-family: $unnnic-font-family-secondary;
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;
      }
    }

    &__settings {
      display: flex;
      flex-direction: column;
      height: -webkit-fill-available;
      height: -moz-available;
      overflow-y: hidden;

      &__content {
        padding-right: $unnnic-spacing-inline-xs;
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: auto;

        &__qr {
          align-self: center;
          margin: $unnnic-spacing-stack-sm 0;
        }

        &__input {
          margin-top: $unnnic-spacing-stack-xs;

          &__subtitle {
            margin-top: $unnnic-spacing-stack-nano/2;
          }

          &__payload {
            flex: 1;
            margin-top: $unnnic-spacing-stack-xs;

            ::v-deep .unnnic-form-input {
              margin-top: $unnnic-spacing-stack-xs;
            }
          }
        }

        &__flow-select {
          margin-top: $unnnic-spacing-stack-md;
          width: 100%;
          max-width: unset;
        }
      }
      &__buttons {
        padding-right: $unnnic-spacing-inline-xs;
        margin-top: $unnnic-spacing-stack-md;
        display: flex;

        &__cancel,
        &__copy {
          flex-grow: 1;
        }
      }
    }
  }

  ::v-deep .unnnic-button--primary {
    background-color: rgba(226, 230, 237, 0.4) !important;
  }
</style>
