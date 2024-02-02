import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: { name: 'Discovery' } },
  {
    path: '/apps',
    component: () => import('@/views/Apps/index.vue'),
    children: [
      {
        name: 'Discovery',
        path: 'discovery',
        component: () => import('@/views/Discovery/index.vue'),
      },
      {
        name: 'Apps',
        path: 'my',
        component: () => import('@/views/MyApps/index.vue'),
      },
      {
        name: 'Other Apps',
        path: 'other-apps',
        component: () => import('@/views/OtherApps/index.vue'),
      },
      {
        name: 'Insights',
        path: 'insights',
        component: () => import('@/views/Insights/index.vue'),
      },
    ],
  },
  {
    name: 'App Detail',
    path: '/apps/:appCode/details',
    component: () => import('@/views/AppDetails/index.vue'),
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
        children: [
          {
            name: 'Create Template',
            path: 'create',
            component: () => import('./views/whatsAppTemplates/Form.vue'),
            meta: {
              crumb_title: 'WhatsApp.templates.create_form.crumb_title',
            },
          },
          {
            name: 'Edit Template',
            path: 'edit/:templateUuid',
            component: () => import('./views/whatsAppTemplates/Form.vue'),
            meta: {
              crumb_title: 'WhatsApp.templates.edit_form.crumb_title',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/apps/my/:appCode/:appUuid/catalogs',
    component: () => import('@/views/whatsAppCatalogs/Base.vue'),
    children: [
      {
        name: 'WhatsApp Catalogs List',
        path: '',
        component: () => import('@/views/whatsAppCatalogs/List.vue'),
        meta: {
          crumb_title: 'WhatsApp.catalog.list.title',
        },
        children: [
          {
            name: 'WhatsApp Catalog Products',
            path: ':catalogUuid/products',
            component: () => import('@/views/whatsAppCatalogs/CatalogProducts.vue'),
            meta: {
              crumb_title: 'WhatsApp.catalog.products.title',
            },
            props: (route) => {
              return {
                catalogName: route.query.catalogName,
              };
            },
          },
        ],
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
