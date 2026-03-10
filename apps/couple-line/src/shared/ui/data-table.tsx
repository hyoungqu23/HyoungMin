import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { cn } from '#/shared/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/shared/ui/table'

export function DataTable<TData>({
  columns,
  data,
  emptyMessage = '표시할 데이터가 없습니다.',
  mobileCardRenderer,
  tableClassName,
}: {
  columns: ColumnDef<TData>[]
  data: TData[]
  emptyMessage?: string
  mobileCardRenderer?: (row: TData, index: number) => ReactNode
  tableClassName?: string
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,248,0.88))] shadow-[0_18px_60px_rgba(35,52,46,0.08)]">
      {mobileCardRenderer ? (
        <div className="space-y-3 p-3 md:hidden">
          {rows.length ? (
            rows.map((row, index) => (
              <div
                key={row.id}
                className="rounded-[1.25rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,248,0.82))] p-4 shadow-[0_10px_24px_rgba(35,52,46,0.04)]"
              >
                {mobileCardRenderer(row.original, index)}
              </div>
            ))
          ) : (
            <div className="flex min-h-32 items-center justify-center px-4 text-center text-sm text-stone-500">
              {emptyMessage}
            </div>
          )}
        </div>
      ) : null}

      <div className={cn(mobileCardRenderer && 'hidden md:block')}>
        <Table className={cn('min-w-[720px] md:min-w-full', tableClassName)}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 bg-stone-50/70 text-stone-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-stone-100/80 transition-colors hover:bg-stone-50/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="align-top">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-stone-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
