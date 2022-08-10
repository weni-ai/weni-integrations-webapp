import Vue from 'vue';
import VueRouter from 'vue-router';
import Discovery from './views/Discovery.vue';
import Apps from './views/Apps.vue';
import MyApps from './views/MyApps.vue';
import OtherApps from './views/OtherApps.vue';
import AppDetails from './views/AppDetails.vue';
import WhatsAppTemplatesTable from './views/WhatsAppTemplatesTable.vue';
import store from './store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: { name: 'Discovery' } },
  {
    path: '/apps',
    component: Apps,
    children: [
      {
        name: 'Discovery',
        path: 'discovery',
        component: Discovery,
      },
      {
        name: 'Apps',
        path: 'my',
        component: MyApps,
      },
      {
        name: 'Other Apps',
        path: 'other-apps',
        component: OtherApps,
      },
    ],
  },
  {
    name: 'App Detail',
    path: '/apps/:appCode/details',
    component: AppDetails,
  },
  {
    name: 'WhatsApp Templates',
    path: '/apps/my/:appCode/:appUuid/templates',
    component: WhatsAppTemplatesTable,
  },
  // {
  //   name: 'App Config',
  //   path: '/apps/:appId/config',
  //   component: AppConfig,
  // },
  {
    path: '/loginexternal/:token/:project/:flowOrg',
    name: 'externalLogin',
    component: null,
    beforeEnter: async (to, from, next) => {
      const { token, project, flowOrg } = to.params;
      store.dispatch('externalLogin', { token: token.replace('+', ' ') });
      store.dispatch('selectedProject', { project });
      store.dispatch('selectedFlowOrg', { flowOrg });
      if (to.query.next) {
        next(to.query.next);
      } else {
        next('/');
      }
    },
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.afterEach(() => {
  window.parent.postMessage(
    {
      event: 'changePathname',
      pathname: window.location.pathname,
    },
    '*',
  );
});

export default router;
