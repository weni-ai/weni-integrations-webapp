import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import WhatsAppTemplatesTable from '@/views/whatsAppTemplates/Table.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

const pinia = createPinia();
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/templates', name: 'WhatsApp Templates Table' },
    { path: '/other', name: 'OtherRoute' },
  ],
});

const Header = { template: '<div class="header">Header</div>' };
const Table = { template: '<div class="table">Table</div>' };

describe('WhatsAppTemplatesTable.vue', () => {
  it('renders Header and Table when route name is WhatsApp Templates Table', async () => {
    const wrapper = mount(WhatsAppTemplatesTable, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
        stubs: {
          Header,
          Table,
        },
      },
      routes: [{ path: '/templates', name: 'WhatsApp Templates Table' }],
    });

    router.push('/templates');
    await router.isReady();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(Header).exists()).toBe(true);
    expect(wrapper.findComponent(Table).exists()).toBe(true);
  });

  it('renders router-view when route name is not WhatsApp Templates Table', async () => {
    const wrapper = mount(WhatsAppTemplatesTable, {
      global: {
        plugins: [pinia, router, i18n, UnnnicSystem],
        stubs: {
          Header,
          Table,
        },
        mocks: {
          $route: {
            name: 'aaa',
          },
        },
      },
    });

    router.push('/other');
    await router.isReady();
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(Header).exists()).toBe(false);
    expect(wrapper.findComponent(Table).exists()).toBe(false);
  });
});
