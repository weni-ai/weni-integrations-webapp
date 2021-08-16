import axios from 'axios';
import store from '../store';

export default {
  get $http() {
    const client = axios.create({
      baseURL: process.env.VUE_APP_API_BASE_URL,
      headers: {
        ...(store.getters.authenticated ? { Authorization: `${store.getters.authToken}` } : {}),
      },
    });

    return client;
  },
};
