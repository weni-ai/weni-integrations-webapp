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

      <div>
        <div class="conversations__content__label">
          {{ $t('WhatsApp.config.conversations.conversations_count.label') }}
        </div>

        <conversations-table
          :userMessages="userInitiated"
          :businessMessages="businessInitiated"
          :total="totalInitiated"
        />
      </div>

      <div class="conversations__content__report">
        <span class="conversations__content__report__label">
          {{ $t('WhatsApp.config.conversations.report.label') }}
        </span>

        <span class="conversations__content__report__description">
          {{ $t('WhatsApp.config.conversations.report.description') }}
        </span>

        <unnnic-button
          class="conversations__content__report__button"
          type="secondary"
          size="small"
          @click="requestReport"
        >
          {{ $t('WhatsApp.config.conversations.report.button') }}
        </unnnic-button>
      </div>
    </div>
    <div class="conversations__buttons">
      <unnnic-button
        class="conversations__buttons__close"
        type="secondary"
        size="large"
        :text="$t('general.Close')"
        @click="() => this.$emit('close')"
      />
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce';
  import ConversationsTable from '../ConversationsTable.vue';
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'ConversationsTab',
    components: {
      ConversationsTable,
    },
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
      ...mapState('WhatsApp', [
        'whatsAppConversations',
        'loadingConversations',
        'errorConversations',
      ]),
      startDateObject() {
        return this.startDate && new Date(this.startDate.replace('-', ' '));
      },
      endDateObject() {
        return this.endDate && new Date(this.endDate.replace('-', ' '));
      },
    },
    methods: {
      ...mapActions('WhatsApp', ['getConversations', 'requestConversationsReport']),
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
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.conversations.fetch_error'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 6,
          });
          return;
        }

        this.businessInitiated = this.whatsAppConversations.business_initiated;
        this.userInitiated = this.whatsAppConversations.user_initiated;
        this.totalInitiated = this.whatsAppConversations.total;
      }, 750),
      async requestReport() {
        const params = {
          start: this.startDate,
          end: this.endDate,
        };

        await this.requestConversationsReport({
          code: this.app.code,
          appUuid: this.app.uuid,
          params,
        });
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

        margin-bottom: $unnnic-spacing-stack-xs;
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

        &__button {
          width: 33%;
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
