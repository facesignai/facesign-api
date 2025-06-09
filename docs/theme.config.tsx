import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  logo: (
    <span className="flex items-center gap-2">
      <span className="font-bold text-xl">FaceSign API</span>
      <span className="text-sm text-gray-500">v1.0.18</span>
    </span>
  ),
  project: {
    link: 'https://github.com/facesignai/facesign-api',
  },
  docsRepositoryBase: 'https://github.com/facesignai/facesign-api/blob/main/docs',
  footer: {
    content: (
      <span>
        © {new Date().getFullYear()} FaceSign AI. All rights reserved.
      </span>
    ),
  },
  darkMode: true,
  sidebar: {
    toggleButton: false,
    defaultMenuCollapseLevel: 0,
    autoCollapse: false,
  },
  navigation: {
    prev: true,
    next: true,
  },
  toc: {
    backToTop: true,
    float: true,
  },
  editLink: {
    content: 'Edit this page on GitHub →',
  },
  feedback: {
    content: 'Questions? Give us feedback →',
    labels: 'feedback',
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="FaceSign API Documentation" />
      <meta property="og:description" content="Official API documentation for FaceSign - Build AI-powered identity verification flows" />
      <link rel="icon" href="/favicon.ico" />
    </>
  ),
}

export default config 