import state from './state';
import actions from './actions';
import mutations from './mutations';

import channels from './channels';
import comments from './comments';

export default {
  modules: {
    channels,
    comments,
  },
  actions,
  mutations,
  state,
};
