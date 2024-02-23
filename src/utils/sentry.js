import * as Sentry from '@sentry/browser';

function captureSentryException(error) {
  error &&
    Sentry.captureException(error, {
      extra: {
        request: error.request,
        response: error.response,
        data: JSON.stringify(error.response?.data),
      },
    });
}

export { captureSentryException };
