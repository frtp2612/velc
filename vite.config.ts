import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		dts({
			rollupTypes: true,
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
		extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
	},
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "VelctComponents",
			formats: ["es"],
			fileName: `velct-components`,
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			input: {
				main: resolve(__dirname, "src/index.ts"),
			},
			external: ["vue", "vue-router", "vue-i18n"],
			output: {
				exports: "named",
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					vue: "Vue",
				},
			},
		},
	},
});
