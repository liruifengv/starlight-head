import { Plugin, defineConfig } from "vite";
import dts from "vite-plugin-dts";

const name = "starlight-head";

export default defineConfig(() => {
	return {
		build: {
			lib: {
				entry: "index.ts",
				name: name,
				fileName: (format) => (format === "es" ? `${name}.mjs` : `${name}.js`),
			},
		},
		plugins: [
			dts({
				outDir: "dist/types",
			}) as unknown as Plugin,
		],
	};
});
