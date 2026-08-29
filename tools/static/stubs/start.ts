/* Static-export stubs for @tanstack/react-start. */
type Chain = {
  inputValidator: (fn?: unknown) => Chain;
  validator: (fn?: unknown) => Chain;
  middleware: (m?: unknown) => Chain;
  handler: (fn?: unknown) => () => Promise<never>;
};

function chain(): Chain {
  const self: Chain = {
    inputValidator: () => self,
    validator: () => self,
    middleware: () => self,
    handler: () => async () => {
      throw new Error("Server functions are not available in the static export");
    },
  };
  return self;
}

export function createServerFn() {
  return chain();
}

export function createMiddleware() {
  return chain();
}

export function useServerFn(fn: unknown) {
  return fn as () => Promise<never>;
}

export function createStart() {
  return {};
}
