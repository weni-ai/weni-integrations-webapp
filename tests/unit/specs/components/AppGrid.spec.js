import { shallowMount, createLocalVue } from '@vue/test-utils';
import AppGrid from '@/components/AppGrid.vue';
import i18n from '@/utils/plugins/i18n';
import VueRouter from 'vue-router';
const router = new VueRouter();
// import { UnnnicCard } from '@weni/unnnic-system';

const localVue = createLocalVue();
localVue.use(VueRouter);

describe('AppGrid.vue', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AppGrid, {
      localVue,
      i18n,
      router,
      mocks: {
        $t: () => 'some specific text',
      },
      stubs: {
        UnnnicButton: true,
        UnnnicModal: true,
        UnnnicCard: true,
      },
      propsData: {
        section: 'communication_channels',
      },
      computed: {
        loaded() {
          return true;
        },
      },
    });
  });

  it('should be rendered properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should set AddModal state as open', () => {
    expect(wrapper.vm.showAddModal).toBeTruthy();
    wrapper.vm.openAddModal();
    expect(wrapper.vm.showAddModal).toBeTruthy();
  });

  it('should set AddModal state as closed on modal close', async () => {
    const addModalComponent = wrapper.findComponent({ ref: 'unnnic-add-modal' });

    wrapper.vm.openAddModal();
    expect(wrapper.vm.showAddModal).toBeTruthy();

    await addModalComponent.vm.$emit('close');
    expect(wrapper.vm.showAddModal).toBeTruthy();
  });

  it('should change route to app on modal button action', async () => {
    const spy = spyOn(wrapper.vm.$router, 'push');
    const addModalNavigationButton = wrapper.findComponent({
      ref: 'unnnic-add-modal-navigate-button',
    });

    await addModalNavigationButton.vm.$emit('click');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('apps');
  });

  it('should open App modal on trigger', async () => {
    const spy = spyOn(wrapper.vm, 'openAppModal');
    const cardComponent = wrapper.findComponent({ ref: 'unnnic-marketplace-card' });

    await cardComponent.vm.$emit('openModal');

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should change AppModal', async () => {
    wrapper.vm.openAppModal(123);

    expect(wrapper.vm.showAppModal).toEqual(123);
  });

  // TODO: check test when mocked apps are gone
  it('should return communication_channel apps', () => {
    const communicationApps = [
      {
        id: 1,
        name: 'Weni Web Chat',
        description:
          'Ullamco occaecat et id cillum. Amet exercitation nisi amet fugiat mollit minim est. Officia in enim amet ipsum Lorem velit sint pariatur sunt magna cupidatat. Magna non ea qui nisi ut.s',
        usersCount: 25,
        backgroundImage:
          'https://images.unsplash.com/photo-1523474438810-b04a2480633c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
        rating: 4.9,
        commentsCount: 3,
        icon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgZGF0YS1uYW1lPSJMYXllciAxIiBpZD0iTGF5ZXJfMSIgdmlld0JveD0iMCAwIDUwOC4zMyA1MDguMzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiMwOWI4M2U7ZmlsbC1ydWxlOmV2ZW5vZGQ7fS5jbHMtMntmaWxsOiNmZmY7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZS8+PHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNDg1LDI5LjcyYzExLjQ1LDE1LjEzLDE2LjYxLDQwLjIxLDE5LjE1LDcwLjcsMy4zNiw0NS41LDQuNzEsMTAwLjEsNiwxNTYuNTItMS42Nyw1Ny40Ny0yLjM1LDExNS40My02LDE1Ni41Mi0yLjg4LDMxLjU0LTksNTIuNjYtMTkuMjIsNjUuNDctMTMsMTIuNzktMzcuOTQsMjMuNTktNzMuNSwyNi4xNS00My4yNSwzLjY5LTk2LjYxLDMuNjUtMTU1LjQ4LDUuMS02NS40NC0xLjEyLTEwOS44Mi0uNjQtMTU2LjM4LTUuMDgtMzYuMzItMi41Mi02MC4wOC0xMy4xOS03NC43LTI2LjA3LTEwLjgzLTE0LjU0LTE0LTMwLTE3LTY2LjI0LTMuNzUtNDEuODUtNC41OC05OC41Ni02LTE1NS41NEM0LDIwMC41Nyw0LjEzLDE0My40NCw3LjksMTAwLjc0LDEwLjQzLDY3LjA1LDE0LjQyLDQ0LjQsMjQuNjUsMzAsMzksMTcuNzcsNjMuNDgsMTEuNjksMTAwLDguNjljNTAtNS44NSwxMDIuMDYtNywxNTUuODgtNi44Nyw1NS4zOS4wOSwxMDguNTYsMS42NywxNTYsNi4zNCwzMiwyLjU2LDU4LjQ4LDguMDcsNzMuMDcsMjEuNTZaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMS44MyAtMS44MikiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zMDguODMsMjA0LjY2Yy0yNy44OSwxLjQ2LTUyLjE0LDkuOTEtNzEuODQsMjktMTkuODksMTkuMy0yOSw0Mi45NS0yNi40OSw3Mi4yNi0xMC45LTEuMzUtMjAuODMtMi44NC0zMC44Mi0zLjY4LTMuNDUtLjI5LTcuNTQuMTItMTAuNDYsMS43Ny05LjcsNS40Ny0xOSwxMS42NS0zMCwxOC41NCwyLTkuMTQsMy4zMy0xNy4xNSw1LjY1LTI0Ljg1LDEuNy01LjY2LjkxLTguODEtNC4zLTEyLjUtMzMuNDgtMjMuNjQtNDcuNTktNTktMzctOTUuNDQsOS43Ny0zMy42OSwzMy43Ny01NC4xMyw2Ni4zNy02NC43OCw0NC41LTE0LjU0LDk0LjUyLjI5LDEyMS41OCwzNS42M0E4My4yOCw4My4yOCwwLDAsMSwzMDguODMsMjA0LjY2Wk0xODAuNDYsMTkzLjMxYy4yNi02LjY2LTUuNTItMTIuNjYtMTIuMzctMTIuODZhMTIuNDksMTIuNDksMCwwLDAtMTMsMTIuMDgsMTIuMzQsMTIuMzQsMCwwLDAsMTIuMjMsMTIuODFBMTIuNywxMi43LDAsMCwwLDE4MC40NiwxOTMuMzFabTY3LTEyLjg3Yy02Ljg4LjEzLTEyLjcsNi0xMi41NywxMi42OGExMi41NiwxMi41NiwwLDAsMCwxMi45MSwxMi4yNywxMi40NywxMi40NywwLDEsMC0uMzMtMjQuOTVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMS44MyAtMS44MikiLz48cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zNzEuNDksMzc4LjU0Yy04LjgzLTMuOTMtMTYuOTMtOS44My0yNS41Ni0xMC43M3MtMTcuNjIsNC4wNi0yNi42MSw1Yy0yNy4zOCwyLjgtNTEuOTEtNC44My03Mi4xNC0yMy41NC0zOC40Ny0zNS41OC0zMy05MC4xNCwxMS41NC0xMTkuMywzOS41Ni0yNS45Miw5Ny41Ny0xNy4yOCwxMjUuNDYsMTguNjgsMjQuMzQsMzEuMzgsMjEuNDgsNzMtOC4yMyw5OS4zOS04LjYsNy42My0xMS42OSwxMy45MS02LjE4LDI0QzM3MC43OCwzNzMuODQsMzcwLjksMzc2LjE5LDM3MS40OSwzNzguNTRaTTI3MSwyODEuMmExMC4zOSwxMC4zOSwwLDEsMCwuMDctMjAuNzhBMTAuMzksMTAuMzksMCwxLDAsMjcxLDI4MS4yWm02NC44MS0yMC43NmExMC40LDEwLjQsMCwwLDAtMTAuMzEsOS45NCwxMC4yNSwxMC4yNSwwLDEsMCwxMC4zMS05Ljk0WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTEuODMgLTEuODIpIi8+PC9zdmc+',
      },
      {
        id: 2,
        name: 'Whatsapp',
        description:
          'Sint in minim consequat est velit in aliquip dolor consequat esse veniam magna. Exercitation est duis esse id dolor id enim magna. Ad laborum ea dolor proident ullamco minim deserunt laborum nulla laboris labore adipisicing labore.',
        usersCount: 590,
        backgroundImage:
          'https://images.unsplash.com/photo-1603145733146-ae562a55031e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        rating: 4.7,
        commentsCount: 7,
        icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/iconfinder_13-whatsapp_4202050+1.svg',
      },
      {
        id: 3,
        name: 'Telegram',
        description:
          'Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.',
        usersCount: 57,
        backgroundImage:
          'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        rating: 4.6,
        commentsCount: 2,
        icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/telegram+1.svg',
      },
      {
        id: 4,
        name: 'Messenger',
        description:
          'Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.',
        usersCount: 57,
        backgroundImage:
          'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        rating: 4.6,
        commentsCount: 2,
        icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/messenger+(1)+1.svg',
      },
    ];

    expect(wrapper.vm.apps).toMatchObject(communicationApps);
  });

  it('should return attendance_manager apps', async () => {
    const attendanceApps = [
      {
        id: 5,
        name: 'Slack',
        description:
          'Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.',
        usersCount: 57,
        backgroundImage:
          'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        rating: 4.6,
        commentsCount: 2,
        icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/slack+1.svg',
      },
      {
        id: 6,
        name: 'Gmail',
        description:
          'Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.',
        usersCount: 57,
        backgroundImage:
          'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        rating: 4.6,
        commentsCount: 2,
        icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/iconfinder_google-gmail_7089163+1.svg',
      },
      {
        id: 7,
        name: 'Dropbox',
        description:
          'Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.',
        usersCount: 57,
        backgroundImage:
          'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        rating: 4.6,
        commentsCount: 2,
        icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/iconfinder_dropbox_social_network_logo_1920522+1.svg',
      },
      {
        id: 8,
        name: 'Rocket.Chat',
        description:
          'Ex enim voluptate mollit sit irure ut officia elit. Officia aliqua velit exercitation nisi et. Enim qui mollit ullamco eu occaecat nulla sunt velit eu proident ipsum veniam. Est enim magna nisi deserunt. Est fugiat enim cillum ipsum ipsum ex consequat cillum.',
        usersCount: 57,
        backgroundImage:
          'https://images.unsplash.com/photo-1521931961826-fe48677230a5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        rating: 4.6,
        commentsCount: 2,
        icon: 'https://weni-sp-push-dev.s3.sa-east-1.amazonaws.com/svg/rocket-chat+1.svg',
      },
    ];

    await wrapper.setProps({ section: 'attendance_managers' });

    expect(wrapper.vm.apps).toMatchObject(attendanceApps);
  });
});
