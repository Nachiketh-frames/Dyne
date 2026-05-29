"use client"

import {
  useEffect,
  useState,
} from "react"

import Link from "next/link"

import Sidebar from "../sidebar"
import Navbar from "../navbar"

import { supabase }
from "../../lib/supabase"

import {
  useWatchlist,
} from "../../context/watchlist-context"

import InvestorRoute from "../../components/routes/InvestorRoute"

type Startup = {
  id: string

  startup_name: string

  industry?: string

  funding_stage?: string

  monthly_revenue: number

  monthly_growth: number

  cash_balance: number
}

export default function WatchlistPage() {
  const {
    watchlist,
    removeFromWatchlist,
  } = useWatchlist()

  const [startups,
    setStartups] =
    useState<Startup[]>([])

  useEffect(() => {
    async function fetchWatchlistStartups() {

      if (
        watchlist.length === 0
      ) {
        setStartups([])

        return
      }

      const {
        data,
        error,
      } = await supabase
        .from(
          "startup_metrics"
        )
        .select("*")
        .in(
          "id",
          watchlist
        )

      if (error) {
        console.error(error)

        return
      }

      setStartups(
        data || []
      )
    }

    fetchWatchlistStartups()
  }, [watchlist])

  return (
    <InvestorRoute>

      <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col">

          <Navbar />

          <section className="p-8 overflow-y-auto">

            <div className="mb-10">

              <h1 className="text-4xl font-bold">
                Your Watchlist
              </h1>

              <p className="text-[#8B949E] mt-2">
                Track startups you are monitoring
              </p>

            </div>

            {startups.length ===
              0 ? (
              <div className="bg-[#161B26] border border-[#2A2E39] rounded-2xl p-10 text-center">

                <h2 className="text-2xl font-semibold mb-3">
                  No startups saved
                </h2>

                <p className="text-[#8B949E]">
                  Add startups from Discover
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">

                {startups.map(
                  (
                    startup
                  ) => (
                    <WatchlistCard
                      key={
                        startup.id
                      }
                      startup={
                        startup
                      }
                      removeFromWatchlist={
                        removeFromWatchlist
                      }
                    />
                  )
                )}

              </div>
            )}

          </section>

        </div>

      </main>

    </InvestorRoute>
  )
}

function WatchlistCard({
  startup,
  removeFromWatchlist,
}: {
  startup: Startup

  removeFromWatchlist: (
    startupId: string
  ) => void
}) {
  return (
    <div className="bg-[#161B26] border border-[#2A2E39] rounded-2xl p-6">

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            {
              startup.startup_name
            }
          </h2>

          <p className="text-[#8B949E] mt-1">
            {
              startup.industry
            }
          </p>

        </div>

        <div className="px-3 py-1 rounded-full bg-[#1E222D] text-sm">

          {
            startup.funding_stage
          }

        </div>

      </div>

      <div className="space-y-5">

        <Metric
          label="Revenue"
          value={`₹${startup.monthly_revenue.toLocaleString()}`}
        />

        <Metric
          label="Growth"
          value={`${startup.monthly_growth}%`}
        />

        <Metric
          label="Cash Reserve"
          value={`₹${startup.cash_balance.toLocaleString()}`}
        />

        <button
          onClick={() =>
            removeFromWatchlist(
              startup.id
            )
          }
          className="w-full py-3 rounded-xl font-semibold transition bg-[#2A1A1A] text-red-400 hover:bg-[#3A2020]"
        >
          Remove from Watchlist
        </button>

        <Link
          href={`/startup/${startup.id}`}
        >

          <button className="w-full mt-2 bg-[#2962FF] hover:bg-[#3B73FF] text-white font-semibold py-3 rounded-xl transition">

            View Startup

          </button>

        </Link>

      </div>

    </div>
  )
}

function Metric({
  label,
  value,
}: {
  label: string

  value: string
}) {
  return (
    <div className="flex items-center justify-between">

      <p className="text-[#8B949E] text-sm">
        {label}
      </p>

      <p className="font-semibold">
        {value}
      </p>

    </div>
  )
}