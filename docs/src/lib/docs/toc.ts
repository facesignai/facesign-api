export interface TOCItem {
  id: string
  text: string
  level: number
}

export function extractHeadingsFromHtml(root: HTMLElement, maxDepth = 3): TOCItem[] {
  const elements = Array.from(root.querySelectorAll('h2, h3, h4'))
  return elements
    .map((elem) => ({
      id: elem.id || elem.textContent?.toLowerCase().replace(/\s+/g, '-') || '',
      text: elem.textContent || '',
      level: parseInt(elem.tagName.charAt(1)),
    }))
    .filter((h) => h.level <= maxDepth && h.id && h.text)
}


