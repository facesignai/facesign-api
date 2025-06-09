# Astro Starlight Theme Customization

This document explains the styling and theme customizations applied to the FaceSign API documentation.

## 1. Default Light Theme

The documentation is configured to always use light theme by default. This is enforced through multiple mechanisms:

- **Head Script**: An inline script in the document head sets light theme before page render
- **ThemeProvider Override**: `src/components/ThemeProvider.astro` forcefully sets and maintains light theme
- **MutationObserver**: Prevents any attempts to change the theme to dark mode
- **localStorage Override**: Always returns 'light' for the theme preference
- **Theme Toggle Hidden**: `src/components/ThemeSelect.astro` hides the theme selector
- **CSS color-scheme**: Explicitly set to 'light' in the root styles

### Theme Enforcement Details:
The system uses a multi-layered approach to ensure light theme:
1. Immediate script execution in document head
2. ThemeProvider component with MutationObserver to prevent changes
3. localStorage interception to always return light theme
4. CSS `color-scheme: light` declaration

### To Enable Theme Toggle:
If you want users to switch between light/dark themes, you need to:
1. Remove or comment out the `ThemeSelect` component override in `astro.config.mjs`
2. Remove the head script that forces light theme
3. Replace the ThemeProvider component with a simpler version
4. Remove the localStorage override

```javascript
// In astro.config.mjs, comment out:
// ThemeSelect: './src/components/ThemeSelect.astro',
```

## 2. Non-Collapsible Sidebar

The sidebar navigation is always expanded to improve discoverability:

- All chevron/collapse icons are hidden
- Sidebar groups cannot be collapsed
- Navigation hierarchy is always visible

This is implemented in `src/styles/globals.css` with comprehensive CSS rules.

## 3. Logo and Branding

The documentation uses the official FaceSign branding:

- **Main Logo**: `public/logoWide.png` - displayed in the header
- **Favicon**: `public/favicon.svg` - browser tab icon
- **Apple Touch Icon**: `public/logo192.png` - mobile devices
- **Large Icon**: `public/logo512.png` - high-resolution displays

## 4. Custom Styling

### Color Scheme
- **Accent Color**: FaceSign Blue (#2196f3)
- **Typography**: Inter font for modern, readable text
- **Code Blocks**: Enhanced with syntax highlighting and copy buttons

### UI Components
- Custom Callout, Button, and Badge components
- Tailwind CSS integration for utility classes
- Responsive full-width layout

## 5. Making Changes

### To Change the Default Theme:
Edit `src/components/ThemeProvider.astro` to set a different default:
```javascript
document.documentElement.dataset.theme = 'dark'; // or 'auto'
```

### To Show Sidebar Chevrons:
Remove or comment out the sidebar CSS rules in `src/styles/globals.css`.

### To Update Branding Colors:
Modify the CSS variables in `src/styles/globals.css`:
```css
:root {
  --sl-color-accent: #your-color-here;
}
```

## Build and Preview

```bash
# Build the documentation
yarn build

# Preview locally
yarn preview

# Development server
yarn dev
``` 