import { slugifyWithCounter } from '@sindresorhus/slugify'
import * as acorn from 'acorn'
import { toString } from 'mdast-util-to-string'
import { mdxAnnotations } from 'mdx-annotations'
import { createHighlighter } from 'shiki'
import { visit } from 'unist-util-visit'

function rehypeParseCodeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, _nodeIndex, parentNode) => {
      if (node.tagName === 'code' && parentNode?.properties) {
        parentNode.properties.language = node.properties.className
          ? node.properties?.className[0]?.replace(/^language-/, '')
          : 'txt'
      }
    })
  }
}

// Singleton highlighter instance (reused across all MDX files during build)
let highlighter
let highlighterPromise

// Create highlighter once and cache the promise to avoid race conditions
async function getHighlighter() {
  if (highlighter) return highlighter

  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'bash',
        'shell',
        'json',
        'html',
        'css',
        'python',
        'go',
        'diff',
      ],
    }).then((h) => {
      highlighter = h
      return h
    })
  }

  return highlighterPromise
}

function rehypeShiki() {
  return async (tree) => {
    const shiki = await getHighlighter()

    visit(tree, 'element', (node) => {
      if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
        let codeNode = node.children[0]
        let textNode = codeNode.children[0]

        node.properties.code = textNode.value

        if (node.properties.language) {
          try {
            let html = shiki.codeToHtml(textNode.value, {
              lang: node.properties.language,
              theme: 'github-light',
            })

            // Extract just the code content, removing <pre> and <code> wrappers
            // The generated HTML is: <pre class="..."><code>...</code></pre>
            // We want just the inner content wrapped in spans
            let match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/)
            if (match) {
              textNode.value = match[1]
            }
          } catch (e) {
            // If language is not supported, leave the code as-is
            console.warn(
              `Shiki: Unsupported language "${node.properties.language}". Available languages can be checked at: https://shiki.style/languages`
            )
          }
        }
      }
    })
  }
}

function rehypeSlugify() {
  return (tree) => {
    let slugify = slugifyWithCounter()
    visit(tree, 'element', (node) => {
      // Add IDs to h2, h3, and h4 headings for TOC and linking
      if (['h2', 'h3', 'h4'].includes(node.tagName) && !node.properties.id) {
        node.properties.id = slugify(toString(node))
      }
    })
  }
}

function rehypeAddMDXExports(getExports) {
  return (tree) => {
    let exports = Object.entries(getExports(tree))

    for (let [name, value] of exports) {
      for (let node of tree.children) {
        if (
          node.type === 'mdxjsEsm' &&
          new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
        ) {
          return
        }
      }

      let exportStr = `export const ${name} = ${value}`

      tree.children.push({
        type: 'mdxjsEsm',
        value: exportStr,
        data: {
          estree: acorn.parse(exportStr, {
            sourceType: 'module',
            ecmaVersion: 'latest',
          }),
        },
      })
    }
  }
}

function getSections(node) {
  let sections = []

  for (let child of node.children ?? []) {
    if (child.type === 'element' && child.tagName === 'h2') {
      sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        ...${child.properties.annotation}
      }`)
    } else if (child.children) {
      sections.push(...getSections(child))
    }
  }

  return sections
}

export const rehypePlugins = [
  mdxAnnotations.rehype,
  rehypeParseCodeBlocks,
  rehypeShiki,
  rehypeSlugify,
  [
    rehypeAddMDXExports,
    (tree) => ({
      sections: `[${getSections(tree).join()}]`,
    }),
  ],
]
