"use client"

export default function AnalyticsPage() {
  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Startup Analytics
        </h1>

        <p className="text-[#8B949E] mt-2">
          Treasury intelligence and growth
          performance monitoring
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Revenue Growth"
          value="+18%"
        />

        <AnalyticsCard
          title="Runway Trend"
          value="24 Months"
        />

        <AnalyticsCard
          title="Investor Activity"
          value="High"
        />

        <AnalyticsCard
          title="Treasury Health"
          value="Stable"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold">
                Growth Intelligence
              </h2>

              <p className="text-[#8B949E] mt-2">
                Startup operational and
                financial trajectory analysis
              </p>
            </div>

            <span className="text-[#2962FF] text-sm">
              LIVE
            </span>
          </div>

          <div className="space-y-5">
            <InsightCard
              title="Revenue trajectory exceeded quarterly expectations"
              description="Startup growth momentum continues strengthening across investor activity and treasury stability."
            />

            <InsightCard
              title="Investor engagement increased by 32%"
              description="Community interaction and treasury update engagement expanded significantly."
            />

            <InsightCard
              title="Operational burn optimization successful"
              description="Treasury efficiency improvements extended runway and reduced exposure risk."
            />
          </div>
        </div>

        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Analytics Overview
          </h2>

          <div className="space-y-6">
            <AnalyticsRow
              label="Growth Momentum"
              value="Strong"
            />

            <AnalyticsRow
              label="Investor Confidence"
              value="High"
            />

            <AnalyticsRow
              label="Treasury Exposure"
              value="Low"
            />

            <AnalyticsRow
              label="Community Activity"
              value="Active"
            />
          </div>

          <div className="mt-10 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
            <p className="text-[#8B949E] leading-relaxed">
              DYNE continuously evaluates
              startup performance, treasury
              resilience, investor sentiment,
              and operational growth signals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsCard({
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

function InsightCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-3">
        {title}
      </h3>

      <p className="text-[#8B949E] leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function AnalyticsRow({
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