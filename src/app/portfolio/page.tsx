"use client"

import {
  useEffect,
  useState,
} from "react"

import Sidebar from "../sidebar"
import Navbar from "../navbar"

import { supabase } from "../../lib/supabase"

import { useAuth } from "../../context/auth-context"

import InvestorRoute from "../../components/routes/InvestorRoute"

import {
  calculatePortfolioValue,
  calculateReturns,
  calculateTotalInvested,
} from "../../lib/portfolio"

type Investment = {
  id: string

  amount: number

  created_at: string

  startup_metrics: {
    startup_name: string

    industry?: string

    monthly_growth: number
  }
}

export default function PortfolioPage() {
  const { user } =
    useAuth()

  const [
    investments,
    setInvestments,
  ] = useState<
    Investment[]
  >([])

  const [loading,
    setLoading] =
    useState(true)

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
            startup_name,
            industry,
            monthly_growth
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

      setLoading(false)
    }

    fetchInvestments()
  }, [user])

  const totalInvested =
    calculateTotalInvested(
      investments
    )

  const totalPortfolioValue =
    calculatePortfolioValue(
      investments
    )

  const totalReturns =
    calculateReturns(
      investments
    )

  return (
    <InvestorRoute>

      <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col">

          <Navbar />

          <section className="p-8 overflow-y-auto">

            <div className="mb-8">
              <h1 className="text-4xl font-bold">
                Portfolio
              </h1>

              <p className="text-[#8B949E] mt-2">
                Track your startup
                investments
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">

              <PortfolioCard
                title="Total Invested"
                value={`₹${Math.floor(
                  totalInvested
                ).toLocaleString()}`}
              />

              <PortfolioCard
                title="Total Holdings"
                value={`${investments.length}`}
              />

              <PortfolioCard
                title="Portfolio Value"
                value={`₹${Math.floor(
                  totalPortfolioValue
                ).toLocaleString()}`}
              />

              <PortfolioCard
                title="Total Returns"
                value={`₹${Math.floor(
                  totalReturns
                ).toLocaleString()}`}
              />

            </div>

            <div className="bg-[#161B26] border border-[#2A2E39] rounded-2xl overflow-hidden">

              <div className="grid grid-cols-3 px-6 py-4 border-b border-[#2A2E39] text-[#8B949E] text-sm">

                <p>Startup</p>

                <p>Investment</p>

                <p>Date</p>

              </div>

              {loading ? (
                <div className="p-6">
                  Loading...
                </div>
              ) : investments.length ===
                0 ? (
                <div className="p-6 text-[#8B949E]">
                  No investments yet
                </div>
              ) : (
                investments.map(
                  (
                    investment
                  ) => (
                    <div
                      key={
                        investment.id
                      }
                      className="grid grid-cols-3 px-6 py-5 border-b border-[#2A2E39]"
                    >

                      <div>

                        <p className="font-semibold">
                          {
                            investment
                              .startup_metrics
                              ?.startup_name
                          }
                        </p>

                        <p className="text-sm text-[#8B949E] mt-1">

                          {
                            investment
                              .startup_metrics
                              ?.industry
                          }

                          {" "}• Growth{" "}

                          {
                            investment
                              .startup_metrics
                              ?.monthly_growth
                          }%

                        </p>

                      </div>

                      <p>
                        ₹
                        {investment.amount.toLocaleString()}
                      </p>

                      <p className="text-[#8B949E]">
                        {new Date(
                          investment.created_at
                        ).toLocaleDateString()}
                      </p>

                    </div>
                  )
                )
              )}

            </div>

          </section>

        </div>

      </main>

    </InvestorRoute>
  )
}

function PortfolioCard({
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