import type { ColumnDef } from '@tanstack/react-table'
import { CategoryFormDialog } from '#/features/categories/category-form-dialog'
import type { Database } from '#/shared/api/supabase/database.types'
import { Badge } from '#/shared/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/ui/card'
import { DataTable } from '#/shared/ui/data-table'
import { PageShell } from '#/shared/ui/page-shell'
import { SummaryTile } from '#/shared/ui/summary-tile'

type CategoryRow = Database['public']['Tables']['categories']['Row']

export function SpaceCategoriesPage({
  spaceId,
  categories,
}: {
  spaceId: string
  categories: CategoryRow[]
}) {
  const incomeCount = categories.filter(
    (category) => category.type === '수입',
  ).length
  const expenseCount = categories.filter(
    (category) => category.type === '지출',
  ).length

  const columns: ColumnDef<CategoryRow>[] = [
    {
      accessorKey: 'name',
      header: '카테고리 이름',
      cell: ({ row }) => (
        <span className="font-medium text-stone-900">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'type',
      header: '유형',
      cell: ({ row }) => (
        <Badge
          className={
            row.original.type === '수입'
              ? 'rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
              : 'rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100'
          }
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <CategoryFormDialog
          spaceId={spaceId}
          initialValue={{
            id: row.original.id,
            name: row.original.name,
            type: row.original.type as '수입' | '지출',
          }}
        />
      ),
    },
  ]

  return (
    <PageShell
      title="카테고리"
      description="수입/지출 카테고리를 커플의 실제 생활 흐름에 맞게 관리하세요."
      actions={<CategoryFormDialog spaceId={spaceId} />}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryTile
          label="전체 카테고리"
          value={`${categories.length}개`}
          description="공간에서 바로 선택 가능한 분류 수"
        />
        <SummaryTile
          label="수입 카테고리"
          value={`${incomeCount}개`}
          description="급여·이자·기타 수입 등 유입 분류"
          tone="success"
        />
        <SummaryTile
          label="지출 카테고리"
          value={`${expenseCount}개`}
          description="생활비·웨딩·정산까지 모두 같은 장부 규칙으로 관리"
          tone="amber"
        />
      </div>
      <Card className="border-white/70 bg-white/88 shadow-[0_18px_60px_rgba(35,52,46,0.08)]">
        <CardHeader className="px-4 pb-0 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
            카테고리 목록
          </CardTitle>
          <CardDescription>
            수입과 지출을 분리해 두면 거래 입력 시 드롭다운이 더 명확해집니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <DataTable
            columns={columns}
            data={categories}
            emptyMessage="아직 카테고리가 없습니다."
            mobileCardRenderer={(row) => (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-medium text-stone-900">
                      {row.name}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      생활 흐름에 맞춰 자유롭게 수정할 수 있어요.
                    </p>
                  </div>
                  <Badge
                    className={
                      row.type === '수입'
                        ? 'rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'rounded-full bg-amber-100 text-amber-700 hover:bg-amber-100'
                    }
                  >
                    {row.type}
                  </Badge>
                </div>
                <CategoryFormDialog
                  spaceId={spaceId}
                  initialValue={{
                    id: row.id,
                    name: row.name,
                    type: row.type as '수입' | '지출',
                  }}
                />
              </div>
            )}
            tableClassName="min-w-[520px]"
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
