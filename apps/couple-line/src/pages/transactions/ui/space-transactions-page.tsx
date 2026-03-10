import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import type { ColumnDef } from '@tanstack/react-table'
import { ArrowLeftRight, CircleMinus, CirclePlus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteTransactionFn } from '#/entities/transaction/server'
import { CreateTransactionForm } from '#/features/transactions/create-transaction-form'
import type { Database } from '#/shared/api/supabase/database.types'
import { formatDateLabel } from '#/shared/lib/date'
import { getErrorMessage } from '#/shared/lib/error'
import { formatCurrency } from '#/shared/lib/format'
import { Button } from '#/shared/ui/button'
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

type TransactionRow = {
  id: string
  date: string
  type: '수입' | '지출' | '이체'
  amount: number
  memo: string | null
  fromLabel: string | null
  toLabel: string | null
  userId: string | null
}

type AccountRow = Database['public']['Tables']['accounts']['Row']
type CategoryRow = Database['public']['Tables']['categories']['Row']

const typeBadgeClassName: Record<TransactionRow['type'], string> = {
  수입: 'bg-emerald-100 text-emerald-700',
  지출: 'bg-rose-100 text-rose-700',
  이체: 'bg-sky-100 text-sky-700',
}

const typeIcon = {
  수입: CirclePlus,
  지출: CircleMinus,
  이체: ArrowLeftRight,
} as const

export function SpaceTransactionsPage({
  spaceId,
  rows,
  accounts,
  categories,
}: {
  spaceId: string
  rows: TransactionRow[]
  accounts: AccountRow[]
  categories: CategoryRow[]
}) {
  const router = useRouter()
  const deleteTransaction = useServerFn(deleteTransactionFn)
  const mutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: async () => {
      toast.success('거래를 삭제했어요.', {
        description: '계정 잔액과 통계가 즉시 다시 계산됩니다.',
      })
      await router.invalidate()
    },
    onError: (error) => {
      toast.error('거래를 삭제하지 못했어요.', {
        description: getErrorMessage(error),
      })
    },
  })
  const negativeExpenseCount = rows.filter(
    (row) => row.type === '지출' && row.amount < 0,
  ).length
  const transferCount = rows.filter((row) => row.type === '이체').length

  async function handleDelete(row: TransactionRow) {
    if (!window.confirm('이 거래를 삭제할까요?')) {
      return
    }

    await mutation.mutateAsync({
      data: { spaceId, transactionId: row.id },
    })
  }

  const columns: ColumnDef<TransactionRow>[] = [
    {
      accessorKey: 'date',
      header: '일자',
      cell: ({ row }) => formatDateLabel(row.original.date),
    },
    {
      accessorKey: 'type',
      header: '유형',
    },
    {
      id: 'flow',
      header: 'From → To',
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium text-stone-900">
            {row.original.fromLabel ?? '—'} → {row.original.toLabel ?? '—'}
          </p>
          {row.original.memo ? (
            <p className="text-xs text-stone-500">{row.original.memo}</p>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: '금액',
      cell: ({ row }) => (
        <span
          className={
            row.original.amount < 0
              ? 'font-semibold text-emerald-700'
              : 'font-semibold text-stone-900'
          }
        >
          {formatCurrency(row.original.amount)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={async () => handleDelete(row.original)}
        >
          <Trash2 className="size-4 text-stone-500" />
        </Button>
      ),
    },
  ]

  return (
    <PageShell
      title="거래 내역"
      description="복식부기 규칙에 맞춰 수입·지출·이체를 입력하고, 환불/정산은 마이너스 지출로 자연스럽게 관리하세요."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryTile
          label="전체 거래"
          value={`${rows.length}건`}
          description="공간에 기록된 모든 분개 수"
        />
        <SummaryTile
          label="음수 지출"
          value={`${negativeExpenseCount}건`}
          description="환불·대납 정산처럼 기존 지출을 상계한 기록"
          tone="success"
        />
        <SummaryTile
          label="이체"
          value={`${transferCount}건`}
          description="계좌 간 이동 또는 카드대금 납부 기록"
          tone="sky"
        />
      </div>
      <CreateTransactionForm
        spaceId={spaceId}
        accounts={accounts}
        categories={categories}
      />
      <Card className="border-white/70 bg-white/88 shadow-[0_18px_60px_rgba(35,52,46,0.08)]">
        <CardHeader className="px-4 pb-0 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
            기록된 거래
          </CardTitle>
          <CardDescription>
            From → To 흐름과 금액을 한 번에 검토하고 필요하면 바로 삭제할 수
            있어요.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <DataTable
            columns={columns}
            data={rows}
            emptyMessage="거래를 한 건도 아직 기록하지 않았어요."
            mobileCardRenderer={(row) => {
              const TypeIcon = typeIcon[row.type]
              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${typeBadgeClassName[row.type]}`}
                      >
                        <TypeIcon className="size-3.5" />
                        {row.type}
                      </div>
                      <p className="mt-3 text-sm text-stone-500">
                        {formatDateLabel(row.date)}
                      </p>
                    </div>
                    <p
                      className={
                        row.amount < 0
                          ? 'text-right text-sm font-semibold text-emerald-700'
                          : 'text-right text-sm font-semibold text-stone-900'
                      }
                    >
                      {formatCurrency(row.amount)}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/80 px-3 py-3 text-sm">
                    <p className="text-stone-400">흐름</p>
                    <p className="mt-1 break-words font-medium text-stone-900">
                      {row.fromLabel ?? '—'} → {row.toLabel ?? '—'}
                    </p>
                    {row.memo ? (
                      <p className="mt-2 break-words text-stone-500">
                        {row.memo}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    variant="outline"
                    className="h-10 w-full rounded-xl text-rose-600"
                    onClick={async () => handleDelete(row)}
                  >
                    <Trash2 className="size-4" /> 삭제
                  </Button>
                </div>
              )
            }}
            tableClassName="min-w-[760px]"
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
