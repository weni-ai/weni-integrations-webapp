import { createPinia, setActivePinia, getActivePinia } from 'pinia';

export function setupPinia() {
  let pinia = getActivePinia();

  //Pinia is initialized for the federated module
  if (!pinia) {
    pinia = createPinia();
    setActivePinia(pinia);
  }

  return pinia;
}

const activePinia = setupPinia();

export default activePinia;
