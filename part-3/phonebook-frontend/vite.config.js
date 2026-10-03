import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            "/phone": {
                target: "http://localhost:3001",
                changeOrigin: true,
            },
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
            },
        },
    },
});
