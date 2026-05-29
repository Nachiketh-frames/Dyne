"use client"

import {
  useEffect,
  useState,
} from "react"

import { supabase }
from "../../../../lib/supabase"

import { useAuth }
from "../../../../context/auth-context"

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts"

type StartupMetrics = {
  startup_name: string

  monthly_revenue: number

  monthly_expenses: number

  cash_balance: number

  total_debt: number

  monthly_growth: number

  active_customers: number
}

export default function TreasuryPage() {
  const { user } =
    useAuth()

  const [metrics,
    setMetrics] =
    useState<StartupMetrics | null>(
      null
    )

  const [loading,
    setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchMetrics() {
      if (!user) return

      const { data } =
        await supabase
          .from(
            "startup_metrics"
          )
          .select("*")
          .eq(
            "user_id",
            user.id
          )
          .single()

      if (data) {
        setMetrics(data)
      }

      setLoading(false)
    }

    fetchMetrics()
  }, [user])

  if (
    loading ||
    !metrics
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Treasury...
      </div>
    )
  }

  const profitability =
    metrics.monthly_revenue -
    metrics.monthly_expenses

  const burnRate =
    profitability < 0
      ? Math.abs(
          profitability
        )
      : 0

  const runway =
    burnRate > 0
      ? `${Math.floor(
          metrics.cash_balance /
            burnRate
        )} Months`
      : "Profitable"

  const treasuryHealth =
    profitability > 0 &&
    metrics.monthly_growth >
      5
      ? "Strong"
      : "Moderate"

      const revenueData = [
        {
          month: "Jan",
          revenue:
            metrics.monthly_revenue *
            0.55,
        },
        {
          month: "Feb",
          revenue:
            metrics.monthly_revenue *
            0.7,
        },
        {
          month: "Mar",
          revenue:
            metrics.monthly_revenue *
            0.82,
        },
        {
          month: "Apr",
          revenue:
            metrics.monthly_revenue *
            0.9,
        },
        {
          month: "May",
          revenue:
            metrics.monthly_revenue,
        },
      ]
      
      const treasuryData = [
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
      
      const burnData = [
        {
          name: "Revenue",
          amount:
            metrics.monthly_revenue,
        },
        {
          name: "Expenses",
          amount:
            metrics.monthly_expenses,
        },
      ]

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Treasury Center
        </h1>

        <p className="text-[#8B949E] mt-2">
          Financial operations and treasury
          intelligence infrastructure
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <TreasuryCard
          title="Revenue"
          value={`₹${metrics.monthly_revenue.toLocaleString()}`}
        />

        <TreasuryCard
          title="Expenses"
          value={`₹${metrics.monthly_expenses.toLocaleString()}`}
        />

        <TreasuryCard
          title="Burn Rate"
          value={`₹${burnRate.toLocaleString()}`}
        />

        <TreasuryCard
          title="Runway"
          value={runway}
        />
      </div>

      <div className="grid grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="space-y-6">
          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">
                  Treasury Operations
                </h2>

                <p className="text-[#8B949E] mt-2">
                  Monitor treasury exposure,
                  burn efficiency, and startup
                  operational stability
                </p>
              </div>

              <span className="text-[#2962FF] text-sm">
                LIVE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <MetricBox
                label="Cash Reserve"
                value={`₹${metrics.cash_balance.toLocaleString()}`}
              />

              <MetricBox
                label="Total Debt"
                value={`₹${metrics.total_debt.toLocaleString()}`}
              />

              <MetricBox
                label="Monthly Growth"
                value={`${metrics.monthly_growth}%`}
              />

              <MetricBox
                label="Customers"
                value={`${metrics.active_customers}`}
              />

              <MetricBox
                label="Profitability"
                value={`₹${profitability.toLocaleString()}`}
              />

              <MetricBox
                label="Treasury Health"
                value={treasuryHealth}
              />
            </div>
          </div>
        
          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-3xl font-bold">
        Financial Intelligence
      </h2>

      <p className="text-[#8B949E] mt-2">
        Live treasury and operational trend analysis
      </p>
    </div>

    <span className="text-[#2962FF] text-sm">
      LIVE
    </span>
  </div>

  <div className="space-y-10">
    <div>
      <h3 className="text-xl font-semibold mb-5">
        Revenue Momentum
      </h3>

      <div className="h-[280px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            data={revenueData}
          >
            <CartesianGrid
              stroke="#2A2E39"
            />

            <XAxis
              dataKey="month"
              stroke="#8B949E"
            />

<Tooltip
  contentStyle={{
    backgroundColor:
      "#161B26",
    border:
      "1px solid #2A2E39",
    borderRadius:
      "16px",
    color: "white",
  }}
/>

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2962FF"
              fillOpacity={0.25}
fill="#2962FF"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="grid grid-cols-[0.9fr_1.1fr] gap-8 items-center">
      <div>
        <h3 className="text-xl font-semibold mb-5">
          Treasury Exposure
        </h3>

        <div className="h-[220px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>

        
  
              <Pie
                data={
                  treasuryData
                }
                dataKey="value"
                outerRadius={62}
                innerRadius={28}
              >
                <Cell fill="#2962FF" />

                <Cell fill="#FF5A5A" />
              </Pie>

              <Tooltip
  contentStyle={{
    backgroundColor:
      "#161B26",
    border:
      "1px solid #2A2E39",
    borderRadius:
      "16px",
    color: "white",
  }}
/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-5">
          Burn Analysis
        </h3>

        <div className="h-[220px]">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={burnData}
            >
              <CartesianGrid
                stroke="#2A2E39"
              />

              <XAxis
                dataKey="name"
                stroke="#8B949E"
              />

<Tooltip
  contentStyle={{
    backgroundColor:
      "#161B26",
    border:
      "1px solid #2A2E39",
    borderRadius:
      "16px",
    color: "white",
  }}
/>

              <Bar
                dataKey="amount"
                fill="#2962FF"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
</div>

          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Treasury Activity
            </h2>

            <div className="space-y-5">
              <ActivityRow
                title="Monthly treasury metrics updated"
                description="Revenue and runway recalculated"
                time="Live"
              />

              <ActivityRow
                title="Treasury intelligence synchronized"
                description="Founder operational data refreshed"
                time="Recently"
              />

              <ActivityRow
                title="Investor-facing metrics active"
                description="Discover marketplace synced"
                time="Today"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              DYNE Intelligence
            </h2>

            <div className="space-y-5">
              <HealthRow
                label="Runway"
                value={runway}
              />

              <HealthRow
                label="Burn Rate"
                value={`₹${burnRate.toLocaleString()}`}
              />

              <HealthRow
                label="Growth"
                value={`${metrics.monthly_growth}%`}
              />

              <HealthRow
                label="Treasury Health"
                value={treasuryHealth}
              />
            </div>

            <div className="mt-10 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
              <p className="text-[#8B949E] leading-relaxed">
                DYNE continuously evaluates
                treasury sustainability,
                operational growth,
                profitability, and financial
                exposure risk indicators.
              </p>
            </div>
          </div>

          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6">
              Treasury Actions
            </h2>

            <div className="space-y-4">
              <ActionCard
                title="Update Metrics"
                action="Refresh Treasury"
              />

              <ActionCard
                title="Investor Report"
                action="Generate Report"
              />

              <ActionCard
                title="Growth Analytics"
                action="Open Analytics"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



function TreasuryCard({
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

function MetricBox({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
      <p className="text-[#8B949E] text-sm mb-2">
        {label}
      </p>

      <h3 className="text-2xl font-bold">
        {value}
      </h3>
    </div>
  )
}

function ActionCard({
  title,
  action,
}: {
  title: string
  action: string
}) {
  return (
    <button className="bg-[#1A1F2B] hover:bg-[#222938] border border-[#2A2E39] rounded-2xl p-6 text-left transition">
      <p className="text-sm text-[#8B949E] mb-3">
        {title}
      </p>

      <h3 className="text-2xl font-bold">
        {action}
      </h3>
    </button>
  )
}

function ActivityRow({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="flex items-start justify-between border-b border-[#2A2E39] pb-5 last:border-none">
      <div>
        <h4 className="font-semibold text-lg">
          {title}
        </h4>

        <p className="text-[#8B949E] mt-1">
          {description}
        </p>
      </div>

      <span className="text-[#8B949E] text-sm">
        {time}
      </span>
    </div>
  )
}

function HealthRow({
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