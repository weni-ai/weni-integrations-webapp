export function getEnv(name) {
  return window?.configs?.[name] || process.env[name];
}
module.exports = getEnv;
