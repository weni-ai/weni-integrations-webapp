<template>
  <div class="wpp_template_details">
    <!-- Header -->
    <div class="wpp_template_details__header">
      <div class="wpp_template_details__header__title">
        <div class="wpp_template_details__header__title__text">
          {{ selectedTemplate?.name }}
        </div>
        <div class="wpp_template_details__header__about__title__tag">
          <UnnnicTag
            scheme="neutral-dark"
            :text="selectedTemplate?.category"
          />
        </div>
      </div>
      <div class="wpp_template_details__header__button">
        <UnnnicButton
          ref="wpp_template_details__button__edit"
          :text="$t('WhatsApp.template_details.button.edit_model')"
          type="secondary"
          @click="redirectEdit"
        />
      </div>
    </div>
    <!-- Tabs -->
    <div class="wpp_template_details__tabs">
      <UnnnicTab
        initialTab="first"
        :tabs="['first']"
      >
        <template #tab-head-first>{{
          $t('WhatsApp.template_details.summary.title')
        }}</template>
        <template #tab-panel-first>
          <Summary />
        </template>
      </UnnnicTab>
    </div>
  </div>
</template>

<script>
import Summary from '../../components/TemplateDetails/Summary.vue';
import { mapState } from 'pinia';
import { insights_store } from '@/stores/modules/insights.store';
export default {
  name: 'AppDetails',
  components: {
    // eslint-disable-next-line vue/no-reserved-component-names
    Summary,
  },
  data() {
    return {
      route: this.$route,
      crumb_title: this.$t('WhatsApp.template_details.crumbs.model_details'),
    };
  },
  computed: {
    ...mapState(insights_store, ['selectedTemplate', 'appUuid']),
  },
  methods: {
    redirectTo(crumb) {
      if (
        crumb.meta ===
          this.$t('WhatsApp.template_details.crumbs.model_details') ||
        crumb.meta === ''
      ) {
        return;
      }
      this.$router.push(crumb.path);
    },
    redirectEdit() {
      this.$router.push({
        path: `/apps/my/wpp-cloud/${this.appUuid}/templates/edit/${this.selectedTemplate?.uuid}`,
      });
    },
  },
};
</script>
<style lang="scss">
@import './styles.scss';
</style>
