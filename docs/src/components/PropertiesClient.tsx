'use client'

import React from 'react'
import { PropertiesTable, type Property } from '@/components/chakra/PropertiesTable'

export function Properties({ children }: { children: React.ReactNode }) {
  // Convert MDX Property children to PropertiesTable format
  const properties: Property[] = React.Children.toArray(children)
    .filter((child): child is React.ReactElement => {
      return (
        React.isValidElement(child) &&
        child.props &&
        (child.props['data-property-name'] || child.props.name)
      )
    })
    .map((child) => {
      // Support both data attributes and direct props
      const name = child.props['data-property-name'] || child.props.name || ''
      const type = child.props['data-property-type'] || child.props.type
      const description = child.props.children

      return {
        name,
        type,
        description,
      }
    })

  return <PropertiesTable properties={properties} />
}

export function Property({
  name,
  children,
  type,
}: {
  name: string
  children: React.ReactNode
  type?: string
}) {
  // This component is just a data holder for Properties to parse
  // Return a data element instead of null to avoid SSR iteration issues
  return (
    <div data-property-name={name} data-property-type={type} style={{ display: 'none' }}>
      {children}
    </div>
  )
}
