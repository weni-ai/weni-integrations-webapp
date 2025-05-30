import { createServer } from 'miragejs';
import factories from './factories/index.js';
import models from './models/index.js';
import routes from './routes/index.js';
import seeds from './seeds/index.js';
import serializers from './serializers/index.js';

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
