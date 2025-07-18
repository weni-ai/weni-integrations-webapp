import axios from 'axios';
import '@/utils/pinia-setup';
import { auth_store } from '@/stores/modules/auth.store';
import getEnv from '@/utils/env';

export default {
  get $http() {
    const client = axios.create({
      baseURL: getEnv('API_BASE_URL'),
      headers: {
        ...(auth_store().authenticated
          ? {
              Authorization: `${auth_store().token}`,
              'Project-Uuid': `${auth_store().project}`,
            }
          : {}),
      },
    });

    client.interceptors.response.use(undefined, (error) => {
      return Promise.reject(error);
    });

    return client;
  },
};
