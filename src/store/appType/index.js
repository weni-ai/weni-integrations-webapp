import state from './state';
import actions from './actions';
import mutations from './mutations';

import channels from './channels';
import comments from './comments';
import externals from './externals';
import ecommerce from './ecommerce';

export default {
  modules: {
    channels,
    comments,
    externals,
    ecommerce,
  },
  actions,
  mutations,
  state,
};
