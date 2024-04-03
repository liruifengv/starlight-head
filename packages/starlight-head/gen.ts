import { parse } from '@astrojs/compiler';
import { walk, is } from '@astrojs/compiler/utils';
import type { StarlightPlugin, StarlightUserConfig } from '@astrojs/starlight/types'

import fs from 'node:fs';

export interface HeadConfig {
  tag: string;
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
}

const results: HeadConfig[] = [];

const canUseInHead = ['title', 'base', 'link', 'style', 'meta', 'script', 'noscript', 'template']

function convertASTToHeadConfig(node): HeadConfig {
  const headConfig: HeadConfig = {
    tag: node.name,
    attrs: {}
  };

  node.attributes.forEach(attr => {
	if (headConfig.attrs) {
		if (attr.kind === 'quoted') {
			headConfig.attrs[attr.name] = attr.value;
		  } else if (attr.kind === 'expression') {
			//  TODO: 这里需要处理表达式
			headConfig.attrs[attr.name] = attr.value; // 假设这里是变量的名称
		  } else if (attr.kind === 'empty') {
			headConfig.attrs[attr.name] = true;
		  }
	}
  });

  if (node.children.length > 0) {
    headConfig.content = node.children.map(child => child.value).join('\n');
  }

  return headConfig;
}

export async function generateHeadConfig(path): Promise<HeadConfig[]> {
	const source = fs.readFileSync(path, 'utf8');

	const result = await parse(source, {
		position: false,
	});

	walk(result.ast, (node) => {
		if (!is.tag(node)) return;
		if (is.tag(node) && !canUseInHead.includes(node.name)) {
			throw new Error(`Element <${node.name}> is not allowed in the head.`);
		}
		if (canUseInHead.includes(node.name)) {
			console.log(node)
		}
		
		const head = convertASTToHeadConfig(node);
		results.push(head);
	});
	
	return results
}