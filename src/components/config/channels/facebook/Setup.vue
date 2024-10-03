<template>
  <div>
    <unnnic-modal
      v-if="stage === 'login'"
      ref="facebook-setup-modal"
      :class="`facebook-setup ${this.integrationName}-icon`"
      :text="$t(`${this.integrationName}.setup.title`)"
      :modal-icon="this.integrationIcon"
      :close-icon="false"
      @close="closePopUp"
      @click.stop
    >
      <template #message>
        <div>
          <span v-html="$t(`${this.integrationName}.setup.description`)"></span>
        </div>
      </template>
      <template #options>
        <div>
          <div class="facebook-setup__buttons">
            <unnnic-button
              class="facebook-setup__buttons__cancel"
              type="tertiary"
              size="large"
              :text="$t('general.Cancel')"
              @click="closePopUp"
            />

            <LoadingButton
              class="facebook-setup__buttons__start"
              type="secondary"
              size="large"
              :text="$t(`${this.integrationName}.setup.connect`)"
              :isLoading="onLogin"
              :disabled="onLogin"
              @clicked="startFacebookLogin"
            />
          </div>
        </div>
      </template>
    </unnnic-modal>

    <unnnic-modal
      v-else
      ref="page-selection-modal"
      :class="`page-selection ${this.integrationName}-icon`"
      :text="$t(`${this.integrationName}.setup.title`)"
      :modal-icon="this.integrationIcon"
      :close-icon="false"
      @close="closePopUp"
      @click.stop
    >
      <template #message>
        <div class="page-selection__select">
          <span v-html="$t(`${this.integrationName}.setup.page_selection.description`)"></span>
          <unnnic-select-smart
            ref="page-selection-input"
            size="sm"
            :options="pageListOptions"
            v-model="selectedPage"
            @update:modelValue="handlePageSelection"
          />
        </div>
      </template>

      <template #options>
        <div class="page-selection__buttons">
          <unnnic-button
            class="page-selection__buttons__cancel"
            type="tertiary"
            size="large"
            :text="$t(`${this.integrationName}.setup.connect_later`)"
            @click="closePopUp"
          />

          <LoadingButton
            class="page-selection__buttons__save"
            type="secondary"
            size="large"
            :isLoading="loadingUpdateAppConfig || loadingCreateApp"
            :loadingText="$t('general.loading')"
            :text="$t(`${this.integrationName}.setup.create_channel`)"
            @clicked="createChannel"
          />
        </div>
      </template>
    </unnnic-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import unnnic from '@weni/unnnic-system';
  import LoadingButton from '../../../LoadingButton/index.vue';
  import getEnv from '../../../../utils/env';
  import { initFacebookSdk } from '../../../../utils/plugins/fb';
  import { mapActions, mapState } from 'pinia';
  import { app_type } from '@/stores/modules/appType/appType.store';
  import { auth_store } from '@/stores/modules/auth.store';

  export default {
    name: 'FacebookSetup',
    components: {
      LoadingButton,
    },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        stage: 'login',
        accessToken: null,
        pageList: [],
        selectedPage: [],
        selectKey: 0,
        onLogin: false,
        loadingPages: false,
        appScopes: {
          ig: 'business_management,instagram_basic,instagram_manage_messages,pages_manage_metadata,pages_messaging,pages_read_engagement,pages_show_list',
          fba: 'business_management,pages_messaging,pages_show_list,pages_manage_metadata,pages_read_engagement',
        },
      };
    },
    async mounted() {
      window.startPageSelectionStage = this.startPageSelectionStage;
      window.changeLoginState = this.changeLoginState;
    },
    computed: {
      ...mapState(app_type, [
        'createAppResponse',
        'loadingCreateApp',
        'errorCreateApp',
        'loadingUpdateAppConfig',
        'errorUpdateAppConfig',
      ]),
      ...mapState(auth_store, ['project']),
      integrationName() {
        const nameMap = {
          ig: 'instagram',
          fba: 'facebook',
        };

        return nameMap[this.app.code];
      },
      integrationIcon() {
        const iconMap = {
          ig: 'social-instagram-1',
          fba: 'social-media-facebook-1',
        };
        return iconMap[this.app.code];
      },
      pageListOptions() {
        return this.pageList.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        });
      },
    },
    methods: {
      ...mapActions(app_type, ['createApp', 'updateAppConfig', 'deleteApp']),
      handlePageSelection(page) {
        this.selectedPage = page;
        this.selectKey += 1;
      },
      changeLoginState(state) {
        this.onLogin = state;
      },
      /* istanbul ignore next */
      startFacebookLogin() {
        const fbAppId = getEnv('VITE_APP_FACEBOOK_APP_ID');

        if (!fbAppId) {
          return;
        }

        /* eslint-disable no-undef */
        const loginCallback = () => {
          this.changeLoginState(true);
          FB.login(
            function (response) {
              if (response.authResponse && response.authResponse.grantedScopes) {
                const accessToken = response.authResponse.accessToken;
                this.startPageSelectionStage(accessToken);
              }
              this.changeLoginState(false);
            },
            {
              return_scopes: true,
              scope: this.appScopes[this.app.code],
            },
          );
        };

        initFacebookSdk(fbAppId, loginCallback);
      },
      /* istanbul ignore next */
      async startPageSelectionStage(accessToken) {
        this.accessToken = accessToken;
        this.stage = 'select-page';

        this.loadingPages = true;
        try {
          const fbAccountUrl = `https://graph.facebook.com/me/accounts?access_token=${accessToken}&limit=200`;
          const res = await axios.get(fbAccountUrl);
          this.pageList = res.data.data;
        } catch (error) {
          const err =
            error.response?.data.error?.error_user_msg ||
            this.$t(`${this.integrationName}.setup.account_data.error`);
          this.callModal({
            type: 'error',
            text: err,
          });
          return;
        }

        this.loadingPages = false;
      },
      async createChannel() {
        const page = this.pageList.find((page) => page.id === this.selectedPage[0].value);

        if (!page) {
          this.callModal({
            type: 'error',
            text: this.$t(`${this.integrationName}.setup.find_page.error`),
          });
          return;
        }

        await this.createApp({
          code: this.app.code,
          payload: { project_uuid: this.project },
        });
        if (this.errorCreateApp) {
          const err =
            this.errorCreateApp?.error_user_msg ||
            this.$t(`${this.integrationName}.setup.create_app.error`);
          this.callModal({
            type: 'error',
            text: err,
          });
          return;
        }

        const data = {
          code: this.app.code,
          appUuid: this.createAppResponse.uuid,
          payload: {
            config: {
              user_access_token: page.access_token,
              page_name: page.name,
              page_id: page.id,
              fb_user_id: FB.getUserID(),
            },
            channeltype_code: this.app.code.toUpperCase(),
            project_uuid: this.project,
          },
        };

        await this.updateAppConfig(data);

        if (this.errorUpdateAppConfig) {
          const err =
            this.errorUpdateAppConfig?.error_user_msg ||
            this.$t(`${this.integrationName}.setup.update_app.error`);
          this.callModal({
            type: 'error',
            text: err,
          });
          await this.deleteApp({ code: this.app.code, appUuid: this.createAppResponse.uuid });
          return;
        }

        this.callModal({ type: 'success', text: this.$t(`${this.integrationName}.setup.success`) });
        this.$router.replace('/apps/my');
      },
      closePopUp() {
        this.$emit('closePopUp');
      },
      callModal({ text, type }) {
        unnnic.unnnicCallAlert({
          props: {
            text: text,
            type: type,
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .facebook-icon {
    ::v-deep {
      .unnnic-icon > svg > path {
        fill: #3c579e;
      }
    }
  }
  .facebook-setup {
    cursor: default;

    &__buttons {
      display: flex;
      justify-content: space-around;
      gap: $unnnic-spacing-inline-xs;

      &__cancel,
      &__start {
        width: 50%;
      }
    }

    ::v-deep {
      .unnnic-modal-container-background-body-description {
        padding-bottom: $unnnic-spacing-stack-nano;
      }
      .link {
        color: inherit;
        text-decoration: none;
        border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-cloudy;
      }
    }
  }

  .page-selection {
    cursor: default;

    &__buttons {
      display: flex;
      justify-content: space-around;
      gap: $unnnic-spacing-inline-xs;

      &__cancel,
      &__save {
        width: 50%;
      }
    }

    &__select {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-stack-md;
    }

    ::v-deep .unnnic-modal-container-background-body-description {
      padding-bottom: $unnnic-spacing-stack-nano;
    }

    ::v-deep .unnnic-modal-container-background-button {
      padding-top: $unnnic-spacing-stack-md;
    }
  }
</style>
