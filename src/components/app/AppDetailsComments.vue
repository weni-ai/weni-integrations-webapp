<template>
  <div class="app-details-comments">
    <div v-if="!editMode" class="app-details-comments__header">
      {{ $t('app_details.leave_a_comment') }}
    </div>
    <div v-else class="app-details-comments__header">
      {{ $t('app_details.edit_comment') + ' -&nbsp;' }}
      <div class="app-details-comments__header__cancel" @click="resetFields">
        {{ $t('Cancel') }}
      </div>
    </div>
    <unnnic-input
      ref="comment_input"
      class="app-details-comments__input"
      type="normal"
      iconRight="send-email-3-1"
      tooltipSideIconRight="right"
      size="md"
      :placeholder="$t('app_details.input_placeholder')"
      iconRightClickable
      @change="handleComment"
      v-model="currentComment"
    />
    <!-- TODO: Fix avatar and name when API is ready -->
    <unnnic-comment
      class="app-details-comments__comment"
      v-for="(comment, index) in comments"
      :key="index"
      :avatar="comment.avatar || ''"
      :title="comment.username || 'nome'"
      :time="getCommentTime(comment.created_on)"
      :text="comment.content"
    >
      <unnnic-dropdown v-if="comment.owned" slot="actions">
        <unnnic-icon-svg slot="trigger" icon="navigation-menu-vertical-1" size="sm" />
        <unnnic-dropdown-item>
          <unnnic-button
            type="terciary"
            iconLeft="pencil-write-1"
            :text="$t('app_details.edit_comment')"
            size="small"
            @click="handleUpdate(comment)"
          />
        </unnnic-dropdown-item>
        <unnnic-dropdown-item>
          <unnnic-button
            type="terciary"
            iconLeft="delete-1"
            :text="$t('app_details.delete_comment')"
            size="small"
            @click="handleDelete(comment.uuid)"
          />
        </unnnic-dropdown-item>
      </unnnic-dropdown>
    </unnnic-comment>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';
  import getRelativeTime from '../../utils/time.js';
  import { unnnicCallAlert } from '@weni/unnnic-system';

  export default {
    name: 'AppDetailsComments',
    props: {
      appCode: {
        type: String,
        default: null,
      },
    },
    data() {
      return {
        comments: [],
        currentComment: null,
        editMode: false,
        editCommentUuid: null,
      };
    },
    async mounted() {
      await this.fetchComments(this.appCode);
    },
    methods: {
      ...mapActions(['listComments', 'createComment', 'deleteComment', 'updateComment']),
      async fetchComments(appCode) {
        const { data } = await this.listComments(appCode);
        this.comments = data.reverse();
      },
      /* istanbul ignore next */
      getCommentTime(time) {
        const epoch = new Date(time).getTime();
        return `- ${getRelativeTime(epoch, this.$root.$i18n.locale)}`;
      },
      resetFields() {
        this.editMode = false;
        this.editCommentUuid = null;
        this.currentComment = null;
      },
      async handleComment() {
        if (this.currentComment !== null && this.currentComment.trim() !== '') {
          try {
            if (this.editMode) {
              await this.updateComment({
                code: this.appCode,
                commentUuid: this.editCommentUuid,
                payload: {
                  content: this.currentComment.trim(),
                },
              });
            } else {
              await this.createComment({
                code: this.appCode,
                payload: {
                  content: this.currentComment.trim(),
                },
              });
            }
            await this.fetchComments(this.appCode);
          } catch (err) {
            unnnicCallAlert({
              props: {
                text: this.$t('app_details.status_error'),
                title: 'Error',
                icon: 'check-circle-1-1',
                scheme: 'feedback-red',
                position: 'bottom-right',
                closeText: this.$t('close'),
              },
              seconds: 3,
            });
          } finally {
            this.resetFields();
          }
        }
      },
      async handleDelete(commentUuid) {
        try {
          await this.deleteComment({
            code: this.appCode,
            commentUuid,
          });

          await this.fetchComments(this.appCode);
        } catch (err) {
          unnnicCallAlert({
            props: {
              text: this.$t('app_details.status_error'),
              title: 'Error',
              icon: 'check-circle-1-1',
              scheme: 'feedback-red',
              position: 'bottom-right',
              closeText: this.$t('close'),
            },
            seconds: 3,
          });
        }
      },
      handleUpdate(comment) {
        this.editMode = true;
        this.editCommentUuid = comment.uuid;
        this.currentComment = comment.content;

        this.$refs.comment_input.$el.children[0].children[0].focus();
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-details-comments {
    &__header {
      display: flex;
      font-family: $unnnic-font-family-secondary;
      font-weight: $unnnic-font-weight-regular;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      color: $unnnic-color-neutral-cloudy;
      margin-bottom: $unnnic-spacing-stack-xs;

      &__cancel {
        text-decoration: underline;
        cursor: pointer;
      }
    }

    &__input {
      margin-bottom: $unnnic-spacing-stack-md;
    }

    &__comment {
      margin-bottom: $unnnic-spacing-stack-md;
    }
  }
</style>
