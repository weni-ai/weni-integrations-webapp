export default {
  contactInfo: {},
  fetchedContactInfo: false,
  loadingContactInfo: false,

  whatsAppConversations: {
    business_initiated: 0,
    user_initiated: 0,
    total: 0,
  },
  loadingConversations: false,
  errorConversations: false,

  whatsAppProfile: null,
  loadingWhatsAppProfile: false,
  errorWhatsAppProfile: false,

  updateWhatsAppProfileResult: null,
  loadingUpdateWhatsAppProfile: false,
  errorUpdateWhatsAppProfile: false,

  deleteWhatsAppProfilePhotoResult: null,
  loadingDeleteWhatsAppProfilePhoto: false,
  errorDeleteWhatsAppProfilePhoto: false,

  whatsAppTemplates: null,
  loadingWhatsAppTemplates: false,
  errorWhatsAppTemplates: false,

  templateForm: {
    name: null,
    category: null,
  },
  templateTranslationForms: {},
  templateTranslationSelectedForm: null,

  whatsAppTemplate: null,
  loadingFetchWhatsAppTemplate: false,
  errorFetchWhatsAppTemplate: false,

  whatsAppTemplateSelectLanguages: null,
  loadingFetchWhatsAppTemplateSelectLanguages: false,
  errorFetchWhatsAppTemplateSelectLanguages: false,

  createdTemplateData: null,
  loadingCreateTemplate: false,
  errorCreateTemplate: false,

  createdTemplateTranslationData: null,
  loadingCreateTemplateTranslation: false,
  errorCreateTemplateTranslation: false,

  loadingUpdateWebhookInfo: false,
  errorUpdateWebhookInfo: null,
  updateWebhookInfoData: null,
};
