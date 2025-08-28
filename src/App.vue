<template>
  <div class="app">
    <RouterView class="content" />
  </div>
</template>

<script>
  import '@weni/unnnic-system';
  import initHelpHero from 'helphero';
  import getEnv from '@/utils/env';
  import { auth_store } from '@/stores/modules/auth.store';
  import { mapActions } from 'pinia';

  export default {
    name: 'App',
    data() {
      return {
        connectBaseURL: '',
      };
    },
    mounted() {
      this.retriveAuthToken();
      this.retriveSelectedOrg();
      this.retriveSelectedProject();
      this.retriveSelectedFlowOrg();
      if (getEnv('HELPHERO_ID')) {
        const hlp = initHelpHero(getEnv('HELPHERO_ID'));
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
      ...mapActions(auth_store, [
        'retriveAuthToken',
        'retriveSelectedOrg',
        'retriveSelectedProject',
        'retriveSelectedFlowOrg',
      ]),
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

<style lang="scss" scoped>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .content {
    padding: $unnnic-spacing-md;
  }
</style>

<style lang="scss">
  html {
    height: 100%;
  }
  body {
    height: 100%;
    margin: 0;
    background-color: $unnnic-color-background-snow;
    font-family: $unnnic-font-family-secondary, Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .alert-container {
    z-index: 9999;
  }
</style>
