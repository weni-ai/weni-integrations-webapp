<template>
  <div class="contact-info">
    <dynamic-form
      v-if="!loadingContactInfo"
      class="contact-info__form"
      :inputs="contactInfoInputs"
      @input="updateInputs"
    />
    <skeleton-loading v-else />

    <div class="contact-info__buttons">
      <unnnic-button
        class="contact-info__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('WhatsApp.config.contact_info.configure_later')"
        @click="() => this.$emit('close')"
      ></unnnic-button>

      <unnnic-button
        class="contact-info__buttons__save"
        type="secondary"
        size="large"
        :text="$t('WhatsApp.config.contact_info.save_changes')"
        @click="saveContactInfo"
      ></unnnic-button>
    </div>
  </div>
</template>

<script>
  import skeletonLoading from './loadings/ContactInfoTab.vue';
  import DynamicForm from '@/components/config/DynamicForm.vue';
  import removeEmpty from '@/utils/clean.js';
  import { mapActions, mapGetters } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'ContactInfoTab',
    components: { DynamicForm, skeletonLoading },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    /* istanbul ignore next */
    async mounted() {
      if (!this.fetchedContactInfo) {
        try {
          await this.fetchWppContactInfo({ code: this.app.code, appUuid: this.app.uuid });
        } catch (err) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.error.data_fetch'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
          });
        }
      }
      this.setInitialInputs();
    },
    computed: {
      ...mapGetters({
        loadingContactInfo: 'WhatsApp/loadingContactInfo',
        fetchedContactInfo: 'WhatsApp/fetchedContactInfo',
        contactInfo: 'WhatsApp/contactInfo',
      }),
    },
    data() {
      return {
        contactInfoInputs: [
          {
            type: 'input',
            name: 'websites.0',
            label: 'WhatsApp.config.contact_info.website_url.label',
            value: null,
          },
          {
            name: 'websites.1',
            label: null,
            value: null,
            type: 'input',
          },
          {
            type: 'input',
            name: 'email',
            label: 'WhatsApp.config.contact_info.email.label',
            placeholder: 'WhatsApp.config.contact_info.email.placeholder',
            value: null,
          },
          {
            type: 'input',
            name: 'address',
            label: 'WhatsApp.config.contact_info.address.label',
            placeholder: 'WhatsApp.config.contact_info.address.placeholder',
            value: null,
          },
        ],
      };
    },
    methods: {
      ...mapActions({
        fetchWppContactInfo: 'WhatsApp/fetchWppContactInfo',
        updateWppContactInfo: 'WhatsApp/updateWppContactInfo',
      }),
      /* istanbul ignore next */
      setInitialInputs() {
        if (this.contactInfo) {
          Object.entries(this.contactInfo).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              this.contactInfoInputs.forEach((input, index) => {
                if (input.name.includes(key)) {
                  input.value = value[index];
                }
              });
            } else {
              const input = this.contactInfoInputs.find((input) => input.name === key);
              if (input) {
                input.value = value;
              }
            }
          });
        }
      },
      updateInputs(inputData) {
        this.contactInfoInputs[inputData.index].value = inputData.value;
      },
      getInputValue(inputName) {
        return this.contactInfoInputs.find((input) => input.name === inputName).value;
      },
      async saveContactInfo() {
        try {
          const payload = {
            websites: Array.of(this.getInputValue('websites.0'), this.getInputValue('websites.1')),
            email: this.getInputValue('email'),
            address: this.getInputValue('address'),
          };

          const data = removeEmpty({ code: this.app.code, appUuid: this.app.uuid, payload });
          await this.updateWppContactInfo(data);

          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.success.contact_info_update'),
              title: 'Success',
              icon: 'check-circle-1-1',
              scheme: 'feedback-green',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } catch (err) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.error.data_update'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 6,
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: $unnnic-inline-xs;
    height: 100%;

    &__form {
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
      flex: 1;

      padding-right: $unnnic-spacing-inline-xs;
    }

    &__buttons {
      margin-top: $unnnic-spacing-stack-sm;
      display: flex;

      &__cancel,
      &__save {
        flex-grow: 1;
      }
    }
  }
</style>
