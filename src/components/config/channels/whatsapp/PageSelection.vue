<template>
  <unnnic-modal
    ref="page-selection-modal"
    class="page-selection"
    :text="$t('whatsapp.selection.popup_title')"
    scheme="feedback-green"
    modal-icon="phone-3"
    @close="closePopUp"
  >
    <div slot="message">
      <unnnic-select :search="false" size="sm" :value="selectedAccount">
        <option v-for="(page, index) in customData.pages" :key="index">page.name</option>
      </unnnic-select>
    </div>
  </unnnic-modal>
</template>

<script>
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
        selectedAccount: this.customData.pages[0],
      };
    },
    methods: {
      closePopUp() {
        this.showModal = !this.showModal;
        this.$emit('closePopUp');
      },
      selectPage() {
        this.$router.replace('/apps/my');
      },
    },
  };
</script>

<style lang="scss" scoped></style>
