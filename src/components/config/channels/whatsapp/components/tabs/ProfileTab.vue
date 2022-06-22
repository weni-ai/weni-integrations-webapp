<template>
  <div class="profile-content">
    <dynamic-form class="profile-content__form" :inputs="profileInputs" @input="updateInputs" />

    <div class="profile-content__buttons">
      <unnnic-button
        class="profile-content__buttons__cancel"
        type="terciary"
        size="large"
        :text="$t('WhatsApp.config.profile.configure_later')"
        @click="() => this.$emit('close')"
      />

      <unnnic-button
        class="profile-content__buttons__save"
        type="secondary"
        size="large"
        :text="$t('WhatsApp.config.profile.save_changes')"
        @click="saveProfile"
      />
    </div>
  </div>
</template>

<script>
  import DynamicForm from '@/components/config/DynamicForm';
  import removeEmpty from '@/utils/clean.js';
  import { toBase64, getHeightAndWidthFromDataUrl } from '@/utils/files.js';
  import { mapActions } from 'vuex';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'ProfileTab',
    components: { DynamicForm },
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
    mounted() {
      if (this.app.code !== 'wpp') {
        this.profileInputs = this.profileInputs.filter((value) => {
          return value.name !== 'status';
        });
      }
    },
    data() {
      return {
        modifiedInitialPhoto: false,
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
      };
    },
    watch: {
      profileInputs: {
        handler: function (val) {
          const photoIndex = val.indexOf(val.find((input) => input.name === 'profile_image'));
          if (val[photoIndex].value[0]?.lastModified !== this.profile.photoFile?.lastModified) {
            this.modifiedInitialPhoto = true;
          }
        },
        deep: true,
      },
    },
    methods: {
      ...mapActions(['updateWppProfile', 'deleteWppProfilePhoto']),
      updateInputs(inputData) {
        this.profileInputs[inputData.index].value = inputData.value;
      },
      async isValidPhotoSize(b64ProfilePhoto) {
        const { height, width } = await getHeightAndWidthFromDataUrl(b64ProfilePhoto);
        if (this.modifiedInitialPhoto && (height < 192 || width < 192)) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.error.invalid_photo_size'),
              title: 'Error',
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
      getInputValue(inputName) {
        return this.profileInputs.find((input) => input.name === inputName)?.value;
      },
      async saveProfile() {
        try {
          const photo = this.getInputValue('profile_image')[0];

          if (!photo) {
            const data = { code: this.app.code, appUuid: this.app.uuid };
            await this.deleteWppProfilePhoto(data);
          }

          const b64ProfilePhoto = photo ? await toBase64(photo) : null;

          const validSize = b64ProfilePhoto ? await this.isValidPhotoSize(b64ProfilePhoto) : true;
          if (!validSize) {
            return;
          }

          const payload = {
            photo: this.modifiedInitialPhoto ? b64ProfilePhoto : null,
            status: this.getInputValue('status'),
            business: {
              description: this.getInputValue('description'),
              vertical: this.getInputValue('sector'),
            },
          };

          const data = removeEmpty({ code: this.app.code, appUuid: this.app.uuid, payload });
          await this.updateWppProfile(data);

          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.success.profile_updated'),
              title: 'Success',
              icon: 'check-circle-1-1',
              scheme: 'feedback-green',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        } catch (e) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
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
  .profile-content {
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

    &__text {
      color: $unnnic-color-neutral-dark;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-lg;
      line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
    }
  }
</style>
