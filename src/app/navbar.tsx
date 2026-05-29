"use client"

import { useRouter } from "next/navigation"

import { supabase } from "../lib/supabase"

import { useAuth } from "../context/auth-context"

export default function Navbar() {
  const router = useRouter()

  const { user } = useAuth()

  async function handleLogout() {
    await supabase.auth.signOut()

    router.push("/login")
  }

  return (
    <header className="h-20 border-b border-[#2A2E39] bg-[#161B26] flex items-center justify-between px-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Investor Dashboard
        </h1>

        <p className="text-sm text-[#8B949E] mt-1">
          Welcome back,{" "}
          {user?.user_metadata
            ?.full_name || "Investor"}{" "}
          👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium">
            {user?.email}
          </p>

          <p className="text-xs text-[#8B949E]">
            Verified Investor
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-[#1E222D] hover:bg-[#252A36] border border-[#2A2E39] px-4 py-2 rounded-xl text-sm transition"
        >
          Logout
        </button>

        <div className="w-11 h-11 rounded-full bg-[#2962FF] flex items-center justify-center font-bold">
          {user?.user_metadata?.full_name
            ?.charAt(0)
            ?.toUpperCase() || "D"}
        </div>
      </div>
    </header>
  )
}