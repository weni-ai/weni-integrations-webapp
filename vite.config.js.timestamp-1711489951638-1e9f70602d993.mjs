// vite.config.js
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'file:///C:/Users/anacl/Documents/WENI/Front/vue3/weni-integrations-webapp/node_modules/vite/dist/node/index.js';
import vue from 'file:///C:/Users/anacl/Documents/WENI/Front/vue3/weni-integrations-webapp/node_modules/@vitejs/plugin-vue/dist/index.mjs';
import vueJsx from 'file:///C:/Users/anacl/Documents/WENI/Front/vue3/weni-integrations-webapp/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs';
var __vite_injected_original_import_meta_url =
  'file:///C:/Users/anacl/Documents/WENI/Front/vue3/weni-integrations-webapp/vite.config.js';
var vite_config_default = defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['md-linedivider'].includes(tag),
          compatConfig: {
            MODE: 2,
          },
        },
      },
    }),
    vueJsx(),
  ],
  resolve: {
    alias: {
      vue: '@vue/compat',
      '@': fileURLToPath(
        new URL('./src', __vite_injected_original_import_meta_url),
      ),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import '@weni/unnnic-system/src/assets/scss/unnnic.scss';
        `,
      },
    },
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxhbmFjbFxcXFxEb2N1bWVudHNcXFxcV0VOSVxcXFxGcm9udFxcXFx2dWUzXFxcXHdlbmktaW50ZWdyYXRpb25zLXdlYmFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcYW5hY2xcXFxcRG9jdW1lbnRzXFxcXFdFTklcXFxcRnJvbnRcXFxcdnVlM1xcXFx3ZW5pLWludGVncmF0aW9ucy13ZWJhcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2FuYWNsL0RvY3VtZW50cy9XRU5JL0Zyb250L3Z1ZTMvd2VuaS1pbnRlZ3JhdGlvbnMtd2ViYXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4JztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKHtcclxuICAgICAgdGVtcGxhdGU6IHtcclxuICAgICAgICBjb21waWxlck9wdGlvbnM6IHtcclxuICAgICAgICAgIGlzQ3VzdG9tRWxlbWVudDogKHRhZykgPT4gWydtZC1saW5lZGl2aWRlciddLmluY2x1ZGVzKHRhZyksXHJcbiAgICAgICAgICBjb21wYXRDb25maWc6IHtcclxuICAgICAgICAgICAgTU9ERTogMixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0pLFxyXG4gICAgdnVlSnN4KCksXHJcbiAgXSxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICB2dWU6ICdAdnVlL2NvbXBhdCcsXHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIGNzczoge1xyXG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICBzY3NzOiB7XHJcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcclxuICAgICAgICAgIEBpbXBvcnQgJ0B3ZW5pL3Vubm5pYy1zeXN0ZW0vc3JjL2Fzc2V0cy9zY3NzL3Vubm5pYy5zY3NzJztcclxuICAgICAgICBgLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxWSxTQUFTLGVBQWUsV0FBVztBQUV4YSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBSnNPLElBQU0sMkNBQTJDO0FBTzFTLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxNQUNGLFVBQVU7QUFBQSxRQUNSLGlCQUFpQjtBQUFBLFVBQ2YsaUJBQWlCLENBQUMsUUFBUSxDQUFDLGdCQUFnQixFQUFFLFNBQVMsR0FBRztBQUFBLFVBQ3pELGNBQWM7QUFBQSxZQUNaLE1BQU07QUFBQSxVQUNSO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELE9BQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUEsTUFDTCxLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLElBQ3REO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUE7QUFBQTtBQUFBLE1BR2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
