<template>
  <div class="profile-content">
    <div v-if="!loadingContactInfo" class="profile-content__wrapper">
      <dynamic-form
        class="profile-content__form"
        :inputs="profileInputs"
        @input="updateProfileInputs"
      />

      <dynamic-form
        class="contact-info__form"
        :inputs="contactInfoInputs"
        @input="updateContactInfoInputs"
      />
    </div>
    <skeleton-loading v-else />

    <div class="profile-content__buttons">
      <unnnic-button
        class="profile-content__buttons__cancel"
        type="tertiary"
        size="large"
        :text="$t('WhatsApp.config.profile.configure_later')"
        @click="() => this.$emit('close')"
      />

      <unnnic-button
        class="profile-content__buttons__save"
        type="secondary"
        size="large"
        :disabled="!modifiedInputs"
        :text="$t('WhatsApp.config.profile.save_changes')"
        @click="handleSave"
      />
    </div>
  </div>
</template>

<script>
  import DynamicForm from '@/components/config/DynamicForm.vue';
  import skeletonLoading from './loadings/ProfileTab.vue';
  import removeEmpty from '@/utils/clean.js';
  import { toBase64, getHeightAndWidthFromDataUrl } from '@/utils/files.js';
  import { mapActions, mapState } from 'pinia';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
   // import unnnicCallAlert from '@weni/unnnic-system';
   import alert from '@/utils/call';

  export default {
    name: 'ProfileTab',
    components: { DynamicForm, skeletonLoading },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
      profile: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    /* istanbul ignore next */
    async mounted() {
      if (this.app.code !== 'wpp') {
        this.profileInputs = this.profileInputs.filter((value) => {
          return value.name !== 'status';
        });
      }

      if (!this.fetchedContactInfo) {
        try {
          await this.fetchWppContactInfo({ code: this.app.code, appUuid: this.app.uuid });
        } catch (err) {
          // unnnicCallAlert({
          //   props: {
          //     text: this.$t('WhatsApp.config.error.data_fetch'),
          //     type: 'error',
          //   },
          //   seconds: 8,
          // });
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.config.error.data_fetch'),
              title: this.$t('general.error'),
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

      setTimeout(() => (this.hadInitialModified = true), 500);
    },
    data() {
      return {
        modifiedInitialPhoto: false,
        modifiedInputs: false,
        hadInitialModified: false,
        profileInputs: [
          {
            type: 'upload',
            name: 'profile_image',
            label: 'WhatsApp.config.profile.profile_image.label',
            value: Array.of(this.profile.photoFile).filter((e) => e),
            props: {
              files: Array.of(this.profile.photoFile).filter((e) => e),
              acceptMultiple: false,
              supportedFormats: '.jpg,.jpeg,.png',
              maximumUploads: 1,
              maxFileSize: 5,
              filesProgress: [],
              isUploading: false,
              canImport: true,
              canDelete: this.app.code === 'wpp',
              shouldReplace: true,
            },
          },
          {
            type: 'input',
            name: 'status',
            label: 'WhatsApp.config.profile.status.label',
            placeholder: 'WhatsApp.config.profile.status.placeholder',
            value: this.profile.status,
          },
          {
            type: 'input',
            name: 'description',
            label: 'WhatsApp.config.profile.description.label',
            placeholder: 'WhatsApp.config.profile.description.placeholder',
            value: this.profile.business?.description,
          },
          {
            type: 'select',
            name: 'sector',
            label: 'WhatsApp.config.profile.sector.label',
            placeholder: 'WhatsApp.config.profile.sector.placeholder',
            value: this.profile.business?.vertical,
            options: this.profile.business?.vertical_choices.map((value) => {
              return {
                value: value,
                text: value,
              };
            }),
          },
        ],
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
            validator: /* istanbul ignore next */ (value) => {
              if (!value) return true;

              const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
              return emailRegex.test(value);
            },
            error: false,
            errorMessage: 'WhatsApp.config.error.invalid_email',
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
    watch: {
      profileInputs: {
        handler: function (val) {
          if (this.hadInitialModified) {
            this.modifiedInputs = true;
          }
          const photoIndex = val.indexOf(val.find((input) => input.name === 'profile_image'));
          if (val[photoIndex].value[0]?.lastModified !== this.profile.photoFile?.lastModified) {
            this.modifiedInitialPhoto = true;
          }
        },
        deep: true,
      },
      contactInfoInputs: {
        handler: function () {
          if (this.hadInitialModified) {
            this.modifiedInputs = true;
          }
        },
        deep: true,
      },
    },
    computed: {
      ...mapState(whatsapp_store, [
        'errorUpdateWhatsAppProfile',
        'errorDeleteWhatsAppProfilePhoto',
        'loadingContactInfo',
        'fetchedContactInfo',
        'contactInfo',
      ]),
    },
    methods: {
      ...mapActions(whatsapp_store, [
        'updateWppProfile',
        'deleteWppProfilePhoto',
        'fetchWppContactInfo',
        'updateWppContactInfo',
      ]),
      updateProfileInputs(inputData) {
        this.profileInputs[inputData.index].value = inputData.value;
      },
      updateContactInfoInputs(inputData) {
        const input = this.contactInfoInputs[inputData.index];
        if (input.validator) {
          this.contactInfoInputs[inputData.index].error = !input.validator(inputData.value);
        }
        this.contactInfoInputs[inputData.index].value = inputData.value;
      },
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
      async isValidPhotoSize(b64ProfilePhoto) {
        const { height, width } = await getHeightAndWidthFromDataUrl(b64ProfilePhoto);
        if (this.modifiedInitialPhoto && (height < 192 || width < 192)) {
          // unnnicCallAlert({
          //   props: {
          //     text: this.$t('WhatsApp.config.error.invalid_photo_size'),
          //     type: 'error',
          //   },
          //   seconds: 8,
          // });
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.config.error.invalid_photo_size'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 8,
          });

          return false;
        }
        return true;
      },
      getProfileInputValue(inputName) {
        return this.profileInputs.find((input) => input.name === inputName)?.value;
      },
      getContactInfoInputValue(inputName) {
        return this.contactInfoInputs.find((input) => input.name === inputName).value;
      },
      handleSave() {
        this.saveProfile();
        this.saveContactInfo();
      },
      async saveProfile() {
        try {
          const photo = this.getProfileInputValue('profile_image')[0];

          if (!photo) {
            const data = { code: this.app.code, appUuid: this.app.uuid };
            await this.deleteWppProfilePhoto(data);

            if (this.errorDeleteWhatsAppProfilePhoto) {
              throw new Error(this.errorDeleteWhatsAppProfilePhoto);
            }
          }

          const b64ProfilePhoto = photo ? await toBase64(photo) : null;

          const validSize = b64ProfilePhoto ? await this.isValidPhotoSize(b64ProfilePhoto) : true;
          if (!validSize) {
            return;
          }

          const payload = {
            photo: this.modifiedInitialPhoto ? b64ProfilePhoto : null,
            status: this.getProfileInputValue('status'),
            business: {
              description: this.getProfileInputValue('description'),
              vertical: this.getProfileInputValue('sector'),
            },
          };

          const data = removeEmpty({ code: this.app.code, appUuid: this.app.uuid, payload });
          await this.updateWppProfile(data);

          if (this.errorUpdateWhatsAppProfile) {
            throw new Error(this.errorUpdateWhatsAppProfile);
          }

          this.$emit('save');

          // unnnicCallAlert({
          //   props: {
          //     text: this.$t('WhatsApp.config.success.profile_updated'),
          //     type: 'success',
          //   },
          //   seconds: 3,
          // });
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.config.success.profile_updated'),
              title: this.$t('general.success'),
              icon: 'check-circle-1-1',
              scheme: 'feedback-green',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } catch (e) {
          // unnnicCallAlert({
          //   props: {
          //     text: this.$t('apps.details.status_error'),
          //     type: 'error',
          //   },
          //   seconds: 6,
          // });
          alert.callAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 6,
          });
        }
      },
      async saveContactInfo() {
        if (this.contactInfoInputs.some((input) => input.error)) {
          // unnnicCallAlert({
          //   props: {
          //     text: this.$t('WhatsApp.config.error.invalid_data'),
          //     type: 'error',
          //   },
          //   seconds: 3,
          // });
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.config.error.invalid_data'),
              title: this.$t('general.error'),
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
          return;
        }

        try {
          const payload = {
            websites: Array.of(
              this.getContactInfoInputValue('websites.0'),
              this.getContactInfoInputValue('websites.1'),
            ),
            email: this.getContactInfoInputValue('email'),
            address: this.getContactInfoInputValue('address'),
          };

          const data = removeEmpty({ code: this.app.code, appUuid: this.app.uuid, payload });
          await this.updateWppContactInfo(data);

          // unnnicCallAlert({
          //   props: {
          //     text: this.$t('WhatsApp.config.success.contact_info_update'),
          //     type: 'success',
          //   },
          //   seconds: 3,
          // });
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.config.success.contact_info_update'),
              title: this.$t('general.success'),
              icon: 'check-circle-1-1',
              scheme: 'feedback-green',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } catch (err) {
          // unnnicCallAlert({
          //   props: {
          //     text: this.$t('WhatsApp.config.error.data_update'),
          //     type: 'error',
          //   },
          //   seconds: 6,
          // });
          alert.callAlert({
            props: {
              text: this.$t('WhatsApp.config.error.data_update'),
              title: this.$t('general.error'),
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
  .profile-content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-inline-xs;
    height: 100%;
    margin-top: $unnnic-spacing-stack-xs;
    overflow: hidden;

    &__wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: auto;
    }

    &__form {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-inline-xs;

      padding-right: $unnnic-spacing-inline-xs;
    }

    &__buttons {
      margin-top: $unnnic-spacing-stack-sm;
      display: flex;
      gap: $unnnic-spacing-inline-sm;

      &__cancel,
      &__save {
        flex-grow: 1;
      }
    }

    &__text {
      color: $unnnic-color-neutral-dark;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
    }
  }

  .contact-info {
    &__form {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-inline-xs;

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
