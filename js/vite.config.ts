import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "src/main.tsx"),
      output: {
        entryFileNames: "opensidian.js",
        chunkFileNames: "[name]-[hash].js",
        assetFileNames: (info) => {
          if (info.name?.endsWith(".css")) return "opensidian.css";
          return "[name][extname]";
        },
        format: "iife",
        name: "OpenSidianApp",
      },
    },
  },
  // OC / OCP are Nextcloud globals — don't bundle or warn about them
  define: {},
});
