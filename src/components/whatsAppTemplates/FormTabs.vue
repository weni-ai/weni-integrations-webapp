<template>
  <section
    v-if="!loadingFetchWhatsAppTemplate && !loadingWhatsAppTemplates && !dataProcessingLoading"
    class="template-form"
  >
    <section class="template-form__general-info">
      <unnnic-input
        ref="nameInput"
        class="template-form__template-name"
        :modelValue="templateForm?.name"
        :label="$t('WhatsApp.templates.form_field.name')"
        :placeholder="$t('WhatsApp.templates.form_field.name')"
        :disabled="!canEditTab || formMode !== 'create'"
        :maxlength="512"
        :type="errorStates.name.value ? 'error' : 'normal'"
        :message="errorStates.name.message"
        @keyup="formatTemplateName"
        @keydown="preventTemplateName"
        @update:modelValue="handleTemplateFormInput({ fieldName: 'name', fieldValue: $event })"
      />

      <div class="template-form__input-container">
        <fieldset>
          <unnnic-label :label="$t('WhatsApp.templates.form_field.language')" />
          <unnnic-select-smart
            enableSearchByValue
            multiple
            :selectFirst="false"
            :modelValue="selectedLanguages"
            :options="templateSelectLanguages"
            :label="$t('WhatsApp.templates.form_field.category')"
            :placeholder="$t('WhatsApp.templates.form_field.language')"
            @update:modelValue="handleLanguageSelection"
            :multipleLimit="3"
          />
        </fieldset>
        <fieldset>
          <unnnic-label :label="$t('WhatsApp.templates.form_field.category')" />
          <unnnic-select-smart
            :selectFirst="false"
            :modelValue="selectedCategory"
            :options="categoryOptions"
            :disabled="!canEditTab || formMode !== 'create'"
            :placeholder="$t('WhatsApp.templates.form_field.category_placeholder')"
            @update:modelValue="handleCategoryChange"
          />
        </fieldset>
      </div>
    </section>

    <unnnic-tab
      v-show="tabsNames.length > 1"
      class="template-form__tab"
      :activeTab="currentTab?.label"
      :tabs="tabsNames"
      :initialTab="initialTranslation"
      @change="handleTranslationSelection"
    />

    <FormTabContent
      ref="formContent"
      class="template-form__content"
      :formMode="currentFormMode"
      :selectedForm="currentTab?.value"
      :canEdit="canEditTab"
      :availableLanguages="templateSelectLanguages"
      :loadingSave="loadingSave"
      @manual-preview-update="$emit('manual-preview-update')"
      @save-changes="handleSave"
    />

    <TranslationSampleForm
      v-if="showSampleModal"
      :hasMedia="templateHasMedia()"
      :hasVariables="templateHasVariables()"
      @close-modal="closeSampleModal"
      @sample-submission="handleSampleSubmission"
    />
  </section>
  <div v-else class="template-form__loading">
    <img class="logo" src="@/assets/svgs/LogoWeniAnimada4.svg" />
  </div>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import { parsePhoneNumber } from 'libphonenumber-js';
  import unnnic from '@weni/unnnic-system';
  import FormTabContent from '@/components/whatsAppTemplates/FormTabContent.vue';
  import TranslationSampleForm from '@/components/whatsAppTemplates/TranslationSampleForm.vue';

  import { countVariables } from '@/utils/countTemplateVariables.js';
  import removeEmpty from '@/utils/clean';

  class ValidationError extends Error {
    constructor(msg) {
      super(msg);
    }
  }

  export default {
    name: 'FormTabs',
    components: {
      FormTabContent,
      TranslationSampleForm,
    },
    props: {
      formMode: {
        type: String,
        required: true,
        validator: (value) => ['edit', 'create'].indexOf(value) !== -1,
      },
      templateUuid: {
        type: String,
        required: false,
      },
    },
    data() {
      return {
        currentTabIndex: 0,
        selectedLanguages: [],
        existingTabs: [],
        createdTabs: [],
        dataProcessingLoading: true,
        showSampleModal: false,
        loadingSave: false,
        currentFormMode: this.formMode,
        sampleVariablesData: {},
        sampleFileData: null,
        errorStates: {
          name: {
            value: false,
            message: '',
          },
        },
        selectedCategory: [],
        categoryOptions: [
          {
            value: 'UTILITY',
            label: this.$t('WhatsApp.templates.category_options.utility'),
            description: this.$t('WhatsApp.templates.category_options.utility_description'),
          },
          {
            value: 'MARKETING',
            label: this.$t('WhatsApp.templates.category_options.marketing'),
            description: this.$t('WhatsApp.templates.category_options.marketing_description'),
          },
          {
            value: 'AUTHENTICATION',
            label: this.$t('WhatsApp.templates.category_options.authentication'),
            description: this.$t('WhatsApp.templates.category_options.authentication_description'),
          },
        ],
      };
    },
    mounted() {
      this.headerScrollBehavior();
    },
    beforeUnmount() {
      const tabHeader = document.getElementsByClassName('tab-content')[0];
      if (tabHeader) {
        tabHeader.removeEventListener(
          'wheel',
          this.listenToWheelEvent,
          { passive: true },
        );
      }
    },
    async created() {
      this.dataProcessingLoading = true;
      await this.fetchLanguages();
      if (this.formMode === 'create') {
        this.clearTemplateData();

        this.fetchAllTemplates();
        const formatedLocale = this.$i18n.locale.toLowerCase().replaceAll('-', '_');
        const findedLanguageOption = this.templateSelectLanguages?.find(
          (item) => item.value.toLowerCase() === formatedLocale,
        );
        if (findedLanguageOption) {
          this.handleLanguageSelection([findedLanguageOption]);
        }
      } else {
        await this.fetchData();
      }
      this.dataProcessingLoading = false;
    },
    moutend() {
      const nativeNameInput = this.$refs.nameInput.$el.querySelector('input');

      nativeNameInput.addEventListener('paste', (event) => {
        event.preventDefault();
        nativeNameInput.value = event.clipboardData
          .getData('Text')
          .replaceAll(' ', '_')
          .replaceAll('-', '_')
          .toLowerCase();
      });
    },
    computed: {
      ...mapState(whatsapp_store, [
        'templateTranslationCurrentForm',
        'loadingFetchWhatsAppTemplate',
        'errorFetchWhatsAppTemplate',
        'whatsAppTemplate',
        'whatsAppTemplateSelectLanguages',
        'loadingWhatsAppTemplateSelectLanguages',
        'errorWhatsAppTemplateSelectLanguages',
        'templateForm',
        'errorCreateTemplate',
        'createdTemplateData',
        'errorCreateTemplateTranslation',
        'createdTemplateTranslationData',
        'loadingWhatsAppTemplates',
        'errorUpdateTemplateTranslation',
        'whatsAppTemplates',
      ]),
      templateSelectLanguages() {
        return this.whatsAppTemplateSelectLanguages?.map((item) => {
          const { text, value } = item;
          return {
            label: text,
            value: value,
          };
        });
      },
      tabsNames() {
        return this.selectedLanguages.map((item) => item.label);
      },
      tabs() {
        return this.selectedLanguages;
      },
      currentTab: {
        get() {
          return this.tabs[this.currentTabIndex];
        },
        set(value) {
          this.currentTabIndex = this.tabs.indexOf(value);
        },
      },
      initialTranslation() {
        return this.selectedLanguages[0]?.label;
      },
      canEditTab() {
        return !this.existingTabs.includes(this.tabs[this.currentTabIndex]);
      },
    },
    methods: {
      ...mapActions(whatsapp_store, [
        'updateTemplateForm',
        'addNewTranslationForm',
        'renameTemplateTranslationForm',
        'setTemplateTranslationSelectedForm',
        'fetchTemplateData',
        'fetchSelectLanguages',
        'createTemplate',
        'createTemplateTranslation',
        'updateTemplateTranslation',
        'getWhatsAppTemplates',
        'clearTemplateData',
        'updateTemplateTranslationForm',
      ]),
      preventTemplateName(event) {
        if (!event.key.match(/[a-zA-Z0-9_]+/)) {
          event.preventDefault();
        }
      },
      formatTemplateName(event) {
        var textValue = event.srcElement.value;
        textValue = textValue.replace(/ /g, '_').toLowerCase();
        event.srcElement.value = textValue;
      },
      handleTemplateFormInput({ fieldName, fieldValue }) {
        if (fieldName === 'name') {
          const exists = this.verifyExistingName(fieldValue);
          this.errorStates.name.value = !!exists;

          this.errorStates.name.message = exists
            ? this.$t('WhatsApp.templates.form_field.name_exists')
            : '';
        }
        this.updateTemplateForm({ fieldName, fieldValue });
      },
      verifyExistingName(templateName) {
        return this.whatsAppTemplates.results.find((template) => template.name === templateName);
      },
      handleLanguageSelection(value) {
        if (value.length === this.selectedLanguages.length) return;

        const selectedLanguagesValues = this.selectedLanguages.map((item) => item.value);

        const newSelectedLanguages = value.find(
          (item) => !selectedLanguagesValues.includes(item.value),
        );

        this.selectedLanguages = value;

        if (this.templateTranslationCurrentForm?.uuid) return;

        this.updateTemplateTranslationForm({
          formName: newSelectedLanguages?.value,
          fieldName: 'language',
          fieldValue: newSelectedLanguages.value,
        });

        this.$emit('language-change', newSelectedLanguages.label);
      },
      handleCategoryChange(event) {
        if (event.length) {
          this.selectedCategory = event;
          this.handleTemplateFormInput({ fieldName: 'category', fieldValue: event[0].value });
        }
      },
      /* istanbul ignore next */
      headerScrollBehavior() {
        const tabHeader = document.getElementsByClassName('tab-content')[0];
        if (tabHeader) {
          this.handleWheelEvent(tabHeader);
        }
      },
      listenToWheelEvent(event) {
        event.preventDefault();

        const tabHeader = document.getElementsByClassName('tab-content')[0];

        if (tabHeader) {
          tabHeader.scrollBy({
            left: event.deltaY < 0 ? -30 : 30,
          });
        }
      },
      handleWheelEvent(component) {
        component.addEventListener(
          'wheel',
          this.listenToWheelEvent,
          { passive: true },
        );
      },
      async fetchAllTemplates() {
        const params = {
          page_size: 251,
        };
        await this.getWhatsAppTemplates({
          appUuid: this.$route?.params.appUuid,
          params,
        });
      },
      async fetchLanguages() {
        await this.fetchSelectLanguages({
          appUuid: this.$route?.params.appUuid,
        });

        if (this.errorWhatsAppTemplateSelectLanguages) {
          this.callErrorModal({
            text: this.$t('WhatsApp.templates.error.select_languages'),
          });
          return;
        }
      },
      async fetchData() {
        const appUuid = this.$route?.params.appUuid;

        if (!appUuid) {
          this.callErrorModal({
            text: this.$t('WhatsApp.templates.error.invalid_app_uuid'),
          });
          return;
        }

        await this.fetchTemplateData({
          appUuid,
          templateUuid: this.templateUuid,
        });
        if (this.errorFetchWhatsAppTemplate) {
          this.callErrorModal({
            text: this.$t('WhatsApp.templates.error.fetch_template_data'),
          });
          return;
        }

        const translations = this.whatsAppTemplate.translations;

        const translationsKeys = translations.map((translation) => translation.language);

        const translationsSelectedOptions = [];

        this.templateSelectLanguages.forEach((option) => {
          if (translationsKeys.includes(option.value)) {
            option.disableRemove = true;
            translationsSelectedOptions.push(option);
          }
        });

        this.selectedLanguages = translationsSelectedOptions;

        this.buildTemplateForm(this.whatsAppTemplate);

        const templateCategory = this.whatsAppTemplate.category;
        const findedCategory = this.categoryOptions.find(
          (option) => option.value === templateCategory,
        );

        this.selectedCategory = [findedCategory];

        this.createdTabs = [];
        this.existingTabs = [];

        translations.forEach((translation) => {
          this.buildTranslationForm(translation);
        });

        if (translations.length) {
          this.setTemplateTranslationSelectedForm({
            formName: translations[0].language,
          });
        }
      },
      buildTemplateForm(template) {
        this.updateTemplateForm({
          fieldName: 'name',
          fieldValue: template.name,
        });
        this.updateTemplateForm({
          fieldName: 'category',
          fieldValue: template.category,
        });
      },
      buildTranslationForm(translation) {
        if (
          translation.header &&
          translation.header.header_type.trim() &&
          translation.header.header_type !== 'TEXT'
        ) {
          translation.header.mediaType = translation.header.header_type;
          translation.header.header_type = 'MEDIA';
        }

        if (translation.buttons && translation.buttons.length > 0) {
          // force to have a max of two buttons if type is not quick_reply
          const haveActionButtons = translation.buttons.find(
            (button) => button.button_type === 'PHONE_NUMBER' || button.button_type === 'URL',
          );
          if (haveActionButtons && translation.buttons.length > 2) {
            translation.buttons.length = 2;
          }

          translation.buttons.forEach((button) => {
            if (button.button_type === 'PHONE_NUMBER') {
              button.country_calling_code = button.country_code;
              const number = button.phone_number.replace(/[- )(]/g, '');
              const completeNumber = `+${button.country_calling_code}${number}`;
              const phoneNumber = parsePhoneNumber(completeNumber);
              button.country_code = phoneNumber.country;
            } else if (button.button_type === 'URL') {
              button.url = button.url.replace('https://', '');
            }
          });
        }

        const language = this.whatsAppTemplateSelectLanguages.find(
          (language) => language.value === translation.language,
        );
        this.existingTabs.push(language.text);
        this.addNewTranslationForm({
          formName: language.value,
          formData: translation,
        });
      },
      handleTranslationSelection(tab) {
        if (!tab) return;
        this.currentTabIndex = this.tabsNames.indexOf(tab);
        this.setTemplateTranslationSelectedForm({
          formName: this.currentTab.value,
        });
      },

      templateHasVariables() {
        const template = this.templateTranslationCurrentForm;
        const variableCount = countVariables(template.body);

        if (variableCount > 0) {
          return true;
        }
      },
      templateHasMedia() {
        const template = this.templateTranslationCurrentForm;
        const headerType = template.header?.header_type;

        if (headerType === 'MEDIA') {
          return true;
        }
      },
      requiresSample() {
        return this.templateHasMedia() || this.templateHasVariables();
      },
      closeSampleModal() {
        this.showSampleModal = false;
      },

      async handleSampleSubmission(event) {
        const { variables, headerFile } = event;
        if (variables && variables.length > 0) {
          this.sampleVariablesData = variables;
        }

        if (headerFile) {
          this.sampleFileData = headerFile;
        }

        await this.executeSave();
      },
      /* istanbul ignore next */
      async handleSave() {
        if (!this.templateForm.name || !this.templateForm.name.trim()) {
          this.callErrorModal({
            text: this.$t('WhatsApp.templates.error.invalid_name'),
          });
          return;
        }

        if (!this.templateForm.category) {
          this.callErrorModal({
            text: this.$t('WhatsApp.templates.error.invalid_category'),
          });
          return;
        }

        if (!this.templateTranslationCurrentForm.language) {
          this.callErrorModal({
            text: this.$t('WhatsApp.templates.error.invalid_language'),
          });
          return;
        }

        if (this.requiresSample()) {
          this.showSampleModal = true;
          return;
        }

        await this.executeSave();
      },
      async executeSave() {
        const { appUuid, templateUuid } = this.$route.params;
        this.loadingSave = true;
        let currentTemplateUuid = this.templateUuid || templateUuid;
        if (this.currentFormMode === 'create') {
          const templatePayload = {
            name: this.templateForm.name.trim(),
            category: this.templateForm.category.trim(),
          };

          await this.createTemplate({ appUuid, payload: templatePayload });

          if (this.errorCreateTemplate) {
            const errorText =
              this.errorCreateTemplate?.error_user_msg ||
              this.$t('WhatsApp.templates.error.create_translation');
            this.callErrorModal({ text: errorText });
            this.loadingSave = false;
            return;
          }

          currentTemplateUuid = this.createdTemplateData?.uuid || '';
          this.loadingSave = false;
        }

        const translationPayload = this.buildPayload();
        if (!translationPayload) {
          this.loadingSave = false;
          return;
        }

        if (this.templateTranslationCurrentForm?.message_template_id) {
          await this.updateTranslation({
            currentTemplateUuid,
            translationPayload,
          });
        } else {
          await this.createTranslation({
            currentTemplateUuid,
            translationPayload,
          });
        }
        this.loadingSave = false;
      },
      async createTranslation({ currentTemplateUuid, translationPayload }) {
        const { appCode, appUuid } = this.$route.params;
        await this.createTemplateTranslation({
          appUuid,
          templateUuid: currentTemplateUuid,
          payload: translationPayload,
        });

        if (this.errorCreateTemplateTranslation) {
          this.callErrorModal({
            text:
              this.errorCreateTemplateTranslation?.error_user_msg ||
              this.$t('WhatsApp.templates.error.create_translation'),
          });
          this.loadingSave = false;
        } else {
          this.callSuccessModal({
            text: this.$t('WhatsApp.templates.success.create_translation'),
          });
          this.loadingSave = false;
        }

        if (this.currentFormMode === 'create' && !this.errorCreateTemplate) {
          this.currentFormMode = 'edit';
          //TODO: fix router for edit template
          this.$router.push(`/apps/my/${appCode}/${appUuid}/templates/`);
        }

        if (!this.errorCreateTemplateTranslation) {
          const createdTabIndex = this.createdTabs.findIndex((tab) => tab === this.currentTab);

          if (createdTabIndex >= 0) {
            const tab = this.createdTabs.splice(createdTabIndex, 1);
            this.existingTabs = this.existingTabs.concat(tab);
          }
        }

        await this.fetchTemplateData({
          appUuid,
          templateUuid: this.createdTemplateData.uuid,
        });
        this.loadingSave = false;
      },
      async updateTranslation({ currentTemplateUuid, translationPayload }) {
        const { appUuid } = this.$route.params;
        await this.updateTemplateTranslation({
          appUuid,
          templateUuid: currentTemplateUuid,
          payload: translationPayload,
        });

        if (this.errorUpdateTemplateTranslation) {
          const errorText =
            this.errorUpdateTemplateTranslation?.error_user_msg ||
            this.$t('WhatsApp.templates.error.update_translation');
          this.callErrorModal({ text: errorText });
        } else {
          this.callSuccessModal({
            text: this.$t('WhatsApp.templates.success.update_translation'),
          });
        }
        this.loadingSave = false;
      },
      buildPayload() {
        try {
          const validPayload = this.validateForm();
          validPayload.language = this.templateTranslationCurrentForm.language;
          if (validPayload.buttons && Array.isArray(validPayload.buttons)) {
            validPayload.buttons.forEach((button) => {
              if (button.button_type === 'URL' && button.url) {
                if (!/^https?:\/\//i.test(button.url)) {
                  button.url = `https://${button.url}`;
                }
              }
            });
          }
          const fbMessageTemplateId = this.templateTranslationCurrentForm?.message_template_id;
          if (fbMessageTemplateId) {
            validPayload.message_template_id = fbMessageTemplateId;
          }
          return validPayload;
        } catch (err) {
          if (err instanceof ValidationError) {
            this.callErrorModal({ text: err.message });
          } else {
            this.callErrorModal({
              text: this.$t('WhatsApp.templates.error.unknown_error'),
            });
          }
          return null;
        }
      },
      validateForm() {
        const validHeader = this.validateHeader();
        const validBody = this.validateBody();
        const validFooter = this.validateFooter();
        const validButtons = this.validateButtons();

        return removeEmpty({
          header: validHeader,
          body: validBody,
          footer: validFooter,
          buttons: validButtons,
        });
      },
      validateHeader() {
        let header = this.templateTranslationCurrentForm?.header;
        let errorMsg = null;
        let mediaFields = {};
        let result = null;

        if (header?.header_type === 'TEXT') {
          if (header.text) {
            header.text = header.text.trim();
            if (!header.text) {
              errorMsg = this.$t('WhatsApp.templates.error.validation.empty_header');
            } else if (header.text.length >= 60) {
              errorMsg = this.$t('WhatsApp.templates.error.validation.long_header');
            }
          } else {
            header = null;
          }
          result = header;
        } else if (header?.header_type === 'MEDIA') {
          if (!header?.mediaType) {
            errorMsg = this.$t('WhatsApp.templates.error.validation.invalid_media_type');
          } else if (!this.sampleFileData) {
            errorMsg = this.$t('WhatsApp.templates.error.validation.invalid_media_example');
          } else {
            mediaFields.header_type = header.mediaType;
            mediaFields.example = this.sampleFileData;
            mediaFields.mediaType = null;

            result = { ...header, ...mediaFields };
          }
        }

        if (errorMsg) {
          throw new ValidationError(errorMsg);
        }

        return result;
      },
      validateBody() {
        let body = this.templateTranslationCurrentForm.body;
        let errorMsg = null;

        if (!body) {
          errorMsg = this.$t('WhatsApp.templates.error.validation.empty_body');
        } else {
          body = body.trim();
          if (!body) {
            errorMsg = this.$t('WhatsApp.templates.error.validation.empty_body');
          } else if (body.length >= 1024) {
            errorMsg = this.$t('WhatsApp.templates.error.validation.long_body');
          }
        }

        const result = {
          type: 'BODY',
          text: body,
        };

        const variableCount = countVariables(body);
        if (variableCount > 0) {
          if (
            !this.sampleVariablesData.length ||
            variableCount !== this.sampleVariablesData.length
          ) {
            errorMsg = this.$t('WhatsApp.templates.error.validation.missing_variables_example');
          } else {
            result.example = {
              body_text: [this.sampleVariablesData],
            };
          }
        }

        if (errorMsg) {
          throw new ValidationError(errorMsg);
        }

        return result;
      },
      validateFooter() {
        let footer = this.templateTranslationCurrentForm.footer;
        let errorMsg = null;

        if (!footer) {
          return null;
        } else {
          footer = footer.trim();
          if (!footer) {
            errorMsg = this.$t('WhatsApp.templates.error.validation.empty_footer');
          }
          if (footer.length >= 60) {
            errorMsg = this.$t('WhatsApp.templates.error.validation.long_footer');
          }
        }

        if (errorMsg) {
          throw new ValidationError(errorMsg);
        }

        return {
          type: 'FOOTER',
          text: footer,
        };
      },
      validateButtons() {
        const buttons = this.templateTranslationCurrentForm.buttons;
        if (!buttons?.length) {
          return null;
        }

        let errorMsg = null;
        const validButtons = buttons.filter((button) => {
          if (button.text) {
            button.text = button.text.trim();
            if (!button.text) {
              errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_text');
            }
          } else {
            errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_text');
          }

          if (button.button_type === 'PHONE_NUMBER') {
            if (button.phone_number) {
              button.phone_number = button.phone_number.trim();
              if (!button.phone_number) {
                errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_phone_number');
              }
            } else {
              errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_phone_number');
            }
            if (button.country_code) {
              button.country_code = button.country_code.trim();
              if (!button.country_code) {
                errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_country_code');
              }
            } else {
              errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_country_code');
            }
          }

          if (button.button_type === 'URL') {
            if (!button.url) {
              errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_url');
            } else {
              let buttonURL = button.url?.trim();

              if (
                buttonURL &&
                buttonURL.indexOf('https://') === -1 &&
                buttonURL.indexOf('http://') === -1
              ) {
                buttonURL = `https://${buttonURL}`;
              }

              if (!this.isValidUrl(buttonURL)) {
                errorMsg = this.$t('WhatsApp.templates.error.validation.invalid_button_url');
              }
            }
          }

          if (errorMsg) {
            return false;
          }

          return true;
        });

        if (validButtons.length !== buttons.length) {
          throw new ValidationError(errorMsg);
        }

        const formattedButtons = validButtons.map((button) => {
          if (button.button_type === 'PHONE_NUMBER') {
            return {
              ...button,
              country_code: button.country_calling_code,
            };
          }

          return removeEmpty({ ...button });
        });

        return formattedButtons;
      },
      isValidUrl(urlString) {
        const urlRegex = /^((https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/.*)?$/;

        return urlRegex.test(urlString);
      },
      callErrorModal({ text }) {
        unnnic.unnnicCallAlert({
          props: {
            text,
            type: 'error',
          },
          seconds: 15,
        });
        return;
      },
      callSuccessModal({ text }) {
        unnnic.unnnicCallAlert({
          props: {
            text,
            type: 'success',
          },
          seconds: 8,
        });
        return;
      },
    },
  };
</script>

<style lang="scss" scoped>
  fieldset {
    margin: 0;
    padding: 0;
    border: none;
  }
  :deep(.select-permission-label) {
    margin-top: 0;
    margin-bottom: $unnnic-spacing-nano;
  }
  :deep(.unnnic-label__label) {
    margin-top: 0;
    margin-bottom: $unnnic-spacing-nano;
  }
  :deep(.unnnic-form__label) {
    margin-top: 0;
    margin-bottom: $unnnic-spacing-nano;
  }

  .template-form {
    overflow: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-md;

    &__template-name {
      margin-bottom: $unnnic-spacing-sm;
    }

    &__input-container {
      display: flex;
      gap: $unnnic-spacing-sm;
      > * {
        flex: 1;
      }
    }

    &__loading {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
      height: 80vh;

      .logo {
        width: 10%;
        max-width: $unnnic-avatar-size-md;
        max-height: $unnnic-avatar-size-md;
      }
    }

    &__tab {
      ::v-deep .tab-header {
        .tab-content {
          overflow-y: hidden;
          overflow-x: auto;
        }

        .tab-head {
          white-space: nowrap;
        }

        ::-webkit-scrollbar {
          height: $unnnic-border-width-thick;
        }

        ::-webkit-scrollbar-track {
          background: $unnnic-color-neutral-soft;
        }

        ::-webkit-scrollbar-thumb {
          background: $unnnic-color-neutral-clean;
          border-radius: $unnnic-border-radius-md;
        }
      }
    }
  }
</style>
