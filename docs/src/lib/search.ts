import FlexSearch from 'flexsearch'

export interface SearchResult {
  id: string
  title: string
  heading?: string
  content: string
  url: string
  section?: string
}

export interface SearchIndex {
  pages: SearchResult[]
}

let searchIndex: FlexSearch.Index | null = null
let searchData: SearchResult[] = []

export async function loadSearchIndex(): Promise<void> {
  if (searchIndex) return // Already loaded

  try {
    const response = await fetch('/search-index.json')
    if (!response.ok) {
      console.warn('Search index not found')
      return
    }

    const data: SearchIndex = await response.json()
    searchData = data.pages

    // Create FlexSearch index
    searchIndex = new FlexSearch.Index({
      tokenize: 'forward',
      cache: 100,
      context: {
        resolution: 9,
        depth: 2,
        bidirectional: true,
      },
    })

    // Add all documents to index
    searchData.forEach((page, idx) => {
      const searchableContent = [
        page.title,
        page.heading || '',
        page.section || '',
        page.content,
      ]
        .filter(Boolean)
        .join(' ')

      searchIndex?.add(idx, searchableContent)
    })
  } catch (error) {
    console.error('Failed to load search index:', error)
  }
}

export function search(query: string, limit = 10): SearchResult[] {
  if (!searchIndex || !query.trim()) return []

  try {
    const results = searchIndex.search(query, { limit: limit * 2 }) as number[]

    return results
      .map((idx) => searchData[idx])
      .filter(Boolean)
      .slice(0, limit)
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text

  const words = query.trim().split(/\s+/)
  let highlighted = text

  words.forEach((word) => {
    const regex = new RegExp(`(${word})`, 'gi')
    highlighted = highlighted.replace(regex, '<mark>$1</mark>')
  })

  return highlighted
}

export function truncateContent(content: string, maxLength = 150): string {
  if (content.length <= maxLength) return content

  const truncated = content.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')

  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...'
}
