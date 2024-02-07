export default {
  GET_CONFIGURED_APPS_REQUEST(state, skipLoading = false) {
    state.loadingConfiguredApps = !skipLoading;
    state.errorConfiguredApps = null;

    if (!skipLoading) {
      state.configuredApps = null;
    }
  },
  GET_CONFIGURED_APPS_SUCCESS(state, data) {
    state.configuredApps = data;
    state.loadingConfiguredApps = false;
  },
  GET_CONFIGURED_APPS_ERROR(state, err) {
    state.errorConfiguredApps = err;
    state.loadingConfiguredApps = false;
  },

  GET_INSTALLED_APPS_REQUEST(state) {
    state.loadingInstalledApps = true;
    state.errorInstalledApps = null;
    state.installedApps = null;
  },
  GET_INSTALLED_APPS_SUCCESS(state, data) {
    state.installedApps = data;
    state.loadingInstalledApps = false;
  },
  GET_INSTALLED_APPS_ERROR(state, err) {
    state.errorInstalledApps = err;
    state.loadingInstalledApps = false;
  },
};
