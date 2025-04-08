<template>
  <unnnic-modal ref="modal" class="vtex-modal" @close="closePopUp" @click.stop :closeIcon="false">
    <template #message>
      <div class="vtex-modal__content">
        <div class="vtex-modal__content__title">Integrate VTEX</div>
        <div class="vtex-modal__content__container">
          <div class="vtex-modal__content__container__account">
            <div class="vtex-modal__content__container__account__title">
              <unnnic-input
                v-model="storeDomain"
                :placeholder="$t('vtex.setup.store_domain')"
                label="Store Domain"
              />
            </div>
            <div class="vtex-modal__content__container__account__storetype">
              <unnnic-select-smart
                label="Store Type"
                v-model="storeType"
                :options="storeTypeOptions"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </unnnic-modal>
</template>

<script>
  import { mapState, mapActions } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { my_apps } from '@/stores/modules/myApps.store';
  import { auth_store } from '@/stores/modules/auth.store';
  import { ecommerce_store } from '@/stores/modules/appType/ecommerce/ecommerce.store';
  import unnnic from '@weni/unnnic-system';
  import StepIndicator from '../../../StepIndicator.vue';
  import getEnv from '../../../../utils/env';

  export default {
    name: 'VtexModal',
    components: {
      StepIndicator,
    },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        storeDomain: '',
        storeType: '',
        storeTypeOptions: [
          { label: 'Layout', value: 'layout' },
          { label: 'Fast Store', value: 'faststore' },
          { label: 'Store', value: 'store' },
        ],
      };
    },
    mounted() {
      this.getWhatsAppChannels();
      this.getVtexAppUuid({ code: this.app.code });
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
        this.$emit('close');
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

          &__title {
            margin-bottom: 16px;
          }

          &__storetype {
            margin-top: 16px;
          }
        }
      }
    }
  }
</style>
