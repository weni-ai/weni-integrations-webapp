import { moduleStorage } from '@/utils/storage';

export function getJwtToken() {
  return new Promise((resolve) => {
    const isInIframe = window.self !== window.top;

    if (!isInIframe) resolve();

    const eventHandler = (event) => {
      if (event.data.event === 'updateToken') {
        moduleStorage.setItem('authToken', `Bearer ${event.data.token}`);
        window.removeEventListener('message', eventHandler);
        return resolve();
      }
    };
    window.addEventListener('message', eventHandler);
    window.parent.postMessage({ event: 'getToken' }, '*');
  });
}
