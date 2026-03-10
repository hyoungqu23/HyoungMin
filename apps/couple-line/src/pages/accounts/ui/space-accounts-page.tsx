import type { ColumnDef } from '@tanstack/react-table'
import { AccountFormDialog } from '#/features/accounts/account-form-dialog'
import type { Database } from '#/shared/api/supabase/database.types'
import { formatCurrency } from '#/shared/lib/format'
import type { AccountBalanceRow } from '#/shared/lib/ledger'
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

type AccountRow = Database['public']['Tables']['accounts']['Row']

export function SpaceAccountsPage({
  spaceId,
  rows,
  accounts,
}: {
  spaceId: string
  rows: AccountBalanceRow[]
  accounts: AccountRow[]
}) {
  const totalAssets = rows
    .filter((row) => row.type === '자산')
    .reduce((sum, row) => sum + row.currentBalance, 0)
  const totalLiabilities = rows
    .filter((row) => row.type === '부채')
    .reduce((sum, row) => sum + row.currentBalance, 0)
  const netWorth = totalAssets - totalLiabilities
  const assetCount = rows.filter((row) => row.type === '자산').length
  const liabilityCount = rows.filter((row) => row.type === '부채').length

  const columns: ColumnDef<AccountBalanceRow>[] = [
    {
      accessorKey: 'name',
      header: '계정',
      cell: ({ row }) => (
        <div className="space-y-1">
          <p className="font-medium text-stone-900">{row.original.name}</p>
          <p className="text-xs text-stone-500">
            {row.original.subType ?? '기타'} · {row.original.owner ?? '미지정'}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: '구분',
      cell: ({ row }) => (
        <Badge
          className={
            row.original.type === '자산'
              ? 'rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
              : 'rounded-full bg-stone-200 text-stone-700 hover:bg-stone-200'
          }
        >
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: 'assetGroup',
      header: '자산 성격',
      cell: ({ row }) => row.original.assetGroup,
    },
    {
      accessorKey: 'initialBalance',
      header: '초기 잔액',
      cell: ({ row }) => formatCurrency(row.original.initialBalance),
    },
    {
      accessorKey: 'currentBalance',
      header: '현재 잔액',
      cell: ({ row }) => (
        <span className="font-semibold text-stone-900">
          {formatCurrency(row.original.currentBalance)}
        </span>
      ),
    },
    {
      accessorKey: 'ratio',
      header: '비율',
      cell: ({ row }) =>
        row.original.type === '자산'
          ? `${row.original.ratio.toFixed(1)}%`
          : '—',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const account = accounts.find((item) => item.id === row.original.id)
        if (!account) {
          return null
        }
        return <AccountFormDialog spaceId={spaceId} initialValue={account} />
      },
    },
  ]

  return (
    <PageShell
      title="계정"
      description="자산/부채 계좌를 관리하고 초기 잔액 대비 현재 잔액을 실시간으로 추적하세요."
      actions={<AccountFormDialog spaceId={spaceId} />}
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryTile
          label="실시간 순자산"
          value={formatCurrency(netWorth)}
          description="초기 잔액 + 입금 - 출금을 반영한 현재 값"
        />
        <SummaryTile
          label="자산 계정"
          value={`${assetCount}개`}
          description={formatCurrency(totalAssets)}
          tone="success"
        />
        <SummaryTile
          label="부채 계정"
          value={`${liabilityCount}개`}
          description={formatCurrency(totalLiabilities)}
          tone="sky"
        />
      </div>
      <Card className="border-white/70 bg-white/88 shadow-[0_18px_60px_rgba(35,52,46,0.08)]">
        <CardHeader className="px-4 pb-0 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
            계정 목록
          </CardTitle>
          <CardDescription>
            현재 잔액은 저장된 값이 아니라 거래 흐름을 바탕으로 실시간
            계산됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <DataTable
            columns={columns}
            data={rows}
            emptyMessage="아직 계정이 없습니다."
            mobileCardRenderer={(row) => {
              const account = accounts.find((item) => item.id === row.id)
              return (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words font-medium text-stone-900">
                        {row.name}
                      </p>
                      <p className="mt-1 text-sm text-stone-500">
                        {row.subType ?? '기타'} · {row.owner ?? '미지정'}
                      </p>
                    </div>
                    <Badge
                      className={
                        row.type === '자산'
                          ? 'rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                          : 'rounded-full bg-stone-200 text-stone-700 hover:bg-stone-200'
                      }
                    >
                      {row.type}
                    </Badge>
                  </div>

                  <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-white/80 px-3 py-3 text-sm">
                    <div>
                      <dt className="text-stone-400">자산 성격</dt>
                      <dd className="mt-1 text-stone-800">{row.assetGroup}</dd>
                    </div>
                    <div>
                      <dt className="text-stone-400">초기 잔액</dt>
                      <dd className="mt-1 text-stone-800">
                        {formatCurrency(row.initialBalance)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-400">현재 잔액</dt>
                      <dd className="mt-1 font-semibold text-stone-900">
                        {formatCurrency(row.currentBalance)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-400">비율</dt>
                      <dd className="mt-1 text-stone-800">
                        {row.type === '자산' ? `${row.ratio.toFixed(1)}%` : '—'}
                      </dd>
                    </div>
                  </dl>

                  {account ? (
                    <AccountFormDialog
                      spaceId={spaceId}
                      initialValue={account}
                    />
                  ) : null}
                </div>
              )
            }}
            tableClassName="min-w-[920px]"
          />
        </CardContent>
      </Card>
    </PageShell>
  )
}
