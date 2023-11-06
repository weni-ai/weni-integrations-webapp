<template>
  <div class="form-tab-content-buttons">
    <span class="form-tab-content-buttons__title">
      {{ $t('WhatsApp.templates.form_field.buttons') }}
    </span>

    <unnnic-select
      :disabled="disableInputs"
      :class="{
        'form-tab-content-buttons__type-select': true,
        'form-tab-content-buttons__type-select__disabled': disableInputs,
      }"
      :value="buttonsType"
      :label="$t('WhatsApp.templates.form_field.buttons__label')"
      @input="handleButtonTypeChange"
    >
      <option
        v-for="option in buttonOptions"
        :key="option.value"
        :value="option.value"
        :label="option.text"
      >
        {{ option.text }}
      </option>
    </unnnic-select>

    <div
      ref="replies-wrapper"
      class="form-tab-content-buttons__replies"
      v-if="buttonsType === 'quick_reply'"
    >
      <div
        class="form-tab-content-buttons__replies__wrapper"
        v-for="(button, index) in currentButtons"
        :key="index"
      >
        <div class="form-tab-content-buttons__replies__wrapper--inline">
          <span class="form-tab-content-buttons__replies__wrapper__button-title">
            {{ `${$t('WhatsApp.templates.form_field.button')} ${index + 1}` }}
          </span>

          <unnnic-button
            class="form-tab-content-buttons__replies__remove-button"
            :disabled="disableInputs"
            type="tertiary"
            iconCenter="bin-1-1"
            size="small"
            @click="removeButton(index)"
          />
        </div>

        <base-input
          class="form-tab-content-buttons__replies__input"
          :disabled="disableInputs"
          :value="currentButtons[index].text"
          :label="$t('WhatsApp.templates.form_field.reply_label')"
          :placeholder="$t('WhatsApp.templates.form_field.button_text_placeholder')"
          :maxlength="25"
          :replaceRegex="EMOJI_REGEX"
          @input="handleRepliesInput($event, index)"
        />
      </div>
    </div>

    <div
      class="form-tab-content-buttons__call-actions"
      v-else-if="buttonsType === 'call_to_action'"
    >
      <div
        v-for="(button, index) in currentButtons"
        :key="index"
        class="form-tab-content-buttons__call-actions__button"
      >
        <div class="form-tab-content-buttons__call-actions__button__header">
          <span class="form-tab-content-buttons__call-actions__button__header__title">
            {{ `${$t('WhatsApp.templates.form_field.button')} ${index + 1}` }}
          </span>

          <unnnic-button
            class="form-tab-content-buttons__call-actions__button__header__remove-button"
            :disabled="disableInputs"
            type="tertiary"
            iconCenter="bin-1-1"
            size="small"
            @click="removeButton(index)"
          />
        </div>

        <unnnic-select
          :class="{
            'form-tab-content-buttons__call-actions__select__disabled': disableInputs,
          }"
          :label="$t('WhatsApp.templates.form_field.type_of_action')"
          :disabled="disableInputs"
          :value="currentButtons[index].button_type"
          @input="handleCallToActionTypeChange($event, index)"
        >
          <option
            v-for="option in callToActionOptions"
            :key="option.value"
            :value="option.value"
            :label="option.text"
          >
            {{ option.text }}
          </option>
        </unnnic-select>

        <div
          :class="{
            'form-tab-content-buttons__call-actions__wrapper': true,
            'form-tab-content-buttons__call-actions__wrapper--url':
              currentButtons[index].button_type === 'URL',
          }"
        >
          <base-input
            :label="$t('WhatsApp.templates.form_field.button_text')"
            :placeholder="$t('WhatsApp.templates.form_field.button_text_placeholder')"
            :disabled="disableInputs"
            :value="currentButtons[index].text"
            :maxlength="25"
            :replaceRegex="EMOJI_REGEX"
            @input="handleActionInput($event, 'text', index)"
          />

          <div
            v-if="currentButtons[index].button_type === 'PHONE_NUMBER'"
            class="form-tab-content-buttons__call-actions--inline"
          >
            <unnnic-select
              :class="{
                'form-tab-content-buttons__call-actions__country-select': true,
                'form-tab-content-buttons__call-actions__select__disabled': disableInputs,
              }"
              :key="currentButtons[index].button_type"
              :label="$t('WhatsApp.templates.form_field.country')"
              :disabled="disableInputs"
              :value="currentButtons[index].country_code"
              :search="true"
              @input="handleCountryCodeSelection($event, index)"
            >
              <option
                v-for="option in countryOptions"
                :key="option.value"
                :value="option.value"
                :label="`${option.text} +${getCountryCallingCode(option.text)}`"
              >
                {{ option.text }}
              </option>
            </unnnic-select>

            <unnnic-input
              class="form-tab-content-buttons__call-actions__number-input"
              :label="$t('WhatsApp.templates.form_field.phone_number')"
              :placeholder="$t('WhatsApp.templates.form_field.phone_number_placeholder')"
              :disabled="disableInputs"
              :value="currentButtons[index].phone_number"
              @input="handleActionInput($event, 'phone_number', index)"
              :maxlength="20"
            />
          </div>

          <div v-if="currentButtons[index].button_type === 'URL'" class="url-input-group">
            <span
              :class="{
                'url-input-group__prefix': true,
                'url-input-group__prefix--focused': focusedUrlInput,
              }"
            >
              https://
            </span>
            <unnnic-input
              class="url-input-group__input"
              :label="$t('WhatsApp.templates.form_field.website_url')"
              :placeholder="$t('WhatsApp.templates.form_field.url_placeholder')"
              :disabled="disableInputs"
              :value="currentButtons[index].url"
              @input="handleActionInput($event, 'url', index)"
              :maxlength="2000"
              @focus="handleUrlFocus"
              @blur="handleUrlBlur"
            />
          </div>
        </div>
      </div>
    </div>

    <unnnic-button
      v-if="showAddButton"
      type="tertiary"
      :disabled="disableInputs"
      iconLeft="add-1"
      size="small"
      class="form-tab-content-buttons__add-button"
      @click="addButton"
    >
      {{ $t('WhatsApp.templates.form_field.add_another_button') }}
    </unnnic-button>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
  import BaseInput from '../BaseInput.vue';

  export default {
    name: 'FormTabContentButtons',
    components: { BaseInput },
    props: {
      disableInputs: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        EMOJI_REGEX: /\p{Emoji_Presentation}/gu,
        buttonOptions: [
          {
            value: '',
            text: this.$t('WhatsApp.templates.button_options.none'),
          },
          {
            value: 'quick_reply',
            text: this.$t('WhatsApp.templates.button_options.quick_reply'),
          },
          {
            value: 'call_to_action',
            text: this.$t('WhatsApp.templates.button_options.call_to_action'),
          },
        ],
        callToActionOptions: [
          {
            value: 'PHONE_NUMBER',
            text: this.$t('WhatsApp.templates.call_to_action_options.call_phone_number'),
          },
          {
            value: 'URL',
            text: this.$t('WhatsApp.templates.call_to_action_options.visit_website'),
          },
        ],
        countryOptions: getCountries().map((country) => {
          return {
            value: country,
            text: country,
          };
        }),

        buttons: [],
        maxRepliesButtons: 3,
        maxActionButtons: 2,
        focusedUrlInput: false,
      };
    },
    computed: {
      ...mapGetters('WhatsApp', ['templateTranslationCurrentForm']),
      buttonsType() {
        if (!this.templateTranslationCurrentForm.buttons?.length) {
          return '';
        } else if (this.templateTranslationCurrentForm.buttons[0]?.button_type === 'QUICK_REPLY') {
          return 'quick_reply';
        } else {
          return 'call_to_action';
        }
      },
      currentButtons() {
        return this.templateTranslationCurrentForm.buttons || [];
      },
      showAddButton() {
        if (this.buttonsType === 'quick_reply') {
          return this.currentButtons.length < this.maxRepliesButtons;
        } else if (this.buttonsType === 'call_to_action') {
          return (
            this.currentButtons.length < this.maxActionButtons && this.currentButtons[0].button_type
          );
        } else {
          return false;
        }
      },
    },
    watch: {
      /* istanbul ignore next */
      currentButtons(newValue) {
        this.buttons = newValue;
      },
    },
    methods: {
      getCountryCallingCode,
      handleButtonTypeChange(event) {
        if (event === this.buttonsType) {
          return;
        }

        this.buttons = [];
        if (event === 'quick_reply') {
          this.buttons = [{ button_type: 'QUICK_REPLY', text: '' }];
        } else if (event === 'call_to_action') {
          this.buttons = [
            { button_type: 'PHONE_NUMBER', country_code: 'BR', country_calling_code: '55' },
          ];
        } else {
          this.buttons = [];
        }

        this.$emit('input-change', {
          fieldName: 'buttons',
          fieldValue: [...this.buttons],
        });
        this.$emit('input-change', { fieldName: 'buttonsType', fieldValue: event });
      },
      handleRepliesInput(event, index) {
        this.buttons[index].text = event;
        this.$emit('input-change', {
          fieldName: 'buttons',
          fieldValue: [...this.buttons],
        });
      },
      handleCallToActionTypeChange(event, index) {
        if (
          this.buttons.length === this.maxActionButtons &&
          this.buttons[index]?.button_type &&
          this.buttons[index].button_type !== event
        ) {
          const indexToSwitch = this.buttons.length - index - 1;
          const currentValue = this.buttons[index];
          this.buttons[index] = this.buttons[indexToSwitch];
          this.buttons[indexToSwitch] = currentValue;
        } else {
          const result = { button_type: event };
          event === 'URL' ? null : (result.country_code = 'BR');
          this.buttons[index] = result;
        }

        this.$emit('input-change', {
          fieldName: 'buttons',
          fieldValue: [...this.buttons],
        });
      },
      handleActionInput(event, inputName, index) {
        this.buttons[index][inputName] = event;
        this.$emit('input-change', {
          fieldName: 'buttons',
          fieldValue: [...this.buttons],
        });
      },
      handleCountryCodeSelection(event, index) {
        this.buttons[index]['country_code'] = event;
        this.buttons[index]['country_calling_code'] = getCountryCallingCode(event);
        this.$emit('input-change', {
          fieldName: 'buttons',
          fieldValue: [...this.buttons],
        });
      },
      removeButton(index) {
        this.buttons.splice(index, 1);
        this.$emit('input-change', {
          fieldName: 'buttons',
          fieldValue: [...this.buttons],
        });
      },
      addButton() {
        if (this.buttonsType === 'quick_reply') {
          this.buttons.push({ button_type: 'QUICK_REPLY', text: '' });
        } else if (this.buttons[0].button_type === 'PHONE_NUMBER') {
          this.buttons.push({ button_type: 'URL' });
        } else {
          this.buttons.push({ button_type: 'PHONE_NUMBER', country_code: 'BR' });
        }

        this.$emit('input-change', {
          fieldName: 'buttons',
          fieldValue: [...this.buttons],
        });
      },
      handleUrlFocus() {
        this.focusedUrlInput = true;
      },
      handleUrlBlur() {
        this.focusedUrlInput = false;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .form-tab-content-buttons {
    display: flex;
    flex-direction: column;

    &__title {
      margin-bottom: $unnnic-spacing-stack-sm;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-bold;

      color: $unnnic-color-neutral-darkest;
    }

    &__type-select {
      margin-bottom: $unnnic-spacing-stack-md;

      &__disabled {
        cursor: default;

        ::v-deep .input,
        ::v-deep .unnnic-icon {
          pointer-events: none;
        }

        ::v-deep .input {
          border: $unnnic-border-width-thinner dashed $unnnic-color-neutral-clean;
          background-color: $unnnic-color-neutral-light;
        }
      }
    }

    &__replies {
      &__wrapper {
        display: flex;
        flex-direction: column;

        border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
        border-radius: $unnnic-border-radius-md;
        padding: $unnnic-spacing-inset-sm;
        margin-bottom: $unnnic-spacing-stack-md;

        &--inline {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        &__button-title {
          font-size: $unnnic-font-size-body-lg;
          line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;

          color: $unnnic-color-neutral-darkest;
        }

        margin-bottom: $unnnic-spacing-stack-md;
      }

      &__input {
        flex: 1;
      }
    }

    &__call-actions {
      display: flex;
      flex-direction: column;
      width: 100%;

      &--inline {
        display: flex;
        gap: $unnnic-spacing-inline-sm;
      }

      &__button {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-xs;

        border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
        border-radius: $unnnic-border-radius-md;
        padding: $unnnic-spacing-inset-sm;
        margin-bottom: $unnnic-spacing-stack-md;

        &__header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          &__title {
            font-size: $unnnic-font-size-body-lg;
            line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;

            color: $unnnic-color-neutral-darkest;
          }
        }
      }

      &__wrapper {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-xs;
      }

      &__select {
        &__disabled {
          cursor: default;

          ::v-deep .input,
          ::v-deep .unnnic-icon {
            pointer-events: none;
          }

          ::v-deep .input {
            border: $unnnic-border-width-thinner dashed $unnnic-color-neutral-clean;
            background-color: $unnnic-color-neutral-light;
          }
        }
      }

      &__number-input {
        flex: 1;
      }

      &__country-select {
        width: 20%;
      }
    }
  }

  .url-input-group {
    display: flex;
    align-items: center;

    &__prefix {
      margin-right: -$unnnic-border-width-thin;
      box-sizing: border-box;
      height: $unnnic-font-size-h3;
      margin-top: 2.4rem;
      padding: $unnnic-spacing-inline-ant $unnnic-spacing-inline-xs;
      border: 0.0625rem solid $unnnic-color-neutral-soft;
      border-right: none;
      border-radius: $unnnic-border-radius-sm 0 0 $unnnic-border-radius-sm;
      background-color: $unnnic-color-background-sky;
      z-index: 1;
      color: $unnnic-color-neutral-dark;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

      &--focused {
        border-color: $unnnic-color-neutral-cleanest;
      }
    }

    &__input {
      margin-left: -$unnnic-border-width-thin;
      width: 100%;

      ::v-deep .unnnic-form__label {
        margin-left: -58px;
      }
    }
  }
</style>
