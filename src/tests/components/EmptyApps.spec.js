import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import EmptyApps from '@/components/EmptyApps/index.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('EmptyApps.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(EmptyApps, {
      props: {
        term: 'test term',
      },
      global: {
        plugins: [i18n, UnnnicSystem],
      },
      mocks: {
        $t: (e) => e,
      },
    });
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders the empty image correctly', () => {
    const image = wrapper.find('img.empty__image');
    expect(image.exists()).toBe(true);
    expect(image.attributes('src')).toBe('/src/assets/svgs/empty-apps.svg');
  });

  it('displays the correct title and description', () => {
    expect(wrapper.find('span.empty__title').text()).toBe(
      `Wow, we couldn't find this thing called “test term”.`,
    );
    expect(wrapper.find('span.empty__description').text()).toContain(
      'But you can see all our integrations by clicking here',
    );
    expect(wrapper.find('span.empty__description__link').text()).toBe('here');
  });

  it('emits "clear" event when link is clicked', async () => {
    await wrapper.find('span.empty__description__link').trigger('click');

    const emittedEvents = wrapper.emitted('clear');
    expect(emittedEvents).toBeTruthy();
    expect(emittedEvents.length).toBe(1);
  });
});
