import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import i18n from '../../utils/plugins/i18n';
import Discovery from '../../views/Discovery/index.vue';

function createWrapper(propsData) {
  const wrapper = mount(Discovery, {
    propsData,
    global: {
      plugins: [i18n],
    },
  });

  return wrapper;
}

describe('Discovery', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = createWrapper();
  });

  it('should render properly', () => {
    expect(wrapper.find('.discovery-content__search__results__highlight')).toBeDefined();
  });
})
