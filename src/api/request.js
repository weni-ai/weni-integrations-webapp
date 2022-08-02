import axios from 'axios';
import store from '../store';
import getEnv from '@/utils/env';

export default {
  get $http() {
    const client = axios.create({
      baseURL: getEnv('VUE_APP_API_BASE_URL'),
      headers: {
        ...(store.getters.authenticated
          ? {
              Authorization: `${store.state.auth.token}`,
              'Project-Uuid': `${store.state.auth.project}`,
            }
          : {}),
      },
    });

    return client;
  },
};
