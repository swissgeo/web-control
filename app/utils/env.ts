const ENV_LOCAL = "local";
const ENV_DEV = "dev";
const ENV_INT = "int";

export function isNotProd(): boolean {
  const runtimeConfig = useRuntimeConfig();
  return (
    runtimeConfig.public.environment === ENV_LOCAL ||
    runtimeConfig.public.environment === ENV_DEV ||
    runtimeConfig.public.environment === ENV_INT
  );
}
