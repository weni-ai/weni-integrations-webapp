<template>
  <div class="config-whatsapp">
    <div class="config-whatsapp__header">
      <div class="config-whatsapp__header__title">
        <div class="config-whatsapp__header__title__icon-container">
          <img class="config-whatsapp__header__title__icon-container__icon" :src="app.icon" />
        </div>
        <div class="config-whatsapp__header__title__name">{{ app.name }}</div>
      </div>
      <div class="config-whatsapp__header__description">
        {{ $t('WhatsApp.config.description.text') }}
        <a
          href="https://docs.ilhasoft.mobi/l/pt/article/qzw2i2og1s-como-obter-o-token-de-um-bot-do-whatsapp#"
          target="_blank"
        >
          {{ $t('WhatsApp.config.description.link') }}
        </a>
      </div>
    </div>

    <unnnic-tab class="config-whatsapp__tabs" :tabs="configTabs" initialTab="conversations">
      <template slot="tab-head-general"> {{ $t('WhatsApp.config.tabs.general') }} </template>
      <template slot="tab-panel-general">
        <div class="config-whatsapp__tabs__general-content">
          <div class="config-whatsapp__tabs__general-content__info">
            <div class="config-whatsapp__tabs__general-content__info__account">
              <div class="config-whatsapp__tabs__general-content__info__account__title">
                {{ $t('WhatsApp.config.account.title') }}
              </div>
              <div class="config-whatsapp__tabs__general-content__info__account__name">
                <unnnic-icon-svg
                  class="config-whatsapp__tabs__general-content__info__account__name__icon"
                  icon="single-neutral-2"
                  scheme="neutral-cloudy"
                  size="sm"
                />
                <div class="config-whatsapp__tabs__general-content__info__account__name__text">
                  Weni Tecnologia
                </div>
              </div>
              <div class="config-whatsapp__tabs__general-content__info__account__business">
                Weni Tech - FB 881768118574045
              </div>
            </div>

            <div class="config-whatsapp__tabs__general-content__info__conversations">
              <div class="config-whatsapp__tabs__general-content__info__conversations__title">
                {{ $t('WhatsApp.config.conversations.title') }}
              </div>
              <div class="config-whatsapp__tabs__general-content__info__conversations__time">
                conversations start at (local time):
              </div>
              <div class="config-whatsapp__tabs__general-content__info__conversations__limit">
                Message per day limit: 10k
              </div>
            </div>
          </div>

          <div class="config-whatsapp__tabs__general-content">
            <div
              v-for="(section, index) in generalSections"
              :key="index"
              class="config-whatsapp__tabs__general-content__section"
            >
              <div class="config-whatsapp__tabs__general-content__section__title">
                <span :class="['status', `${section.status}`]" />
                <span class="config-whatsapp__tabs__general-content__section__title__name">
                  {{ $t(`WhatsApp.config.${section.name}.title`) }}
                </span>
              </div>

              <div
                v-for="(field, i) in section.fields"
                :key="i"
                class="config-whatsapp__tabs__general-content__section__field"
              >
                <div class="config-whatsapp__tabs__general-content__section__field__key">
                  {{ $t(field.label) }}
                </div>
                <div
                  v-if="field.type === 'text'"
                  class="config-whatsapp__tabs__general-content__section__field__value"
                >
                  {{ field.value }}
                </div>
                <div v-else class="config-whatsapp__tabs__general-content__section__field__edit">
                  <unnnic-input
                    class="config-whatsapp__tabs__general-content__section__field__edit__input"
                  />
                  <span class="status yellow" />
                  <unnnic-icon-svg
                    class="config-whatsapp__tabs__general-content__section__field__edit__icon"
                    icon="pencil-write-1"
                    scheme="neutral-cloudy"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template slot="tab-head-profile"> {{ $t('WhatsApp.config.tabs.profile') }} </template>
      <template slot="tab-panel-profile">
        <div class="config-whatsapp__tabs__profile-content">
          <dynamic-form :inputs="profileInputs" @input="updateProfileInput" />

          <div class="config-whatsapp__tabs__profile-content__buttons">
            <unnnic-button
              class="config-whatsapp__tabs__profile-content__buttons__cancel"
              type="terciary"
              size="large"
              :text="$t('WhatsApp.config.profile.configure_later')"
              @click="closeConfig"
            />

            <unnnic-button
              class="config-whatsapp__tabs__profile-content__buttons__save"
              type="secondary"
              size="large"
              :text="$t('WhatsApp.config.profile.create_channel')"
              @click="saveConfig"
            />
          </div>
        </div>
      </template>

      <template slot="tab-head-contact_info">
        {{ $t('WhatsApp.config.tabs.contact_info') }}
      </template>
      <template slot="tab-panel-contact_info">
        <div class="config-whatsapp__tabs__contact_info-content">
          <dynamic-form :inputs="contactInfoInputs" @input="updateContactInfoInput" />

          <div class="config-whatsapp__tabs__profile-content__buttons">
            <unnnic-button
              class="config-whatsapp__tabs__profile-content__buttons__cancel"
              type="terciary"
              size="large"
              :text="$t('WhatsApp.config.profile.configure_later')"
              @click="closeConfig"
            ></unnnic-button>

            <unnnic-button
              class="config-whatsapp__tabs__profile-content__buttons__save"
              type="secondary"
              size="large"
              :text="$t('WhatsApp.config.profile.create_channel')"
              @click="saveConfig"
            ></unnnic-button>
          </div>
        </div>
      </template>

      <template slot="tab-head-conversations">
        {{ $t('WhatsApp.config.tabs.conversations') }}
      </template>
      <template slot="tab-panel-conversations">
        <div class="config-whatsapp__tabs__conversations-content">
          <div
            :class="[
              'config-whatsapp__tabs__conversations-content__dropdown',
              { active: showDateFilter },
            ]"
          >
            <div class="config-whatsapp__tabs__conversations-content__label">
              {{ $t('WhatsApp.config.conversations.filter.label') }}
            </div>
            <unnnic-date-filter
              class="config-whatsapp__tabs__conversations-content__dropdown-filter"
              dateFormat="DD/MM/YYYY"
              @filter="showDateFilter = true"
              :startDate="startDateObject"
              :endDate="endDateObject"
              placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
            />

            <div class="config-whatsapp__tabs__conversations-content__dropdown-data">
              <unnnic-date-picker v-if="showDateFilter" size="small" @change="handleDateFilter" />
            </div>
          </div>

          <div class="config-whatsapp__tabs__conversations-content__label">
            {{ $t('WhatsApp.config.conversations.conversations_count.label') }}
          </div>

          <conversations-table
            :userMessages="userInitiated"
            :templateMessages="businessInitiated"
            :total="totalInitiated"
          />
        </div>
        <div class="config-whatsapp__tabs__conversations-buttons">
          <unnnic-button
            class="config-whatsapp__tabs__conversations-buttons__close"
            type="secondary"
            size="large"
            :text="$t('general.Close')"
            @click="closeConfig"
          />
        </div>
      </template>
    </unnnic-tab>
  </div>
