<template>
  <div class="form-tab-content-buttons">
    <unnnic-tag
      class="form-tab-content-buttons__tag"
      type="default"
      :text="$t('WhatsApp.templates.form_field.buttons')"
      scheme="neutral-darkest"
    />

    <unnnic-select
      :disabled="disableInputs"
      :class="{
        'form-tab-content-buttons__type-select': true,
        'form-tab-content-buttons__type-select__disabled': disableInputs,
      }"
      :value="buttonsType"
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
        <unnnic-input
          class="form-tab-content-buttons__replies__input"
          :disabled="disableInputs"
          :value="currentButtons[index].text"
          @input="handleRepliesInput($event, index)"
          :maxlength="25"
        />
        <unnnic-button
          class="form-tab-content-buttons__replies__remove-button"
          v-if="showRemoveButton"
          :disabled="disableInputs"
          type="terciary"
          iconCenter="close-1"
          size="small"
          @click="removeButton(index)"
        />
      </div>
    </div>

    <div
      class="form-tab-content-buttons__call-actions"
      v-else-if="buttonsType === 'call_to_action'"
    >
      <div
        :class="{
          'form-tab-content-buttons__call-actions__wrapper': true,
          'form-tab-content-buttons__call-actions__wrapper--url':
            currentButtons[index].button_type === 'URL',
        }"
        v-for="(button, index) in currentButtons"
        :key="index"
      >
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

        <unnnic-input
          :label="$t('WhatsApp.templates.form_field.button_name')"
          :disabled="disableInputs"
          :value="currentButtons[index].text"
          @input="handleActionInput($event, 'text', index)"
          :maxlength="25"
        />

        <unnnic-select
          v-if="currentButtons[index].button_type === 'PHONE_NUMBER'"
          :class="{
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
            :label="option.text"
          >
            {{ option.text }}
          </option>
        </unnnic-select>

        <div v-if="currentButtons[index].button_type === 'URL'" class="url-input-group">
          <span
            :class="{
              'url-input-group__prefix': true,
              'url-input-group__prefix--focused': focusedUrlInput,
            }"
            >https://</span
          >
          <unnnic-input
            class="url-input-group__input"
            :label="$t('WhatsApp.templates.form_field.website_url')"
            :disabled="disableInputs"
            :value="currentButtons[index].url"
            @input="handleActionInput($event, 'url', index)"
            @keydown="formatUrlInput($event)"
            :maxlength="2000"
            @focus="handleUrlFocus"
            @blur="handleUrlBlur"
          />
        </div>
        <unnnic-input
          v-else
          :label="$t('WhatsApp.templates.form_field.phone_number')"
          :disabled="disableInputs"
          :value="currentButtons[index].phone_number"
          @input="handleActionInput($event, 'phone_number', index)"
          :maxlength="20"
        />

        <unnnic-button
          class="form-tab-content-buttons__call-actions__remove-button"
          v-if="showRemoveButton"
          :disabled="disableInputs"
          type="terciary"
          iconCenter="close-1"
          size="small"
          @click="removeButton(index)"
        />
      </div>
    </div>

    <unnnic-button
      v-if="showAddButton"
      type="secondary"
      :disabled="disableInputs"
      iconLeft="add-1"
      size="large"
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

  export default {
    name: 'FormTabContentButtons',
    props: {
      disableInputs: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
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
      showRemoveButton() {
        if (this.buttonsType === 'quick_reply') {
          return this.currentButtons.length > 1;
        } else {
          return this.currentButtons.length > 1;
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

    &__tag {
      width: fit-content;
      margin-bottom: $unnnic-spacing-stack-sm;
    }

    &__type-select {
      min-width: 25%;
      width: fit-content;
      margin-bottom: $unnnic-spacing-stack-sm;

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
        flex: 1;
        margin-bottom: $unnnic-spacing-stack-sm;
      }

      &__input {
        flex: 1;
        margin-right: $unnnic-spacing-inline-xs;
      }
    }

    &__call-actions {
      display: flex;
      flex-direction: column;
      width: 100%;

      &__wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 50px;
        gap: $unnnic-spacing-inline-xs;
        margin-bottom: $unnnic-spacing-stack-sm;
        white-space: nowrap;

        &--url {
          grid-template-columns: 1fr 1fr 1fr 50px;
        }
      }

      &__remove-button {
        margin-top: 38px;
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
    }

    &__add-button {
      width: fit-content;
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
