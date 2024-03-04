<template>
  <div class="survey">
    <transition name="fade">
      <div v-if="isOpen" class="survey__content">
        <unnnic-input
          class="survey__content__input"
          v-model="answer"
          maxlength="255"
          size="sm"
          :label="$t('survey.content.question')"
        />

        <div class="survey__content__buttons">
          <unnnic-button
            class="survey__content__buttons__exit"
            type="tertiary"
            size="small"
            :text="$t('general.exit')"
            @click="closeSurvey"
          />

          <unnnic-button
            class="survey__content__buttons__send"
            type="secondary"
            size="small"
            :text="$t('general.send')"
            :loading="surveyState.loadingSurveyAnswer"
            @click="sendSurvey"
          />
        </div>
      </div>
    </transition>

    <div class="survey__toggle" @click="toggleContent">
      <unnnic-icon-svg icon="question-circle-1" scheme="neutral-darkest" size="lg" />
    </div>
  </div>
</template>

<script>
  import { unnnicCallAlert } from '@weni/unnnic-system';
  import { survey_store } from '@/stores/modules/survey.store';

  export default {
    name: 'Survey',
    data() {
      return {
        isOpen: false,
        answer: '',
      };
    },
    computed: {
      surveyState() {
        return {
          surveyStatus: survey_store().surveyStatus,
          loadingSurveyAnswer: survey_store().loadingSurveyAnswer,
          errorSurveyAnswer: survey_store().errorSurveyAnswer,
          surveyAnswerResult: survey_store().surveyAnswerResult,
        };
      },
    },
    mounted() {
      this.isOpen = this.surveyState.surveyStatus === 'TO_ANSWER';
    },
    methods: {
      closeSurvey() {
        this.isOpen = false;
        survey_store().setSurveyStatus({ status: 'CLOSED' });
      },
      async sendSurvey() {
        const payload = {
          answer: this.answer,
        };

        await survey_store().submitSurveyAnswer({ payload });

        if (this.surveyState.errorSurveyAnswer) {
          this.callModal({
            type: 'Error',
            text: this.$t(`survey.error_submit_answer`),
          });
          return;
        }

        this.isOpen = false;
        survey_store().setSurveyStatus({ status: 'ANSWERED' });
        this.answer = '';

        this.callModal({
          type: 'Success',
          text: this.$t(`survey.success_submit_answer`),
        });
      },
      toggleContent() {
        this.isOpen = !this.isOpen;

        if (this.surveyState.surveyStatus !== 'ANSWERED') {
          survey_store().setSurveyStatus({ status: this.isOpen ? 'TO_ANSWER' : 'CLOSED' });
        }
      },
      callModal({ text, type }) {
        unnnicCallAlert({
          props: {
            text: text,
            title: type === 'Success' ? this.$t('general.success') : this.$t('general.error'),
            icon: type === 'Success' ? 'check-circle-1-1' : 'alert-circle-1',
            scheme: type === 'Success' ? 'feedback-green' : 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
          },
          seconds: 6,
        });
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import './styles.scss';
</style>
