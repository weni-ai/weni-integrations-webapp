<template>
  <div>
    <router-view />
  </div>
</template>

<script>
  import '@weni/unnnic-system';
  import initHelpHero from 'helphero';
  import getEnv from '@/utils/env';

  export default {
    name: 'App',
    data() {
      return {
        connectBaseURL: '',
      };
    },
    mounted() {
      if (getEnv('VUE_APP_HELPHERO_ID')) {
        const hlp = initHelpHero(getEnv('VUE_APP_HELPHERO_ID'));
        hlp.anonymous();
      }

      window.parent.postMessage(
        {
          event: 'getConnectBaseURL',
        },
        '*',
      );
      window.parent.postMessage(
        {
          event: 'getLanguage',
        },
        '*',
      );
      window.addEventListener('message', (event) => {
        const eventName = event.data && event.data.event;
        if (eventName === 'setConnectBaseURL') {
          this.connectBaseURL = event.data.connectBaseURL;
          this.translateAllLinks();
        }
        if (eventName === 'setLanguage') {
          this.$i18n.locale = event.data.language;
        }
      });
    },
    methods: {
      translateAllLinks() {
        if (!this.connectBaseURL) {
          return;
        }
        const url = new URL(this.connectBaseURL);
        const debug = url.host && url.host.includes('develop');
        document.querySelectorAll('a[href]').forEach((link) => {
          const internalHref = link.getAttribute('internal-href') || link.getAttribute('href');
          if (['http://', 'https://'].some((initial) => internalHref.startsWith(initial))) {
            return;
          }
          const dashHref = this.connectBaseURL + internalHref;
          if (link.translateLinkConnect) {
            if (link.getAttribute('href') === dashHref) {
              return;
            }
            link.removeEventListener('click', link.translateLinkConnect);
          }
          link.setAttribute('internal-href', internalHref);
          link.setAttribute('href', dashHref);
          const randomId = Math.floor(Math.random() * 100);
          link.addEventListener(
            'click',
            (link.translateLinkConnect = () => {
              if (debug) {
                // eslint-disable-next-line no-console
                console.log(`TranslateLinkConnectId ${randomId}`);
              }
              link.setAttribute('href', internalHref);
              setTimeout(() => {
                link.setAttribute('href', dashHref);
              }, 0);
            }),
          );
        });
      },
    },
    updated() {
      this.translateAllLinks();
    },
  };
</script>

<style lang="scss">
  body {
    margin: $unnnic-spacing-inset-md;
    background-color: $unnnic-color-background-snow;
    font-family: $unnnic-font-family-secondary, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }
</style>
