## starlight-head

A Starlight plugin for easy to add `<head>` for your Starlight site.

### Installation

```bash
npm install -D starlight-head
```

### Usage

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightHead from "starlight-head";

export default defineConfig({
	integrations: [
		starlight({
			title: "My Docs",
			plugins: [
				starlightHead({
					path: "./src/components/head.astro",
				}),
			],
		}),
	],
});
```

```astro
// src/components/head.astro
---
---
<meta name="description" content="This is a description by starlight-head-plugin">

<script>
	window.onload = function() {
		console.log("Page loaded");
	}
</script>
```

It will be covert to Starlight config:

```js
starlight({
	head: [
		{
			tag: "meta",
			attributes: {
				name: "description",
				content: "This is a description by starlight-head-plugin",
			},
		},
		{
			tag: "script",
			content: 'window.onload = function() {\n\tconsole.log("Page loaded");\n}',
		},
	],
});
```

### Features

-   [x] Add `<head>` content to Starlight by `.astro` component.
-   [ ] Support expressions in `.astro` component.
-   [ ] Supports importing variables from other files.
-   [ ] Support add `<head>` for certain page.

### Configuration Reference

#### path (required)

**type:** `string`

A path to the file that contains the `<head>` content. Like `./src/components/head.astro`.

### License

MIT
