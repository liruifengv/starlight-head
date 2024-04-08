import fs from "node:fs";
import { parse } from "@astrojs/compiler";
import type { TagLikeNode, FrontmatterNode } from "@astrojs/compiler/types";
import { is } from "@astrojs/compiler/utils";
import type { HeadConfig, EvaluatedExpression } from "./scheme";
import { getDescendants } from "./walker";

import type { AstroIntegrationLogger } from "astro";

type ChildNode = {
	type: string;
	value: string;
};

function convertTagLikeNodeToHeadConfig(
	node: TagLikeNode,
	symbols: Map<string, EvaluatedExpression>,
	logger: AstroIntegrationLogger,
): HeadConfig | null {
	if (!is.tag(node)) {
		return null;
	}
	const headConfig: HeadConfig = {
		tag: node.name as HeadConfig["tag"],
		attrs: {},
		content: "",
	};

	// biome-ignore lint/complexity/noForEach: <explanation>
	node.attributes.forEach((attr) => {
		if (attr.kind === "quoted") {
			headConfig.attrs[attr.name] = attr.value;
		} else if (attr.kind === "expression") {
			//  TODO
			logger.warn("expression is not support now.");
			// headConfig.attrs[attr.name] = symbols.get(attr.value)?.value ?? "";
		} else if (attr.kind === "empty") {
			headConfig.attrs[attr.name] = true;
		}
	});

	if (node.children.length > 0) {
		const children = node.children as ChildNode[];
		headConfig.content = children.map((child) => child.value).join("\n");
	}
	return headConfig;
}

function convertFrontmatterToEvaluatedExpression(
	node: FrontmatterNode,
): EvaluatedExpression | null {
	return {
		name: node.type,
		value: node.value,
	};
}

export async function generateHeadConfig({
	path,
	logger,
}: {
	path: string;
	logger: AstroIntegrationLogger;
}): Promise<HeadConfig[]> {
	const source = fs.readFileSync(path, "utf8");

	const result = await parse(source, {
		position: false,
	});

	const descendants = await getDescendants(result.ast);

	const symbols = new Map<string, EvaluatedExpression>();
	// biome-ignore lint/complexity/noForEach: <explanation>
	descendants.frontMatters.forEach((node) => {
		const expression = convertFrontmatterToEvaluatedExpression(node);
		if (expression !== null) {
			symbols.set(expression.name, expression);
		}
	});

	return descendants.tags
		.map((it) => {
			return convertTagLikeNodeToHeadConfig(it as TagLikeNode, symbols, logger);
		})
		.filter((config) => config !== null) as HeadConfig[];
}
