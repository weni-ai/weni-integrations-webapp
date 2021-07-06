<template>
  <div class="app-details-comments">
    <div class="app-details-comments__header">{{ $t('Leave_a_comment') }}</div>
    <unnnic-input
      class="app-details-comments__input"
      type="normal"
      iconRight="send-email-3-1"
      tooltipSideIconRight="right"
      size="md"
      :placeholder="$t('A_good_comment_can_help_others_that_are_learning')"
    />
    <unnnic-comment
      class="app-details-comments__comment"
      v-for="comment in comments"
      :key="comment.id"
      :avatar="comment.avatar"
      :title="comment.username"
      :time="getCommentTime(comment.time)"
      :text="comment.text"
    >
      <unnnic-dropdown v-if="comment.owned" slot="actions">
        <unnnic-icon-svg slot="trigger" icon="navigation-menu-vertical-1" size="sm" />
        <unnnic-dropdown-item>
          <unnnic-button
            type="terciary"
            iconLeft="pencil-write-1"
            text="Edit comment"
            size="small"
          />
        </unnnic-dropdown-item>
        <unnnic-dropdown-item>
          <unnnic-button type="terciary" iconLeft="delete-1" text="Delete Comment" size="small" />
        </unnnic-dropdown-item>
      </unnnic-dropdown>
    </unnnic-comment>
  </div>
</template>

<script>
  import getRelativeTime from '../../utils/time.js';

  export default {
    name: 'AppDetailsComments',
    data() {
      return {
        comments: [
          {
            id: '1',
            username: 'Paulo',
            avatar:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8qiVsOfzasQWdcm81N6WmPicyHp50mMkvgw&usqp=CAU',
            text: 'This is a comment text',
            time: '1625064859501',
            owned: true,
          },
          {
            id: '2',
            username: 'Sandrinho',
            avatar:
              'https://cdn.discordapp.com/avatars/776103761374216212/5004d21f7372fce490283bb090ceeb42.webp?size=128',
            text: 'Munguzá é salgado 🤮',
            time: '1625063004488',
            owned: false,
          },
        ],
      };
    },
    methods: {
      getCommentTime(time) {
        return `- ${getRelativeTime(time, this.$root.$i18n.locale)}`;
      },
    },
  };
</script>

<style scoped lang="scss">
  .app-details-comments {
    &__header {
      font-family: $unnnic-font-family-secondary;
      font-weight: $unnnic-font-weight-regular;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      color: $unnnic-color-neutral-cloudy;
      margin-bottom: $unnnic-spacing-stack-xs;
    }

    &__input {
      margin-bottom: $unnnic-spacing-stack-md;
    }

    &__comment {
      margin-bottom: $unnnic-spacing-stack-md;
    }
  }
</style>
