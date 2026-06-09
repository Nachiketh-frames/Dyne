
"use client"

import {
  useEffect,
  useState,
} from "react"

import { supabase } from "../../../../lib/supabase"
import { useAuth } from "../../../../context/auth-context"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

type Investment = {
  id: string
  amount: number
}

export default function AnalyticsPage() {
  const { user } = useAuth()

  const [metrics, setMetrics] =
    useState<any>(null)

  const [
    investments,
    setInvestments,
  ] = useState<Investment[]>([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user) return

      const {
        data: startup,
      } = await supabase
        .from("startup_metrics")
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .maybeSingle()

      if (!startup) {
        setLoading(false)
        return
      }

      setMetrics(startup)

      const {
        data: investmentData,
      } = await supabase
        .from("investments")
        .select("*")
        .eq(
          "startup_id",
          startup.id
        )

      setInvestments(
        investmentData || []
      )

      setLoading(false)
    }

    fetchAnalytics()
  }, [user])

  if (
    loading ||
    !metrics
  ) {
    return (
      <div className="text-white">
        Loading Analytics...
      </div>
    )
  }

  const totalRaised =
    investments.reduce(
      (
        sum,
        investment
      ) =>
        sum +
        investment.amount,
      0
    )

  const investorCount =
    investments.length

  const profitability =
    metrics.monthly_revenue -
    metrics.monthly_expenses

  const burnRate =
    profitability < 0
      ? Math.abs(
          profitability
        )
      : 0

  const runwayMonths =
    burnRate > 0
      ? Math.floor(
          metrics.cash_balance /
            burnRate
        )
      : null

  const chartData = [
    {
      name: "Revenue",
      value:
        metrics.monthly_revenue,
    },
    {
      name: "Expenses",
      value:
        metrics.monthly_expenses,
    },
    {
      name: "Cash",
      value:
        metrics.cash_balance,
    },
    {
      name: "Debt",
      value:
        metrics.total_debt,
    },
  ]

  const insights = []

  if (
    metrics.monthly_growth >
    10
  ) {
    insights.push({
      title:
        "Strong Growth Momentum",

      description:
        `${metrics.monthly_growth}% monthly growth exceeds healthy startup benchmarks.`,
    })
  }

  if (
    investorCount > 0
  ) {
    insights.push({
      title:
        "Investor Validation",

      description:
        `${investorCount} investors have deployed capital into the startup.`,
    })
  }

  if (
    profitability > 0
  ) {
    insights.push({
      title:
        "Profitable Operations",

      description:
        `Monthly profitability currently stands at ₹${profitability.toLocaleString()}.`,
    })
  }

  if (
    metrics.cash_balance >
    metrics.monthly_expenses *
      12
  ) {
    insights.push({
      title:
        "Healthy Treasury Position",

      description:
        "Current treasury reserves can sustain operations for over 12 months.",
    })
  }

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Startup Analytics
        </h1>

        <p className="text-[#8B949E] mt-2">
          Live treasury intelligence and startup performance analytics
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Monthly Revenue"
          value={`₹${metrics.monthly_revenue.toLocaleString()}`}
        />

        <AnalyticsCard
          title="Growth Rate"
          value={`${metrics.monthly_growth}%`}
        />

        <AnalyticsCard
          title="Capital Raised"
          value={`₹${totalRaised.toLocaleString()}`}
        />

        <AnalyticsCard
          title="Investors"
          value={`${investorCount}`}
        />
      </div>

      <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8 mb-8">
        <h2 className="text-3xl font-bold mb-8">
          Financial Overview
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart
            data={chartData}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                Growth Intelligence
              </h2>

              <p className="text-[#8B949E] mt-2">
                Real-time startup performance insights
              </p>
            </div>

            <span className="text-[#2962FF] text-sm">
              LIVE
            </span>
          </div>

          <div className="space-y-5">
            {insights.map(
              (
                insight,
                index
              ) => (
                <InsightCard
                  key={index}
                  title={
                    insight.title
                  }
                  description={
                    insight.description
                  }
                />
              )
            )}
          </div>
        </div>

        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Analytics Overview
          </h2>

          <div className="space-y-6">
            <AnalyticsRow
              label="Customers"
              value={`${metrics.active_customers}`}
            />

            <AnalyticsRow
              label="Funding Stage"
              value={
                metrics.funding_stage ||
                "Unknown"
              }
            />

            <AnalyticsRow
              label="Debt"
              value={`₹${metrics.total_debt.toLocaleString()}`}
            />

            <AnalyticsRow
              label="Runway"
              value={
                runwayMonths
                  ? `${runwayMonths} Months`
                  : "Profitable"
              }
            />
          </div>

          <div className="mt-10 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
            <p className="text-[#8B949E] leading-relaxed">
              DYNE continuously evaluates treasury health,
              startup growth, investor participation,
              and operational resilience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="bg-[#161B26] border border-[#2A2E39] rounded-2xl p-6">
      <p className="text-sm text-[#8B949E] mb-3">
        {title}
      </p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </div>
  )
}

function InsightCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-[#8B949E] leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function AnalyticsRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#8B949E] text-xl">
        {label}
      </span>

      <span className="text-2xl font-bold">
        {value}
      </span>
    </div>
  )
}