</template>

<script>
  import dynamicForm from '../../DynamicForm.vue';
  import ConversationsTable from './ConversationsTable.vue';
  import { mapActions } from 'vuex';
  import debounce from 'lodash.debounce';

  export default {
    name: 'whatsapp-config',
    components: {
      dynamicForm,
      ConversationsTable,
    },
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    created() {
      /* istanbul ignore next */
      window.addEventListener('click', (event) => {
        if (event.target.closest('.config-whatsapp__tabs__conversations-content__dropdown')) {
          return false;
        }
        this.showDateFilter = false;
      });
    },
    data() {
      return {
        showDateFilter: false,
        startDate: null,
        endDate: null,
        businessInitiated: 0,
        userInitiated: 0,
        totalInitiated: 0,
        generalSections: [
          {
            name: 'channel',
            status: 'green',
            fields: [
              {
                type: 'text',
                name: 'phone_number',
                label: 'WhatsApp.config.channel.fields.phone_number',
                value: '+558299620000',
              },
              {
                type: 'text',
                name: 'whatsapp_display_name',
                label: 'WhatsApp.config.channel.fields.whatsapp_display_name',
                value: 'Weni',
              },
              {
                type: 'text',
                name: 'number_registration',
                label: 'WhatsApp.config.channel.fields.number_registration',
                value: 'Pin Verification',
              },
              {
                type: 'text',
                name: 'default_language_for_templates',
                label: 'WhatsApp.config.channel.fields.default_language_for_templates',
                value: 'pt_BR',
              },
              {
                type: 'text',
                name: 'ivr_existing',
                label: 'WhatsApp.config.channel.fields.ivr_existing',
                value: 'IVR existing',
              },
              {
                type: 'text',
                name: 'ivr_active',
                label: 'WhatsApp.config.channel.fields.ivr_active',
                value: 'IVR active',
              },
              {
                type: 'text',
                name: 'certificate',
                label: 'WhatsApp.config.channel.fields.certificate',
                value: 'N/A',
              },
              {
                type: 'text',
                name: 'consent_status',
                label: 'WhatsApp.config.channel.fields.consent_status',
                value: 'Approved',
              },
            ],
          },
          {
            name: 'business_account',
            status: 'yellow',
            fields: [
              {
                type: 'text',
                name: 'waba_name',
                label: 'WhatsApp.config.business_account.fields.waba_name',
                value: 'Weni Tecnologia - FB 881768118500000',
              },
              {
                type: 'text',
                name: 'message_on_behalf_of',
                label: 'WhatsApp.config.business_account.fields.message_on_behalf_of',
                value: 'Weni Tecnologia',
              },
              {
                type: 'text',
                name: 'timezone_id',
                label: 'WhatsApp.config.business_account.fields.timezone_id',
                value: 'America/Sao_Paulo',
              },
              {
                type: 'text',
                name: 'waba_id',
                label: 'WhatsApp.config.business_account.fields.waba_id',
                value: '372347354000000',
              },
              {
                type: 'text',
                name: 'namespace',
                label: 'WhatsApp.config.business_account.fields.namespace',
                value: '2ee3daabc_0f8e_0000_ae7c_175b808f916',
              },
            ],
          },
        ],
        profileInputs: [
          {
            type: 'upload',
            name: 'profile_image',
            label: 'WhatsApp.config.profile.profile_image.label',
            value: null,
            props: {
              acceptMultiple: false,
              supportedFormats: '.png,.jpeg',
              maximumUploads: 1,
              filesProgress: [],
              isUploading: false,
              canImport: true,
              canDelete: true,
            },
          },
          {
            type: 'input',
            name: 'status',
            label: 'WhatsApp.config.profile.status.label',
            placeholder: 'WhatsApp.config.profile.status.placeholder',
            value: null,
          },
          {
            type: 'input',
            name: 'description',
            label: 'WhatsApp.config.profile.description.label',
            placeholder: 'WhatsApp.config.profile.description.placeholder',
            value: null,
          },
          {
            type: 'select',
            name: 'sector',
            label: 'WhatsApp.config.profile.sector.label',
            placeholder: 'WhatsApp.config.profile.sector.placeholder',
            value: null,
            options: [
              { value: '1', text: 'option1' },
              { value: '2', text: 'option2' },
              { value: '3', text: 'option3' },
              { value: '4', text: 'option4' },
              { value: '5', text: 'option5' },
            ],
          },
        ],
        contactInfoInputs: [
          {
            type: 'input',
            name: 'website_url',
            label: 'WhatsApp.config.contact_info.website_url.label',
            value: null,
          },
          { name: 'website_url_alternative', label: null, value: null, type: 'input' },
          {
            type: 'input',
            name: 'corporate_email',
            label: 'WhatsApp.config.contact_info.corporate_email.label',
            placeholder: 'WhatsApp.config.contact_info.corporate_email.placeholder',
            value: null,
          },
        ],
      };
    },
    computed: {
      configTabs() {
        return ['conversations'];
      },
      startDateObject() {
        return this.startDate && new Date(this.startDate);
      },
      endDateObject() {
        return this.endDate && new Date(this.endDate);
      },
    },
    methods: {
      ...mapActions(['getConversations']),
      updateContactInfoInput(inputData) {
        this.contactInfoInputs[inputData.index].value = inputData.value;
      },
      updateProfileInput(inputData) {
        this.profileInputs[inputData.index].value = inputData.value;
      },
      closeConfig() {
        this.$emit('closeModal');
      },
      /* istanbul ignore next */
      saveConfig() {
        console.log('saved');
      },
      handleDateFilter: debounce(async function (event) {
        this.startDate = event.startDate;
        this.endDate = event.endDate;

        const params = {
          start: event.startDate,
          end: event.endDate,
        };

        const { data } = await this.getConversations({
          code: this.app.code,
          appUuid: this.app.uuid,
          params,
        });

        this.businessInitiated = data.business_initiated;
        this.userInitiated = data.user_initiated;
        this.totalInitiated = data.total;
      }, 250),
    },
  };
