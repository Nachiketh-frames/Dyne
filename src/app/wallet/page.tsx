"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import Sidebar from "../sidebar"
import Navbar from "../navbar"

import { supabase } from "../../lib/supabase"

import { useAuth } from "../../context/auth-context"

import InvestorRoute from "../../components/routes/InvestorRoute"

type Investment = {
  id: string

  amount: number

  created_at: string
}

export default function WalletPage() {
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

  const baseBalance =
    250000

  useEffect(() => {
    async function fetchInvestments() {
      if (!user) return

      const {
        data,
        error,
      } = await supabase
        .from("investments")
        .select("*")
        .eq(
          "investor_id",
          user.id
        )

      if (error) {
        console.error(error)

        setLoading(false)

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
    useMemo(() => {
      return investments.reduce(
        (
          sum,
          investment
        ) =>
          sum +
          investment.amount,
        0
      )
    }, [investments])

  const availableBalance =
    baseBalance -
    totalInvested

  const portfolioReturns =
    Math.floor(
      totalInvested *
        0.18
    )

  return (
    <InvestorRoute>

      <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">

          <Navbar />

          <section className="flex-1 overflow-y-auto p-8">

            <div className="mb-10">
              <h1 className="text-4xl font-bold">
                Wallet
              </h1>

              <p className="text-[#8B949E] mt-2">
                Manage capital allocation and treasury exposure
              </p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">

              <WalletCard
                title="Available Balance"
                value={`₹${availableBalance.toLocaleString()}`}
              />

              <WalletCard
                title="Capital Deployed"
                value={`₹${totalInvested.toLocaleString()}`}
              />

              <WalletCard
                title="Portfolio Returns"
                value={`₹${portfolioReturns.toLocaleString()}`}
              />

              <WalletCard
                title="Transactions"
                value={`${investments.length}`}
              />

            </div>

            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">

              <div className="flex items-center justify-between mb-8">

                <div>
                  <h2 className="text-3xl font-bold">
                    Transaction Ledger
                  </h2>

                  <p className="text-[#8B949E] mt-2">
                    Historical investment activity and treasury deployment
                  </p>
                </div>

                <span className="text-[#2962FF] text-sm">
                  LIVE
                </span>

              </div>

              {loading ? (
                <div className="py-10 text-center text-[#8B949E]">
                  Loading transactions...
                </div>
              ) : investments.length ===
                0 ? (
                <div className="py-10 text-center text-[#8B949E]">
                  No transactions yet
                </div>
              ) : (
                <div className="space-y-5">

                  {investments.map(
                    (
                      investment
                    ) => (
                      <TransactionRow
                        key={
                          investment.id
                        }
                        amount={`₹${investment.amount.toLocaleString()}`}
                        date={new Date(
                          investment.created_at
                        ).toLocaleDateString()}
                      />
                    )
                  )}

                </div>
              )}

            </div>

          </section>

        </div>

      </main>

    </InvestorRoute>
  )
}

function WalletCard({
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

function TransactionRow({
  amount,
  date,
}: {
  amount: string

  date: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6 flex items-center justify-between">

      <div>
        <h3 className="text-2xl font-bold">
          Investment Transaction
        </h3>

        <p className="text-[#8B949E] mt-1">
          Capital deployed into startup ecosystem
        </p>
      </div>

      <div className="text-right">

        <p className="text-2xl font-bold">
          {amount}
        </p>

        <p className="text-[#8B949E] mt-1">
          {date}
        </p>

      </div>

    </div>
  )
}