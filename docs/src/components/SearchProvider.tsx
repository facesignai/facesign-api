'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { SearchResult } from '@/lib/search'

interface SearchContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  query: string
  setQuery: (query: string) => void
  results: SearchResult[]
  isLoading: boolean
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchModule, setSearchModule] = useState<any>(null)

  // Lazy load search module only when first opened
  useEffect(() => {
    if (isOpen && !searchModule) {
      setIsLoading(true)
      import('@/lib/search')
        .then((module) => {
          module.loadSearchIndex().then(() => {
            setSearchModule(module)
            setIsLoading(false)
          })
        })
        .catch(() => setIsLoading(false))
    }
  }, [isOpen, searchModule])

  // Perform search when query changes
  useEffect(() => {
    if (!query.trim() || !searchModule) {
      setResults([])
      return
    }

    const searchResults = searchModule.search(query, 10)
    setResults(searchResults)
  }, [query, searchModule])

  // Handle keyboard shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Reset query when closing
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        setIsOpen,
        query,
        setQuery,
        results,
        isLoading,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
