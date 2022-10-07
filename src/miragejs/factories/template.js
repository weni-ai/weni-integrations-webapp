import { Factory } from 'miragejs';
import { faker } from '@faker-js/faker';

const possibleCategories = ['TRANSACTIONAL', 'MARKETING', 'OTP'];
const possibleTypes = ['TEXT', 'MEDIA', 'INTERACTIVE'];

export default {
  template: Factory.extend({
    uuid() {
      return faker.datatype.uuid();
    },
    name() {
      return faker.lorem.words(4);
    },
    created_on() {
      return faker.date.past();
    },
    category() {
      return possibleCategories[Math.floor(Math.random() * possibleCategories.length)];
    },
    template_type() {
      return possibleTypes[Math.floor(Math.random() * possibleTypes.length)];
    },
    namespace() {
      return faker.datatype.uuid(1);
    },
    afterCreate(template, server) {
      template.update({
        translations: server.createList('translation', Math.floor(Math.random() * 3) + 1, {
          template,
        }),
      });
    },
  }),
};
