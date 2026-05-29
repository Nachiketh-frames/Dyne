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

import { startups } from "../../data/startups"

type Investment = {
  id: number
  startup_slug: string
  amount: number
}

export default function DocumentsPage() {
  const { user } = useAuth()

  const [investments, setInvestments] =
    useState<Investment[]>([])

  useEffect(() => {
    async function fetchInvestments() {
      if (!user) return

      const { data, error } =
        await supabase
          .from("investments")
          .select("*")
          .eq("user_id", user.id)

      if (error) {
        console.error(error)
        return
      }

      setInvestments(data)
    }

    fetchInvestments()
  }, [user])

  const investedStartups =
    useMemo(() => {
      const grouped =
        investments.reduce(
          (
            acc,
            investment
          ) => {
            if (
              !acc[
                investment
                  .startup_slug
              ]
            ) {
              acc[
                investment
                  .startup_slug
              ] = 0
            }

            acc[
              investment
                .startup_slug
            ] += investment.amount

            return acc
          },
          {} as Record<
            string,
            number
          >
        )

      return Object.entries(
        grouped
      )
        .map(
          ([slug]) => {
            const startup =
              startups.find(
                (s) =>
                  s.slug === slug
              )

            return {
              slug,
              startup,
            }
          }
        )
        .filter(
          (item) =>
            item.startup
        )
    }, [investments])

  return (
    <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <section className="p-8 overflow-y-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Documents
            </h1>

            <p className="text-[#8B949E]">
              Secure investor
              agreements, escrow
              records, and startup
              diligence files
            </p>
          </div>

          {investments.length ===
          0 ? (
            <div className="bg-[#161B26] border border-[#2A2E39] rounded-2xl p-10 text-center text-[#8B949E]">
              Invest in startups
              to unlock protected
              investment documents
            </div>
          ) : (
            <div className="space-y-6">
              {investedStartups.map(
                (
                  item,
                  index
                ) => {
                  const startup =
                    item.startup!

                  return (
                    <div
                      key={index}
                      className="bg-[#161B26] border border-[#2A2E39] rounded-2xl p-6"
                    >
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h2 className="text-3xl font-bold">
                            {
                              startup.name
                            }
                          </h2>

                          <p className="text-[#8B949E] mt-2">
                            Protected
                            investor
                            documentation
                            center
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-[#8B949E]">
                            Verification
                            Status
                          </p>

                          <h3 className="text-2xl font-bold text-[#2962FF]">
                            Verified
                          </h3>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <DocumentCard
                          title="SAFE Agreement"
                          description={`Protected SAFE investment agreement for ${startup.name}.`}
                          status="SIGNED"
                        />

                        <DocumentCard
                          title="Escrow Contract"
                          description="Escrow protection agreement and milestone release structure."
                          status="VERIFIED"
                        />

                        <DocumentCard
                          title="Due Diligence Report"
                          description={`${startup.name} operational and treasury diligence verification.`}
                          status="SECURED"
                        />

                        <DocumentCard
                          title="Investor Rights"
                          description="Investor participation rights and equity allocation agreement."
                          status="ACTIVE"
                        />
                      </div>

                      <div className="mt-6 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                          <h3 className="text-xl font-semibold">
                            Document
                            Activity
                          </h3>

                          <span className="text-xs text-[#2962FF]">
                            LIVE
                          </span>
                        </div>

                        <div className="space-y-4">
                          <ActivityItem
                            text={`${startup.name} escrow agreement verified successfully.`}
                          />

                          <ActivityItem
                            text="Investor agreement protected and encrypted."
                          />

                          <ActivityItem
                            text="Treasury allocation disclosures updated."
                          />

                          <ActivityItem
                            text="Due diligence systems remain active."
                          />
                        </div>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function DocumentCard({
  title,
  description,
  status,
}: {
  title: string
  description: string
  status: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold">
          {title}
        </h2>

        <span className="text-[10px] text-[#2962FF] font-semibold">
          {status}
        </span>
      </div>

      <p className="text-sm text-[#8B949E] leading-relaxed mb-6">
        {description}
      </p>

      <div className="flex gap-3">
        <button className="flex-1 bg-[#2962FF] hover:bg-[#3B73FF] transition py-2 rounded-xl text-sm font-semibold">
          Preview
        </button>

        <button className="flex-1 bg-[#1E222D] hover:bg-[#2A2E39] transition py-2 rounded-xl text-sm font-semibold">
          Download
        </button>
      </div>
    </div>
  )
}

function ActivityItem({
  text,
}: {
  text: string
}) {
  return (
    <div className="p-4 rounded-xl bg-[#11151F] border border-[#2A2E39]">
      <p className="text-sm text-[#8B949E] leading-relaxed">
        {text}
      </p>
    </div>
  )
}