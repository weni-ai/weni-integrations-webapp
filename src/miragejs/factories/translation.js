import { Factory, belongsTo } from 'miragejs';
import { faker } from '@faker-js/faker';

const possibleStatus = [
  'APPROVED',
  // 'IN_APPEAL',
  // 'PENDING',
  'REJECTED',
  // 'PENDING_DELETION',
  // 'DELETED',
  // 'DISABLED',
  // 'LOCKED',
];

export default {
  translation: Factory.extend({
    template: belongsTo(),
    uuid() {
      return faker.datatype.uuid();
    },
    status() {
      return possibleStatus[Math.floor(Math.random() * possibleStatus.length)];
    },
    language() {
      return faker.random.locale().replace('_ocker', '');
    },
    country() {
      return faker.address.countryCode();
    },
  }),
};
