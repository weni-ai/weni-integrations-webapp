module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import '~@weni/unnnic-system/dist/unnnic.css';
          @import '~@weni/unnnic-system/src/assets/scss/unnnic.scss';
        `,
      },
    },
  },
};
