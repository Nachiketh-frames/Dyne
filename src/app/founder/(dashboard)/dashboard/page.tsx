
"use client"

import {
  useEffect,
  useState,
} from "react"

import { useRouter } from "next/navigation"

import { supabase } from "../../../../lib/supabase"

import { useAuth } from "../../../../context/auth-context"

type StartupMetrics = {
  id?: string

  startup_name: string

  monthly_revenue: number

  monthly_expenses: number

  cash_balance: number

  total_debt: number

  monthly_growth: number

  active_customers: number

  status?: string

  industry?: string

  description?: string

  funding_stage?: string

  rejection_reason?: string
}

type Investment = {
  id: string

  amount: number

  created_at: string
}

export default function FounderDashboardPage() {
  const {
    user,
    role,
    loading: authLoading,
  } = useAuth()

  const router = useRouter()

  const [loading,
    setLoading] =
    useState(true)

  const [saving,
    setSaving] =
    useState(false)

  const [message,
    setMessage] =
    useState("")

  const [metricsId,
    setMetricsId] =
    useState<string | null>(
      null
    )

  const [metrics,
    setMetrics] =
    useState<StartupMetrics>({
      startup_name: "",

      monthly_revenue: 0,

      monthly_expenses: 0,

      cash_balance: 0,

      total_debt: 0,

      monthly_growth: 0,

      active_customers: 0,

      industry: "",

      description: "",

      funding_stage: "",
    })

    const [
      investments,
      setInvestments,
    ] = useState<
      Investment[]
    >([])

    const [
      founderFeed,
      setFounderFeed,
    ] = useState<any[]>([])

 

  useEffect(() => {
    async function fetchMetrics() {
      if (
        authLoading ||
        !user
      ) {
        return
      }

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
          .maybeSingle()

      if (data) {
        setMetrics(data)

        setMetricsId(data.id)
      } else {
        setMetrics((prev) => ({
          ...prev,

          startup_name:
            user.user_metadata
              ?.startup_name ||
            "",
        }))
      }

      if (!data) {
        setLoading(false)
        return
      }

      const {
        data: investmentData,
      } = await supabase
        .from("investments")
        .select("*")
        .eq(
          "startup_id",
          data.id
        )
      
      setInvestments(
        investmentData || []
      )

      const investmentEvents =
  (
    investmentData || []
  ).map(
    (
      investment: any
    ) => ({
      id:
        investment.id,

      title: `New investment received`,

      description: `₹${investment.amount.toLocaleString()} deployed into ${data.startup_name}.`,

      created_at:
        investment.created_at,
    })
  )

const growthEvent = {
  id: "growth",

  title:
    "Growth momentum updated",

  description: `${data.startup_name} is currently growing at ${data.monthly_growth}% monthly momentum.`,

  created_at:
    new Date().toISOString(),
}

const treasuryEvent = {
  id: "treasury",

  title:
    "Treasury intelligence updated",

  description: `Treasury reserve currently stands at ₹${data.cash_balance.toLocaleString()}.`,

  created_at:
    new Date().toISOString(),
}

const combinedFeed = [
  ...investmentEvents,
  growthEvent,
  treasuryEvent,
]

combinedFeed.sort(
  (a, b) =>
    new Date(
      b.created_at
    ).getTime() -
    new Date(
      a.created_at
    ).getTime()
)

setFounderFeed(
  combinedFeed.slice(
    0,
    5
  )
)

      

      setLoading(false)
    }

    

    fetchMetrics()
  }, [
    user,
    authLoading,
  ])

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

  function formatRunway() {
    if (!runwayMonths) {
      return "Profitable"
    }

    if (
      runwayMonths < 12
    ) {
      return `${runwayMonths} Months`
    }

    const years =
      Math.floor(
        runwayMonths / 12
      )

    const months =
      runwayMonths % 12

    if (months === 0) {
      return `${years} Years`
    }

    return `${years} Years ${months} Months`
  }

  const runway =
    formatRunway()

  async function saveMetrics() {
    if (!user) return

    setSaving(true)

    setMessage("")

    if (metricsId) {
      const { error } =
        await supabase
          .from(
            "startup_metrics"
          )
          .update({
            ...metrics,
          })
          .eq(
            "id",
            metricsId
          )

          await supabase
  .from(
    "analytics_snapshots"
  )
  .insert({
    startup_id:
      metricsId,

    monthly_revenue:
      metrics.monthly_revenue,

    monthly_expenses:
      metrics.monthly_expenses,

    cash_balance:
      metrics.cash_balance,

    total_debt:
      metrics.total_debt,

    monthly_growth:
      metrics.monthly_growth,

    active_customers:
      metrics.active_customers,
  })

      if (error) {
        setMessage(
          error.message
        )

        setSaving(false)

        return
      }

      setMessage(
        "Startup metrics updated successfully."
      )
    } else {
      const {
        data,
        error,
      } = await supabase
        .from(
          "startup_metrics"
        )
        .insert({
          ...metrics,

          user_id: user.id,

          status: "draft",
        })
        .select()
        .single()

        await supabase
  .from(
    "analytics_snapshots"
  )
  .insert({
    startup_id:
      data.id,

    monthly_revenue:
      metrics.monthly_revenue,

    monthly_expenses:
      metrics.monthly_expenses,

    cash_balance:
      metrics.cash_balance,

    total_debt:
      metrics.total_debt,

    monthly_growth:
      metrics.monthly_growth,

    active_customers:
      metrics.active_customers,
  })

      if (error) {
        setMessage(
          error.message
        )

        setSaving(false)

        return
      }

      setMetricsId(data.id)

      setMetrics({
        ...metrics,
        status: "draft",
      })

      setMessage(
        "Startup metrics saved successfully."
      )
    }

    setSaving(false)
  }

  const totalRaised =
  investments.reduce(
    (sum, investment) =>
      sum +
      investment.amount,
    0
  )

const investorCount =
  investments.length

  async function resubmitApplication() {
    if (!metricsId) return
  
    const { error } =
      await supabase
        .from(
          "startup_metrics"
        )
        .update({
          status: "pending",
  
          rejection_reason:
            null,
        })
        .eq("id", metricsId)
  
    if (error) {
      setMessage(
        error.message
      )
  
      return
    }
  
    setMetrics({
      ...metrics,
      status: "pending",
      rejection_reason:
        undefined,
    })
  }

  async function editStartupMetrics() {
    if (!metricsId) return
  
    const { error } =
      await supabase
        .from(
          "startup_metrics"
        )
        .update({
          status: "draft",
        })
        .eq("id", metricsId)
  
    if (error) {
      setMessage(
        error.message
      )
  
      return
    }
  
    setMetrics({
      ...metrics,
      status: "draft",
    })
  }

  async function submitForReview() {
    if (!metricsId) {
      setMessage(
        "Save metrics before submitting."
      )

      return
    }

   

    const { error } =
      await supabase
        .from(
          "startup_metrics"
        )
        .update({
          status: "pending",
        })
        .eq(
          "id",
          metricsId
        )

    if (error) {
      setMessage(
        error.message
      )

      return
    }

    setMetrics({
      ...metrics,
      status: "pending",
    })

    setMessage(
      "Startup submitted for review."
    )
  }

  if (
    loading ||
    authLoading
  ) {
    return (
      <main className="min-h-screen bg-[#0D1117] flex items-center justify-center text-white">
        Loading Founder Dashboard...
      </main>
    )
  }

  if (
    metrics.status ===
    "pending"
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <div className="max-w-2xl w-full bg-[#161B26] border border-[#2A2E39] rounded-3xl p-10 text-center">
          <h1 className="text-4xl font-bold mb-5">
            Approval Pending
          </h1>

          <p className="text-[#8B949E] leading-relaxed text-lg">
            DYNE is currently reviewing your startup metrics,
            treasury structure, and operational intelligence.
          </p>
        </div>
      </main>
    )
  }

  if (
    metrics.status ===
    "rejected"
  ) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <div className="w-full max-w-2xl bg-[#161B26] border border-[#2A2E39] rounded-3xl p-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-red-400">
              Startup Rejected
            </h1>
  
            <p className="text-[#8B949E] mt-3 leading-relaxed">
              Your startup submission did not
              meet DYNE operational requirements.
            </p>
          </div>
  
          <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              DYNE Review Feedback
            </h2>
  
            <p className="text-[#8B949E] leading-relaxed whitespace-pre-line">
              {metrics.rejection_reason ||
                "No rejection feedback provided."}
            </p>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
          <button
  onClick={
    editStartupMetrics
  }
  className="bg-[#1A1F2B] hover:bg-[#222938] border border-[#2A2E39] py-4 rounded-2xl font-semibold transition"
