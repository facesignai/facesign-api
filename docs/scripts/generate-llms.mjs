#!/usr/bin/env node

// Generate LLM-friendly markdown from source (MDX/OpenAPI) and write to public/llms
// Usage: node scripts/generate-llms.mjs

import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const APP_DIR = path.join(ROOT, 'src', 'app')
const OUT_DIR = path.join(ROOT, 'public', 'llms')
fs.mkdirSync(OUT_DIR, { recursive: true })

function read(file) {
  return fs.readFileSync(file, 'utf8')
}

function writeOut(relSlug, content) {
  const outPath = path.join(OUT_DIR, relSlug + '.txt')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, content)
  console.log('Wrote', path.relative(ROOT, outPath))
}

function sanitizeMDXToMarkdown(src) {
  // Remove export metadata and sections arrays
  let s = src.replace(/^export\s+const\s+metadata[\s\S]*?^\}/m, '')
  s = s.replace(/^export\s+const\s+sections[\s\S]*?^\]/m, '')
  // Strip most component wrappers while preserving fenced code content
  s = s.replace(/<\/?(CodeGroup|Properties|Property|Row|Col|Note|Alert|FlowDiagram|ApiPlayground)[^>]*>/g, '')
  // Remove HTML comments
  s = s.replace(/<!--([\s\S]*?)-->/g, '')
  // Collapse excessive blank lines
  s = s.replace(/\n{3,}/g, '\n\n')
  // Append footer
  const now = new Date().toISOString().slice(0, 10)
  s += `\n\n---\nGenerated for LLMs on ${now}. Source: FaceSign docs.\n`
  return s.trim() + '\n'
}

function generateForMdx(slugParts) {
  const filePath = path.join(APP_DIR, ...slugParts, 'page.mdx')
  if (!fs.existsSync(filePath)) return false
  const raw = read(filePath)
  const md = sanitizeMDXToMarkdown(raw)
  writeOut(path.join(...slugParts), md)
  return true
}

function composeOpenApiMarkdown(spec, endpoints) {
  const lines = []
  lines.push('# FaceSign API – Endpoint Pack')
  for (const { path: p, method } of endpoints) {
    const op = spec.paths?.[p]?.[method]
    if (!op) continue
    lines.push(`\n## ${method.toUpperCase()} ${p}`)
    if (op.summary) lines.push(`\n${op.summary}`)
    if (op.parameters?.length) {
      lines.push('\n### Parameters')
      for (const prm of op.parameters) {
        lines.push(`- ${prm.name} (${prm.in})${prm.required ? ' [required]' : ''}: ${prm.description || ''}`)
      }
    }
    const resp200 = op.responses?.['200'] || op.responses?.['201']
    if (resp200) {
      lines.push('\n### 200 Example')
      lines.push('```json')
      lines.push('{ /* see live fixture in docs/src/examples */ }')
      lines.push('```')
    }
    const key4xx = ['400','401','404','429'].find(c => op.responses?.[c])
    if (key4xx) {
      lines.push(`\n### ${key4xx} Example`)
      lines.push('```json')
      lines.push('{ "error": { "type": "...", "message": "..." } }')
      lines.push('```')
    }
  }
  const now = new Date().toISOString().slice(0, 10)
  lines.push(`\n---\nGenerated for LLMs on ${now}. Source: OpenAPI.`)
  return lines.join('\n') + '\n'
}

function generateForApi() {
  const specPath = path.join(ROOT, 'public', 'openapi.json')
  if (!fs.existsSync(specPath)) return false
  const spec = JSON.parse(read(specPath))
  const endpoints = [
    { path: '/sessions', method: 'post' },
    { path: '/sessions', method: 'get' },
    { path: '/sessions/{sessionId}', method: 'get' },
    { path: '/sessions/{sessionId}/refresh', method: 'get' },
    { path: '/langs', method: 'get' },
    { path: '/avatars', method: 'get' },
  ]
  const md = composeOpenApiMarkdown(spec, endpoints)
  writeOut('api', md)
  return true
}

async function main() {
  // Generate for key MDX pages
  const mdxSlugs = [
    ['docs'],
    ['quickstart'],
    ['sessions'],
    ['flows'],
    ['flows','mapping'],
    ['webhooks'],
    ['webhooks','signed-headers'],
    ['authentication'],
    ['errors'],
  ]
  for (const slug of mdxSlugs) generateForMdx(slug)
  // Generate API pack
  generateForApi()
}

main().catch((e) => { console.error(e); process.exit(1) })


