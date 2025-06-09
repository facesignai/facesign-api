module.exports = async () => {
  const nextra = await import('./protocol_docs/node_modules/nextra/dist/server')
  
  const withNextra = nextra.default({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx',
  })

  return withNextra({
    reactStrictMode: true,
    images: { 
      unoptimized: true,
    },
    output: 'export',
  })
} 