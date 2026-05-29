"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import { supabase } from "../../../../lib/supabase"

import { useAuth } from "../../../../context/auth-context"

type Investor = {
  id: string

  amount: number

  created_at: string

  investor_id: string
}

export default function InvestorsPage() {
  const { user } =
    useAuth()

  const [
    investors,
    setInvestors,
  ] = useState<
    Investor[]
  >([])

  const [loading,
    setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchInvestors() {
      if (!user) return

      const {
        data: startup,
      } = await supabase
        .from(
          "startup_metrics"
        )
        .select("id")
        .eq(
          "user_id",
          user.id
        )
        .single()

      if (!startup) {
        setLoading(false)

        return
      }

      const {
        data: investments,
        error,
      } = await supabase
        .from("investments")
        .select("*")
        .eq(
          "startup_id",
          startup.id
        )
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

      setInvestors(
        investments || []
      )

      setLoading(false)
    }

    fetchInvestors()
  }, [user])

  const totalRaised =
    useMemo(() => {
      return investors.reduce(
        (
          sum,
          investor
        ) =>
          sum +
          investor.amount,
        0
      )
    }, [investors])

  const investorCount =
    investors.length

  const averageTicket =
    investorCount > 0
      ? Math.floor(
          totalRaised /
            investorCount
        )
      : 0

  const latestInvestment =
    investors[0]?.amount || 0

  const momentum =
    totalRaised > 500000
      ? "Accelerating"
      : totalRaised >
        100000
      ? "Growing"
      : "Early"

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Investor Relations
        </h1>

        <p className="text-[#8B949E] mt-2">
          Monitor investor activity and
          capital participation
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <InvestorMetricCard
          title="Total Raised"
          value={`₹${totalRaised.toLocaleString()}`}
        />

        <InvestorMetricCard
          title="Active Investors"
          value={`${investorCount}`}
        />

        <InvestorMetricCard
          title="Average Ticket"
          value={`₹${averageTicket.toLocaleString()}`}
        />

        <InvestorMetricCard
          title="Momentum"
          value={momentum}
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                Investor Network
              </h2>

              <p className="text-[#8B949E] mt-2">
                Startup capital participation
                and investor engagement
              </p>
            </div>

            <span className="text-[#2962FF] text-sm">
              LIVE
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center text-[#8B949E]">
              Loading investors...
            </div>
          ) : investors.length ===
            0 ? (
            <div className="py-10 text-center text-[#8B949E]">
              No investors yet
            </div>
          ) : (
            <div className="space-y-5">
              {investors.map(
                (
                  investor
                ) => (
                  <InvestorRow
                    key={
                      investor.id
                    }
                    name={`Investor ${investor.investor_id.slice(
                      0,
                      6
                    )}`}
                    amount={`₹${investor.amount.toLocaleString()}`}
                    date={new Date(
                      investor.created_at
                    ).toLocaleDateString()}
                    status="Active"
                  />
                )
              )}
            </div>
          )}
        </div>

        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Capital Intelligence
          </h2>

          <div className="space-y-5">

            <IntelligenceRow
              label="Latest Investment"
              value={`₹${latestInvestment.toLocaleString()}`}
            />

            <IntelligenceRow
              label="Funding Momentum"
              value={momentum}
            />

            <IntelligenceRow
              label="Investor Count"
              value={`${investorCount}`}
            />

            <IntelligenceRow
              label="Average Allocation"
              value={`₹${averageTicket.toLocaleString()}`}
            />

          </div>

          <div className="mt-10 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
            <p className="text-[#8B949E] leading-relaxed">
              DYNE continuously tracks
              investor participation,
              capital concentration,
              engagement activity, and
              treasury communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InvestorMetricCard({
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

function InvestorRow({
  name,
  amount,
  date,
  status,
}: {
  name: string
  amount: string
  date: string
  status: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6 flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-bold">
          {name}
        </h3>

        <p className="text-[#8B949E] mt-1">
          Invested {date}
        </p>
      </div>

      <div className="text-right">
        <p className="text-2xl font-bold">
          {amount}
        </p>

        <p className="text-[#2962FF] mt-1">
          {status}
        </p>
      </div>
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
      <span className="text-[#8B949E]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>
    </div>
  )
}