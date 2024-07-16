<template>
  <unnnic-dropdown class="table-action__dropdown" :position="position">
    <template #trigger>
      <unnnic-button size="small" type="tertiary" iconCenter="navigation-menu-vertical-1" />
    </template>

    <unnnic-dropdown-item
      :class="['table-action__dropdown__item', `table-action__dropdown__item--${option.id}`]"
      v-for="option in options"
      :key="option.id"
      @click="() => option.action()"
      :id="option.id"
    >
      <unnnic-icon-svg :icon="option.icon" size="sm" :scheme="option.scheme" />
      {{ option.title }}
    </unnnic-dropdown-item>
  </unnnic-dropdown>
</template>

<script>
  import { mapActions, mapState } from 'pinia';
  import { insights_store } from '@/stores/modules/insights.store';
  import { whatsapp_store } from '@/stores/modules/appType/channels/whatsapp.store';
  import unnnic from '@weni/unnnic-system';

  export default {
    name: 'TableActionButton',
    props: {
      templateUuid: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        default: 'bottom-left',
        validator(value) {
          return ['bottom-left', 'bottom-right', 'top-left', 'top-right'].indexOf(value) !== -1;
        },
      },
      data: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        options: [
          {
            id: 'add_language',
            title: this.$t('WhatsApp.templates.table.actions.add_language'),
            icon: 'add-circle-1',
            scheme: 'neutral-darkest',
            action: () => {
              const { appCode, appUuid } = this.$route.params;
              this.$router.push({
                path: `/apps/my/${appCode}/${appUuid}/templates/edit/${this.templateUuid}`,
              });
            },
          },
          {
            id: 'see_details',
            title: this.$t('WhatsApp.templates.table.actions.see_details'),
            icon: 'pencil-write-1',
            scheme: 'neutral-darkest',
            action: () => {
              const { appUuid, appCode } = this.$route.params;
              this.setAppUuid({ appUuid: appUuid });
              this.setSelectedTemplate({ template: this.data });
              this.$router.push({
                path: `/apps/my/${appCode}/${appUuid}/templates/template-details`,
                hash: `#${this.data.uuid}`,
              });
            },
          },
          {
            id: 'delete_language',
            title: this.$t('WhatsApp.templates.table.actions.delete_language'),
            icon: 'bin-1-1',
            scheme: 'feedback-red',
            action: /* istanbul ignore next */ async () => {
              const { appUuid } = this.$route.params;
              await this.deleteTemplateMessage({ appUuid, templateUuid: this.templateUuid });

              if (this.errorDeleteTemplateMessage) {
                let errorMsg = this.$t('WhatsApp.templates.error.delete_template');
                const responseError = this.errorDeleteTemplateMessage.response.data.error;
                if (responseError) {
                  errorMsg = this.$t(responseError);
                }
                unnnic.unnnicCallAlert({
                  props: {
                    text: errorMsg,
                    type: 'error',
                  },
                  seconds: 6,
                });
                return;
              }

              this.$emit('refresh-table');
            },
          },
        ],
      };
    },
    methods: {
      ...mapActions(whatsapp_store, ['deleteTemplateMessage']),
      ...mapActions(insights_store, ['setSelectedTemplate', 'setAppUuid']),
    },
    computed: {
      ...mapState(whatsapp_store, ['errorDeleteTemplateMessage']),
    },
  };
</script>

<style lang="scss" scoped>
  .table-action {
    &__dropdown {
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-md;
      line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
      color: $unnnic-color-neutral-dark;

      ::v-deep .unnnic-dropdown__content {
        width: max-content;
        height: auto;
      }

      &__item {
        &--delete_language {
          color: $unnnic-color-feedback-red;
        }
      }
    }
  }
</style>
