<template>
  <div class="conversations">
    <div class="conversations__content">
      <div :class="['conversations__content__dropdown', { active: showDateFilter }]">
        <div class="conversations__content__label">
          {{ $t('WhatsApp.config.conversations.filter.label') }}
        </div>
        <unnnic-date-filter
          class="conversations__content__dropdown-filter"
          dateFormat="DD/MM/YYYY"
          @filter="showDateFilter = true"
          :startDate="startDateObject"
          :endDate="endDateObject"
          placeholder="DD/MM/YYYY ~ DD/MM/YYYY"
        />

        <div class="conversations__content__dropdown-data">
          <unnnic-date-picker
            v-if="showDateFilter"
            size="small"
            :days="['D', 'S', 'T', 'Q', 'Q', 'S', 'S']"
            @change="handleDateFilter"
          />
        </div>
      </div>

      <div class="conversations__content__tables">
        <div class="conversations__content__label">
          {{ $t('WhatsApp.config.conversations.conversations_count.label') }}
        </div>

        <div class="conversations__content__tables__section">
          <span v-if="hasBeforeAndAfter">
            {{ $t('WhatsApp.config.conversations.conversations_count.before_label') }}
          </span>
          <unnnic-table v-if="hasBefore" :items="beforeItems">
            <template v-slot:header>
              <unnnic-table-row :headers="beforeHeaders" />
            </template>

            <template v-slot:item="{ item }">
              <unnnic-table-row :headers="beforeHeaders">
                <template v-slot:startedBy>
                  <div :title="item.startedBy" class="break-text">
                    {{ item.startedBy }}
                  </div>
                </template>

                <template v-slot:quantity>
                  <div :title="item.quantity" class="break-text">
                    {{ item.quantity }}
                  </div>
                </template>
              </unnnic-table-row>
            </template>
          </unnnic-table>
        </div>

        <div class="conversations__content__tables__section">
          <span v-if="hasBeforeAndAfter">
            {{ $t('WhatsApp.config.conversations.conversations_count.after_label') }}
          </span>
          <unnnic-table v-if="(!hasBefore && !hasAfter) || hasAfter" :items="afterItems">
            <template v-slot:header>
              <unnnic-table-row :headers="afterHeaders" />
            </template>

            <template v-slot:item="{ item }">
              <unnnic-table-row :headers="afterHeaders">
                <template v-slot:category>
                  <div :title="item.category" class="break-text">
                    {{ item.category }}
                  </div>
                </template>

                <template v-slot:quantity>
                  <div :title="item.quantity" class="break-text">
                    {{ item.quantity }}
                  </div>
                </template>
              </unnnic-table-row>
            </template>
          </unnnic-table>
        </div>
      </div>

      <div class="conversations__content__report">
        <span class="conversations__content__report__label">
          {{ $t('WhatsApp.config.conversations.report.label') }}
        </span>

        <span class="conversations__content__report__description">
          {{ $t('WhatsApp.config.conversations.report.description') }}
        </span>

        <unnnic-tool-tip
          class="conversations__content__report__tooltip"
          :text="$t('WhatsApp.config.conversations.report.missing_dates')"
          :enabled="!this.startDate || !this.endDate"
          side="top"
          maxWidth="15rem"
        >
          <unnnic-button
            ref="reportButton"
            class="conversations__content__report__button"
            type="secondary"
            size="small"
            @click="requestReport"
            :disabled="!this.startDate || !this.endDate"
          >
            {{ $t('WhatsApp.config.conversations.report.button') }}
          </unnnic-button>
        </unnnic-tool-tip>
      </div>
    </div>
    <div class="conversations__buttons">
      <unnnic-button
        class="conversations__buttons__close"
        type="tertiary"
        size="large"
        :text="$t('general.Cancel')"
        @click="() => this.$emit('close')"
      />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce';
  import unnnic from '@weni/unnnic-system';
  import { mapActions, mapState } from 'pinia';
  import { auth_store } from '@/stores/modules/auth.store';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import removeEmpty from '../../../../../../utils/clean';

  export default {
    name: 'ConversationsTab',
    props: {
      app: {
        type: Object,
        default: /* istanbul ignore next */ () => {},
      },
    },
    data() {
      return {
        showDateFilter: false,
        startDate: null,
        endDate: null,
        businessInitiated: 0,
        userInitiated: 0,
        totalInitiated: 0,
        afterData: {},
        beforeHeaders: [
          {
            id: 'startedBy',
            text: this.$t('WhatsApp.config.conversations.conversations_count.table.started_by'),
            flex: 1,
          },
          {
            id: 'quantity',
            text: this.$t('WhatsApp.config.conversations.conversations_count.table.quantity'),
            flex: 1,
          },
        ],
        afterHeaders: [
          {
            id: 'category',
            text: this.$t('WhatsApp.config.conversations.conversations_count.table.category'),
            flex: 1,
          },
          {
            id: 'quantity',
            text: this.$t('WhatsApp.config.conversations.conversations_count.table.quantity'),
            flex: 1,
          },
        ],
      };
    },
    created() {
      /* istanbul ignore next */
      window.addEventListener('click', (event) => {
        if (event.target.closest('.conversations__content__dropdown')) {
          return false;
        }
        this.showDateFilter = false;
      });
    },
    computed: {
      ...mapState(auth_store, ['project']),
      ...mapState(whatsapp_store, [
        'whatsAppConversations',
        'loadingConversations',
        'errorConversations',
        'loadingConversationsReport',
        'errorConversationsReport',
      ]),
      startDateObject() {
        return this.startDate && new Date(this.startDate.replace('-', ' '));
      },
      endDateObject() {
        return this.endDate && new Date(this.endDate.replace('-', ' '));
      },
      beforeItems() {
        return [
          {
            startedBy: this.$t('WhatsApp.config.conversations.conversations_count.table.business'),
            quantity: this.businessInitiated || 0,
          },
          {
            startedBy: this.$t('WhatsApp.config.conversations.conversations_count.table.user'),
            quantity: this.userInitiated || 0,
          },
        ];
      },
      afterItems() {
        return [
          {
            category: this.$t('WhatsApp.config.conversations.conversations_count.table.marketing'),
            quantity: this.afterData?.MARKETING || 0,
          },
          {
            category: this.$t('WhatsApp.config.conversations.conversations_count.table.utility'),
            quantity: this.afterData?.UTILITY || 0,
          },
          {
            category: this.$t(
              'WhatsApp.config.conversations.conversations_count.table.authentication',
            ),
            quantity: this.afterData?.AUTHENTICATION || 0,
          },
          {
            category: this.$t('WhatsApp.config.conversations.conversations_count.table.service'),
            quantity: this.afterData?.SERVICE || 0,
          },
        ];
      },
      hasBeforeAndAfter() {
        return this.hasBefore && this.hasAfter;
      },
      hasBefore() {
        return !!this.beforeItems.find((item) => item.quantity > 0);
      },
      hasAfter() {
        return !!this.afterItems.find((item) => item.quantity > 0);
      },
    },
    methods: {
      ...mapActions(whatsapp_store, ['getConversations', 'requestConversationsReport']),
      handleDateFilter: debounce(async function (event) {
        this.startDate = event.startDate;
        this.endDate = event.endDate;

        const params = {
          start: event.startDate,
          end: event.endDate,
        };

        await this.getConversations({
          code: this.app.code,
          appUuid: this.app.uuid,
          params,
        });

        if (this.errorConversations) {
          const err =
            this.errorConversations?.error_user_msg ||
            this.$t('WhatsApp.config.conversations.fetch_error');
          unnnic.unnnicCallAlert({
            props: {
              text: err,
              type: 'error',
            },
            seconds: 6,
          });
          return;
        }

        this.businessInitiated = this.whatsAppConversations.business_initiated;
        this.userInitiated = this.whatsAppConversations.user_initiated;
        this.totalInitiated = this.whatsAppConversations.total;
        this.afterData = this.whatsAppConversations.templates;
      }, 750),
      async requestReport() {
        const params = removeEmpty({
          project_uuid: this.project,
          start_date: this.startDate,
          end_date: this.endDate,
        });

        await this.requestConversationsReport({
          code: this.app.code,
          appUuid: this.app.uuid,
          params,
        });

        if (this.errorConversationsReport) {
          let errorText =
            this.errorConversationsReport?.error_user_msg ||
            this.$t('WhatsApp.config.conversations.report_error');

          if (this.errorConversationsReport.response?.status === 409) {
            errorText = this.$t('WhatsApp.config.conversations.report_already_processing');
          }
          unnnic.unnnicCallAlert({
            props: {
              text: errorText,
              type: 'error',
            },
            seconds: 6,
          });
          return;
        }

        unnnic.unnnicCallAlert({
          props: {
            text: this.$t('WhatsApp.config.conversations.report_success'),
            type: 'success',
          },
          seconds: 6,
        });
        return;
      },
    },
  };
</script>

<style lang="scss" scoped>
  .conversations {
    display: flex;
    flex-direction: column;
    flex: 1;
    margin-top: $unnnic-spacing-inline-xs;

    &__content {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: $unnnic-spacing-stack-md;

      &__dropdown {
        width: fit-content;
        &-data {
          position: absolute;
          z-index: 1;
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
      }

      &__report {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-sm;
        font-size: $unnnic-font-size-body-gt;
        line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;

        &__label {
          font-weight: $unnnic-font-weight-bold;
          color: $unnnic-color-neutral-darkest;
        }

        &__description {
          font-weight: $unnnic-font-weight-regular;
          color: $unnnic-color-neutral-cloudy;
        }

        &__tooltip {
          width: 33%;
        }

        &__button {
          width: 100%;
        }
      }

      &__tables {
        display: flex;
        flex-direction: column;
        gap: $unnnic-spacing-stack-sm;

        &__section {
          display: flex;
          flex-direction: column;
          gap: $unnnic-spacing-stack-xs;
          ::v-deep .scroll {
            padding-right: 0;
          }
        }
      }
    }

    &__buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: $unnnic-spacing-stack-sm;

      &__close {
        width: 50%;
      }
    }
  }
</style>
