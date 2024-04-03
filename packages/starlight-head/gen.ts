import { parse } from '@astrojs/compiler';
import { walk, is } from '@astrojs/compiler/utils';

import fs from 'node:fs';

interface HeadConfig {
  tag: string;
  attrs?: Record<string, string | boolean | undefined>;
  content?: string;
}

const results: HeadConfig[] = [];

const canUseInHead = ['title', 'base', 'link', 'style', 'meta', 'script', 'noscript', 'template']

const source = fs.readFileSync('./head.astro', 'utf8');

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

  convertASTToHeadConfig(node);
  // console.log('results: ', results);
});

// 转换函数
function convertASTToHeadConfig(node) {

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

  results.push(headConfig);
}