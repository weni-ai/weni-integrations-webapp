import { createServer } from 'miragejs';
import factories from './factories';
import models from './models';
import routes from './routes';
import seeds from './seeds';
import serializers from './serializers';

const config = (environment) => {
  return {
    environment,
    factories,
    models,
    routes,
    seeds,
    serializers,
  };
};

export const makeServer = ({ environment = 'development' } = {}) => {
  return new createServer(config(environment));
};
