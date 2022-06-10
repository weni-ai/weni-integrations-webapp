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
    <div slot="message">
      <unnnic-select
        :search="false"
        size="sm"
        v-model="selectedNumber"
        placeholder="Select your phone number"
      >
        <option v-for="(number, index) in phoneNumbers" :key="index">
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
          :text="$t('WhatsAppCloud.config.phone_numbers.create_channel')"
          @click="createChannel"
        ></unnnic-button>
      </div>
    </div>
  </unnnic-modal>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'PageSelection',
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
        input_token: null,
      };
    },
    beforeDestroy() {
      this.setSelectedPhoneNumber({ data: null });
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
        phoneNumbers: 'WhatsAppCloud/whatsAppPhoneNumbers',
        selectedPhoneNumber: 'WhatsAppCloud/selectedPhoneNumber',
        wabaId: 'WhatsAppCloud/wabaId',
        businessId: 'WhatsAppCloud/businessId',
      }),
    },
    methods: {
      ...mapActions({
        setSelectedPhoneNumber: 'WhatsAppCloud/setSelectedPhoneNumber',
        configurePhoneNumber: `WhatsAppCloud/configurePhoneNumber`,
      }),
      closePopUp() {
        this.showModal = !this.showModal;
        this.$emit('closePopUp');
      },
      async createChannel() {
        const data = {
          waba_id: this.wabaId,
          business_id: this.businessId,
          phone_number_id: this.selectedPhoneNumber.id,
          input_token: this.customData.input_token,
          project_uuid: this.getSelectedProject,
        };

        await this.configurePhoneNumber({ data });
        this.$router.replace('/apps/my');
      },
    },
    watch: {
      selectedNumber(newValue) {
        const newValueDisplayNumber = newValue
          .split('~')[1]
          .replaceAll('(', '')
          .replaceAll(')', '')
          .trim();

        const number = this.phoneNumbers.find(
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
    }

    ::v-deep .unnnic-modal-container-background-body-description {
      padding-bottom: $unnnic-spacing-stack-lg;
    }
  }
</style>
