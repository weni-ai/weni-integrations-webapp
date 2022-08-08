import { Model, hasMany, belongsTo } from 'miragejs';

export default {
  template: Model.extend({
    translations: hasMany(),
  }),
  translation: Model.extend({
    template: belongsTo(),
  }),
};
