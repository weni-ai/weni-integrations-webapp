<template>
  <button @click="callAlert">Launch alert</button>
</template>

<script>
  import alert from '../../utils/call';

  export default {
    props: {
      title: {
        type: String,
        default: null,
      },
      text: {
        type: String,
        default: null,
      },
      icon: {
        type: String,
        default: null,
      },
      enabled: {
        type: Boolean,
        default: true,
      },
      scheme: {
        type: String,
        default: null,
      },
      seconds: {
        type: Number,
        default: 3,
      },
      closeText: {
        type: String,
        default: null,
      },
      position: {
        type: String,
        default: 'top-right',
      },
    },
    methods: {
      callAlert() {
        alert.callAlert({ props: this.$props, seconds: this.seconds });
      },
    },
  };
</script>
