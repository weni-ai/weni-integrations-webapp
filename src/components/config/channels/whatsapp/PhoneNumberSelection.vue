<template>
  <unnnic-modal
    ref="phone-number-selection-modal"
    class="phone-number-selection"
    :text="$t('WhatsAppCloud.config.phone_numbers.connect')"
    scheme="feedback-green"
    modal-icon="phone-3"
    @close="closePopUp"
    @click.stop
  >
    <skeleton-loading v-if="loadingPhoneNumbers || loadingDebugToken" slot="message" />
    <div v-else slot="message">
      <unnnic-select
        :search="false"
        size="sm"
        v-model="selectedNumber"
        placeholder="Select your phone number"
      >
        <option v-for="(number, index) in whatsAppPhoneNumbers" :key="index">
          {{ number.verified_name }} ~ ({{ number.display_phone_number }})
        </option>
      </unnnic-select>

      <div class="phone-number-selection__buttons">
        <unnnic-button
          class="phone-number-selection__buttons__cancel"
          type="terciary"
          size="large"
          :text="$t('WhatsAppCloud.config.phone_numbers.connect_later')"
          @click="closePopUp"
        ></unnnic-button>

        <unnnic-button
          class="phone-number-selection__buttons__save"
          type="terciary"
          size="large"
          :text="
            loadingWhatsAppCloudConfigure
              ? $t('general.loading')
              : $t('WhatsAppCloud.config.phone_numbers.create_channel')
          "
          @click="createChannel"
          :iconLeft="loadingWhatsAppCloudConfigure ? 'loading-circle-1' : null"
        ></unnnic-button>
      </div>
    </div>
  </unnnic-modal>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex';
  import skeletonLoading from './loadings/PhoneNumberSelection.vue';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'PhoneNumberSelection',
    components: {
      skeletonLoading,
    },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
      customData: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        showModal: false,
        selectedNumber: null,
      };
    },
    beforeDestroy() {
      this.setSelectedPhoneNumber({ data: null });
    },
    /* istanbul ignore next */
    async mounted() {
      await this.fetchDebugToken();
      if (!this.errorDebugToken) {
        await this.fetchPhoneNumbers();
      }
    },
    computed: {
      ...mapGetters(['getSelectedProject']),
      ...mapState('WhatsAppCloud', [
        'loadingPhoneNumbers',
        'loadingDebugToken',
        'loadingWhatsAppCloudConfigure',
        'errorCloudConfigure',
        'errorPhoneNumbers',
        'errorDebugToken',
        'selectedPhoneNumber',
        'wabaId',
        'businessId',
        'whatsAppPhoneNumbers',
      ]),
    },
    methods: {
      ...mapActions({
        setSelectedPhoneNumber: 'WhatsAppCloud/setSelectedPhoneNumber',
        configurePhoneNumber: `WhatsAppCloud/configurePhoneNumber`,
        getDebugToken: 'WhatsAppCloud/getDebugToken',
        getWhatsAppPhoneNumbers: 'WhatsAppCloud/getWhatsAppPhoneNumbers',
      }),
      closePopUp() {
        this.showModal = !this.showModal;
        this.$emit('closePopUp');
      },
      async createChannel() {
        if (!this.loadingWhatsAppCloudConfigure) {
          const data = {
            waba_id: this.wabaId,
            business_id: this.businessId,
            phone_number_id: this.selectedPhoneNumber?.id,
            input_token: this.customData.input_token,
            project_uuid: this.getSelectedProject,
          };

          await this.configurePhoneNumber({ data });

          if (this.errorCloudConfigure) {
            this.callErrorModal({
              text: this.$t('WhatsAppCloud.config.configure_phone_number.error'),
            });
          } else {
            this.$router.replace('/apps/my');
          }
        }
      },
      async fetchDebugToken() {
        const params = {
          input_token: this.customData.input_token,
        };

        await this.getDebugToken({ params });

        if (this.errorDebugToken) {
          this.callErrorModal({
            text: this.$t('WhatsAppCloud.config.debug_token.error'),
          });
        }
      },
      async fetchPhoneNumbers() {
        const params = {
          waba_id: this.wabaId,
          input_token: this.customData.input_token,
        };

        await this.getWhatsAppPhoneNumbers({ params });

        if (this.errorPhoneNumbers) {
          this.callErrorModal({
            text: this.$t('WhatsAppCloud.config.phone_numbers.error'),
          });
        }
      },
      callErrorModal({ text }) {
        unnnicCallAlert({
          props: {
            text: text,
            title: 'Error',
            icon: 'alert-circle-1',
            scheme: 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },
    },
    watch: {
      selectedNumber(newValue) {
        const newValueDisplayNumber = newValue
          .split('~')[1]
          .replaceAll('(', '')
          .replaceAll(')', '')
          .trim();

        const number = this.whatsAppPhoneNumbers.find(
          (number) => number.display_phone_number === newValueDisplayNumber,
        );

        this.setSelectedPhoneNumber({ data: number });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .phone-number-selection {
    cursor: default;

    &__buttons {
      display: flex;
      justify-content: space-around;
      margin-top: $unnnic-spacing-stack-lg;

      &__save {
        ::v-deep svg {
          animation: rotation 1.5s infinite linear;
        }
      }
    }

    ::v-deep .unnnic-modal-container-background-body-description {
      padding-bottom: $unnnic-spacing-stack-lg;
    }
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
