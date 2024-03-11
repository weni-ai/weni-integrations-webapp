<template>
  <RouterView />
  <div class="survey-container">
    <Survey />
  </div>
</template>

<script>
  import '@weni/unnnic-system';
  import Survey from '@/components/Survey/index.vue';
  import initHelpHero from 'helphero';
  import getEnv from '@/utils/env';

  export default {
    name: 'App',
    components: {
      Survey,
    },
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

<style scoped>
  header {
    line-height: 1.5;
    max-height: 100vh;
  }

  .logo {
    display: block;
    margin: 0 auto 2rem;
  }

  nav {
    width: 100%;
    font-size: 12px;
    text-align: center;
    margin-top: 2rem;
  }

  nav a.router-link-exact-active {
    color: var(--color-text);
  }

  nav a.router-link-exact-active:hover {
    background-color: transparent;
  }

  nav a {
    display: inline-block;
    padding: 0 1rem;
    border-left: 1px solid var(--color-border);
  }

  nav a:first-of-type {
    border: 0;
  }

  @media (min-width: 1024px) {
    header {
      display: flex;
      place-items: center;
      padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
      margin: 0 2rem 0 0;
    }

    header .wrapper {
      display: flex;
      place-items: flex-start;
      flex-wrap: wrap;
    }

    nav {
      text-align: left;
      margin-left: -1rem;
      font-size: 1rem;

      padding: 1rem 0;
      margin-top: 1rem;
    }
  }
</style>
