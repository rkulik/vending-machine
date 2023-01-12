export const registerService = <T>(name: string, initFn: () => T): T => {
  if (process.env.NODE_ENV !== 'development') {
    return initFn();
  }

  const service = global.services?.[name];
  if (!service) {
    global.services = { ...global.services, [name]: initFn() };
  }

  return global.services![name] as T;
};
