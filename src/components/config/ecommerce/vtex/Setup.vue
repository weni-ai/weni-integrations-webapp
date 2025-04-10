<template>
  <unnnic-modal ref="modal" class="vtex-modal" @close="closePopUp" @click.stop :closeIcon="false">
    <template #message>
      <div class="vtex-modal__content">
        <div class="vtex-modal__content__title">Integrate VTEX</div>
        <div class="vtex-modal__content__container">
          <div class="vtex-modal__content__container__account">
            <div class="vtex-modal__content__container__account__title">
              <unnnic-input
                v-model="account"
                :placeholder="$t('vtex.setup.account')"
                label="Account"
              />
            </div>
            <div class="vtex-modal__content__container__account__storetype">
              <unnnic-label label="Store Type" />
              <unnnic-select-smart v-model="storeType" :options="storeTypeOptions" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #options>
      <unnnic-button type="tertiary" @click="closePopUp">Cancel</unnnic-button>
      <unnnic-button type="primary" @click="saveConfig">Confirm</unnnic-button>
    </template>
  </unnnic-modal>
</template>

<script>
  import { mapState, mapActions } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { my_apps } from '@/stores/modules/myApps.store';
  import { auth_store } from '@/stores/modules/auth.store';
  import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
  import getEnv from '../../../../utils/env';

  export default {
    name: 'VtexModal',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        account: '',
        storeType: '',
        storeTypeOptions: [
          { label: 'Layout', value: 'layout' },
          { label: 'Fast Store', value: 'faststore' },
          { label: 'Store', value: 'store' },
        ],
      };
    },
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(my_apps, ['configuredApps', 'errorConfiguredApps']),
      ...mapState(app_type, ['loadingCreateApp', 'errorCreateApp']),
      ...mapState(ecommerce_store, ['generatedVtexAppUuid', 'errorVtexAppUuid']),
      webhookUrl() {
        const backendUrl = getEnv('VITE_APP_API_BASE_URL');
        return `${backendUrl}/api/v1/webhook/vtex/${this.generatedVtexAppUuid.uuid}/products-update/api/notification/`;
      },
    },
    methods: {
      ...mapActions(ecommerce_store, ['getVtexAppUuid']),
      closePopUp() {
        console.log('closePopUp');
        this.$emit('closePopUp');
      },
      saveConfig() {
        this.$emit('saveConfig');
      },
    },
  };
</script>

<style lang="scss" scoped>
  .vtex-modal {
    &__content {
      &__container {
        display: flex;
        flex-direction: column;
        gap: 16px;

        &__account {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }
      }
    }
  }
</style>
