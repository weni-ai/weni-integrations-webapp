import { createLocalVue } from '@vue/test-utils';
import {createPinia} from 'pinia'
import { comments_store } from '@/stores/modules/appType/comments/comments.store';

const pinia = createPinia();
pinia.use(({ store }) => {
  store.router = markRaw(router);
});

const localVue = createLocalVue();
localVue.use(pinia)

describe('comments store', () => {
  let store;

  beforeEach(() => {
    store = comments_store();
    jest.resetAllMocks();
  });

  describe('test', ()=>{
    it('should return tanana', () => {
      expect(store.loadingListComments).toBeTruthy();
    })
  })
})
