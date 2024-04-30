import { createApp } from 'vue';
import Alert from '../components/Alert/Alert.vue';

export default {
  callAlert({ props, containerRef }) {
    const AlertComponent = createApp(Alert, {
      ...props,
      onClose: () => {
        instance.$el.remove();
      },
      created() {
        this.$emit(['close'], () => {
          instance.$el.remove();
        });
      },
    });
    const element = document.createElement('div');
    const instance = AlertComponent.mount(element);

    if (containerRef) {
      instance.$el.style.position = 'absolute';
      containerRef.appendChild(instance.$el);
    } else {
      document.body.appendChild(instance.$el);
    }
  },
};
