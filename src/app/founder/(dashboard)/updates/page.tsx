"use client"

import {
  useEffect,
  useState,
} from "react"

import { supabase }
from "../../../../lib/supabase"

import { useAuth }
from "../../../../context/auth-context"

type FounderUpdate = {
  id: string

  title: string

  content: string

  created_at: string
}

type StartupMetrics = {
  id: string

  startup_name: string
}

export default function UpdatesPage() {
  const { user } =
    useAuth()

  const [startup,
    setStartup] =
    useState<StartupMetrics | null>(
      null
    )

  const [updates,
    setUpdates] =
    useState<FounderUpdate[]>(
      []
    )

  const [title,
    setTitle] =
    useState("")

  const [content,
    setContent] =
    useState("")

  const [loading,
    setLoading] =
    useState(true)

  const [publishing,
    setPublishing] =
    useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!user) return

      const {
        data: startupData,
      } = await supabase
        .from(
          "startup_metrics"
        )
        .select(
          "id, startup_name"
        )
        .eq(
          "user_id",
          user.id
        )
        .single()

      if (!startupData) {
        setLoading(false)

        return
      }

      setStartup(startupData)

      const {
        data: updatesData,
      } = await supabase
        .from(
          "founder_updates"
        )
        .select("*")
        .eq(
          "startup_id",
          startupData.id
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

      setLoading(false)
    }

    fetchData()
  }, [user])

  async function publishUpdate() {
    if (
      !user ||
      !startup ||
      !title ||
      !content
    )
      return

    setPublishing(true)

    const { data, error } =
      await supabase
        .from(
          "founder_updates"
        )
        .insert({
          startup_id:
            startup.id,

          user_id:
            user.id,

          title,

          content,
        })
        .select()
        .single()

    if (error) {
      console.error(error)

      setPublishing(false)

      return
    }

    setUpdates((prev) => [
      data,
      ...prev,
    ])

    setTitle("")
    setContent("")

    setPublishing(false)
  }

  if (
    loading ||
    !startup
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Updates...
      </div>
    )
  }

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Startup Updates
        </h1>

        <p className="text-[#8B949E] mt-2">
          Publish startup intelligence and
          investor-facing announcements
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <UpdateMetricCard
          title="Updates Posted"
          value={`${updates.length}`}
        />

        <UpdateMetricCard
          title="Startup"
          value={
            startup.startup_name
          }
        />

        <UpdateMetricCard
          title="Activity Status"
          value="Active"
        />

        <UpdateMetricCard
          title="Investor Visibility"
          value="Public"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3">
              Publish Update
            </h2>

            <p className="text-[#8B949E]">
              Share startup progress,
              milestones, treasury updates,
              and investor announcements
            </p>
          </div>

          <input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Update title..."
            className="w-full bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5 outline-none focus:border-[#2962FF] text-white mb-5"
          />

          <textarea
            value={content}
            onChange={(e) =>
              setContent(
                e.target.value
              )
            }
            placeholder="Share startup progress with investors..."
            className="w-full h-[220px] bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5 outline-none resize-none focus:border-[#2962FF] text-white"
          />

          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={
                publishUpdate
              }
              disabled={
                publishing
              }
              className="bg-[#2962FF] hover:bg-[#3B73FF] px-6 py-3 rounded-2xl font-semibold transition"
            >
              {publishing
                ? "Publishing..."
                : "Publish Update"}
            </button>
          </div>

          <div className="mt-10">
            <h2 className="text-3xl font-bold mb-6">
              Recent Updates
            </h2>

            <div className="space-y-5">
              {updates.length ===
              0 ? (
                <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-8 text-center">
                  <p className="text-[#8B949E]">
                    No updates published yet
                  </p>
                </div>
              ) : (
                updates.map(
                  (
                    update
                  ) => (
                    <UpdateRow
                      key={
                        update.id
                      }
                      title={
                        update.title
                      }
                      description={
                        update.content
                      }
                      time={new Date(
                        update.created_at
                      ).toLocaleDateString()}
                    />
                  )
                )
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Update Intelligence
          </h2>

          <div className="space-y-6">
            <IntelligenceRow
              label="Community Activity"
              value={
                updates.length > 5
                  ? "High"
                  : "Moderate"
              }
            />

            <IntelligenceRow
              label="Startup Momentum"
              value={
                updates.length > 0
                  ? "Active"
                  : "Low"
              }
            />

            <IntelligenceRow
              label="Investor Visibility"
              value="Public"
            />

            <IntelligenceRow
              label="Update Volume"
              value={`${updates.length}`}
            />
          </div>

          <div className="mt-10 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
            <p className="text-[#8B949E] leading-relaxed">
              DYNE continuously monitors
              startup communication,
              investor engagement,
              operational momentum, and
              founder transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function UpdateMetricCard({
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

      <h2 className="text-2xl font-bold">
        {value}
      </h2>
    </div>
  )
}

function UpdateRow({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-2xl font-bold max-w-xl">
          {title}
        </h3>

        <span className="text-[#8B949E] text-sm">
          {time}
        </span>
      </div>

      <p className="text-[#8B949E] leading-relaxed">
        {description}
      </p>
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