import type {
	Node,
	TagLikeNode,
	ParentNode,
	FrontmatterNode,
} from "@astrojs/compiler/types";
import { is, type Visitor } from "@astrojs/compiler/utils";

const canUseInHead = [
	"title",
	"base",
	"link",
	"style",
	"meta",
	"script",
	"noscript",
	"template",
];

class Walker {
	constructor(private callback: Visitor) {}
	async visit(node: Node, parent?: ParentNode, index?: number): Promise<void> {
		await this.callback(node, parent, index);
		if (is.parent(node)) {
			const promises = [] as (void | Promise<void>)[];
			for (let i = 0; i < node.children.length; i++) {
				const child = node.children[i] as Node;
				promises.push(this.callback(child, node as ParentNode, i));
			}
			await Promise.all(promises);
		}
	}
}

export async function getDescendants(node: ParentNode): Promise<{
	tags: TagLikeNode[];
	frontMatters: FrontmatterNode[];
}> {
	const tags = [] as TagLikeNode[];
	const frontMatters = [] as FrontmatterNode[];

	const walker = new Walker((node) => {
		if (!is.tag(node) && !is.frontmatter(node)) return;

		if (is.frontmatter(node)) {
			frontMatters.push(node);
			return;
		}

		if (is.tag(node) && !canUseInHead.includes(node.name)) {
			return;
		}
		tags.push(node);
	});
	await walker.visit(node);
	return {
		tags,
		frontMatters,
	};
}
