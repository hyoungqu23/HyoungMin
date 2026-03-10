import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowLeftRight,
  Landmark,
  PiggyBank,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { getMonthLabel } from '#/shared/lib/date'
import {
  formatCompactCurrency,
  formatCurrency,
  formatSignedPercent,
} from '#/shared/lib/format'
import type { DashboardSnapshot } from '#/shared/lib/ledger'
import { Badge } from '#/shared/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/ui/card'
import { EmptyState } from '#/shared/ui/empty-state'
import { MetricCard } from '#/shared/ui/metric-card'
import { PageShell } from '#/shared/ui/page-shell'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/shared/ui/select'
import { SummaryTile } from '#/shared/ui/summary-tile'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#/shared/ui/tabs'

const CHART_COLORS = ['#0f766e', '#10b981', '#059669', '#34d399', '#99f6e4']

type TooltipPayloadItem = {
  color?: string
  name?: string
  value?: number | string
  payload?: {
    name?: string
    value?: number
  }
}

export function SpaceDashboardPage({ data }: { data: DashboardSnapshot }) {
  const [view, setView] = useState<'cashflow' | 'asset-report'>('cashflow')
  const defaultMonth = data.timeline.at(-1)?.monthKey ?? ''
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth)

  const latestMonth = data.timeline.at(-1) ?? null
  const previousMonth = data.timeline.at(-2) ?? null
  const selectedBreakdown = data.monthExpenseBreakdown[selectedMonth] ?? []
  const positiveBreakdown = selectedBreakdown.filter((item) => item.value > 0)
  const ranking = positiveBreakdown.slice(0, 6)
  const selectedMonthLabel = selectedMonth
    ? getMonthLabel(`${selectedMonth}-01`)
    : '이번 달'
  const selectedMonthGrossExpense = positiveBreakdown.reduce(
    (sum, item) => sum + item.value,
    0,
  )
  const selectedMonthNetExpense = selectedBreakdown.reduce(
    (sum, item) => sum + item.value,
    0,
  )
  const selectedMonthAdjustments = Math.abs(
    selectedBreakdown
      .filter((item) => item.value < 0)
      .reduce((sum, item) => sum + item.value, 0),
  )
  const topExpense = positiveBreakdown.at(0) ?? null
  const latestNetWorthDelta =
    latestMonth && previousMonth
      ? latestMonth.netWorth - previousMonth.netWorth
      : null
  const latestCashflow = latestMonth
    ? latestMonth.income - latestMonth.expense
    : 0
  const topAssetGroup = data.assetGroups.at(0) ?? null
  const topAssetShare =
    topAssetGroup && data.kpis.totalAssets > 0
      ? (topAssetGroup.value / data.kpis.totalAssets) * 100
      : 0
  const groupedRows = useMemo(() => {
    return data.accountRows.reduce<Record<string, typeof data.accountRows>>(
      (acc, row) => {
        const key = row.assetGroup ?? '기타'
        acc[key] ??= []
        acc[key].push(row)
        return acc
      },
      {},
    )
  }, [data.accountRows])

  return (
    <PageShell
      title="대시보드"
      description="최근 12개월 흐름부터 자산 성적표까지, 커플 돈의 현재 상태를 한 화면에서 확인하세요."
    >
      <Tabs
        value={view}
        onValueChange={(value) => setView(value as 'cashflow' | 'asset-report')}
      >
        <TabsList className="grid w-full grid-cols-2 sm:w-fit">
          <TabsTrigger value="cashflow" className="px-3 sm:px-5">
            현금흐름
          </TabsTrigger>
          <TabsTrigger value="asset-report" className="px-3 sm:px-5">
            자산 성적표
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cashflow" className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryTile
              label="최근 월 순자산"
              value={formatCurrency(latestMonth?.netWorth ?? 0)}
              description={
                latestNetWorthDelta === null
                  ? '아직 비교할 전월 데이터가 없어요.'
                  : `전월 대비 ${formatSignedCurrency(latestNetWorthDelta)}`
              }
              tone={
                latestNetWorthDelta !== null && latestNetWorthDelta < 0
                  ? 'amber'
                  : 'success'
              }
            />
            <SummaryTile
              label={`${selectedMonthLabel} 순지출`}
              value={formatCurrency(selectedMonthNetExpense)}
              description={
                selectedMonthAdjustments > 0
                  ? `환불/정산 상계 ${formatCurrency(selectedMonthAdjustments)} 반영`
                  : '상계 없이 순수 지출만 반영된 월이에요.'
              }
              tone="default"
            />
            <SummaryTile
              label="최대 지출 카테고리"
              value={topExpense?.name ?? '데이터 없음'}
              description={
                topExpense
                  ? `${formatCurrency(topExpense.value)} · ${selectedMonthLabel} 기준`
                  : '선택한 월에 표시할 지출 카테고리가 없어요.'
              }
              tone="sky"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.25fr_0.95fr] xl:gap-6">
            <Card>
              <CardHeader className="gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
                      최근 12개월 순자산 · 수입 · 지출
                    </CardTitle>
                    <CardDescription>
                      순자산 추세와 월별 현금흐름을 같은 축에서 비교해 돈의 압력
                      변화를 읽을 수 있어요.
                    </CardDescription>
                  </div>
                  <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
                    <Sparkles className="size-3.5" />{' '}
                    {latestMonth?.label ?? '최근 월'} 스냅샷
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ChartLegendItem color="#0f766e" label="순자산" />
                  <ChartLegendItem color="#10b981" label="수입" />
                  <ChartLegendItem color="#f97316" label="지출" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-5 sm:px-6">
                <div className="h-[280px] rounded-[1.5rem] border border-white/80 bg-stone-50/70 p-2 sm:h-[360px] sm:p-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.timeline}
                      margin={{ left: 6, right: 10, top: 16, bottom: 6 }}
                    >
                      <defs>
                        <linearGradient
                          id="net-worth-gradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#0f766e"
                            stopOpacity={0.34}
                          />
                          <stop
                            offset="100%"
                            stopColor="#0f766e"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                        <linearGradient
                          id="income-gradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#10b981"
                            stopOpacity={0.22}
                          />
                          <stop
                            offset="100%"
                            stopColor="#10b981"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                        <linearGradient
                          id="expense-gradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#f97316"
                            stopOpacity={0.18}
                          />
                          <stop
                            offset="100%"
                            stopColor="#f97316"
                            stopOpacity={0.02}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        vertical={false}
                        strokeDasharray="4 4"
                        stroke="#e7ece8"
                      />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        fontSize={12}
                      />
                      <YAxis
                        tickFormatter={formatCompactCurrency}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        width={74}
                        fontSize={11}
                      />
                      <Tooltip
                        cursor={{ stroke: '#cbd5d1', strokeDasharray: '4 4' }}
                        content={<TimelineTooltip />}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        fill="url(#income-gradient)"
                        strokeWidth={2.2}
                        dot={false}
                        activeDot={{ r: 4.5, fill: '#10b981', strokeWidth: 0 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#f97316"
                        fill="url(#expense-gradient)"
                        strokeWidth={2.2}
                        dot={false}
                        activeDot={{ r: 4.5, fill: '#f97316', strokeWidth: 0 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="netWorth"
                        stroke="#0f766e"
                        fill="url(#net-worth-gradient)"
                        strokeWidth={2.8}
                        dot={false}
                        activeDot={{ r: 5, fill: '#0f766e', strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <InsightCard
                    label="최근 월 수입"
                    value={formatCurrency(latestMonth?.income ?? 0)}
                    description="월 기준 유입 합계"
                    tone="success"
                  />
                  <InsightCard
                    label="최근 월 지출"
                    value={formatCurrency(latestMonth?.expense ?? 0)}
                    description="음수 지출 상계 전 카테고리 지출 합계"
                    tone="amber"
                  />
                  <InsightCard
                    label="최근 월 현금흐름"
                    value={formatSignedCurrency(latestCashflow)}
                    description="수입 - 지출"
                    tone={latestCashflow < 0 ? 'amber' : 'success'}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col gap-3 px-4 pt-5 sm:px-6 sm:pt-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
                    월별 지출 구성
                  </CardTitle>
                  <CardDescription>
                    환불은 음수 지출로 상계되어 카테고리 합계에 반영됩니다.
                  </CardDescription>
                </div>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full rounded-full bg-white/90 sm:w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {data.timeline.map((item) => (
                      <SelectItem key={item.monthKey} value={item.monthKey}>
                        {getMonthLabel(`${item.monthKey}-01`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent className="grid gap-5 px-4 pb-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-3">
                  <div className="relative h-[240px] rounded-[1.5rem] border border-white/80 bg-stone-50/70 p-3 sm:h-[270px]">
                    {positiveBreakdown.length ? (
                      <>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={positiveBreakdown}
                              dataKey="value"
                              nameKey="name"
                              innerRadius={58}
                              outerRadius={92}
                              paddingAngle={3}
                              stroke="rgba(255,255,255,0.9)"
                              strokeWidth={2}
                            >
                              {positiveBreakdown.map((entry, index) => (
                                <Cell
                                  key={entry.name}
                                  fill={
                                    CHART_COLORS[index % CHART_COLORS.length]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <div className="rounded-full bg-white/92 px-4 py-3 text-center shadow-[0_12px_36px_rgba(35,52,46,0.08)]">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                              총 지출
                            </p>
                            <p className="mt-1 font-display text-2xl leading-none text-stone-900">
                              {formatCompactCurrency(selectedMonthGrossExpense)}
                            </p>
                            <p className="mt-1 text-xs text-stone-500">
                              {selectedMonthLabel}
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <EmptyState
                        title="지출 데이터 없음"
                        description="선택한 월에 지출이 없거나 환불 상계로 모두 상쇄되었어요."
                      />
                    )}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                    <InsightCard
                      label="순지출"
                      value={formatCurrency(selectedMonthNetExpense)}
                      tone="default"
                    />
                    <InsightCard
                      label="상계 금액"
                      value={formatCurrency(selectedMonthAdjustments)}
                      tone="success"
                    />
                    <InsightCard
                      label="카테고리 수"
                      value={`${selectedBreakdown.length}개`}
                      tone="sky"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-stone-700 sm:text-base">
                    카테고리 랭킹
                  </h3>
                  {ranking.length ? (
                    ranking.map((item, index) => {
                      const share = selectedMonthGrossExpense
                        ? (item.value / selectedMonthGrossExpense) * 100
                        : 0
                      const color = CHART_COLORS[index % CHART_COLORS.length]

                      return (
                        <div
                          key={item.name}
                          className="rounded-[1.25rem] border border-white/80 bg-stone-50/80 px-4 py-3"
                        >
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-stone-400">
                                #{index + 1} · {share.toFixed(1)}%
                              </p>
                              <p className="mt-1 truncate font-medium text-stone-900">
                                {item.name}
                              </p>
                            </div>
                            <p className="font-semibold text-stone-900">
                              {formatCurrency(item.value)}
                            </p>
                          </div>
                          <div className="mt-3 h-1.5 rounded-full bg-white">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${share}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-sm leading-6 text-stone-500">
                      선택한 월의 카테고리 랭킹이 아직 없습니다.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="asset-report" className="space-y-4 sm:space-y-6">
          <div className="grid gap-3 min-[480px]:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="총자산"
              value={formatCurrency(data.kpis.totalAssets)}
              icon={<Wallet className="size-5" />}
            />
            <MetricCard
              title="총부채"
              value={formatCurrency(data.kpis.totalLiabilities)}
              icon={<Landmark className="size-5" />}
            />
            <MetricCard
              title="순자산"
              value={formatCurrency(data.kpis.netWorth)}
              icon={<PiggyBank className="size-5" />}
            />
            <MetricCard
              title="전월 대비 증감"
              value={formatSignedPercent(data.kpis.netWorthGrowthRate)}
              meta={
                data.kpis.netWorthGrowthRate === null
                  ? '첫 비교 구간'
                  : `${defaultMonth} 기준`
              }
              tone={
                data.kpis.netWorthGrowthRate !== null &&
                data.kpis.netWorthGrowthRate < 0
                  ? 'danger'
                  : 'success'
              }
              icon={<ArrowLeftRight className="size-5" />}
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr] xl:gap-6">
            <Card>
              <CardHeader className="gap-3 px-4 pt-5 sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
                      자산 성격 포트폴리오
                    </CardTitle>
                    <CardDescription>
                      자산을 안정·유동·투자 성격으로 나눠 포트폴리오 쏠림을
                      한눈에 보세요.
                    </CardDescription>
                  </div>
                  {topAssetGroup ? (
                    <Badge className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 hover:bg-emerald-100">
                      최대 비중 · {topAssetGroup.name}
                    </Badge>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-5 sm:px-6">
                {data.assetGroups.length ? (
                  <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
                    <div className="relative h-[280px] rounded-[1.5rem] border border-white/80 bg-stone-50/70 p-3 sm:h-[320px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.assetGroups}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={108}
                            paddingAngle={4}
                            stroke="rgba(255,255,255,0.9)"
                            strokeWidth={2}
                          >
                            {data.assetGroups.map((entry, index) => (
                              <Cell
                                key={entry.name}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full bg-white/92 px-5 py-4 text-center shadow-[0_12px_36px_rgba(35,52,46,0.08)]">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                            총자산
                          </p>
                          <p className="mt-1 font-display text-2xl leading-none text-stone-900">
                            {formatCompactCurrency(data.kpis.totalAssets)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {data.assetGroups.map((group, index) => {
                        const share = data.kpis.totalAssets
                          ? (group.value / data.kpis.totalAssets) * 100
                          : 0
                        const color = CHART_COLORS[index % CHART_COLORS.length]

                        return (
                          <div
                            key={group.name}
                            className="rounded-[1.25rem] border border-white/80 bg-stone-50/80 px-4 py-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="size-2.5 rounded-full"
                                    style={{ backgroundColor: color }}
                                  />
                                  <p className="truncate font-medium text-stone-900">
                                    {group.name}
                                  </p>
                                </div>
                                <p className="mt-1 text-sm text-stone-500">
                                  전체 자산의 {share.toFixed(1)}%
                                </p>
                              </div>
                              <p className="font-semibold text-stone-900">
                                {formatCurrency(group.value)}
                              </p>
                            </div>
                            <div className="mt-3 h-1.5 rounded-full bg-white">
                              <div
                                className="h-1.5 rounded-full"
                                style={{
                                  width: `${share}%`,
                                  backgroundColor: color,
                                }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="아직 자산 계정이 없어요"
                    description="계정 페이지에서 자산 계정을 추가하면 포트폴리오 비중이 표시됩니다."
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="gap-3 px-4 pt-5 sm:px-6 sm:pt-6">
                <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
                  자산 성격별 구성
                </CardTitle>
                <CardDescription>
                  어디에 자산이 몰려 있는지, 그리고 얼마나 분산되어 있는지를
                  텍스트와 막대로 같이 읽어보세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-4 pb-5 sm:px-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <InsightCard
                    label="최대 비중 자산"
                    value={topAssetGroup?.name ?? '데이터 없음'}
                    description={
                      topAssetGroup
                        ? `${topAssetShare.toFixed(1)}% · ${formatCurrency(topAssetGroup.value)}`
                        : '아직 자산 계정이 없습니다.'
                    }
                    tone="success"
                  />
                  <InsightCard
                    label="분산 개수"
                    value={`${data.assetGroups.length}개 그룹`}
                    description="자산 성격 기준으로 나뉜 포트폴리오 조각 수"
                    tone="sky"
                  />
                </div>

                {data.assetGroups.map((group, index) => {
                  const share = data.kpis.totalAssets
                    ? (group.value / data.kpis.totalAssets) * 100
                    : 0
                  const color = CHART_COLORS[index % CHART_COLORS.length]

                  return (
                    <div
                      key={group.name}
                      className="rounded-[1.25rem] border border-white/80 bg-stone-50/80 px-4 py-4"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                          <p className="font-medium text-stone-900">
                            {group.name}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-semibold text-stone-900">
                            {formatCurrency(group.value)}
                          </p>
                          <p className="text-sm text-stone-500">
                            {share.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-white">
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${share}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="gap-2 px-4 pt-5 sm:px-6 sm:pt-6">
          <CardTitle className="font-display text-xl text-stone-900 sm:text-2xl">
            계정 상세 테이블
          </CardTitle>
          <CardDescription>
            자산 성격 그룹별로 현재 잔액과 비중을 함께 보면서 포트폴리오의 실제
            구성을 점검하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-4 pb-5 sm:space-y-6 sm:px-6">
          {Object.entries(groupedRows).map(([group, rows]) => (
            <div key={group} className="space-y-3">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-medium text-stone-900">{group}</h3>
                <p className="text-sm text-stone-500">
                  {formatCurrency(
                    rows.reduce((sum, row) => sum + row.currentBalance, 0),
                  )}
                </p>
              </div>

              <div className="space-y-3 md:hidden">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-[1.25rem] border border-stone-100 bg-stone-50/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium text-stone-900">
                          {row.name}
                        </p>
                        <p className="mt-1 text-xs text-stone-500">
                          {row.type} · {row.owner ?? '미지정'}
                        </p>
                      </div>
                      <p className="text-right text-sm font-semibold text-stone-900">
                        {formatCurrency(row.currentBalance)}
                      </p>
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-stone-400">초기 잔액</dt>
                        <dd className="mt-1 text-stone-700">
                          {formatCurrency(row.initialBalance)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-stone-400">비중</dt>
                        <dd className="mt-1 text-stone-700">
                          {row.type === '자산'
                            ? `${row.ratio.toFixed(1)}%`
                            : '—'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-hidden rounded-[1.4rem] border border-stone-100 md:block">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-stone-50/80 text-sm text-stone-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">계정</th>
                      <th className="px-4 py-3 font-medium">구분</th>
                      <th className="px-4 py-3 font-medium">현재 잔액</th>
                      <th className="px-4 py-3 font-medium">비중</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-stone-100 text-sm text-stone-700"
                      >
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">{row.type}</td>
                        <td className="px-4 py-3 font-medium text-stone-900">
                          {formatCurrency(row.currentBalance)}
                        </td>
                        <td className="px-4 py-3">
                          {row.type === '자산'
                            ? `${row.ratio.toFixed(1)}%`
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  )
}

function ChartLegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-stone-50/80 px-3 py-1.5 text-xs font-medium text-stone-600">
      <span
        className="size-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  )
}

function InsightCard({
  label,
  value,
  description,
  tone = 'default',
}: {
  label: string
  value: string
  description?: string
  tone?: 'default' | 'success' | 'sky' | 'amber'
}) {
  return (
    <div
      className={[
        'rounded-[1.2rem] border px-4 py-3',
        tone === 'default' && 'border-white/80 bg-stone-50/75',
        tone === 'success' && 'border-emerald-100 bg-emerald-50/75',
        tone === 'sky' && 'border-sky-100 bg-sky-50/75',
        tone === 'amber' && 'border-amber-100 bg-amber-50/80',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 font-display text-[1.65rem] leading-none text-stone-900">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-xs leading-5 text-stone-500">{description}</p>
      ) : null}
    </div>
  )
}

function TimelineTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="min-w-48 rounded-[1.25rem] border border-white/80 bg-white/95 p-3 shadow-[0_18px_50px_rgba(35,52,46,0.12)] backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </p>
      <div className="mt-3 space-y-2">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex min-w-0 items-center gap-2 text-stone-600">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: entry.color ?? '#0f766e' }}
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-medium text-stone-900">
              {formatCurrency(Number(entry.value ?? 0))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PieTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) {
    return null
  }

  const entry = payload[0]

  return (
    <div className="rounded-[1.1rem] border border-white/80 bg-white/95 px-3 py-2.5 shadow-[0_16px_40px_rgba(35,52,46,0.10)] backdrop-blur-sm">
      <p className="text-sm font-medium text-stone-900">
        {entry.name ?? entry.payload?.name}
      </p>
      <p className="mt-1 text-sm text-stone-600">
        {formatCurrency(Number(entry.value ?? entry.payload?.value ?? 0))}
      </p>
    </div>
  )
}

function formatSignedCurrency(value: number | null) {
  if (value === null) {
    return '—'
  }

  if (value === 0) {
    return formatCurrency(0)
  }

  return `${value > 0 ? '+' : '-'}${formatCurrency(Math.abs(value))}`
}
