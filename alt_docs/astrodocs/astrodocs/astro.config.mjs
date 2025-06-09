// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightOpenAPI from 'starlight-openapi';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	server: {
		port: 4001,                              // set default port
	},
	integrations: [
		starlight({
			title: 'FaceSign API',
			description: 'AI-powered identity verification API documentation',
			logo: {
				src: './public/logoWide.png',
				alt: 'FaceSign',
			},
			favicon: '/favicon.svg',
			// Force light theme
			expressiveCode: {
				themes: ['github-light'],
				styleOverrides: {
					borderColor: '#e1e4e8',
					borderRadius: '6px',
				},
			},
			customCss: [
				// Import custom global styles
				'./src/styles/globals.css',
				'./src/styles/components.css',
			],
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/facesignai/facesign-api' }
			],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Installation', link: '/getting-started/' },
						{ label: 'Quick Start', link: '/getting-started/quick-start' },
						{ label: 'Authentication', link: '/getting-started/authentication' },
						{ label: 'Error Handling', link: '/getting-started/error-handling' },
					],
				},
				{
					label: 'Core Concepts',
					items: [
						{ label: 'Sessions', link: '/concepts/sessions' },
						{ label: 'Client Secrets', link: '/concepts/client-secrets' },
						{ label: 'Node Graph', link: '/concepts/node-graph' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Webhooks', link: '/guides/webhooks' },
						{ label: 'Rate Limits', link: '/guides/rate-limits' },
						{ label: 'Security', link: '/guides/security' },
					],
				},
				{
					label: 'Examples',
					items: [
						{ label: 'Basic Session', link: '/examples/basic-session' },
						{ label: 'REST Client', link: '/examples/rest-client' },
					],
				},
				{
					label: 'API Reference',
					link: '/reference',
				},
			],
			defaultLocale: 'en',
			locales: {
				en: {
					label: 'English',
				},
			},
			head: [
				// Force light theme immediately
				{
					tag: 'script',
					attrs: {
						type: 'text/javascript',
					},
					content: `
						// Force light theme before page renders
						document.documentElement.setAttribute('data-theme', 'light');
						document.documentElement.style.colorScheme = 'light';
						localStorage.setItem('starlight-theme', 'light');
					`,
				},
				// Add Inter font
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.googleapis.com',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'preconnect',
						href: 'https://fonts.gstatic.com',
						crossorigin: true,
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'stylesheet',
						href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
					},
				},
				// Add additional favicon links
				{
					tag: 'link',
					attrs: {
						rel: 'apple-touch-icon',
						sizes: '192x192',
						href: '/logo192.png',
					},
				},
				{
					tag: 'link',
					attrs: {
						rel: 'icon',
						type: 'image/png',
						sizes: '512x512',
						href: '/logo512.png',
					},
				},
			],
			plugins: [
				starlightOpenAPI([
					{
						base: 'reference',       // Base path for generated pages
						schema: './openapi.yaml', // Path to OpenAPI spec file
					},
				]),
			],
			components: {
				// Force light theme by default
				ThemeProvider: './src/components/ThemeProvider.astro',
				// Comment out the line below if you want to show the theme toggle
				ThemeSelect: './src/components/ThemeSelect.astro',
			},
		}),
		tailwind({
			// Disable base styles as we're using Starlight's
			applyBaseStyles: false,
		}),
	],
});
