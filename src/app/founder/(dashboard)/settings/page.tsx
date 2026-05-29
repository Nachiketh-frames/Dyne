"use client"

export default function SettingsPage() {
  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Founder Settings
        </h1>

        <p className="text-[#8B949E] mt-2">
          Manage startup profile and
          platform preferences
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Startup Profile
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <SettingsInput
                label="Startup Name"
                placeholder="DYNE"
              />

              <SettingsInput
                label="Founder Email"
                placeholder="founder@dyne.com"
              />

              <SettingsInput
                label="Industry"
                placeholder="Fintech"
              />

              <SettingsInput
                label="Funding Stage"
                placeholder="Seed"
              />
            </div>
          </div>

          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Platform Preferences
            </h2>

            <div className="space-y-5">
              <PreferenceRow
                title="Investor Visibility"
              />

              <PreferenceRow
                title="Treasury Notifications"
              />

              <PreferenceRow
                title="Community Access"
              />

              <PreferenceRow
                title="Startup Intelligence Alerts"
              />
            </div>
          </div>
        </div>

        <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
          <h2 className="text-3xl font-bold mb-8">
            Security
          </h2>

          <div className="space-y-4">
            <SecurityButton
              title="Change Password"
            />

            <SecurityButton
              title="Manage Sessions"
            />

            <SecurityButton
              title="Notification Settings"
            />

            <SecurityButton
              title="Privacy Controls"
            />
          </div>

          <div className="mt-10 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
            <p className="text-[#8B949E] leading-relaxed">
              DYNE protects startup
              treasury data, investor
              infrastructure, operational
              intelligence, and founder
              activity systems.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsInput({
  label,
  placeholder,
}: {
  label: string
  placeholder: string
}) {
  return (
    <div>
      <label className="block text-sm text-[#8B949E] mb-2">
        {label}
      </label>

      <input
        type="text"
        placeholder={placeholder}
        className="w-full bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-5 py-4 outline-none focus:border-[#2962FF]"
      />
    </div>
  )
}

function PreferenceRow({
  title,
}: {
  title: string
}) {
  return (
    <div className="flex items-center justify-between bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-5 py-4">
      <span className="text-xl font-medium">
        {title}
      </span>

      <div className="w-12 h-6 bg-[#2962FF] rounded-full flex items-center px-1">
        <div className="w-4 h-4 bg-white rounded-full ml-auto" />
      </div>
    </div>
  )
}

function SecurityButton({
  title,
}: {
  title: string
}) {
  return (
    <button className="w-full bg-[#1A1F2B] hover:bg-[#222938] border border-[#2A2E39] rounded-2xl p-5 text-left transition">
      <h3 className="text-xl font-bold">
        {title}
      </h3>
    </button>
  )
}