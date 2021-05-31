import Vue from 'vue';
import VueRouter from 'vue-router';
import Discovery from './views/Discovery.vue';
import Apps from './views/Apps.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: { name: 'Discovery' } },
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

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