</script>

<style lang="scss" scoped>
  .status {
    height: 8px;
    border-radius: 50%;
    display: inline-block;

    min-width: 8px;
    align-self: center;
    width: 8px;

    &.green {
      background-color: $unnnic-color-feedback-green;
    }

    &.yellow {
      background-color: $unnnic-color-feedback-yellow;
    }

    &.red {
      background-color: $unnnic-color-feedback-red;
    }
  }

  .config-whatsapp {
    display: flex;
    flex-direction: column;
    height: -webkit-fill-available;
    height: -moz-available;
    padding: $unnnic-inset-lg;
    font-family: $unnnic-font-family-secondary;

    &__header {
      display: flex;
      margin-bottom: $unnnic-spacing-stack-nano;
      flex-direction: column;

      &__title {
        display: flex;

        &__icon-container {
          display: flex;
          width: $unnnic-avatar-size-sm;
          height: $unnnic-avatar-size-sm;
          border-radius: $unnnic-border-radius-sm;

          background-color: rgba(3, 155, 229, 0.2);

          &__icon {
            width: $unnnic-icon-size-md;
            margin: 0 auto;
          }
        }

        &__name {
          align-self: center;
          font-family: $unnnic-font-family-primary;
          font-weight: $unnnic-font-weight-regular;
          font-size: $unnnic-font-size-title-md;
          line-height: $unnnic-font-size-title-md + $unnnic-line-height-md;
          color: $unnnic-color-neutral-darkest;

          margin-left: $unnnic-inline-sm;
        }
      }

      &__description {
        display: flex;
        flex-wrap: wrap;

        margin-top: $unnnic-inline-sm;
        padding-bottom: $unnnic-spacing-stack-md;

        font-weight: $unnnic-font-weight-regular;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
        color: $unnnic-color-neutral-cloudy;

        a {
          margin-left: $unnnic-inline-nano;
          font-weight: $unnnic-font-weight-bold;
          color: $unnnic-color-neutral-cloudy;
        }
      }
    }

    &__tabs {
      display: flex;
      flex-direction: column;
      height: -webkit-fill-available;
      height: -moz-available;
      overflow-y: hidden;

      ::v-deep .tab-body {
        display: flex;
        height: -webkit-fill-available;
        height: -moz-available;
        overflow-y: auto;
      }
      ::v-deep .tab-panel {
        display: flex;
        flex-direction: column;
        width: -webkit-fill-available;
        width: -moz-available;
        overflow-x: hidden;
      }

      &__general-content {
        display: flex;
        flex-direction: column;
        padding-right: $unnnic-spacing-inline-xs;

        ::v-deep .unnnic-form__message {
          color: $unnnic-color-feedback-red;
        }

        &__info {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          margin-bottom: $unnnic-spacing-stack-sm;

          &__account,
          &__conversations {
            flex: 1;

            &__title {
              font-weight: $unnnic-font-weight-black;
              font-size: $unnnic-font-size-body-lg;
              line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
              color: $unnnic-color-neutral-darkest;

              margin-bottom: $unnnic-spacing-stack-xs;
            }

            &__name {
              display: inline-flex;
              align-items: center;
              font-size: $unnnic-font-size-body-gt;
              line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
              color: $unnnic-color-neutral-cloudy;
              margin-bottom: $unnnic-spacing-stack-xs;

              &__icon {
                margin-right: $unnnic-inline-nano;
              }
            }

            &__time {
              margin-bottom: $unnnic-spacing-stack-xs;
            }

            &__business,
            &__time,
            &__limit {
              font-size: $unnnic-font-size-body-gt;
              line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
              color: $unnnic-color-neutral-cloudy;
            }
          }

          &__conversations {
            flex: 1;
          }
        }

        &__section {
          display: flex;
          flex-direction: column;
          flex-basis: 100%;
          gap: $unnnic-spacing-inline-sm;
          margin-bottom: $unnnic-spacing-stack-sm;

          &__title {
            display: flex;
            margin-bottom: $unnnic-spacing-stack-xs;
            gap: $unnnic-inline-xs;

            &__name {
              font-weight: $unnnic-font-weight-black;
              font-size: $unnnic-font-size-body-lg;
              line-height: $unnnic-font-size-body-lg + $unnnic-line-height-md;
              color: $unnnic-color-neutral-darkest;
            }
          }

          &__field {
            display: inline-flex;

            &__key,
            &__value,
            &__edit {
              flex: 1;
              width: 50%;
              font-size: $unnnic-font-size-body-gt;
              line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
              color: $unnnic-color-neutral-cloudy;
              margin: auto 0;
            }

            &__edit {
              display: inline-flex;
              gap: $unnnic-spacing-inline-xs;
              align-items: center;

              &__input {
                height: 29px;
                max-width: 70%;

                ::v-deep .input {
                  height: 29px;
                }
              }
            }
          }
        }
      }

      &__profile-content {
        display: flex;
        flex-direction: column;
        gap: $unnnic-inline-xs;

        &__buttons {
          padding-right: $unnnic-spacing-inline-xs;
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

      &__conversations {
        display: flex;
        flex: 1;

        &-content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;

          &__dropdown {
            width: fit-content;
            &-data {
              position: absolute;
            }

            &-filter {
              width: 14rem;
            }
          }

          &__label {
            font-weight: $unnnic-font-weight-bold;
            font-size: $unnnic-font-size-body-gt;
            line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
            color: $unnnic-color-neutral-darkest;

            margin: $unnnic-spacing-stack-xs 0;
          }
        }

        &-buttons {
          display: flex;
          justify-content: flex-end;

          &__close {
            width: 50%;
          }
        }
      }
    }
  }
</style>
