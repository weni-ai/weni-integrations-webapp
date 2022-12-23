import genericTypeApi from '@/api/appType/generic';
import { captureSentryException } from '@/utils/sentry';

export default {
  async getAppForm({ commit }, { channelCode }) {
    commit('GET_APP_FORM_REQUEST');
    try {
      const { data } = await genericTypeApi.getAppForm(channelCode);
      commit('GET_APP_FORM_SUCCESS', data);
    } catch (err) {
      captureSentryException(err);
      commit('GET_APP_FORM_ERROR', err);
    }
  },
};
