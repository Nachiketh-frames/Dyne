"use client"

import {
  useEffect,
  useState,
} from "react"

import Link from "next/link"

import {
  useRouter,
} from "next/navigation"

import Sidebar from "../sidebar"
import Navbar from "../navbar"

import {
  supabase,
} from "../../lib/supabase"

import {
  useAuth,
} from "../../context/auth-context"

import InvestorRoute from "../../components/routes/InvestorRoute"

type Startup = {
  id: string

  startup_name: string

  tagline: string

  industry: string

  funding_stage: string

  monthly_growth: number

  valuation: number

  logo_url: string | null
}

export default function DiscoverPage() {
  const {
    user,
    loading,
  } = useAuth()

  const router =
    useRouter()

  const [
    startups,
    setStartups,
  ] = useState<
    Startup[]
  >([])

  const [
    loadingStartups,
    setLoadingStartups,
  ] = useState(true)

  useEffect(() => {
    async function fetchStartups() {

      const {
        data,
        error,
      } = await supabase
        .from(
          "startup_metrics"
        )
        .select("*")
        .eq(
          "status",
          "approved"
        )

      if (error) {
        console.error(error)

        setLoadingStartups(
          false
        )

        return
      }

      setStartups(
        data || []
      )

      setLoadingStartups(
        false
      )
    }

    fetchStartups()
  }, [])

  if (
    loading ||
    !user
  ) {
    return null
  }

  return (
    <InvestorRoute>

      <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">

          <Navbar />

          <section className="flex-1 overflow-y-auto p-8">

            <div className="mb-10">
              <h1 className="text-4xl font-bold">
                Discover Startups
              </h1>

              <p className="text-[#8B949E] mt-2">
                Explore high-growth startups and investment opportunities
              </p>
            </div>

            {loadingStartups ? (
              <div className="text-[#8B949E]">
                Loading startups...
              </div>
            ) : startups.length ===
              0 ? (
              <div className="text-[#8B949E]">
                No approved startups found
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">

                {startups.map(
                  (
                    startup
                  ) => (
                    <div
                      key={
                        startup.id
                      }
                      className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-6"
                    >

                      <div className="flex items-center justify-between mb-6">

                        <div>
                          <p className="text-[#2962FF] text-sm mb-2">
                            {
                              startup.industry
                            }
                          </p>

                          <h2 className="text-2xl font-bold">
                            {
                              startup.startup_name
                            }
                          </h2>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-[#8B949E]">
                            Growth
                          </p>

                          <h3 className="text-green-400 text-2xl font-bold">
                            +
                            {
                              startup.monthly_growth
                            }
                            %
                          </h3>
                        </div>

                      </div>

                      <p className="text-[#8B949E] leading-relaxed mb-6">
                        {
                          startup.tagline
                        }
                      </p>

                      <div className="space-y-4 mb-6">

                        <InfoRow
                          label="Funding Stage"
                          value={
                            startup.funding_stage
                          }
                        />

                        <InfoRow
                          label="Valuation"
                          value={`₹${(
                            startup.valuation || 0
                          ).toLocaleString()}`}
                        />

                      </div>

                      <Link
                        href={`/startup/${startup.id}`}
                      >
                        <button className="w-full bg-[#2962FF] hover:bg-[#3B73FF] rounded-2xl py-4 font-semibold transition">

                          View Startup

                        </button>
                      </Link>

                    </div>
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

function InfoRow({
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