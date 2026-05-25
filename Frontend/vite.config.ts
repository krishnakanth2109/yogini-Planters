import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const injectedHeadScriptsPlugin = {
  name: 'injected-head-scripts-fix',
  resolveId(id: string) {
    if (id === 'tanstack-start-injected-head-scripts:v') {
      return '\0tanstack-start-injected-head-scripts:v';
    }
    return null;
  },
  load(id: string) {
    if (id === '\0tanstack-start-injected-head-scripts:v') {
      return 'export const injectedHeadScripts = "";';
    }
    return null;
  }
};

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this; wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [injectedHeadScriptsPlugin],
});

