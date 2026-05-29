
"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import { useRouter } from "next/navigation"

import Sidebar from "./sidebar"
import Navbar from "./navbar"

import { useAuth } from "../context/auth-context"

import { supabase } from "../lib/supabase"

type Investment = {
  id: string

  amount: number

  created_at: string

  startup_metrics: {
    id: string

    startup_name: string

    industry: string

    monthly_growth: number

    funding_stage: string

    monthly_revenue: number

    cash_balance: number
  }
}

type FeedEvent = {
  id: string

  type:
    | "update"
    | "investment"
    | "growth"

  title: string

  description: string

  created_at: string
}

export default function HomePage() {
  const { user } =
    useAuth()

  const router =
    useRouter()

  const [
    investments,
    setInvestments,
  ] = useState<
    Investment[]
  >([])

  const [feed,
    setFeed] =
    useState<
      FeedEvent[]
    >([])

  const [loading,
    setLoading] =
    useState(true)

  useEffect(() => {
    if (user === undefined)
      return

    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  useEffect(() => {
    async function fetchInvestments() {
      if (!user) return

      const {
        data,
        error,
      } = await supabase
        .from("investments")
        .select(`
          *,
          startup_metrics (
            id,
            startup_name,
            industry,
            monthly_growth,
            funding_stage,
            monthly_revenue,
            cash_balance
          )
        `)
        .eq(
          "investor_id",
          user.id
        )

      if (error) {
        console.error(error)

        return
      }

      setInvestments(
        data || []
      )

      const investmentFeed =
        (data || []).map(
          (
            investment: any
          ) => ({
            id:
              investment.id,

            type:
              "investment",

            title: `New capital deployed into ${investment.startup_metrics.startup_name}`,

            description: `₹${investment.amount.toLocaleString()} invested into ${investment.startup_metrics.startup_name}.`,

            created_at:
              investment.created_at,
          })
        )

      const {
        data: updatesData,
      } = await supabase
        .from(
          "founder_updates"
        )
        .select("*")
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(5)

      const updatesFeed =
        (updatesData || []).map(
          (
            update: any
          ) => ({
            id: update.id,

            type: "update",

            title:
              update.title,

            description:
              update.content,

            created_at:
              update.created_at,
          })
        )

      const growthFeed =
        (data || []).map(
          (
            investment: any
          ) => ({
            id: `growth-${investment.id}`,

            type: "growth",

            title: `${investment.startup_metrics.startup_name} growth increased`,

            description: `Monthly growth is now ${investment.startup_metrics.monthly_growth}% with increasing treasury momentum.`,

            created_at:
              investment.created_at,
          })
        )

        const combinedFeed = [
          ...investmentFeed,
          ...updatesFeed,
          ...growthFeed,
        ] as FeedEvent[]

      combinedFeed.sort(
        (a, b) =>
          new Date(
            b.created_at
          ).getTime() -
          new Date(
            a.created_at
          ).getTime()
      )

      setFeed(
        combinedFeed.slice(
          0,
          6
        )
      )

      setLoading(false)
    }

    fetchInvestments()
  }, [user])

  const totalInvested =
    useMemo(() => {
      return investments.reduce(
        (sum, investment) =>
          sum +
          investment.amount,
        0
      )
    }, [investments])

  const portfolioValue =
    useMemo(() => {
      return Math.floor(
        totalInvested * 1.18
      )
    }, [totalInvested])

  const portfolioGrowth =
    useMemo(() => {
      if (totalInvested === 0)
        return 0

      return Math.floor(
        ((portfolioValue -
          totalInvested) /
          totalInvested) *
          100
      )
    }, [
      totalInvested,
      portfolioValue,
    ])

  const activeHoldings =
    investments.length

  if (!user) {
    return null
  }

  return (
    <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <section className="flex-1 overflow-y-auto p-8">

          <div className="mb-10">
            <h1 className="text-4xl font-bold">
              Investor Dashboard
            </h1>

            <p className="text-[#8B949E] mt-2">
              Live ecosystem overview and portfolio intelligence
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Portfolio Value"
              value={`₹${portfolioValue.toLocaleString()}`}
            />

            <DashboardCard
              title="Watchlisted"
              value="12"
            />

            <DashboardCard
              title="Active Holdings"
              value={`${activeHoldings}`}
            />

            <DashboardCard
              title="Wallet Balance"
              value={`₹${(
                250000 -
                totalInvested
              ).toLocaleString()}`}
            />
          </div>

          <div className="grid grid-cols-[1.1fr_0.9fr] gap-8 mb-8">

            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold">
                    Intelligence Feed
                  </h2>

                  <p className="text-[#8B949E] mt-2">
                    Real-time ecosystem intelligence and founder momentum
                  </p>
                </div>

                <span className="text-[#2962FF] text-sm">
                  LIVE
                </span>
              </div>

              <div className="space-y-5">
                {feed.map((item) => (
                  <FeedCard
                    key={item.id}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-8">

              <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Portfolio Snapshot
                    </h2>

                    <p className="text-[#8B949E] mt-2">
                      Top investment holdings
                    </p>
                  </div>

                  <span className="text-[#2962FF] text-sm">
                    LIVE
                  </span>
                </div>

                <div className="space-y-5">

                  {investments
                    .slice(0, 3)
                    .map(
                      (investment) => {

                        const growth =
                          investment
                            .startup_metrics
                            ?.monthly_growth || 0

                        return (
                          <div
                            key={investment.id}
                            className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5"
                          >
                            <div className="flex items-center justify-between mb-4">

                              <div>
                                <p className="text-[#2962FF] text-sm mb-1">
                                  {
                                    investment
                                      .startup_metrics
                                      ?.industry
                                  }
                                </p>

                                <h3 className="text-xl font-bold">
                                  {
                                    investment
                                      .startup_metrics
                                      ?.startup_name
                                  }
                                </h3>
                              </div>

                              <div className="text-right">
                                <p className="text-sm text-[#8B949E]">
                                  Growth
                                </p>

                                <h3 className="text-green-400 text-2xl font-bold">
                                  +{growth}%
                                </h3>
                              </div>

                            </div>

                            <div className="flex items-center justify-between">

                              <div>
                                <p className="text-sm text-[#8B949E]">
                                  Invested
                                </p>

                                <p className="text-xl font-bold mt-1">
                                  ₹{investment.amount.toLocaleString()}
                                </p>
                              </div>

                              <button className="bg-[#2962FF] hover:bg-[#3B73FF] px-5 py-2 rounded-xl font-semibold transition">
                                View
                              </button>

                            </div>
                          </div>
                        )
                      }
                    )}

                </div>
              </div>

              <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">

                <div className="flex items-center justify-between mb-8">

                  <div>
                    <h2 className="text-2xl font-bold">
                      Wallet Snapshot
                    </h2>

                    <p className="text-[#8B949E] mt-2">
                      Treasury allocation and liquidity overview
                    </p>
                  </div>

                  <span className="text-[#2962FF] text-sm">
                    LIVE
                  </span>

                </div>

                <div className="space-y-5">

                  <WalletRow
                    label="Available Balance"
                    value={`₹${(
                      250000 -
                      totalInvested
                    ).toLocaleString()}`}
                  />

                  <WalletRow
                    label="Capital Deployed"
                    value={`₹${totalInvested.toLocaleString()}`}
                  />

                  <WalletRow
                    label="Portfolio Returns"
                    value={`+₹${(
                      portfolioValue -
                      totalInvested
                    ).toLocaleString()}`}
                  />

                </div>

              </div>

            </div>

          </div>

        </section>
      </div>
    </main>
  )
}

function DashboardCard({
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

function FeedCard({
  title,
  description,
}: {
  title: string

  description: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
      <h3 className="text-lg font-bold mb-3">
        {title}
      </h3>

      <p className="text-[#8B949E] leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function WalletRow({
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

