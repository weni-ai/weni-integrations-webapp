import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: { name: 'Discovery' } },
  {
    path: '/apps',
    component: () => import('@/views/Apps.vue'),
    children: [
      {
        name: 'Discovery',
        path: 'discovery',
        component: () => import('@/views/Discovery.vue'),
      },
      {
        name: 'Apps',
        path: 'my',
        component: () => import('@/views/MyApps.vue'),
      },
      {
        name: 'Other Apps',
        path: 'other-apps',
        component: () => import('@/views/OtherApps.vue'),
      },
    ],
  },
  {
    name: 'App Detail',
    path: '/apps/:appCode/details',
    component: () => import('@/views/AppDetails.vue'),
  },
  {
    path: '/apps/my/:appCode/:appUuid/templates',
    component: () => import('@/views/whatsAppTemplates/Base.vue'),
    children: [
      {
        name: 'WhatsApp Templates Table',
        path: '',
        component: () => import('@/views/whatsAppTemplates/Table.vue'),
        meta: {
          crumb_title: 'WhatsApp.templates.table.crumb_title',
        },
      },
      {
        name: 'Create Template',
        path: 'create',
        component: () => import('./views/whatsAppTemplates/Form.vue'),
        meta: {
          crumb_title: 'WhatsApp.templates.form.crumb_title',
        },
      },
      {
        name: 'Edit Template',
        path: 'edit/:templateUuid',
        component: () => import('./views/whatsAppTemplates/Form.vue'),
        meta: {
          crumb_title: 'WhatsApp.templates.form.crumb_title',
        },
      },
    ],
  },
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
