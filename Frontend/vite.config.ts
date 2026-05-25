import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

const injectedHeadScriptsPlugin = {
  name: "injected-head-scripts-fix",
  resolveId(id: string) {
    if (id === "tanstack-start-injected-head-scripts:v") {
      return "\0tanstack-start-injected-head-scripts:v";
    }
    return null;
  },
  load(id: string) {
    if (id === "\0tanstack-start-injected-head-scripts:v") {
      return 'export const injectedHeadScripts = "";';
    }
    return null;
  },
};

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [injectedHeadScriptsPlugin, netlify()],
});
