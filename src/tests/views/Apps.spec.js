import { mount, shallowMount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Apps from '@/views/Apps/index.vue';
import NavBar from '@/components/NavBar/index.vue';
import Carousel from '@/components/Carousel/index.vue';
import Discovery from '@/views/Discovery/index.vue';
import { createRouter, createMemoryHistory } from 'vue-router';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import i18n from '@/utils/plugins/i18n';

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
    ],
  },
];
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
const pinia = createTestingPinia({ stubActions: false });
setActivePinia(pinia);

describe('Apps.vue', () => {
  it('renders NavBar and Carousel components', async () => {
    const wrapper = shallowMount(Apps, {
      global: {
        plugins: [router, pinia, i18n],
      },
    });

    expect(wrapper.findComponent(NavBar).exists()).toBe(true);
    expect(wrapper.findComponent(Carousel).exists()).toBe(true);
  });

  it('redirects to Discovery view via router-view', async () => {
    const wrapper = mount(Apps, {
      global: {
        plugins: [router, i18n, pinia],
      },
    });

    router.push('/');
    await router.isReady();

    expect(wrapper.findComponent(Discovery).exists()).toBe(true);
  });
});
