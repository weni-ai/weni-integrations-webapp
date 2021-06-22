import Vue from 'vue';
import VueRouter from 'vue-router';
import Discovery from './views/Discovery.vue';
import Apps from './views/Apps.vue';
import MyApps from './views/MyApps.vue';
import AppDetails from './views/AppDetails.vue';
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
    ],
  },
  {
    name: 'App Detail',
    path: '/apps/:appId/details',
    component: AppDetails,
  },
  // {
  //   name: 'App Config',
  //   path: '/apps/:appId/config',
  //   component: AppConfig,
  // },
  {
    path: '/loginexternal/:token/:org/:project',
    name: 'externalLogin',
    component: null,
    beforeEnter: async (to, from, next) => {
      const { token, org, project } = to.params;
      store.dispatch('externalLogin', { token: token.replace('+', ' ') });
      store.dispatch('selectedOrg', { org });
      store.dispatch('selectedProject', { project });
      next('/');
    },
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
