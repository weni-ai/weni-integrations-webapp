import { createRouter, createWebHistory } from 'vue-router';
import { auth_store } from '@/stores/modules/auth.store';
import setLocal from '@/utils/storage';

let currentRouterInstance = null;

export function createIntegrationsRouter(routerBase = '/') {
  const router = createRouter({
    mode: 'history',
    history: createWebHistory(routerBase),
    routes: [
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
        ],
      },
      {
        name: 'App Details',
        path: '/:appCode/details',
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
                component: () => import('@/views/whatsAppTemplates/Form.vue'),
                meta: {
                  crumb_title: 'WhatsApp.templates.create_form.crumb_title',
                },
              },
              {
                name: 'Edit Template',
                path: 'edit/:templateUuid',
                component: () => import('@/views/whatsAppTemplates/Form.vue'),
                meta: {
                  crumb_title: 'WhatsApp.templates.edit_form.crumb_title',
                },
              },
              {
                name: 'Template Details',
                path: 'template-details',
                component: () => import('@/views/TemplateDetails/index.vue'),
                meta: {
                  crumb_title: 'WhatsApp.template_details.crumbs.template_details',
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
        path: '/:project/:flowOrg',
        name: 'externalLogin',
        component: null,
        beforeEnter: (to, from, next) => {
          const { project, flowOrg } = to.params;
          auth_store().selectedProject({ project });
          flowOrg ? auth_store().selectedFlowOrg({ flowOrg }) : auth_store().getFlowOrganization();
          if (to.query.next) {
            next(to.query.next);
          } else {
            next('/');
          }
        },
      },
      {
        path: '/callback',
        name: 'Google Callback',
        component: null,
        beforeEnter: (to, from, next) => {
          const { code } = to.query;
          setLocal('code', code);
          if (to.query.next) {
            next(to.query.next);
          } else {
            window.close();
          }
        },
      },
    ],
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

  if (!currentRouterInstance) {
    currentRouterInstance = router;
  }

  return router;
}

const routerProxy = new Proxy(
  {},
  {
    get(_, prop) {
      return currentRouterInstance?.[prop];
    },
  },
);

export { createIntegrationsRouter as createRouter };
export default routerProxy;
