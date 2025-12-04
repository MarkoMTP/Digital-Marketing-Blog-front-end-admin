import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: ["node_modules", "dist", "node_modules 2"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.js",
  },
});
