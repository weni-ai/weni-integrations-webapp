<template>
  <div class="general-tab">
    <div class="general-tab__content">
      <div class="general-tab__content__info">
        <div class="general-tab__content__info__account">
          <div class="general-tab__content__info__account__title">
            {{ $t('WhatsApp.config.account.title') }}
          </div>
          <div class="general-tab__content__info__account__name">
            <unnnic-icon-svg
              class="general-tab__content__info__account__name__icon"
              icon="single-neutral-2"
              scheme="neutral-cloudy"
              size="sm"
            />
            <div class="general-tab__content__info__account__name__text">Weni Tecnologia</div>
          </div>
          <div class="general-tab__content__info__account__business">
            Weni Tech - FB 881768118574045
          </div>
        </div>

        <div class="general-tab__content__info__conversations">
          <div class="general-tab__content__info__conversations__title">
            {{ $t('WhatsApp.config.conversations.title') }}
          </div>
          <div class="general-tab__content__info__conversations__time">
            conversations start at (local time):
          </div>
          <div class="general-tab__content__info__conversations__limit">
            Message per day limit: 10k
          </div>
        </div>
      </div>

      <div>
        <div
          v-for="(section, index) in generalSections"
          :key="index"
          class="general-tab__content__section"
        >
          <div class="general-tab__content__section__title">
            <StatusIndicator :status="section.status" />
            <span class="general-tab__content__section__title__name">
              {{ $t(`WhatsApp.config.${section.name}.title`) }}
            </span>
          </div>

          <div
            v-for="(field, i) in section.fields"
            :key="i"
            class="general-tab__content__section__field"
          >
            <div class="general-tab__content__section__field__key">
              {{ $t(field.label) }}
            </div>
            <div class="general-tab__content__section__field__value">
              {{ field.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <unnnic-button
      class="general-tab__close-button"
      type="secondary"
      size="large"
      :text="$t('general.Close')"
      @click="emitClose"
    />
  </div>
</template>

<script>
  import StatusIndicator from '../StatusIndicator.vue';

  export default {
    name: 'GeneralTab',
    components: { StatusIndicator },
    data() {
      return {
        generalSections: [
          {
            name: 'channel',
            status: 'green',
            fields: [
              {
                type: 'text',
                name: 'phone_number',
                label: 'WhatsApp.config.channel.fields.phone_number',
                value: '+558299620000',
              },
              {
                type: 'text',
                name: 'whatsapp_display_name',
                label: 'WhatsApp.config.channel.fields.whatsapp_display_name',
                value: 'Weni',
              },
              {
                type: 'text',
                name: 'number_registration',
                label: 'WhatsApp.config.channel.fields.number_registration',
                value: 'Pin Verification',
              },
              {
                type: 'text',
                name: 'default_language_for_templates',
                label: 'WhatsApp.config.channel.fields.default_language_for_templates',
                value: 'pt_BR',
              },
              {
                type: 'text',
                name: 'ivr_existing',
                label: 'WhatsApp.config.channel.fields.ivr_existing',
                value: 'IVR existing',
              },
              {
                type: 'text',
                name: 'ivr_active',
                label: 'WhatsApp.config.channel.fields.ivr_active',
                value: 'IVR active',
              },
              {
                type: 'text',
                name: 'certificate',
                label: 'WhatsApp.config.channel.fields.certificate',
                value: 'N/A',
              },
              {
                type: 'text',
                name: 'consent_status',
                label: 'WhatsApp.config.channel.fields.consent_status',
                value: 'Approved',
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
                value: 'Weni Tecnologia - FB 881768118500000',
              },
              {
                type: 'text',
                name: 'message_on_behalf_of',
                label: 'WhatsApp.config.business_account.fields.message_on_behalf_of',
                value: 'Weni Tecnologia',
              },
              {
                type: 'text',
                name: 'timezone_id',
                label: 'WhatsApp.config.business_account.fields.timezone_id',
                value: 'America/Sao_Paulo',
              },
              {
                type: 'text',
                name: 'waba_id',
                label: 'WhatsApp.config.business_account.fields.waba_id',
                value: '372347354000000',
              },
              {
                type: 'text',
                name: 'namespace',
                label: 'WhatsApp.config.business_account.fields.namespace',
                value: '2ee3daabc_0f8e_0000_ae7c_175b808f916',
              },
            ],
          },
        ],
      };
    },
    methods: {
      emitClose() {
        this.$emit('close');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .general-tab {
    display: flex;
    flex-direction: column;
    height: 100%;

    &__content {
      display: flex;
      flex-direction: column;
      padding-right: $unnnic-spacing-inline-sm;
      overflow-x: hidden;

      &__info {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        // margin-bottom: $unnnic-spacing-stack-md;

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
            margin-bottom: $unnnic-spacing-stack-xs;

            &__icon {
              margin-right: $unnnic-inline-nano;
            }
          }

          &__time {
            margin-bottom: $unnnic-spacing-stack-xs;
          }

          &__business,
          &__time,
          &__limit {
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
            color: $unnnic-color-neutral-cloudy;
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
        // margin-bottom: $unnnic-spacing-stack-sm;

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
