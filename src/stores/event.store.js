import { defineStore } from 'pinia';

export const useEventStore = defineStore('event', {
  state: () => ({
    events: {},
  }),
  actions: {
    emit(eventName) {
      if (this.events[eventName]) {
        this.events[eventName].forEach((callback) => callback());
      }
    },
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = [];
      }
      this.events[eventName].push(callback);
    },
    off(eventName, callback) {
      if (this.events[eventName]) {
        this.events[eventName] = this.events[eventName].filter((cb) => cb !== callback);
      }
    },
  },
});
