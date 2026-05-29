"use client"

import {
  useEffect,
  useState,
} from "react"

import { useRouter } from "next/navigation"

import { supabase } from "../../../lib/supabase"

import { useAuth } from "../../../context/auth-context"

type StartupSubmission = {
  id: string

  startup_name: string

  monthly_revenue: number

  monthly_expenses: number

  cash_balance: number

  total_debt: number

  monthly_growth: number

  active_customers: number

  status: string

  created_at?: string

  rejection_reason?: string

  industry?: string

  funding_stage?: string
}

export default function AdminDashboardPage() {
  const { user } = useAuth()

  const router = useRouter()

  const [loading,
    setLoading] =
    useState(true)

  const [submissions,
    setSubmissions] =
    useState<
      StartupSubmission[]
    >([])

    const [
      rejectionReasons,
      setRejectionReasons,
    ] = useState<
      Record<string, string>
    >({})

  useEffect(() => {
    if (!user) return

    const role =
      user.user_metadata?.role

    if (role !== "admin") {
      if (role === "founder") {
        router.push(
          "/founder/dashboard"
        )
      } else {
        router.push(
          "/dashboard"
        )
      }

      return
    }

    fetchStartups()
  }, [user, router])

  async function fetchStartups() {
    const { data, error } =
      await supabase
        .from("startup_metrics")
        .select("*")
        .eq("status", "pending")
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

    setSubmissions(data || [])

    setLoading(false)
  }

  async function updateStatus(
    id: string,
    status: string
  ) {
    if (
      status === "rejected" &&
      !rejectionReasons[id]
    ) {
      alert(
        "Please provide a rejection reason."
      )
  
      return
    }
  
    const updates: {
      status: string
  
      rejection_reason?: string | null
    } = {
      status,
    }
  
    if (
      status === "rejected"
    ) {
      updates.rejection_reason =
        rejectionReasons[id]
    }
  
    if (
      status === "approved"
    ) {
      updates.rejection_reason =
        null
    }
  
    const { error } =
      await supabase
        .from(
          "startup_metrics"
        )
        .update(updates)
        .eq("id", id)
  
    if (error) {
      console.error(error)
  
      return
    }
  
    fetchStartups()
  }

  async function handleLogout() {
    await supabase.auth.signOut()

    router.push("/")
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center">
        Loading Admin Dashboard...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0D1117] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold">
              DYNE Admin Dashboard
            </h1>

            <p className="text-[#8B949E] mt-2">
              Startup moderation and
              approval infrastructure
            </p>

            <p className="text-sm text-[#2962FF] mt-4">
              Signed in as:
              {" "}
              {user?.email}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-[#1E222D] hover:bg-[#2A2E39] px-5 py-3 rounded-xl font-semibold transition"
          >
            Logout
          </button>
        </div>

        {submissions.length ===
        0 ? (
          <div className="bg-[#161B26] border border-[#2A2E39] rounded-2xl p-6 text-[#8B949E]">
            No startup submissions
            yet.
          </div>
        ) : (
          <div className="space-y-6">
            {submissions.map(
              (startup) => {
                const burnRate =
                  startup.monthly_expenses -
                  startup.monthly_revenue

                const runway =
                  burnRate > 0
                    ? Math.floor(
                        startup.cash_balance /
                          burnRate
                      )
                    : null

                return (
                  <div
                    key={startup.id}
                    className="bg-[#161B26] border border-[#2A2E39] rounded-2xl p-8"
                  >
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <h2 className="text-3xl font-bold">
                          {
                            startup.startup_name
                          }
                        </h2>

                        <p className="text-[#8B949E] text-sm mt-2">
                           Submitted{" "}
                             {startup.created_at
                               ? new Date(
                                startup.created_at
                            ).toLocaleDateString()
                             : "Unknown"}
                            </p>
                      </div>

                      <div className="mb-6">
  <label className="block text-sm text-[#8B949E] mb-2">
    Rejection Reason
  </label>

  <textarea
    value={
      rejectionReasons[
        startup.id
      ] || ""
    }
    onChange={(e) =>
      setRejectionReasons({
        ...rejectionReasons,

        [startup.id]:
          e.target.value,
      })
    }
    placeholder="Explain why this startup was rejected..."
    className="w-full h-28 bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-5 py-4 outline-none focus:border-red-500 resize-none"
  />
</div>

                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            updateStatus(
                              startup.id,
                              "approved"
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              startup.id,
                              "rejected"
                            )
                          }
                          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-5">
                      <AdminMetricCard
                        title="Revenue"
                        value={`₹${startup.monthly_revenue.toLocaleString()}`}
                      />

                      <AdminMetricCard
                        title="Expenses"
                        value={`₹${startup.monthly_expenses.toLocaleString()}`}
                      />

                      <AdminMetricCard
                        title="Cash Reserve"
                        value={`₹${startup.cash_balance.toLocaleString()}`}
                      />

                      <AdminMetricCard
                        title="Debt"
                        value={`₹${startup.total_debt.toLocaleString()}`}
                      />

                      <AdminMetricCard
                        title="Growth"
                        value={`${startup.monthly_growth}%`}
                      />

                      <AdminMetricCard
                        title="Customers"
                        value={`${startup.active_customers}`}
                      />

                      <AdminMetricCard
                        title="Burn Rate"
                        value={`₹${Math.max(
                          burnRate,
                          0
                        ).toLocaleString()}`}
                      />

                      <AdminMetricCard
                        title="Runway"
                        value={
                          runway
                            ? `${runway} Months`
                            : "Profitable"
                        }
                      />
                    </div>
                  </div>
                )
              }
            )}
          </div>
        )}
      </div>
    </main>
  )
}

function AdminMetricCard({
  title,
  value,
}: {
  title: string

  value: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
      <p className="text-sm text-[#8B949E] mb-3">
        {title}
      </p>

      <h3 className="text-2xl font-bold">
        {value}
      </h3>
    </div>
  )
}