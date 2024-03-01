import { createRouter, createWebHistory } from 'vue-router';
import { auth_store } from '@/stores/modules/auth.store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: { name: 'Discovery' } },
    {
      path: '/apps',
      component: () => import('@/views/Apps/index.vue'),
      children: [
        {
          name: 'Discovery',
          path: 'discovery',
          component: () => import('@/views/Discovery.vue'),
        },
      ],
    },
    {
      path: '/loginexternal/:token/:project/:flowOrg',
      name: 'externalLogin',
      component: null,
      beforeEnter: async (to, from, next) => {
        const { token, project, flowOrg } = to.params;
        auth_store().externalLogin({ token: token.replace('+', ' ') });
        auth_store().selectedProject({ project });
        auth_store().selectedFlowOrg({ flowOrg });
        if (to.query.next) {
          next(to.query.next);
        } else {
          next('/');
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

export default router;
