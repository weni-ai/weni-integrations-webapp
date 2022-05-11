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
          <unnnic-date-picker v-if="showDateFilter" size="small" @change="handleDateFilter" />
        </div>
      </div>

      <div class="conversations__content__label">
        {{ $t('WhatsApp.config.conversations.conversations_count.label') }}
      </div>

      <conversations-table
        :userMessages="userInitiated"
        :businessMessages="businessInitiated"
        :total="totalInitiated"
      />
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
  import { mapActions } from 'vuex';

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
    methods: {
      ...mapActions(['getConversations']),
      handleDateFilter: debounce(async function (event) {
        this.startDate = event.startDate;
        this.endDate = event.endDate;

        const params = {
          start: event.startDate,
          end: event.endDate,
        };

        try {
          const { data } = await this.getConversations({
            code: this.app.code,
            appUuid: this.app.uuid,
            params,
          });
          this.businessInitiated = data.business_initiated;
          this.userInitiated = data.user_initiated;
          this.totalInitiated = data.total;
        } catch (err) {
          unnnicCallAlert({
            props: {
              text: this.$t('WhatsApp.config.conversations.fetch_error'),
              title: 'Error',
              icon: 'alert-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('general.Close'),
            },
            seconds: 3,
          });
        }
      }, 750),
    },
    computed: {
      startDateObject() {
        return this.startDate && new Date(this.startDate);
      },
      endDateObject() {
        return this.endDate && new Date(this.endDate);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .conversations {
    display: flex;
    flex-direction: column;
    flex: 1;

    &__content {
      display: flex;
      flex-direction: column;
      flex: 1;

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

        margin: $unnnic-spacing-stack-xs 0;
      }
    }

    &__buttons {
      display: flex;
      justify-content: flex-end;

      &__close {
        width: 50%;
      }
    }
  }
</style>