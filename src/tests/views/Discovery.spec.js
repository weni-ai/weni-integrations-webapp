// __tests__/HelloWorld.spec.js
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import Discovery from '../../views/Discovery/index.vue';
import { describe, expect, it } from 'vitest';
import i18n from '@/utils/plugins/i18n';

describe('HelloWorld', () => {
  it('matches snapshot', () => {
    const wrapper = mount(Discovery, {
      global: {
        plugins: [createTestingPinia(), i18n],
      },
      props: { msg: 'Hello Vitest' },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});
