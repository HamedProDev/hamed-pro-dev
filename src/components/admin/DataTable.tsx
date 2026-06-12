'use client'
import { ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Column<T> {
  header: string
  accessor: string
  render?: (item: T) => ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({ columns, data, emptyMessage = 'No data found.' }: DataTableProps<T>) {
  return (
    <div className="rounded-xl border border-dark-500 bg-dark-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-dark-500">
            {columns.map(col => <TableHead key={col.accessor}>{col.header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={columns.length} className="text-center py-8 text-text-muted">{emptyMessage}</TableCell></TableRow>
          ) : data.map((item, i) => (
            <TableRow key={i} className="border-dark-500">
              {columns.map(col => <TableCell key={col.accessor}>{col.render ? col.render(item) : item[col.accessor]}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