>
  Edit Startup Metrics
</button>
  
            <button
              onClick={
                resubmitApplication
              }
              className="bg-[#2962FF] hover:bg-[#3B73FF] py-4 rounded-2xl font-semibold transition"
            >
              Resubmit Application
            </button>
          </div>
        </div>
      </main>
    )
  }  

  if (
    metrics.status ===
    "approved"
  ) {
    return (
      <div className="text-white">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-5xl font-bold mb-3">
              Founder HQ
            </h1>
  
            <p className="text-[#8B949E] text-lg">
              Treasury operations and startup intelligence infrastructure.
            </p>
          </div>
  
          <div className="bg-[#161B26] border border-[#2A2E39] rounded-2xl px-6 py-4">
            <p className="text-[#8B949E] text-sm mb-2">
              Startup Status
            </p>
  
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
  
              <p className="font-semibold text-green-400">
                Approved
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8 mb-8">

  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-3xl font-bold">
        Founder Intelligence Feed
      </h2>

      <p className="text-[#8B949E] mt-2">
        Live operational and investment ecosystem activity
      </p>
    </div>

    <span className="text-[#2962FF] text-sm">
      LIVE
    </span>
  </div>

  <div className="space-y-5">

    {founderFeed.map(
      (event) => (
        <FounderFeedCard
          key={event.id}
          title={event.title}
          description={event.description}
        />
      )
    )}

  </div>

</div>
  
        <div className="grid grid-cols-4 gap-6 mb-8">
        <DashboardMetric
  title="Monthly Revenue"
  value={`₹${metrics.monthly_revenue.toLocaleString()}`}
/>

<DashboardMetric
  title="Cash Reserve"
  value={`₹${metrics.cash_balance.toLocaleString()}`}
/>

<DashboardMetric
  title="Capital Raised"
  value={`₹${totalRaised.toLocaleString()}`}
/>

<DashboardMetric
  title="Investors"
  value={`${investorCount}`}
/>
        </div>
  
        <div className="grid grid-cols-[1.2fr_0.8fr] gap-8">
          <div className="space-y-8">
            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Treasury Overview
                  </h2>
  
                  <p className="text-[#8B949E]">
                    Live operational financial intelligence.
                  </p>
                </div>
  
                <div className="text-[#2962FF] text-sm">
                  LIVE
                </div>
              </div>
  
              <div className="grid grid-cols-2 gap-5">
                <TreasuryCard
                  label="Monthly Revenue"
                  value={`₹${metrics.monthly_revenue.toLocaleString()}`}
                />
  
                <TreasuryCard
                  label="Monthly Expenses"
                  value={`₹${metrics.monthly_expenses.toLocaleString()}`}
                />
  
                <TreasuryCard
                  label="Cash Balance"
                  value={`₹${metrics.cash_balance.toLocaleString()}`}
                />
  
                <TreasuryCard
                  label="Total Debt"
                  value={`₹${metrics.total_debt.toLocaleString()}`}
                />
  
                <TreasuryCard
                  label="Growth Rate"
                  value={`${metrics.monthly_growth}%`}
                />
  
                <TreasuryCard
                  label="Customers"
                  value={`${metrics.active_customers}`}
                />
              </div>
            </div>
  
            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
              <h2 className="text-3xl font-bold mb-6">
                Startup Profile
              </h2>
  
              <div className="space-y-5">
                <ProfileRow
                  label="Startup"
                  value={metrics.startup_name}
                />
  
                <ProfileRow
                  label="Industry"
                  value={metrics.industry || "Unknown"}
                />
  
                <ProfileRow
                  label="Funding Stage"
                  value={metrics.funding_stage || "Unknown"}
                />
  
                <ProfileRow
                  label="Operational Status"
                  value="Active"
                />
              </div>
  
              <div className="mt-8 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
                <p className="text-[#8B949E] leading-relaxed">
                  {metrics.description}
                </p>
              </div>
            </div>
          </div>
  
          <div className="space-y-8">
            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                DYNE Intelligence
              </h2>
  
              <div className="space-y-5">
                <IntelligenceRow
                  label="Treasury Health"
                  value={
                    profitability > 0
                      ? "Strong"
                      : "Moderate"
                  }
                />
  
                <IntelligenceRow
                  label="Burn Rate"
                  value={`₹${burnRate.toLocaleString()}`}
                />
  
                <IntelligenceRow
                  label="Runway"
                  value={runway}
                />
  
                <IntelligenceRow
                  label="Growth"
                  value={`${metrics.monthly_growth}%`}
                />
              </div>
            </div>
  
            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-6">
                Founder Actions
              </h2>
  
              <div className="space-y-4">
                <button
                  onClick={() =>
                    router.push(
                      "/founder/updates"
                    )
                  }
                  className="w-full bg-[#2962FF] hover:bg-[#3B73FF] py-4 rounded-2xl font-semibold transition"
                >
                  Post Founder Update
                </button>
  
                <button
                  onClick={() =>
                    router.push(
                      "/founder/treasury"
                    )
                  }
                  className="w-full bg-[#1E222D] hover:bg-[#252A36] py-4 rounded-2xl font-semibold transition"
                >
                  Open Treasury
                </button>
  
                <button
                  onClick={() =>
                    router.push(
                      "/founder/analytics"
                    )
                  }
                  className="w-full bg-[#1E222D] hover:bg-[#252A36] py-4 rounded-2xl font-semibold transition"
                >
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[1.2fr_0.8fr] gap-8 text-white">
      <div>
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Founder Onboarding
          </h1>

          <p className="text-[#8B949E] text-lg">
            Configure startup metrics and treasury intelligence.
          </p>
        </div>

        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <div className="grid grid-cols-2 gap-5 mb-6">
            <InputField
              label="Startup Name"
              value={
                metrics.startup_name
              }
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  startup_name:
                    value,
                })
              }
            />

            <InputField
              label="Industry"
              value={
                metrics.industry ||
                ""
              }
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  industry: value,
                })
              }
            />

            <InputField
              label="Funding Stage"
              value={
                metrics.funding_stage ||
                ""
              }
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  funding_stage:
                    value,
                })
              }
            />

            <InputField
              label="Monthly Revenue"
              type="number"
              value={String(
                metrics.monthly_revenue
              )}
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  monthly_revenue:
                    Number(value),
                })
              }
            />

            <InputField
              label="Monthly Expenses"
              type="number"
              value={String(
                metrics.monthly_expenses
              )}
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  monthly_expenses:
                    Number(value),
                })
              }
            />

            <InputField
              label="Cash Balance"
              type="number"
              value={String(
                metrics.cash_balance
              )}
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  cash_balance:
                    Number(value),
                })
              }
            />

            <InputField
              label="Total Debt"
              type='number'
              value={String(
                metrics.total_debt
              )}
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  total_debt:
                    Number(value),
                })
              }
            />

            <InputField
              label="Monthly Growth %"
              type="number"
              value={String(
                metrics.monthly_growth
              )}
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  monthly_growth:
                    Number(value),
                })
              }
            />

            <InputField
              label="Active Customers"
              type='number'
              value={String(
                metrics.active_customers
              )}
              onChange={(value) =>
                setMetrics({
                  ...metrics,
                  active_customers:
                    Number(value),
                })
              }
            />

            <div className="col-span-2">
              <label className="block text-sm text-[#8B949E] mb-2">
                Startup Description
              </label>

              <textarea
                value={
                  metrics.description ||
                  ""
                }
                onChange={(e) =>
                  setMetrics({
                    ...metrics,
                    description:
                      e.target.value,
                  })
                }
                className="w-full h-32 bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-5 py-4 outline-none focus:border-[#2962FF] resize-none"
                placeholder="Describe your startup..."
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard
              title="Burn Rate"
              value={`₹${burnRate.toLocaleString()}`}
            />

            <StatCard
              title="Runway"
              value={runway}
            />

            <StatCard
              title="Profitability"
              value={`₹${profitability.toLocaleString()}`}
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={saveMetrics}
              disabled={saving}
              className="bg-[#1E222D] hover:bg-[#252A36] px-6 py-4 rounded-2xl font-semibold transition"
            >
              {saving
                ? "Saving..."
                : "Save Metrics"}
            </button>

            <button
              onClick={
                submitForReview
              }
              className="bg-[#2962FF] hover:bg-[#3B73FF] px-6 py-4 rounded-2xl font-semibold transition"
            >
              Submit For Review
            </button>
          </div>

          {message && (
            <p className="mt-6 text-[#8B949E]">
              {message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6 sticky top-8 h-fit">
        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                Live Investor Preview
              </h2>

              <p className="text-[#8B949E] mt-1 text-sm">
                This is how investors will view your startup.
              </p>
            </div>

            <div className="px-3 py-1 rounded-full bg-[#1E222D] text-sm">
              {metrics.funding_stage || "Stage"}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-3xl font-bold mb-2">
              {metrics.startup_name || "Startup Name"}
            </h3>

            <p className="text-[#8B949E]">
              {metrics.industry || "Industry"}
            </p>
          </div>

          <p className="text-[#8B949E] leading-relaxed mb-8 min-h-[100px]">
            {metrics.description ||
              "Your startup description will appear here as investors see it in Discover."}
          </p>

          <div className="space-y-4">
            <PreviewMetric
              label="Revenue"
              value={`₹${metrics.monthly_revenue.toLocaleString()}`}
            />

            <PreviewMetric
              label="Growth"
              value={`${metrics.monthly_growth}%`}
            />

            <PreviewMetric
              label="Burn Rate"
              value={`₹${burnRate.toLocaleString()}`}
            />

            <PreviewMetric
              label="Runway"
              value={runway}
            />

            <PreviewMetric
              label="Profitability"
              value={`₹${profitability.toLocaleString()}`}
            />

            <PreviewMetric
              label="Customers"
              value={`${metrics.active_customers}`}
            />
          </div>
        </div>

        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Startup Health
          </h2>

          <div className="space-y-5">
            <PreviewMetric
              label="Treasury Status"
              value={
                profitability > 0
                  ? "Profitable"
                  : "Burning Cash"
              }
            />

            <PreviewMetric
              label="Operational Health"
              value={
                runwayMonths &&
                runwayMonths > 18
                  ? "Strong"
                  : runwayMonths &&
                      runwayMonths > 8
                    ? "Stable"
                    : "Risky"
              }
            />

            <PreviewMetric
              label="Investor Readiness"
              value={
                metrics.monthly_growth > 10
                  ? "High"
                  : "Moderate"
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardMetric({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="bg-[#161B26] border border-[#2A2E39] rounded-2xl p-6">
      <p className="text-[#8B949E] text-sm mb-3">
        {title}
      </p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </div>
  )
}

function TreasuryCard({
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

function ProfileRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#8B949E]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  )
}

function IntelligenceRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-5 py-4">
      <span className="text-[#8B949E]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  )
}


function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (
    value: string
  ) => void
  type?: string
}) {
  return (
    <div>
      <label className="block text-sm text-[#8B949E] mb-2">
        {label}
      </label>

      <input
        type={type}
        step={
          type === "number"
            ? "0.01"
            : undefined
        }
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-5 py-4 outline-none focus:border-[#2962FF]"
      />
    </div>
  )
}

function PreviewMetric({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-4 py-4">
      <span className="text-[#8B949E]">
        {label}
      </span>

      <span className="font-semibold text-right">
        {value}
      </span>
    </div>
  )
}

function StatCard({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
      <p className="text-sm text-[#8B949E] mb-2">
        {title}
      </p>

      <h3 className="text-xl font-bold">
        {value}
      </h3>
    </div>
  )
}
function FounderFeedCard({
  title,
  description,
}: {
  title: string

  description: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
      <h3 className="text-xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-[#8B949E] leading-relaxed">
        {description}
      </p>
    </div>
  )
}