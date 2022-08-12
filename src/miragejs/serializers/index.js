import { RestSerializer } from 'miragejs';

export default {
  template: RestSerializer.extend({
    include: ['translations'],
    embed: true,
  }),
};
