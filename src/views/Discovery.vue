<template>
  <div>
    <app-grid section="channel" type="add" :loading="channels.loading" :apps="channels.data" />
  </div>
</template>
<script>
  import AppGrid from '../components/AppGrid.vue';
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'Discovery',
    components: { AppGrid },
    data() {
      return {
        channels: {
          loading: true,
          data: null,
        },
      };
    },
    async mounted() {
      await this.fetchChannels();
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
      }),
    },
    methods: {
      ...mapActions(['getAllAppTypes']),
      async fetchChannels() {
        this.channels.loading = true;
        const params = {
          category: 'channel',
        };
        const { data } = await this.getAllAppTypes({ params });
        this.channels.data = data;
        this.channels.loading = false;
      },
    },
  };
</script>
<style lang="scss"></style>
