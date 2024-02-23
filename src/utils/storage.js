import window from 'global/window';

function setLocal(field, value) {
  /* istanbul ignore next */
  if (window.localStorage) {
    if (value) {
      window.localStorage.setItem(field, value);
    } else {
      window.localStorage.removeItem(field);
    }
  }
}

export default setLocal;
