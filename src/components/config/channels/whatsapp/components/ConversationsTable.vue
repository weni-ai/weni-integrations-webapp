<template>
  <div class="conversations-table-container">
    <unnnic-table :items="items">
      <template v-slot:header>
        <unnnic-table-row :headers="headers" />
      </template>

      <template v-slot:item="{ item }">
        <unnnic-table-row :headers="headers">
          <template v-slot:userMessages>
            <div :title="item.userMessages" class="break-text">
              {{ item.userMessages }}
            </div>
          </template>

          <template v-slot:businessMessages>
            <div :title="item.businessMessages" class="break-text">
              {{ item.businessMessages }}
            </div>
          </template>

          <template v-slot:total>
            <div :title="item.total" class="break-text">
              {{ item.total }}
            </div>
          </template>
        </unnnic-table-row>
      </template>
    </unnnic-table>
  </div>
</template>

<script>
  export default {
    name: 'ConversationsTable',
    props: {
      userMessages: {
        type: Number,
        default: 0,
      },
      businessMessages: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        headers: [
          {
            id: 'userMessages',
            text: this.$t('WhatsApp.config.conversations.conversations_count.table.user_messages'),
            flex: 1,
          },
          {
            id: 'businessMessages',
            text: this.$t(
              'WhatsApp.config.conversations.conversations_count.table.business_messages',
            ),
            flex: 1,
          },
          {
            id: 'total',
            text: this.$t('WhatsApp.config.conversations.conversations_count.table.total'),
            width: '55px',
          },
        ],
      };
    },
    computed: {
      items() {
        return [
          {
            userMessages: this.userMessages,
            businessMessages: this.businessMessages,
            total: this.total,
          },
        ];
      },
    },
  };
</script>

<style scoped lang="scss">
  ::v-deep .scroll {
    padding-right: 0;
  }
</style>
