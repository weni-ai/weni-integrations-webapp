import { createWebHistory, createRouter } from 'vue-router';
import Discovery from './views/Discovery.vue';
import Apps from './views/Apps.vue';

const routes = [
  {
    name: 'Discovery',
    path: '/discovery',
    component: Discovery,
  },
  {
    name: 'Apps',
    path: '/apps',
    component: Apps,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
