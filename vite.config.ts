import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [sveltekit()],
    server: {
        allowedHosts: ["local-5173-wsl.ap12.net"],
    },
});
