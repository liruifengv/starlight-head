import type { StarlightPlugin } from "@astrojs/starlight/types";
import { generateHeadConfig } from "./gen";

export type StarlightHeadConfig = {
	path: string;
};

export default function starlightHeadPlugin(
	userConfig: StarlightHeadConfig,
): StarlightPlugin {
	// todo: validate userConfig
	const config: StarlightHeadConfig = userConfig;

	return {
		name: "starlight-head-plugin",
		hooks: {
			setup: async ({
				config: starlightConfig,
				logger,
				updateConfig: updateStarlightConfig,
			}) => {
				const headConfig = await generateHeadConfig({
					path: config.path,
					logger,
				});
				logger.info("Generated head config");
				updateStarlightConfig({
					head: headConfig,
				});
			},
		},
	};
}
