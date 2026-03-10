import { endOfMonth, parseISO } from 'date-fns'
import { getLast12MonthFrames, getMonthKey } from '#/shared/lib/date'
import { toNumber } from '#/shared/lib/format'
import type { Database } from '#/shared/api/supabase/database.types'

type AccountRow = Database['public']['Tables']['accounts']['Row']
type CategoryRow = Database['public']['Tables']['categories']['Row']
type TransactionRow = Database['public']['Tables']['transactions']['Row']

export type AccountBalanceRow = {
  id: string
  name: string
  type: string
  subType: string | null
  assetGroup: string | null
  owner: string | null
  initialBalance: number
  currentBalance: number
  ratio: number
}

export type TransactionListRow = {
  id: string
  date: string
  type: TransactionRow['type']
  amount: number
  memo: string | null
  fromLabel: string | null
  toLabel: string | null
  userId: string | null
}

export type DashboardSnapshot = {
  timeline: Array<{
    monthKey: string
    label: string
    income: number
    expense: number
    netWorth: number
  }>
  monthExpenseBreakdown: Record<string, Array<{ name: string; value: number }>>
  assetGroups: Array<{ name: string; value: number }>
  kpis: {
    totalAssets: number
    totalLiabilities: number
    netWorth: number
    netWorthGrowthRate: number | null
  }
  accountRows: AccountBalanceRow[]
  transactionRows: TransactionListRow[]
}

export function computeBalanceMap(
  accounts: AccountRow[],
  transactions: TransactionRow[],
  cutoffDate?: Date,
) {
  const balanceMap = Object.fromEntries(
    accounts.map((account) => [account.id, toNumber(account.initial_balance)]),
  )

  transactions.forEach((transaction) => {
    const txDate = parseISO(transaction.date)
    if (cutoffDate && txDate > cutoffDate) {
      return
    }

    const amount = toNumber(transaction.amount)

    if (transaction.to_account_id) {
      balanceMap[transaction.to_account_id] =
        (balanceMap[transaction.to_account_id] ?? 0) + amount
    }

    if (transaction.from_account_id) {
      balanceMap[transaction.from_account_id] =
        (balanceMap[transaction.from_account_id] ?? 0) - amount
    }
  })

  return balanceMap
}

export function buildDashboardSnapshot(params: {
  accounts: AccountRow[]
  categories: CategoryRow[]
  transactions: TransactionRow[]
}) {
  const { accounts, categories, transactions } = params
  const accountNameMap = Object.fromEntries(
    accounts.map((item) => [item.id, item.name]),
  )
  const categoryNameMap = Object.fromEntries(
    categories.map((item) => [item.id, item.name]),
  )

  const currentBalances = computeBalanceMap(accounts, transactions)
  const frames = getLast12MonthFrames()
  const timeline = frames.map((frame) => {
    const frameTransactions = transactions.filter(
      (transaction) => getMonthKey(transaction.date) === frame.key,
    )
    const income = frameTransactions
      .filter((item) => item.type === '수입')
      .reduce((sum, item) => sum + toNumber(item.amount), 0)
    const expense = frameTransactions
      .filter((item) => item.type === '지출')
      .reduce((sum, item) => sum + toNumber(item.amount), 0)
    const balances = computeBalanceMap(
      accounts,
      transactions,
      endOfMonth(frame.start),
    )
    const netWorth = calculateNetWorth(accounts, balances)

    return {
      monthKey: frame.key,
      label: frame.label,
      income,
      expense,
      netWorth,
    }
  })

  const monthExpenseBreakdown = Object.fromEntries(
    frames.map((frame) => {
      const grouped = new Map<string, number>()

      transactions
        .filter(
          (transaction) =>
            transaction.type === '지출' &&
            getMonthKey(transaction.date) === frame.key,
        )
        .forEach((transaction) => {
          const categoryName = transaction.to_category_id
            ? (categoryNameMap[transaction.to_category_id] ?? '미분류 지출')
            : '미분류 지출'
          grouped.set(
            categoryName,
            (grouped.get(categoryName) ?? 0) + toNumber(transaction.amount),
          )
        })

      return [
        frame.key,
        Array.from(grouped.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((left, right) => right.value - left.value),
      ]
    }),
  )

  const totalAssets = accounts
    .filter((account) => account.type === '자산')
    .reduce(
      (sum, account) => sum + Math.max(currentBalances[account.id] ?? 0, 0),
      0,
    )

  const totalLiabilities = accounts
    .filter((account) => account.type === '부채')
    .reduce(
      (sum, account) =>
        sum + Math.abs(Math.min(currentBalances[account.id] ?? 0, 0)),
      0,
    )

  const netWorth = totalAssets - totalLiabilities
  const previousNetWorth = timeline.at(-2)?.netWorth ?? null
  const netWorthGrowthRate =
    previousNetWorth === null || previousNetWorth === 0
      ? null
      : ((netWorth - previousNetWorth) / Math.abs(previousNetWorth)) * 100

  const assetGroups = Array.from(
    accounts
      .filter((account) => account.type === '자산')
      .reduce((grouped, account) => {
        const key = account.asset_group ?? '미분류 자산'
        grouped.set(
          key,
          (grouped.get(key) ?? 0) +
            Math.max(currentBalances[account.id] ?? 0, 0),
        )
        return grouped
      }, new Map<string, number>())
      .entries(),
  )
    .map(([name, value]) => ({ name, value }))
    .filter((item) => item.value > 0)
    .sort((left, right) => right.value - left.value)

  const accountRows = accounts
    .map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      subType: account.sub_type,
      assetGroup:
        account.type === '자산'
          ? (account.asset_group ?? '미분류 자산')
          : '부채',
      owner: account.owner,
      initialBalance: toNumber(account.initial_balance),
      currentBalance: currentBalances[account.id] ?? 0,
      ratio:
        account.type === '자산' && totalAssets > 0
          ? ((currentBalances[account.id] ?? 0) / totalAssets) * 100
          : 0,
    }))
    .sort((left, right) => {
      if (left.assetGroup === right.assetGroup) {
        return right.currentBalance - left.currentBalance
      }

      return left.assetGroup.localeCompare(right.assetGroup, 'ko-KR')
    })

  const transactionRows = transactions
    .map((transaction) => ({
      id: transaction.id,
      date: transaction.date,
      type: transaction.type,
      amount: toNumber(transaction.amount),
      memo: transaction.memo,
      fromLabel: transaction.from_account_id
        ? (accountNameMap[transaction.from_account_id] ?? '알 수 없는 계정')
        : transaction.from_category_id
          ? (categoryNameMap[transaction.from_category_id] ??
            '알 수 없는 카테고리')
          : null,
      toLabel: transaction.to_account_id
        ? (accountNameMap[transaction.to_account_id] ?? '알 수 없는 계정')
        : transaction.to_category_id
          ? (categoryNameMap[transaction.to_category_id] ??
            '알 수 없는 카테고리')
          : null,
      userId: transaction.user_id,
    }))
    .sort((left, right) => right.date.localeCompare(left.date))

  return {
    timeline,
    monthExpenseBreakdown,
    assetGroups,
    kpis: {
      totalAssets,
      totalLiabilities,
      netWorth,
      netWorthGrowthRate,
    },
    accountRows,
    transactionRows,
  } satisfies DashboardSnapshot
}

function calculateNetWorth(
  accounts: AccountRow[],
  balanceMap: Record<string, number>,
) {
  return accounts.reduce((sum, account) => {
    const balance = balanceMap[account.id] ?? 0
    if (account.type === '자산') {
      return sum + balance
    }

    return sum + balance
  }, 0)
}
