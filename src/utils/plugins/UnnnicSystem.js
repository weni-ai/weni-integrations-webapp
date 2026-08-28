import UnnnicSystem from '@weni/unnnic-system';

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toPascalCase(name) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
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
      const component = components[componentName];
      const aliases = new Set([
        componentName,
        capitalize(componentName),
        toPascalCase(componentName),
      ]);

      aliases.forEach((name) => {
        app.component(name, component);
      });
    });
  },
};
