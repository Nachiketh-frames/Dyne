"use client"

import {
  useEffect,
  useState,
} from "react"

import {
  useParams,
  useRouter,
} from "next/navigation"

import Sidebar from "../../sidebar"
import Navbar from "../../navbar"

import { supabase }
from "../../../lib/supabase"

import { useAuth }
from "../../../context/auth-context"

type Startup = {
  id: string

  startup_name: string

  industry?: string

  description?: string

  funding_stage?: string

  monthly_revenue: number

  monthly_growth: number

  cash_balance: number

  monthly_expenses: number

  total_debt: number

  active_customers: number

  user_id: string
}

type FounderUpdate = {
  id: string

  title: string

  content: string

  created_at: string
}

export default function StartupDetailPage() {
  const params =
    useParams()

  const router =
    useRouter()

  const {
    user,
    loading,
  } = useAuth()

  const [startup,
    setStartup] =
    useState<Startup | null>(
      null
    )

    const [updates,
      setUpdates] =
      useState<
        FounderUpdate[]
      >([])

    const [
        watchlisted,
        setWatchlisted,
      ] = useState(false)

      const [
        investmentAmount,
        setInvestmentAmount,
      ] = useState("")
      
      const [
        investing,
        setInvesting,
      ] = useState(false)

  useEffect(() => {
    if (
      !loading &&
      !user
    ) {
      router.push("/login")
    }
  }, [
    user,
    loading,
    router,
  ])

  useEffect(() => {
    async function fetchStartup() {
      const { data, error } =
        await supabase
          .from(
            "startup_metrics"
          )
          .select("*")
          .eq(
            "id",
            params.id
          )
          .single()

      if (error) {
        console.error(error)

        return
      }

      setStartup(data)

      const {
        data: updatesData,
      } = await supabase
        .from(
          "founder_updates"
        )
        .select("*")
        .eq(
          "startup_id",
          data.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
      
      setUpdates(
        updatesData || []
      )


      if (user) {
        const {
          data: watchlistData,
        } = await supabase
          .from("watchlists")
          .select("*")
          .eq(
            "user_id",
            user.id
          )
          .eq(
            "startup_id",
            data.id
          )
          .single()
      
        if (watchlistData) {
          setWatchlisted(true)
        }
      }
    }

    if (params.id) {
      fetchStartup()
    }
  }, [params.id])

  async function toggleWatchlist() {
    if (!user || !startup)
      return
  
    if (watchlisted) {
      await supabase
        .from("watchlists")
        .delete()
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "startup_id",
          startup.id
        )
  
      setWatchlisted(false)
    } else {
      await supabase
        .from("watchlists")
        .insert({
          user_id: user.id,
  
          startup_id:
            startup.id,
        })
  
      setWatchlisted(true)
    }
  }

  async function investInStartup() {
    if (
      !user ||
      !startup ||
      !investmentAmount
    )
      return

      if (
        Number(
          investmentAmount
        ) < 5000
      ) {
        alert(
          "Minimum investment is ₹5,000"
        )
      
        return
      }
  
    setInvesting(true)
  
    const { error } =
      await supabase
        .from("investments")
        .insert({
          investor_id:
            user.id,
  
          startup_id:
            startup.id,
  
          amount:
            Number(
              investmentAmount
            ),
        })
  
        if (error) {
          console.error(error)
        
          setInvesting(false)
        
          return
        }
        
        await supabase
          .from("notifications")
          .insert([
            {
              user_id:
                user.id,
        
              title:
                "Investment Confirmed",
        
              description: `You invested ₹${Number(
                investmentAmount
              ).toLocaleString()} into ${startup.startup_name}.`,
        
              type:
                "investment",
            },
        
            {
              user_id:
                startup.user_id,
        
              title:
                "New Capital Received",
        
              description: `${startup.startup_name} received ₹${Number(
                investmentAmount
              ).toLocaleString()} in new investment.`,
        
              type:
                "funding",
            },
          ])
        
        setInvestmentAmount("")
        
        setInvesting(false)
        
        alert(
          "Investment successful"
        )
  }

  if (
    loading ||
    !startup
  ) {
    return (
      <main className="min-h-screen bg-[#0D1117] flex items-center justify-center text-white">
        Loading Startup...
      </main>
    )
  }

  const profitability =
    startup.monthly_revenue -
    startup.monthly_expenses

  const burnRate =
    profitability < 0
      ? Math.abs(
          profitability
        )
      : 0

  const runway =
    burnRate > 0
      ? `${Math.floor(
          startup.cash_balance /
            burnRate
        )} Months`
      : "Profitable"

  return (
    <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <section className="p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-5xl font-bold">
                {
                  startup.startup_name
                }
              </h1>

              <p className="text-[#8B949E] text-lg mt-3">
                {
                  startup.industry
                }
              </p>
            </div>

            <div className="px-4 py-2 bg-[#1E222D] rounded-full">
              {
                startup.funding_stage
              }
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-10">
            <MetricCard
              title="Revenue"
              value={`₹${startup.monthly_revenue.toLocaleString()}`}
            />

            <MetricCard
              title="Growth"
              value={`${startup.monthly_growth}%`}
            />

            <MetricCard
              title="Customers"
              value={`${startup.active_customers}`}
            />
          </div>

          <div className="grid grid-cols-[1.3fr_0.7fr] gap-8">
            <div className="space-y-8">
              <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-6">
                  Startup Overview
                </h2>

                <p className="text-[#8B949E] leading-relaxed text-lg">
                  {
                    startup.description
                  }
                </p>
              </div>

              <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
                <h2 className="text-3xl font-bold mb-8">
                  Treasury Intelligence
                </h2>

                <div className="grid grid-cols-2 gap-5">
                  <MetricRow
                    label="Cash Reserve"
                    value={`₹${startup.cash_balance.toLocaleString()}`}
                  />

                  <MetricRow
                    label="Debt"
                    value={`₹${startup.total_debt.toLocaleString()}`}
                  />

                  <MetricRow
                    label="Burn Rate"
                    value={`₹${burnRate.toLocaleString()}`}
                  />

                  <MetricRow
                    label="Runway"
                    value={runway}
                  />

                  <MetricRow
                    label="Profitability"
                    value={`₹${profitability.toLocaleString()}`}
                  />

                  <MetricRow
                    label="Growth Rate"
                    value={`${startup.monthly_growth}%`}
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-3xl font-bold">
        Founder Updates
      </h2>

      <p className="text-[#8B949E] mt-2">
        Recent startup activity and operational announcements
      </p>
    </div>

    <span className="text-[#2962FF] text-sm">
      LIVE
    </span>
  </div>

  <div className="space-y-5">
    {updates.length === 0 ? (
      <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6 text-center">
        <p className="text-[#8B949E]">
          No founder updates published yet
        </p>
      </div>
    ) : (
      updates.map(
        (update) => (
          <div
            key={update.id}
            className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold max-w-xs">
                {update.title}
              </h3>

              <span className="text-[#8B949E] text-sm">
                {new Date(
                  update.created_at
                ).toLocaleDateString()}
              </span>
            </div>

            <p className="text-[#8B949E] leading-relaxed">
              {update.content}
            </p>
          </div>
        )
      )
    )}
  </div>
</div>

            <div className="space-y-6">
            <div className="space-y-6">

<div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
  <div className="mb-8">
    <h2 className="text-3xl font-bold mb-3">
      Invest in Startup
    </h2>

    <p className="text-[#8B949E]">
      Allocate capital and gain startup exposure
    </p>
  </div>

  <div className="space-y-5">
    <input
      type="number"
      value={
        investmentAmount
      }
      onChange={(e) =>
        setInvestmentAmount(
          e.target.value
        )
      }
      placeholder="Investment amount..."
      className="w-full bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5 outline-none focus:border-[#2962FF] text-white"
    />

    <button
      onClick={
        investInStartup
      }
      disabled={investing}
      className="w-full bg-[#2962FF] hover:bg-[#3B73FF] py-4 rounded-2xl font-semibold transition"
    >
      {investing
        ? "Processing..."
        : "Invest Now"}
    </button>
  </div>

  <div className="mt-8 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
    <div className="space-y-4">
      <InvestmentRow
        label="Funding Stage"
        value={
          startup.funding_stage ||
          "Unknown"
        }
      />

      <InvestmentRow
        label="Growth Rate"
        value={`${startup.monthly_growth}%`}
      />

      <InvestmentRow
        label="Runway"
        value={runway}
      />
    </div>
  </div>
</div>

<div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
  <div className="flex items-center justify-between mb-8">
    <div>
      <h2 className="text-3xl font-bold">
        Founder Updates
      </h2>

      <p className="text-[#8B949E] mt-2">
        Recent startup activity and operational announcements
      </p>
    </div>

    <span className="text-[#2962FF] text-sm">
      LIVE
    </span>
  </div>

  <div className="space-y-5">
    {updates.length === 0 ? (
      <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6 text-center">
        <p className="text-[#8B949E]">
          No founder updates published yet
        </p>
      </div>
    ) : (
      updates.map(
        (update) => (
          <div
            key={update.id}
            className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold max-w-xs">
                {update.title}
              </h3>

              <span className="text-[#8B949E] text-sm">
                {new Date(
                  update.created_at
                ).toLocaleDateString()}
              </span>
            </div>

            <p className="text-[#8B949E] leading-relaxed">
              {update.content}
            </p>
          </div>
        )
      )
    )}
  </div>
</div>

<div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
  <h2 className="text-2xl font-bold mb-6">
    DYNE Analysis
  </h2>

  <div className="space-y-5">
    <AnalysisRow
      label="Treasury Health"
      value={
        profitability > 0
          ? "Strong"
          : "Moderate"
      }
    />

    <AnalysisRow
      label="Operational Stability"
      value={
        burnRate < 50000
          ? "Stable"
          : "Aggressive Burn"
      }
    />

    <AnalysisRow
      label="Investor Readiness"
      value={
        startup.monthly_growth >
        10
          ? "High"
          : "Moderate"
      }
    />
  </div>
</div>

<div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
  <button
    onClick={
      toggleWatchlist
    }
    className={`w-full py-4 rounded-2xl font-semibold transition mb-4 ${
      watchlisted
        ? "bg-green-500 hover:bg-green-600"
        : "bg-[#2962FF] hover:bg-[#3B73FF]"
    }`}
  >
    {watchlisted
      ? "Watchlisted"
      : "Add to Watchlist"}
  </button>

  <button className="w-full bg-[#1E222D] hover:bg-[#252A36] py-4 rounded-2xl font-semibold transition">
    Request Investor Access
  </button>
</div>

</div>

              <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
              <button
  onClick={
    toggleWatchlist
  }
  className={`w-full py-4 rounded-2xl font-semibold transition mb-4 ${
    watchlisted
      ? "bg-green-500 hover:bg-green-600"
      : "bg-[#2962FF] hover:bg-[#3B73FF]"
  }`}
>
  {watchlisted
    ? "Watchlisted"
    : "Add to Watchlist"}
</button>

                <button className="w-full bg-[#1E222D] hover:bg-[#252A36] py-4 rounded-2xl font-semibold transition">
                  Request Investor Access
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function InvestmentRow({
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

function MetricCard({
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

function MetricRow({
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

function AnalysisRow({
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