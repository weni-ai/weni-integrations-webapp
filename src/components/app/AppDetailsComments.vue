<template>
  <div class="app-details-comments">
    <div
      v-if="!editMode"
      class="app-details-comments__header"
    >
      {{ $t('apps.details.comments.leave_a_comment') }}
    </div>
    <div
      v-else
      class="app-details-comments__header"
    >
      {{ $t('apps.details.comments.edit_comment') + ' -&nbsp;' }}
      <div
        class="app-details-comments__header__cancel"
        @click="resetFields"
      >
        {{ $t('general.Cancel') }}
      </div>
    </div>
    <UnnnicInput
      ref="comment_input"
      v-model="currentComment"
      class="app-details-comments__input"
      type="normal"
      iconRight="send-email-3-1"
      tooltipSideIconRight="right"
      size="md"
      :placeholder="$t('apps.details.comments.input_placeholder')"
      iconRightClickable
      @change="handleComment"
    />
    <UnnnicComment
      v-for="(comment, index) in commentsList"
      :key="index"
      class="app-details-comments__comment"
      :title="comment.owned ? $t('general.You') : comment.owner.first_name"
      :time="getCommentTime(comment.created_on)"
      :text="comment.content"
    >
      <template #avatar>
        <Avatar
          v-if="!comment.owner.photo_url"
          :username="fullOwnerName(comment.owner)"
        />
        <img
          v-else
          class="app-details-comments__comment__avatar"
          :src="comment.owner.photo_url"
          alt=""
        />
      </template>
      <template #actions>
        <UnnnicDropdown v-if="comment.owned">
          <template #trigger>
            <UnnnicIconSvg
              icon="navigation-menu-vertical-1"
              size="sm"
            />
          </template>
          <UnnnicDropdownItem>
            <UnnnicButton
              type="tertiary"
              iconLeft="pencil-write-1"
              :text="$t('apps.details.comments.edit_comment')"
              size="small"
              @click="handleUpdate(comment)"
            />
          </UnnnicDropdownItem>
          <UnnnicDropdownItem>
            <UnnnicButton
              type="tertiary"
              iconLeft="delete-1"
              :text="$t('apps.details.comments.delete_comment')"
              size="small"
              @click="confirmDelete(comment.uuid)"
            />
          </UnnnicDropdownItem>
        </UnnnicDropdown>
      </template>
    </UnnnicComment>

    <UnnnicModal
      ref="unnnic-remove-modal"
      :showModal="showRemoveModal"
      :text="$t('apps.details.comments.remove.title')"
      scheme="feedback-red"
      modalIcon="alert-circle-1"
      @close="toggleRemoveModal"
    >
      <template #message>
        <span v-html="$t('apps.details.comments.remove.description')"></span>
      </template>
      <template #options>
        <UnnnicButton
          ref="unnnic-remove-modal-close-button"
          type="tertiary"
          @click="toggleRemoveModal"
          >{{ $t('general.Cancel') }}</UnnnicButton
        >
        <UnnnicButton
          ref="unnnic-remove-modal-navigate-button"
          type="primary"
          scheme="feedback-red"
          @click="handleDelete(currentRemovalUuid)"
        >
          {{ $t('apps.details.comments.remove.remove') }}
        </UnnnicButton>
      </template>
    </UnnnicModal>
  </div>
</template>

<script>
import { app_type } from '@/stores/modules/appType/appType.store.js';
import { mapActions, mapState } from 'pinia';
import { comments_store } from '@/stores/modules/appType/comments/comments.store.js';
import getRelativeTime from '../../utils/time.js';
import unnnic from '@weni/unnnic-system';
import Avatar from 'vue-avatar';

export default {
  name: 'AppDetailsComments',
  components: { Avatar },
  props: {
    appCode: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      currentComment: null,
      editMode: false,
      editCommentUuid: null,
      showRemoveModal: false,
      currentRemovalUuid: null,
    };
  },
  async mounted() {
    await this.listComments(this.appCode);
  },
  computed: {
    ...mapState(app_type, [
      'commentsList',
      'errorListComments',
      'errorCreateComment',
      'errorDeleteComment',
      'errorUpdateComment',
    ]),
  },
  methods: {
    ...mapActions(comments_store, [
      'listComments',
      'createComment',
      'deleteComment',
      'updateComment',
    ]),
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
    fullOwnerName(owner) {
      return owner.first_name + ' ' + owner.last_name;
    },
    toggleRemoveModal() {
      this.showRemoveModal = !this.showRemoveModal;
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

            if (this.errorUpdateComment) {
              throw new Error(this.errorUpdateComment);
            }
          } else {
            await this.createComment({
              code: this.appCode,
              payload: {
                content: this.currentComment.trim(),
              },
            });

            if (this.errorCreateComment) {
              throw new Error(this.errorCreateComment);
            }
          }
          await this.listComments(this.appCode);

          if (this.errorListComments) {
            throw new Error(this.errorListComments);
          }
        } catch (err) {
          unnnic.unnnicCallAlert({
            props: {
              text: this.$t('apps.details.status_error'),
              type: 'error',
            },
            seconds: 3,
          });
        } finally {
          this.resetFields();
        }
      }
    },
    confirmDelete(commentUuid) {
      this.showRemoveModal = true;
      this.currentRemovalUuid = commentUuid;
    },
    async handleDelete(commentUuid) {
      try {
        await this.deleteComment({
          code: this.appCode,
          commentUuid,
        });

        if (this.errorDeleteComment) {
          throw new Error(this.errorDeleteComment);
        }

        this.showRemoveModal = false;
        this.currentRemovalUuid = null;
        await this.listComments(this.appCode);

        if (this.errorListComments) {
          throw new Error(this.errorListComments);
        }

        unnnic.unnnicCallAlert({
          props: {
            text: this.$t('apps.details.comments.remove.status_text'),
            type: 'success',
          },
          seconds: 3,
        });
      } catch (err) {
        unnnic.unnnicCallAlert({
          props: {
            text: this.$t('apps.details.status_error'),
            type: 'error',
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
    color: $unnnic-color-fg-base;
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

    &__avatar {
      width: 56px;
      object-fit: cover;
      border-radius: $unnnic-border-radius-pill;
    }
  }
}
</style>
