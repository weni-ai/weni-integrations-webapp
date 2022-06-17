<template>
  <div>
    <app-grid
      section="channel"
      type="add"
      :loading="channels.loading"
      :apps="channels.data"
      @update="fetchChannels"
    />
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
      await this.loadChannels();
    },
    computed: {
      ...mapGetters({
        getSelectedProject: 'getSelectedProject',
      }),
    },
    methods: {
      ...mapActions(['getAllAppTypes']),
      async loadChannels() {
        this.channels.loading = true;
        await this.fetchChannels();
        this.channels.loading = false;
      },
      async fetchChannels() {
        const params = {
          category: 'channel',
        };
        const { data } = await this.getAllAppTypes({ params });
        this.channels.data = data.reverse();
      },
    },
  };
</script>
<style lang="scss"></style>
