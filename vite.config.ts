import { defineConfig } from "vite";

// Plugins:
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import contentCollections from "@content-collections/vite";

export default defineConfig({
  // Same build-arg name as phototourl (`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`)
  envPrefix: ["PUBLIC_", "NEXT_PUBLIC_"],
  plugins: [devtoolsJson(), tailwindcss(), sveltekit(), contentCollections()],
});
