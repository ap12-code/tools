import adapterNode from '@sveltejs/adapter-node';
import adapterStatic from "@sveltejs/adapter-static"
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import { env } from 'process';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [vitePreprocess(), mdsvex()],
    extensions: ['.svelte', '.svx'],
    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter: env.BUILD_TYPE === 'node' ? adapterNode() : adapterStatic({
            fallback: "index.html",
            strict: false
        }),
        alias: {
            $components: 'src/components/*'
        },
        csrf: {
            checkOrigin: false
        },
    }
};

export default config;
