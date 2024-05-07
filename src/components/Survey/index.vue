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
            @click.native="closeSurvey"
          />

          <unnnic-button
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

    <div class="survey__toggle" @click="toggleContent">
      <unnnic-icon-svg icon="question-circle-1" scheme="neutral-darkest" size="lg" />
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'pinia';
  import { survey_store } from '@/stores/modules/survey.store';
<<<<<<< HEAD
  import unnnicCallAlert from '@weni/unnnic-system';
=======
  import alert from '@/utils/call';
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800

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
<<<<<<< HEAD
            type: 'Error',
=======
            type: 'error',
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
            text: this.$t(`survey.error_submit_answer`),
          });
          return;
        }

        this.isOpen = false;
        this.setSurveyStatus({ status: 'ANSWERED' });
        this.answer = '';

        this.callModal({
<<<<<<< HEAD
          type: 'Success',
=======
          type: 'success',
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
<<<<<<< HEAD
        unnnicCallAlert({
          props: {
            text: text,
            title: type === 'Success' ? this.$t('general.success') : this.$t('general.error'),
            icon: type === 'Success' ? 'check-circle-1-1' : 'alert-circle-1',
            scheme: type === 'Success' ? 'feedback-green' : 'feedback-red',
            position: 'bottom-right',
            closeText: this.$t('general.Close'),
=======
        alert.callAlert({
          props: {
            text,
            type,
>>>>>>> 4e067734185eee6ee14ddd4329b9599b20178800
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
