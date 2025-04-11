function getEnv(name) {
  return (
    window?.configs?.[name] ||
    import.meta.env[name] ||
    window?.configs?.[`VITE_APP_${name}`] ||
    import.meta.env[`VITE_APP_${name}`]
  );
}
export default getEnv;
