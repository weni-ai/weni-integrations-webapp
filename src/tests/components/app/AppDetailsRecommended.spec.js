import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppDetailsRecommended from '@/components/app/AppDetailsRecommended.vue';
import i18n from '@/utils/plugins/i18n';
import UnnnicSystem from '@/utils/plugins/UnnnicSystem';

describe('AppDetailsRecommended.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(AppDetailsRecommended, {
      global: {
        plugins: [i18n, UnnnicSystem],
        mocks: {
          $t: (msg) => msg,
          $router: {
            push: vi.fn(),
          },
          $route: {
            path: '/',
          },
        },
      },
    });
  });

  it('renders the recommended app title correctly', () => {
    const title = wrapper.find('.app-details-recommended__header__title');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe('Recommended');
  });

  it('renders the current recommended app in the card', () => {
    const card = wrapper.findComponent({ref: 'unnnic-card-marketplace'});
    expect(card.exists()).toBe(true);
    expect(card.props('title')).toBe('Slack');
    expect(card.props('description')).toBe('Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.');
    expect(card.props('icon')).toBe('https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/slack+1.svg');
    expect(card.props('comments')).toBe('2 comments');
    expect(card.props('rating')).toBe(4.1);
  });

  it('changes recommended app when clicking next button', async () => {
    const nextButton = wrapper.find('.app-details-recommended__header__buttons__next');
    await nextButton.trigger('click');
    expect(wrapper.vm.currentRecommendedIndex).toBe(1); // Next app should be Gmail
  });

  it('changes recommended app when clicking prev button', async () => {
    await wrapper.setData({ currentRecommendedIndex: 1 }); // Set to Gmail
    const prevButton = wrapper.find('.app-details-recommended__header__buttons__prev');
    await prevButton.trigger('click');
    expect(wrapper.vm.currentRecommendedIndex).toBe(0); // Previous app should be Slack
  });

  it('emits openModal event with correct ID when card is clicked', async () => {
    const card = wrapper.findComponent({ref: 'unnnic-card-marketplace'});
    expect(card.exists()).toBe(true)
    await card.vm.$emit('openModal', 5);
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/apps/5/details');
  });
});
