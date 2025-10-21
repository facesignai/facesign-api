'use client'

import {
  Card,
  Table,
} from '@chakra-ui/react'
import { ReactNode } from 'react'

interface ReferenceTableProps {
  headers: string[]
  children: ReactNode
}

export function ReferenceTable({ headers, children }: ReferenceTableProps) {
  return (
    <Card.Root variant="outline" bg="gray.50">
      <Card.Body p={0}>
        <Table.Root variant="line">
          <Table.Header>
            <Table.Row>
              {headers.map((header, idx) => (
                <Table.ColumnHeader key={idx}>{header}</Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {children}
          </Table.Body>
        </Table.Root>
      </Card.Body>
    </Card.Root>
  )
}
