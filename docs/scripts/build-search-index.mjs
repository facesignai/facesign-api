import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import fg from 'fast-glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ROOT_DIR = path.resolve(__dirname, '..')
const SRC_DIR = path.join(ROOT_DIR, 'src', 'app')
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'search-index.json')

// Extract text content from MDX file
function extractContent(content) {
  // Remove code blocks
  let cleaned = content.replace(/```[\s\S]*?```/g, '')

  // Remove imports
  cleaned = cleaned.replace(/^import .+$/gm, '')

  // Remove exports
  cleaned = cleaned.replace(/^export .+$/gm, '')

  // Remove HTML/JSX tags
  cleaned = cleaned.replace(/<[^>]+>/g, '')

  // Remove markdown links but keep text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

  // Remove markdown formatting
  cleaned = cleaned.replace(/[*_`#]/g, '')

  // Normalize whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim()

  return cleaned
}

// Extract headings from MDX content
function extractHeadings(content) {
  const headings = []
  const lines = content.split('\n')

  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+?)(?:\s+\{\{.*?\}\})?$/)
    const h3Match = line.match(/^###\s+(.+?)(?:\s+\{\{.*?\}\})?$/)

    if (h2Match) {
      headings.push({ level: 2, text: h2Match[1].trim() })
    } else if (h3Match) {
      headings.push({ level: 3, text: h3Match[1].trim() })
    }
  }

  return headings
}

// Extract title from MDX frontmatter or first h1
function extractTitle(content, filePath) {
  // Try to extract from metadata export
  const metadataMatch = content.match(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?title:\s*['"]([^'"]+)['"]/m)
  if (metadataMatch) {
    return metadataMatch[1]
  }

  // Try to extract from first h1
  const h1Match = content.match(/^#\s+(.+?)(?:\s+\{\{.*?\}\})?$/m)
  if (h1Match) {
    return h1Match[1].trim()
  }

  // Fallback to filename
  const filename = path.basename(filePath, path.extname(filePath))
  return filename.charAt(0).toUpperCase() + filename.slice(1)
}

// Convert file path to URL
function getUrlFromPath(filePath) {
  const relativePath = path.relative(SRC_DIR, filePath)
  const withoutExt = relativePath.replace(/\.(mdx?|tsx?)$/, '')
  const withoutPage = withoutExt.replace(/\/page$/, '')

  let url = '/' + withoutPage.replace(/\\/g, '/')

  // Normalize URLs
  if (url === '/') return '/'
  return url.replace(/\/$/, '')
}

async function buildSearchIndex() {
  console.log('Building search index...')

  // Find all MDX and TSX page files
  const mdxFiles = await fg('**/page.{mdx,tsx}', {
    cwd: SRC_DIR,
    absolute: true,
  })

  console.log(`Found ${mdxFiles.length} page files`)

  const pages = []

  for (const filePath of mdxFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const title = extractTitle(content, filePath)
      const headings = extractHeadings(content)
      const cleanContent = extractContent(content)
      const url = getUrlFromPath(filePath)

      // Skip if no meaningful content
      if (!cleanContent || cleanContent.length < 10) {
        continue
      }

      // Add page with title
      pages.push({
        id: url,
        title,
        content: cleanContent.slice(0, 500),
        url,
      })

      // Add entries for each major heading
      headings.forEach((heading, idx) => {
        if (heading.level === 2) {
          // Get content after this heading until next h2
          const headingIndex = content.indexOf(`## ${heading.text}`)
          if (headingIndex === -1) return

          const nextH2Index = content.indexOf('##', headingIndex + 1)
          const sectionContent = nextH2Index !== -1
            ? content.slice(headingIndex, nextH2Index)
            : content.slice(headingIndex)

          const cleanSectionContent = extractContent(sectionContent)

          if (cleanSectionContent.length > 20) {
            pages.push({
              id: `${url}#${idx}`,
              title,
              heading: heading.text,
              content: cleanSectionContent.slice(0, 300),
              url: `${url}#${heading.text.toLowerCase().replace(/\s+/g, '-')}`,
              section: heading.text,
            })
          }
        }
      })
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message)
    }
  }

  console.log(`Generated ${pages.length} searchable entries`)

  // Write index to public directory
  const searchIndex = { pages }
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchIndex, null, 2))

  console.log(`Search index written to ${OUTPUT_FILE}`)
}

buildSearchIndex().catch((error) => {
  console.error('Failed to build search index:', error)
  process.exit(1)
})
