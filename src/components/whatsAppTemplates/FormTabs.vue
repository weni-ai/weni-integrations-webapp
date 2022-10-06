<template>
  <div v-if="!loadingFetchWhatsAppTemplate && !dataProcessingLoading" class="form-tabs">
    <unnnic-tab
      class="form-tabs__tab"
      v-model="currentTab"
      :tabs="tabs"
      :initialTab="initialTranslation"
      @change="handleTranslationSelection"
    >
      <template slot="tab-head-add">
        <div ref="add-translation-button" @click.stop="addTranslation">
          <unnnic-icon-svg icon="add-1" size="sm" />
          {{ $t('WhatsApp.templates.add_language') }}
        </div>
      </template>
    </unnnic-tab>

    <FormTabContent
      ref="formContent"
      class="form-tabs__content"
      :formMode="currentFormMode"
      :selectedForm="currentTab"
      :removeLanguages="tabs"
      :canEdit="canEditTab"
      :availableLanguages="whatsAppTemplateSelectLanguages"
      :loadingSave="loadingSave"
      @language-change="handleLanguageChange($event)"
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
  </div>
  <div v-else class="form-tabs__loading">
    <img class="logo" src="@/assets/svgs/LogoWeniAnimada4.svg" />
  </div>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex';
  import { parsePhoneNumber } from 'libphonenumber-js';
  import { unnnicCallAlert } from '@weni/unnnic-system';
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
        existingTabs: [],
        createdTabs: [],
        dataProcessingLoading: true,
        showSampleModal: false,
        loadingSave: false,
        currentFormMode: this.formMode,
        sampleVariablesData: {},
        sampleFileData: null,
      };
    },
    updated() {
      this.headerScrollBehavior();
    },
    async created() {
      this.dataProcessingLoading = true;
      await this.fetchLanguages();
      if (this.formMode === 'create') {
        this.createDefaultNewLanguageTab();
      } else {
        await this.fetchData();
      }
      this.dataProcessingLoading = false;
    },
    computed: {
      ...mapGetters('WhatsApp', ['templateTranslationCurrentForm']),
      ...mapState('WhatsApp', [
        'templateTranslationForms',
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
      ]),
      tabs() {
        return this.existingTabs.concat(this.createdTabs.concat(['add']));
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
        return this.tabs[0];
      },
      canEditTab() {
        return !this.existingTabs.includes(this.tabs[this.currentTabIndex]);
      },
    },
    methods: {
      ...mapActions('WhatsApp', [
        'updateTemplateForm',
        'addNewTranslationForm',
        'renameTemplateTranslationForm',
        'setTemplateTranslationSelectedForm',
        'fetchTemplateData',
        'fetchSelectLanguages',
        'createTemplate',
        'createTemplateTranslation',
      ]),
      forceUpdateContent() {
        if (this.$refs.formContent) {
          this.$refs.formContent.updateBody();
        }
      },
      /* istanbul ignore next */
      headerScrollBehavior() {
        const tabHeader = document.getElementsByClassName('tab-content')[0];
        if (tabHeader) {
          tabHeader.addEventListener('wheel', (event) => {
            event.preventDefault();

            tabHeader.scrollBy({
              left: event.deltaY < 0 ? -30 : 30,
            });
          });
        }
      },
      async fetchLanguages() {
        const { appUuid } = this.$route.params;
        await this.fetchSelectLanguages({ appUuid });

        if (this.errorWhatsAppTemplateSelectLanguages) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.select_languages') });
          return;
        }
      },
      async fetchData() {
        const { appUuid } = this.$route.params;

        if (!appUuid) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.invalid_app_uuid') });
          return;
        }

        await this.fetchTemplateData({ appUuid, templateUuid: this.templateUuid });
        if (this.errorFetchWhatsAppTemplate) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.fetch_template_data') });
          return;
        }

        const translations = this.whatsAppTemplate.translations;

        this.buildTemplateForm(this.whatsAppTemplate);

        this.createdTabs = [];
        this.existingTabs = [];

        translations.forEach((translation) => {
          this.buildTranslationForm(translation);
        });

        if (!translations.length) {
          this.createDefaultNewLanguageTab();
        } else {
          this.setTemplateTranslationSelectedForm({
            formName: translations[0].language,
          });
        }
      },
      buildTemplateForm(template) {
        this.updateTemplateForm({ fieldName: 'name', fieldValue: template.name });
        this.updateTemplateForm({ fieldName: 'category', fieldValue: template.category });
      },
      buildTranslationForm(translation) {
        if (translation.header && translation.header.header_type !== 'TEXT') {
          translation.header.mediaType = translation.header.header_type;
          translation.header.header_type = 'MEDIA';
        }

        if (translation.buttons && translation.buttons.length > 0) {
          translation.buttons.forEach((button) => {
            if (button.button_type === 'PHONE_NUMBER') {
              button.country_calling_code = button.country_code;
              const number = button.phone_number.replace(/[- )(]/g, '');
              const completeNumber = `+${button.country_calling_code}${number}`;
              const phoneNumber = parsePhoneNumber(completeNumber);
              button.country_code = phoneNumber.country;
            }
          });
        }

        const language = this.whatsAppTemplateSelectLanguages.find(
          (language) => language.value === translation.language,
        );
        this.existingTabs.push(language.text);
        this.addNewTranslationForm({ formName: language.text, formData: translation });
      },
      handleTranslationSelection(tab) {
        this.currentTabIndex = this.tabs.indexOf(tab);
        this.setTemplateTranslationSelectedForm({ formName: tab });
        this.forceUpdateContent();
      },
      addTranslation() {
        if (this.createdTabs.includes(this.$t('WhatsApp.templates.new_language'))) {
          return;
        }
        this.createdTabs.push(this.$t('WhatsApp.templates.new_language'));
        this.currentTabIndex = this.existingTabs.length + this.createdTabs.length - 1;
        this.addNewTranslationForm({ formName: this.$t('WhatsApp.templates.new_language') });
        this.setTemplateTranslationSelectedForm({
          formName: this.$t('WhatsApp.templates.new_language'),
        });
        this.forceUpdateContent();
      },
      handleLanguageChange(event) {
        this.renameTemplateTranslationForm({
          currentName: this.currentTab,
          newName: event,
        });
        this.createdTabs.splice(this.currentTabIndex - this.existingTabs.length, 1, event);
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
      createDefaultNewLanguageTab() {
        this.createdTabs = [this.$t('WhatsApp.templates.new_language')];
        this.currentTabIndex = 0;
        this.addNewTranslationForm({ formName: this.$t('WhatsApp.templates.new_language') });
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
        if (this.existingTabs.includes(this.currentTab)) {
          return;
        }

        if (!this.templateForm.name || !this.templateForm.name.trim()) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.invalid_name') });
          return;
        }

        if (!this.templateForm.category) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.invalid_category') });
          return;
        }

        if (!this.templateTranslationCurrentForm.language) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.invalid_language') });
          return;
        }

        if (this.requiresSample()) {
          this.showSampleModal = true;
          return;
        }

        await this.executeSave();
      },
      async executeSave() {
        const { appCode, appUuid, templateUuid } = this.$route.params;
        this.loadingSave = true;
        let currentTemplateUuid = this.templateUuid || templateUuid;
        if (this.currentFormMode === 'create') {
          const templatePayload = {
            name: this.templateForm.name.trim(),
            category: this.templateForm.category.trim(),
          };

          await this.createTemplate({ appUuid, payload: templatePayload });
          if (this.errorCreateTemplate) {
            this.callErrorModal({ text: this.$t('WhatsApp.templates.error.create_template') });
            this.loadingSave = false;
            return;
          }

          currentTemplateUuid = this.createdTemplateData.uuid;
        }

        const translationPayload = this.buildPayload();
        if (!translationPayload) {
          this.loadingSave = false;
          return;
        }

        await this.createTemplateTranslation({
          appUuid,
          templateUuid: currentTemplateUuid,
          payload: translationPayload,
        });

        if (this.errorCreateTemplateTranslation) {
          this.callErrorModal({ text: this.$t('WhatsApp.templates.error.create_translation') });
        }

        if (this.currentFormMode === 'create' && !this.errorCreateTemplate) {
          this.$router.replace(
            `/apps/my/${appCode}/${appUuid}/templates/edit/${this.createdTemplateData.uuid}`,
          );

          this.currentFormMode = 'edit';
        }

        if (!this.errorCreateTemplateTranslation) {
          const createdTabIndex = this.createdTabs.findIndex((tab) => tab === this.currentTab);

          if (createdTabIndex >= 0) {
            const tab = this.createdTabs.splice(createdTabIndex, 1);
            this.existingTabs = this.existingTabs.concat(tab);
          }
        }

        this.loadingSave = false;
      },
      buildPayload() {
        try {
          const validPayload = this.validateForm();
          validPayload.language = this.templateTranslationCurrentForm.language;
          return validPayload;
        } catch (err) {
          if (err instanceof ValidationError) {
            this.callErrorModal({ text: err.message });
          } else {
            this.callErrorModal({ text: this.$t('WhatsApp.templates.error.unknown_error') });
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
        let header = this.templateTranslationCurrentForm.header;
        let errorMsg = null;
        let mediaFields = {};
        let result = null;

        if (header.header_type === 'TEXT') {
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
        } else {
          if (!header.mediaType) {
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
            if (button.url) {
              button.url = button.url.trim();
              if (!button.url) {
                errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_url');
              }
            } else {
              errorMsg = this.$t('WhatsApp.templates.error.validation.empty_button_url');
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

          return { ...button };
        });

        return formattedButtons;
      },
      callErrorModal({ text }) {
        unnnicCallAlert({
          props: {
            text,
            title: 'Error',
            icon: 'alert-circle-1-1',
            scheme: 'feedback-red',
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
  .form-tabs {
    flex: 1;

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

    &__content {
      margin-bottom: $unnnic-spacing-stack-md;
    }
  }
</style>