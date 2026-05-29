"use client"

import {
  useState,
} from "react"

import Sidebar from "../sidebar"
import Navbar from "../navbar"

import {
  useAuth,
} from "../../context/auth-context"

import InvestorRoute from "../../components/routes/InvestorRoute"

export default function SettingsPage() {
  const { user } =
    useAuth()

  const [
    notificationsEnabled,
    setNotificationsEnabled,
  ] = useState(true)

  const [
    darkMode,
    setDarkMode,
  ] = useState(true)

  return (
    <InvestorRoute>

      <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">

          <Navbar />

          <section className="flex-1 overflow-y-auto p-8">

            <div className="mb-10">

              <h1 className="text-4xl font-bold">
                Settings
              </h1>

              <p className="text-[#8B949E] mt-2">
                Manage your account preferences and platform configuration
              </p>

            </div>

            <div className="grid grid-cols-3 gap-6">

              <div className="col-span-2 space-y-6">

                <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">

                  <h2 className="text-3xl font-bold mb-8">
                    Account Information
                  </h2>

                  <div className="space-y-6">

                    <SettingsRow
                      label="Email"
                      value={
                        user?.email ||
                        "Unavailable"
                      }
                    />

                    <SettingsRow
                      label="Role"
                      value="Investor"
                    />

                    <SettingsRow
                      label="Account Status"
                      value="Active"
                    />

                  </div>

                </div>

                <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">

                  <h2 className="text-3xl font-bold mb-8">
                    Platform Preferences
                  </h2>

                  <div className="space-y-6">

                    <ToggleRow
                      title="Notifications"
                      description="Receive investment and ecosystem alerts"
                      enabled={
                        notificationsEnabled
                      }
                      onToggle={() =>
                        setNotificationsEnabled(
                          !notificationsEnabled
                        )
                      }
                    />

                    <ToggleRow
                      title="Dark Mode"
                      description="Enable immersive dark interface"
                      enabled={
                        darkMode
                      }
                      onToggle={() =>
                        setDarkMode(
                          !darkMode
                        )
                      }
                    />

                  </div>

                </div>

              </div>

              <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8 h-fit">

                <h2 className="text-3xl font-bold mb-8">
                  Platform Status
                </h2>

                <div className="space-y-5">

                  <StatusCard
                    title="Investor Access"
                    value="ENABLED"
                  />

                  <StatusCard
                    title="Treasury Systems"
                    value="LIVE"
                  />

                  <StatusCard
                    title="Notification Engine"
                    value="ACTIVE"
                  />

                  <StatusCard
                    title="Ecosystem Access"
                    value="AUTHORIZED"
                  />

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </InvestorRoute>
  )
}

function SettingsRow({
  label,
  value,
}: {
  label: string

  value: string
}) {
  return (
    <div className="flex items-center justify-between bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-5 py-4">

      <span className="text-[#8B949E]">
        {label}
      </span>

      <span className="font-semibold">
        {value}
      </span>

    </div>
  )
}

function ToggleRow({
  title,
  description,
  enabled,
  onToggle,
}: {
  title: string

  description: string

  enabled: boolean

  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between bg-[#0D1117] border border-[#2A2E39] rounded-2xl px-5 py-5">

      <div>

        <h3 className="text-xl font-bold">
          {title}
        </h3>

        <p className="text-[#8B949E] mt-1">
          {description}
        </p>

      </div>

      <button
        onClick={onToggle}
        className={`w-16 h-8 rounded-full transition flex items-center px-1 ${
          enabled
            ? "bg-[#2962FF]"
            : "bg-[#2A2E39]"
        }`}
      >

        <div
          className={`w-6 h-6 rounded-full bg-white transition ${
            enabled
              ? "translate-x-8"
              : ""
          }`}
        />

      </button>

    </div>
  )
}

function StatusCard({
  title,
  value,
}: {
  title: string

  value: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">

      <p className="text-[#8B949E] text-sm mb-2">
        {title}
      </p>

      <h3 className="text-xl font-bold text-[#2962FF]">
        {value}
      </h3>

    </div>
  )
}