<template>
  <div class="account-tab">
    <div class="account-tab__content">
      <div class="account-tab__content__info">
        <div class="account-tab__content__info__account">
          <div class="account-tab__content__info__account__title">
            {{ $t('WhatsApp.config.account.title') }}
          </div>
          <div class="account-tab__content__info__account__name">
            <unnnic-icon-svg
              class="account-tab__content__info__account__name__icon"
              icon="single-neutral-2"
              scheme="neutral-cloudy"
              size="sm"
            />
            <div class="account-tab__content__info__account__name__text">
              {{ fieldHandler(appConfig.phone_number.display_name) }}
            </div>
          </div>
          <div class="account-tab__content__info__account__business">
            {{ wabaInfo.name }}
          </div>
        </div>
      </div>

      <div>
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
      </div>
    </div>
    <unnnic-button
      class="account-tab__close-button"
      type="secondary"
      size="large"
      :text="$t('general.Close')"
      @click="emitClose"
    />
  </div>
</template>

<script>
  export default {
    name: 'AccountTab',
    props: {
      appInfo: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    methods: {
      emitClose() {
        this.$emit('close');
      },
      fieldHandler(field) {
        return field ?? `-`;
      },
    },
    computed: {
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
                value: this.fieldHandler(this.appConfig.phone_number.display_phone_number),
              },
              {
                type: 'text',
                name: 'whatsapp_display_name',
                label: 'WhatsApp.config.channel.fields.whatsapp_display_name',
                value: this.fieldHandler(this.appConfig.phone_number.display_name),
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
    },
  };
</script>

<style lang="scss" scoped>
  .account-tab {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__content {
      display: flex;
      flex-direction: column;
      padding-right: $unnnic-spacing-inline-sm;
      overflow-x: hidden;
      flex: 1;

      &__info {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        &__account,
        &__conversations {
          flex: 1;

          &__title {
            font-weight: $unnnic-font-weight-black;
            font-size: $unnnic-font-size-body-lg;
            line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
            color: $unnnic-color-neutral-darkest;

            margin-bottom: $unnnic-spacing-stack-sm;
          }

          &__name {
            display: inline-flex;
            align-items: center;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
            color: $unnnic-color-neutral-cloudy;

            &__icon {
              margin-right: $unnnic-inline-nano;
            }
          }

          &__time {
            margin-bottom: $unnnic-spacing-stack-xs;
          }

          &__business,
          &__limit {
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
            color: $unnnic-color-neutral-cloudy;
            margin-top: $unnnic-spacing-stack-xs;
          }
        }

        &__conversations {
          flex: 1;
        }
      }

      &__section {
        display: flex;
        flex-direction: column;
        flex-basis: 100%;
        gap: $unnnic-spacing-inline-sm;

        &__title {
          display: flex;
          margin-bottom: $unnnic-spacing-stack-nano;
          margin-top: $unnnic-spacing-stack-md;
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
    }

    &__close-button {
      margin-top: $unnnic-spacing-inset-sm;
      align-self: flex-end;
      width: 50%;
      min-height: 3rem;
    }
  }
</style>
