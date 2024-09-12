import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Base from '@/views/whatsAppTemplates/Base.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';
import { setActivePinia } from 'pinia';
import { createTestingPinia } from '@pinia/testing';
import { createRouter, createWebHistory } from 'vue-router';

describe('Base.vue', () => {
  const pinia = createTestingPinia({ stubActions: false });
  setActivePinia(pinia);
  const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/test', name: 'TestRoute' }],
  });

  it('renders the component and its children correctly', () => {
    const wrapper = mount(Base, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $route: {
            meta: { crumb_title: 'Test Title' },
            matched: [{ path: '/', meta: { crumb_title: 'Test Crumb Title' } }],
          },
          $router: {
            push: () => {},
            go: () => {},
          },
        },
      },
    });

    expect(wrapper.find('.whatsapp-templates-base').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'unnnic-breadcrumb' }).exists()).toBe(true);
    expect(wrapper.find('router-view').exists()).toBe(true);
  });

  it('computes crumbs correctly', async () => {
    const wrapper = mount(Base, {
      global: {
        plugins: [pinia, i18n, router],
        mocks: {
          $route: {
            meta: { crumb_title: 'Test Title' },
            matched: [
              {
                path: '/',
                meta: { crumb_title: 'WhatsApp.template_details.crumbs.model_details' },
              },
              { path: '/test', meta: { crumb_title: 'Test Crumb Title' } },
            ],
          },
        },
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.crumbs).toEqual([
      {
        name: 'My Apps',
        path: '/apps/my',
        meta: 'myApps',
      },
      {
        name: 'Model Details',
        path: '/',
        meta: 'myApps',
      },
      {
        name: 'Test Crumb Title',
        path: '/test',
        meta: undefined,
      },
    ]);
  });

  it('handles crumb clicks correctly', async () => {
    const push = vi.fn();
    const go = vi.fn();

    const wrapper = mount(Base, {
      global: {
        plugins: [pinia, i18n, UnnnicSystem],
        mocks: {
          $route: {
            name: 'current-route',
            meta: { crumb_title: 'Test Title' },
            matched: [],
          },
          $t: (msg) => msg, // mock de tradução
          $router: {
            push,
            go,
          },
        },
      },
    });

    const crumb1 = { meta: 'current-route' };
    const crumb2 = { meta: 'WhatsApp Templates Table', path: '/test' };

    await wrapper.vm.handleCrumbClick(crumb1);
    expect(push).not.toHaveBeenCalled();
    expect(go).not.toHaveBeenCalled();

    await wrapper.vm.handleCrumbClick(crumb2);
    expect(push).not.toHaveBeenCalled();
    expect(go).toHaveBeenCalledWith(-1);
  });
});
