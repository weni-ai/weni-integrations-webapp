<template>
  <div class="authentication-form">
    <div class="authentication-form">
      <span class="authentication-form__header__title">
        {{ $t('WhatsApp.templates.authentication_form.code_delivery.title') }}
      </span>

      <unnnic-radio
        v-for="(delivery, index) in codeDelivery"
        :key="index"
        v-model="selectedDelivery"
        :options="codeDelivery"
        :value="delivery"
      >
        {{ delivery }}

        <unnnic-toolTip
          v-if="delivery === 'Preencher automaticamente'"
          :text="$t('WhatsApp.templates.authentication_form.code_delivery.autofill_tooltip')"
          :enabled="true"
          side="right"
          maxWidth="600px"
        >
          <unnnic-icon-svg icon="information-circle-4" size="sm" scheme="neutral-soft" />
        </unnnic-toolTip>
        <unnnic-toolTip
          v-else
          :text="$t('WhatsApp.templates.authentication_form.code_delivery.copy_tooltip')"
          :enabled="true"
          side="right"
          maxWidth="500px"
        >
          <unnnic-icon-svg icon="information-circle-4" size="sm" scheme="neutral-soft" />
        </unnnic-toolTip>

        <div
          v-if="selectedDelivery === delivery && delivery === 'Preencher automaticamente'"
          class="u font secondary body-md color-neutral-cloudy"
        >
          {{ $t('WhatsApp.templates.authentication_form.code_delivery.autofill_description') }}
          <div class="authentication-form__wrapper">
            <unnnic-input
              :label="$t('WhatsApp.templates.authentication_form.code_delivery.package_name_label')"
              :placeholder="
                $t('WhatsApp.templates.authentication_form.code_delivery.package_name_placeholder')
              "
            >
            </unnnic-input>
            <unnnic-input
              :label="
                $t('WhatsApp.templates.authentication_form.code_delivery.signature_hash_label')
              "
              :placeholder="
                $t(
                  'WhatsApp.templates.authentication_form.code_delivery.signature_hash_placeholder',
                )
              "
            >
            </unnnic-input>
          </div>
        </div>

        <div
          v-else-if="selectedDelivery === delivery && delivery === 'Copiar código'"
          class="u font secondary body-md color-neutral-cloudy"
        >
          {{ $t('WhatsApp.templates.authentication_form.code_delivery.copy_description') }}
        </div>
      </unnnic-radio>
    </div>

    <div class="authentication-form">
      <div>
        <div class="authentication-form__header">
          <span class="authentication-form__header__title">
            {{ $t('WhatsApp.templates.authentication_form.message_content.title') }}
          </span>

          <span class="authentication-form__header__description">
            {{ $t('WhatsApp.templates.authentication_form.message_content.description') }}
          </span>
        </div>

        <unnnic-checkbox
          class="authentication-form__checkbox"
          v-model="expiration"
          :value="expiration"
          :textRight="
            $t('WhatsApp.templates.authentication_form.message_content.expiration_time_checkbox')
          "
        />
        <unnnic-checkbox
          v-model="security"
          :value="security"
          :textRight="
            $t(
              'WhatsApp.templates.authentication_form.message_content.security_recommendation_checkbox',
            )
          "
        />
        <div class="authentication-form__wrapper">
          <span class="authentication-form__header__description">
            {{ $t('WhatsApp.templates.authentication_form.message_content.slider_label') }}
          </span>

          <div class="authentication-form__wrapper__slider">
            <unnnic-slider
              :minValue="1"
              :maxValue="90"
              minLabel="1"
              maxLabel="90"
              :initialValue="10"
            ></unnnic-slider>
          </div>
        </div>
      </div>
    </div>

    <div class="authentication-form">
      <div>
        <div class="authentication-form__header">
          <span class="authentication-form__header__title">
            {{ $t('WhatsApp.templates.authentication_form.button_text.title') }}
          </span>

          <span class="authentication-form__header__description">
            {{ $t('WhatsApp.templates.authentication_form.button_text.description') }}
          </span>
        </div>

        <unnnic-input
          class="authentication-form__input"
          :label="$t('WhatsApp.templates.authentication_form.button_text.autofill_label')"
          :placeholder="
            $t('WhatsApp.templates.authentication_form.button_text.autofill_placeholder')
          "
        >
        </unnnic-input>
        <unnnic-input
          :label="$t('WhatsApp.templates.authentication_form.button_text.copy_label')"
          :placeholder="$t('WhatsApp.templates.authentication_form.button_text.copy_placeholder')"
        >
        </unnnic-input>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AuthenticationCategoryForm',
    data() {
      return {
        expiration: false,
        security: false,
        selectedDelivery: 'Preencher automaticamente',
        codeDelivery: ['Preencher automaticamente', 'Copiar código'],
      };
    },
  };
</script>

<style lang="scss" scoped>
  .authentication-form {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-md;

    &__header {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-xs;

      &__title {
        font-size: $unnnic-font-size-body-lg;
        line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
        font-weight: $unnnic-font-weight-bold;
        color: $unnnic-color-neutral-darkest;
      }

      &__description {
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        font-weight: $unnnic-font-weight-regular;
        color: $unnnic-color-neutral-cloudy;
        margin-bottom: $unnnic-spacing-sm;
      }
    }

    &__wrapper {
      display: flex;
      flex-direction: column;
      border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
      border-radius: $unnnic-border-radius-md;
      padding: $unnnic-spacing-sm;
      margin-top: $unnnic-spacing-sm;

      &__slider {
        width: 323px;
      }
    }

    &__checkbox {
      margin-bottom: $unnnic-spacing-sm;
    }

    &__input {
      margin-bottom: $unnnic-spacing-md;
    }

    ::v-deep .unnnic-radio-container {
      align-items: flex-start;
    }
  }
</style>
