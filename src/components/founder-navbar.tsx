"use client"

import { useRouter }
from "next/navigation"

import { supabase }
from "../lib/supabase"

import { useAuth }
from "../context/auth-context"

export default function FounderNavbar() {
  const { user } =
    useAuth()

  const router =
    useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()

    router.push(
      "/founder/login"
    )
  }

  return (
    <header className="h-24 border-b border-[#2A2E39] bg-[#161B26] px-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Founder Dashboard
        </h1>

        <p className="text-[#8B949E] mt-1">
          Welcome back,
          {
            user?.email?.split(
              "@"
            )[0]
          }
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-white font-semibold">
            {user?.email}
          </p>

          <p className="text-[#8B949E] text-sm">
            Verified Founder
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#1E222D] hover:bg-[#252A36] px-5 py-3 rounded-xl text-white font-medium transition"
        >
          Logout
        </button>
      </div>
    </header>
  )
}