import win from 'global/window';

function setLocal(field, value) {
  /* istanbul ignore next */
  if (win.localStorage) {
    if (value) {
      win.localStorage.setItem(field, value);
    } else {
      win.localStorage.removeItem(field);
    }
  }
}

export default setLocal;
