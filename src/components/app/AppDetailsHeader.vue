<template>
  <div class="app-details-header" :style="cssVars">
    <div class="app-details-header__icon">
      <img class="app-details-header__icon__src" :src="icon" />
    </div>
    <div class="app-details-header__content">
      <div class="app-details-header__content__title">{{ title }}</div>
      <div class="app-details-header__content__description">{{ $t(description) }}</div>
    </div>
    <unnnic-button
      ref="unnnic-button-add"
      class="app-details-header__button"
      type="secondary"
      icon-left="add-1"
      @click="openAddModal(appCode)"
      :disabled="!canAdd"
      >{{ $t('apps.details.header.add') }}</unnnic-button
    >

    <add-modal ref="addModal" />
  </div>
</template>

<script>
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import addModal from '../AddModal.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'AppDetailsHeader',
    components: { addModal },
    props: {
      appCode: {
        type: String,
        default: null,
      },
      title: {
        type: String,
        default: null,
      },
      description: {
        type: String,
        default: null,
      },
      icon: {
        type: String,
        default: null,
      },
      iconbgColor: {
        type: String,
        default: 'none',
      },
      canAdd: {
        type: Boolean,
        default: true,
      },
    },
    methods: {
      ...mapActions(['createApp']),
      async openAddModal(code) {
        try {
          const payload = {
            project_uuid: this.getSelectedProject,
          };
          await this.createApp({ code, payload });
          this.$refs.addModal.toggleModal();
        } catch (error) {
          unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              title: 'Error',
              icon: 'check-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        }
      },
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
      }),
      cssVars() {
        return {
          '--icon-bg-color': this.iconbgColor,
        };
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-details-header {
    display: flex;
    flex-direction: row;

    &__icon {
      display: flex;
      height: 80px;
      width: 80px;
      background-color: var(--icon-bg-color);
      border-radius: $unnnic-border-radius-md;
      justify-content: center;

      &__src {
        padding: $unnnic-inset-xs;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      font-family: $unnnic-font-family-secondary;
      margin-left: $unnnic-inline-sm;
      &__title {
        font-weight: $unnnic-font-weight-bold;
        font-size: $unnnic-font-size-title-md;
        line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
        color: $unnnic-color-neutral-black;
      }

      &__description {
        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-lg;
        line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;
      }
    }

    &__button {
      align-self: flex-start;
      margin-left: auto;
    }
  }
</style>
