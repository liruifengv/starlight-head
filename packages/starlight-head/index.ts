import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types'

export type StarlightHeadConfig = {
	path: string
}

import { type HeadConfig, generateHeadConfig } from './gen'

export default function starlightBlogPlugin(userConfig: StarlightHeadConfig): StarlightPlugin {
	// todo: validate userConfig
	const config: StarlightHeadConfig = userConfig

	return {
		name: 'starlight-head-plugin',
		hooks: {
			async setup({ config: starlightConfig, logger, updateConfig: updateStarlightConfig }) {
				const headConfig = await generateHeadConfig(config.path)
				updateStarlightConfig({
					head: headConfig
				})
			},
		}
	}
}