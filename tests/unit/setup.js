import Vue from 'vue';
import MockDate from 'mockdate';
import fetchMock from 'jest-fetch-mock';

MockDate.set(1534341842684);

fetchMock.enableMocks();

Vue.directive('click-outside', {});
