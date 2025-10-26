'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { loadSearchIndex, search as performSearch, SearchResult } from '@/lib/search'

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
  const [isLoading, setIsLoading] = useState(true)

  // Load search index on mount
  useEffect(() => {
    loadSearchIndex()
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false))
  }, [])

  // Perform search when query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchResults = performSearch(query, 10)
    setResults(searchResults)
  }, [query])

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
