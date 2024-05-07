function getEnv(name) {
  return window?.configs?.[name] || import.meta.env[name];
}
export default getEnv;
