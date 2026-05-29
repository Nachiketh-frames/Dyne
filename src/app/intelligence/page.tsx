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

type FeedUpdate = {
  id: string

  title: string

  content: string

  created_at: string

  startup_id: string

  startup_metrics: {
    startup_name: string

    industry?: string
  }
}

export default function IntelligencePage() {
  const [updates,
    setUpdates] =
    useState<FeedUpdate[]>(
      []
    )

  const [loading,
    setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchUpdates() {
      const { data, error } =
        await supabase
          .from(
            "founder_updates"
          )
          .select(`
            *,
            startup_metrics (
              startup_name,
              industry
            )
          `)
          .order(
            "created_at",
            {
              ascending: false,
            }
          )

      if (error) {
        console.error(error)

        setLoading(false)

        return
      }

      setUpdates(
        data || []
      )

      setLoading(false)
    }

    fetchUpdates()
  }, [])

  return (
    <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <section className="p-8 overflow-y-auto">
          <div className="mb-10">
            <h1 className="text-5xl font-bold mb-3">
              Intelligence Feed
            </h1>

            <p className="text-[#8B949E] text-lg">
              Live founder activity,
              treasury intelligence,
              and startup operational momentum
            </p>
          </div>

          <div className="grid grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Live Updates"
              value={`${updates.length}`}
            />

            <MetricCard
              title="Ecosystem Activity"
              value={
                updates.length > 5
                  ? "High"
                  : "Growing"
              }
            />

            <MetricCard
              title="Founder Momentum"
              value="Active"
            />

            <MetricCard
              title="Investor Visibility"
              value="Public"
            />
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#8B949E]">
              Loading Intelligence...
            </div>
          ) : updates.length === 0 ? (
            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-10 text-center">
              <h2 className="text-3xl font-bold mb-4">
                No ecosystem activity yet
              </h2>

              <p className="text-[#8B949E]">
                Founder updates will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {updates.map(
                (update) => (
                  <FeedCard
                    key={update.id}
                    update={update}
                  />
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function FeedCard({
  update,
}: {
  update: FeedUpdate
}) {
  return (
    <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#2962FF]" />

            <span className="text-[#2962FF] text-sm">
              LIVE UPDATE
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-2">
            {update.title}
          </h2>

          <div className="flex items-center gap-3 text-[#8B949E]">
            <span>
              {
                update
                  .startup_metrics
                  ?.startup_name
              }
            </span>

            <span>•</span>

            <span>
              {
                update
                  .startup_metrics
                  ?.industry
              }
            </span>
          </div>
        </div>

        <span className="text-[#8B949E] text-sm">
          {new Date(
            update.created_at
          ).toLocaleDateString()}
        </span>
      </div>

      <p className="text-[#8B949E] text-lg leading-relaxed mb-8">
        {update.content}
      </p>

      <div className="flex items-center gap-4">
        <Link
          href={`/startup/${update.startup_id}`}
        >
          <button className="bg-[#2962FF] hover:bg-[#3B73FF] px-5 py-3 rounded-2xl font-semibold transition">
            View Startup
          </button>
        </Link>

        <button className="bg-[#1E222D] hover:bg-[#252A36] px-5 py-3 rounded-2xl font-semibold transition">
          Track Activity
        </button>
      </div>
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
      <p className="text-sm text-[#8B949E] mb-3">
        {title}
      </p>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>
    </div>
  )
}