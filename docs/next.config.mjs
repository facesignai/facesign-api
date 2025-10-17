import nextMDX from '@next/mdx'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import { recmaPlugins } from './src/mdx/recma.mjs'
import { rehypePlugins } from './src/mdx/rehype.mjs'
import { remarkPlugins } from './src/mdx/remark.mjs'
import withSearch from './src/mdx/search.mjs'

const withMDX = nextMDX({
  options: {
    remarkPlugins,
    rehypePlugins,
    recmaPlugins,
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  experimental: {
    outputFileTracingIncludes: {
      '/**/*': ['./src/app/**/*.mdx'],
    },
  },
  webpack: (config) => {
    // Copy root openapi.yaml into docs/public for Redoc
    const repoRoot = path.resolve(__dirname, '..')
    const src = path.join(repoRoot, 'openapi.yaml')
    const dest = path.join(__dirname, 'public', 'openapi.yaml')
    try {
      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true })
        fs.copyFileSync(src, dest)
      }
    } catch (e) {
      console.warn('openapi copy failed:', e?.message)
    }
    return config
  },
}

export default withSearch(withMDX(nextConfig))
