import UnnnicSystem from '@weni/unnnic-system';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const components = {};

UnnnicSystem.install({
  component(name, component) {
    components[name] = component;
  },
});

export default {
  install(app) {
    Object.keys(components).forEach((componentName) => {
      app.component(capitalize(componentName), components[componentName]);
    });
  },
};
