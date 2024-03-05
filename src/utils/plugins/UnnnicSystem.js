import * as UnnnicSystem from '@weni/unnnic-system';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default {
  install(app) {
    for (const componentName in UnnnicSystem) {
      app.component(capitalize(componentName), UnnnicSystem[componentName]);
    }
  },
};
