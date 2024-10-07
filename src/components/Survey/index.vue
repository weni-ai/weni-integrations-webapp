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
            ref="exit-button"
            class="survey__content__buttons__exit"
            type="tertiary"
            size="small"
            :text="$t('general.exit')"
            @click.native="closeSurvey"
          />

          <unnnic-button
            ref="send-button"
            class="survey__content__buttons__send"
            type="secondary"
            size="small"
            :text="$t('general.send')"
            :loading="loadingSurveyAnswer"
            @click.native="sendSurvey"
          />
        </div>
      </div>
    </transition>

    <div class="survey__toggle" @click="toggleContent" ref="survey-toggle">
      <unnnic-icon-svg icon="question-circle-1" scheme="neutral-darkest" size="lg" />
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'pinia';
  import { survey_store } from '@/stores/modules/survey.store';
  import unnnic from '@weni/unnnic-system';

  export default {
    name: 'Survey',
    data() {
      return {
        isOpen: false,
        answer: '',
      };
    },
    computed: {
      ...mapState(survey_store, [
        'surveyStatus',
        'loadingSurveyAnswer',
        'errorSurveyAnswer',
        'surveyAnswerResult',
      ]),
    },
    mounted() {
      this.isOpen = this.surveyStatus === 'TO_ANSWER';
    },
    methods: {
      ...mapActions(survey_store, ['setSurveyStatus', 'submitSurveyAnswer']),
      closeSurvey() {
        this.isOpen = false;
        this.setSurveyStatus({ status: 'CLOSED' });
      },
      async sendSurvey() {
        const payload = {
          answer: this.answer,
        };

        await this.submitSurveyAnswer({ payload });

        if (this.errorSurveyAnswer) {
          this.callModal({
            type: 'error',
            text: this.$t(`survey.error_submit_answer`),
          });
          return;
        }

        this.isOpen = false;
        this.setSurveyStatus({ status: 'ANSWERED' });
        this.answer = '';

        this.callModal({
          type: 'success',
          text: this.$t(`survey.success_submit_answer`),
        });
      },
      toggleContent() {
        this.isOpen = !this.isOpen;

        if (this.surveyStatus !== 'ANSWERED') {
          this.setSurveyStatus({ status: this.isOpen ? 'TO_ANSWER' : 'CLOSED' });
        }
      },
      callModal({ text, type }) {
        unnnic.unnnicCallAlert({
          props: {
            text,
            type,
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
