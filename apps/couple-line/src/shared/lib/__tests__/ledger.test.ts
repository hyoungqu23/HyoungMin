import { describe, it, expect } from 'vitest'
import {
  computeBalanceMap,
  buildDashboardSnapshot,
} from '#/shared/lib/ledger'

function makeAccount(overrides: Record<string, unknown> = {}) {
  return {
    id: crypto.randomUUID(),
    space_id: 'space-1',
    name: '계좌',
    type: '자산' as string,
    sub_type: null as string | null,
    asset_group: '유동 자산' as string | null,
    owner: null as string | null,
    initial_balance: 0,
    created_at: '2026-01-01T00:00:00Z',
    ...overrides,
  }
}

function makeTx(
  overrides: Record<string, unknown> = {},
) {
  return {
    id: crypto.randomUUID(),
    space_id: 'space-1',
    user_id: 'user-1',
    date: '2026-03-01',
    type: '수입' as '수입' | '지출' | '이체',
    amount: 1000,
    memo: null,
    from_account_id: null,
    from_category_id: null,
    to_account_id: null,
    to_category_id: null,
    created_at: '2026-03-01T00:00:00Z',
    ...overrides,
  }
}

describe('computeBalanceMap', () => {
  it('returns initial balances with no transactions', () => {
    const account = makeAccount({ initial_balance: 5000 })
    const result = computeBalanceMap([account], [])
    expect(result[account.id]).toBe(5000)
  })

  it('adds income to to_account', () => {
    const account = makeAccount({ initial_balance: 1000 })
    const tx = makeTx({
      type: '수입',
      amount: 500,
      to_account_id: account.id,
      from_category_id: 'cat-1',
    })
    const result = computeBalanceMap([account], [tx])
    expect(result[account.id]).toBe(1500)
  })

  it('subtracts expense from from_account', () => {
    const account = makeAccount({ initial_balance: 1000 })
    const tx = makeTx({
      type: '지출',
      amount: 300,
      from_account_id: account.id,
      to_category_id: 'cat-1',
    })
    const result = computeBalanceMap([account], [tx])
    expect(result[account.id]).toBe(700)
  })

  it('handles transfers between accounts', () => {
    const from = makeAccount({ initial_balance: 1000 })
    const to = makeAccount({ initial_balance: 500 })
    const tx = makeTx({
      type: '이체',
      amount: 200,
      from_account_id: from.id,
      to_account_id: to.id,
    })
    const result = computeBalanceMap([from, to], [tx])
    expect(result[from.id]).toBe(800)
    expect(result[to.id]).toBe(700)
  })

  it('respects cutoff date', () => {
    const account = makeAccount({ initial_balance: 1000 })
    const txBefore = makeTx({
      date: '2026-01-15',
      amount: 500,
      to_account_id: account.id,
    })
    const txAfter = makeTx({
      date: '2026-03-15',
      amount: 300,
      to_account_id: account.id,
    })
    const result = computeBalanceMap(
      [account],
      [txBefore, txAfter],
      new Date('2026-01-31'),
    )
    expect(result[account.id]).toBe(1500) // only txBefore applied
  })

  it('handles multiple transactions', () => {
    const account = makeAccount({ initial_balance: 0 })
    const txs = [
      makeTx({ amount: 1000, to_account_id: account.id }),
      makeTx({ amount: 200, to_account_id: account.id }),
      makeTx({ amount: 500, from_account_id: account.id }),
    ]
    const result = computeBalanceMap([account], txs)
    expect(result[account.id]).toBe(700)
  })
})

describe('buildDashboardSnapshot', () => {
  it('returns a valid snapshot with empty data', () => {
    const snapshot = buildDashboardSnapshot({
      accounts: [],
      categories: [],
      transactions: [],
    })

    expect(snapshot.timeline).toHaveLength(12)
    expect(snapshot.kpis.totalAssets).toBe(0)
    expect(snapshot.kpis.totalLiabilities).toBe(0)
    expect(snapshot.kpis.netWorth).toBe(0)
    expect(snapshot.kpis.netWorthGrowthRate).toBeNull()
    expect(snapshot.accountRows).toEqual([])
    expect(snapshot.transactionRows).toEqual([])
    expect(snapshot.assetGroups).toEqual([])
  })

  it('computes KPIs correctly', () => {
    const asset = makeAccount({ initial_balance: 10000, type: '자산' })
    const liability = makeAccount({
      initial_balance: -3000,
      type: '부채',
    })
    const snapshot = buildDashboardSnapshot({
      accounts: [asset, liability],
      categories: [],
      transactions: [],
    })

    expect(snapshot.kpis.totalAssets).toBe(10000)
    expect(snapshot.kpis.totalLiabilities).toBe(3000)
    expect(snapshot.kpis.netWorth).toBe(7000)
  })

  it('builds transaction rows with labels', () => {
    const account = makeAccount({ name: '신한은행' })
    const category = {
      id: crypto.randomUUID(),
      space_id: 'space-1',
      name: '급여',
      type: '수입' as const,
      created_at: '2026-01-01T00:00:00Z',
    }
    const tx = makeTx({
      type: '수입',
      amount: 5000000,
      from_category_id: category.id,
      to_account_id: account.id,
      memo: '3월 급여',
    })
    const snapshot = buildDashboardSnapshot({
      accounts: [account],
      categories: [category],
      transactions: [tx],
    })

    expect(snapshot.transactionRows).toHaveLength(1)
    expect(snapshot.transactionRows[0].fromLabel).toBe('급여')
    expect(snapshot.transactionRows[0].toLabel).toBe('신한은행')
    expect(snapshot.transactionRows[0].memo).toBe('3월 급여')
  })

  it('groups asset accounts by asset_group', () => {
    const a1 = makeAccount({
      initial_balance: 5000,
      asset_group: '유동 자산',
    })
    const a2 = makeAccount({
      initial_balance: 3000,
      asset_group: '투자 자산',
    })
    const a3 = makeAccount({
      initial_balance: 2000,
      asset_group: '유동 자산',
    })
    const snapshot = buildDashboardSnapshot({
      accounts: [a1, a2, a3],
      categories: [],
      transactions: [],
    })

    expect(snapshot.assetGroups).toEqual([
      { name: '유동 자산', value: 7000 },
      { name: '투자 자산', value: 3000 },
    ])
  })
})
