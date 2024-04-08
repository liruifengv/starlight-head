import { builtinModules } from "node:module";
import { type Plugin, defineConfig } from "vite";
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
			rollupOptions: {
				external: [
					...builtinModules,
					...builtinModules.map((it) => `node:${it}`),
					"@astrojs/compiler",
				],
			},
		},
		plugins: [
			dts({
				outDir: "dist/types",
			}) as unknown as Plugin,
		],
	};
});
