"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import Link from "next/link"

import { supabase } from "../../../lib/supabase"

export default function FounderSignupPage() {
  const router = useRouter()

  const [startupName,
    setStartupName] =
    useState("")

  const [founderName,
    setFounderName] =
    useState("")

  const [industry,
    setIndustry] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password,
    setPassword] =
    useState("")

  const [loading,
    setLoading] =
    useState(false)

  const [error,
    setError] =
    useState("")

  async function handleSignup(
    e: React.FormEvent
  ) {
    e.preventDefault()

    setLoading(true)

    setError("")

    const { error } =
      await supabase.auth.signUp({
        email,
        password,

        options: {
          data: {
            full_name:
              founderName,

            startup_name:
              startupName,

            industry,

            role: "founder",
          },
        },
      })

    if (error) {
      setError(error.message)

      setLoading(false)

      return
    }

    router.push(
      "/founder/dashboard"
    )
  }

  return (
    <main className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center p-8">
      <div className="w-full max-w-xl bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold">
            DYNE
          </h1>

          <p className="text-[#8B949E] mt-2">
            Founder Registration Portal
          </p>
        </div>

        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >
          <div>
            <label className="block text-sm text-[#8B949E] mb-2">
              Startup Name
            </label>

            <input
              type="text"
              placeholder="NovaAI"
              value={startupName}
              onChange={(e) =>
                setStartupName(
                  e.target.value
                )
              }
              className="w-full bg-[#11151F] border border-[#2A2E39] rounded-xl px-4 py-3 outline-none focus:border-[#2962FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#8B949E] mb-2">
              Founder Name
            </label>

            <input
              type="text"
              placeholder="Arjun Mehta"
              value={founderName}
              onChange={(e) =>
                setFounderName(
                  e.target.value
                )
              }
              className="w-full bg-[#11151F] border border-[#2A2E39] rounded-xl px-4 py-3 outline-none focus:border-[#2962FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#8B949E] mb-2">
              Industry
            </label>

            <input
              type="text"
              placeholder="FinTech"
              value={industry}
              onChange={(e) =>
                setIndustry(
                  e.target.value
                )
              }
              className="w-full bg-[#11151F] border border-[#2A2E39] rounded-xl px-4 py-3 outline-none focus:border-[#2962FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#8B949E] mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="founder@startup.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full bg-[#11151F] border border-[#2A2E39] rounded-xl px-4 py-3 outline-none focus:border-[#2962FF]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-[#8B949E] mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full bg-[#11151F] border border-[#2A2E39] rounded-xl px-4 py-3 outline-none focus:border-[#2962FF]"
              required
            />
          </div>

          {error && (
            <div className="bg-[#2A1A1A] border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2962FF] hover:bg-[#3B73FF] py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading
              ? "Creating Founder Account..."
              : "Create Founder Account"}
          </button>
        </form>

        <div className="text-center mt-6 space-y-3">
          <p className="text-[#8B949E] text-sm">
            Already have a founder account?
          </p>

          <Link
            href="/founder/login"
            className="inline-block text-[#2962FF] hover:text-[#4B7DFF] transition font-semibold"
          >
            Login As Founder
          </Link>

          <p className="text-[#8B949E] text-sm pt-2">
            Startup treasury and
            investor infrastructure
            powered by DYNE
          </p>
        </div>
      </div>
    </main>
  )
}