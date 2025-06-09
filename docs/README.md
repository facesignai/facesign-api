# FaceSign API Documentation

This is the official documentation site for the FaceSign API, built with Next.js 14, Nextra 4.2, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Start development server (http://localhost:4000)
yarn dev

# Build for production
yarn build

# Preview production build
yarn start
```

## 📁 Project Structure

```
docs/
├── pages/              # Documentation pages (MDX)
│   ├── index.mdx      # Homepage
│   ├── getting-started/
│   ├── concepts/
│   ├── nodes/
│   ├── sdk/
│   └── ...
├── components/         # React components
├── styles/            # Global CSS
├── public/            # Static assets
└── theme.config.tsx   # Nextra theme configuration
```

## 🛠️ Development

### Adding New Pages

1. Create an `.mdx` file in the appropriate directory
2. Add frontmatter with `title` and `description`
3. Update `_meta.json` in the parent directory for navigation

### Using Components

```mdx
import { Callout } from 'nextra/components'
import { CodeBlock } from '@/components/CodeBlock'

<Callout type="info">
  This is an info callout
</Callout>
```

### Syntax Highlighting

Code blocks automatically get syntax highlighting:

````mdx
```typescript
const client = new Client({
  auth: process.env.FACESIGN_API_KEY
})
```
````

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Static Export

```bash
# Build static site
yarn build

# Output will be in 'out' directory
```

### Firebase Hosting

```bash
# Build the site
yarn build

# Initialize Firebase (if not already done)
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## 🎨 Customization

- **Theme**: Edit `theme.config.tsx`
- **Styles**: Modify `styles/globals.css`
- **Colors**: Update Tailwind config in `tailwind.config.js`
- **Components**: Add custom components to `components/`

## 📝 Writing Guidelines

1. **Use clear headings** - Help readers scan content
2. **Include examples** - Show, don't just tell
3. **Add type definitions** - Use TypeScript code blocks
4. **Link related content** - Help users discover more
5. **Keep it concise** - Get to the point quickly

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
yarn install
yarn build
```

## 📚 Resources

- [Nextra Documentation](https://nextra.site)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [MDX](https://mdxjs.com)

## 📄 License

MIT © FaceSign AI 