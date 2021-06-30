import { shallowMount, createLocalVue } from '@vue/test-utils';
import AppDetailsRecommended from '@/components/app/AppDetailsRecommended.vue';
import i18n from '@/utils/plugins/i18n';
// import VueRouter from 'vue-router';
// const router = new VueRouter();

const localVue = createLocalVue();
// localVue.use(VueRouter);

describe('AppDetailsComments.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AppDetailsRecommended, {
      localVue,
      i18n,
      // router,
      mocks: {
        $t: () => 'some specific text',
        $router: {
          push: () => {},
        },
        $route: {
          path: '/apps/1/details',
        },
      },
      stubs: {
        UnnnicButton: true,
        UnnnicCard: true,
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set next recommendation to first if start index equals last', () => {
    wrapper.vm.currentRecommendedIndex = wrapper.vm.recommendedApps.length - 1;
    wrapper.vm.nextRecommendation();

    expect(wrapper.vm.currentRecommendedIndex).toEqual(0);
  });

  it('should set next recommendation', () => {
    expect(wrapper.vm.currentRecommendedIndex).toEqual(0);
    wrapper.vm.nextRecommendation();

    expect(wrapper.vm.currentRecommendedIndex).toEqual(1);
  });

  it('should set previous recommendation', () => {
    wrapper.vm.currentRecommendedIndex = 1;
    wrapper.vm.prevRecommendation();

    expect(wrapper.vm.currentRecommendedIndex).toEqual(0);
  });

  it('should set previous recommendation to last if start index equals 0', () => {
    expect(wrapper.vm.currentRecommendedIndex).toEqual(0);
    wrapper.vm.prevRecommendation();

    expect(wrapper.vm.currentRecommendedIndex).toEqual(wrapper.vm.recommendedApps.length - 1);
  });

  it('should set previous recommendation', () => {
    wrapper.vm.currentRecommendedIndex = 1;
    expect(wrapper.vm.currentRecommendedIndex).toEqual(1);
    wrapper.vm.prevRecommendation();

    expect(wrapper.vm.currentRecommendedIndex).toEqual(0);
  });

  it('should call openApp on click', async () => {
    const spy = spyOn(wrapper.vm, 'openApp');
    const cardComponent = wrapper.findComponent({ ref: 'unnnic-card-marketplace' });

    await cardComponent.vm.$emit('openModal');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(wrapper.vm.currentRecommended.id);
  });

  it('should change route on openApp', () => {
    const spy = spyOn(wrapper.vm.$router, 'push');
    wrapper.vm.openApp(wrapper.vm.currentRecommended.id);

    expect(spy).toBeCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(`/apps/${wrapper.vm.currentRecommended.id}/details`);
  });

  it('should not change route on openApp if route is the same', () => {
    const spy = spyOn(wrapper.vm.$router, 'push');

    wrapper.vm.openApp(1);

    expect(spy).not.toHaveBeenCalled();
  });
});
