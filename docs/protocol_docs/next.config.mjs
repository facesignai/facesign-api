import nextMDX from '@next/mdx'

import { recmaPlugins } from '../../protocol_docs/src/mdx/recma.mjs'
import { rehypePlugins } from '../../protocol_docs/src/mdx/rehype.mjs'
import { remarkPlugins } from '../../protocol_docs/src/mdx/remark.mjs'
import withSearch from '../../protocol_docs/src/mdx/search.mjs'

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
}

export default withSearch(withMDX(nextConfig))
