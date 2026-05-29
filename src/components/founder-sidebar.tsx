"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"

import { supabase } from "../lib/supabase"

const navItems = [
  {
    label: "Overview",
    href: "/founder/dashboard",
  },

  {
    label: "Treasury",
    href: "/founder/treasury",
  },

  {
    label: "Investors",
    href: "/founder/investors",
  },

  {
    label: "Updates",
    href: "/founder/updates",
  },

  {
    label: "Community",
    href: "/founder/community",
  },

  {
    label: "Analytics",
    href: "/founder/analytics",
  },

  {
    label: "Settings",
    href: "/founder/settings",
  },
]

export default function FounderSidebar() {
  const pathname =
    usePathname()

  async function handleLogout() {
    await supabase.auth.signOut()

    window.location.href =
      "/"
  }

  return (
    <aside className="w-[270px] min-h-screen bg-[#11151F] border-r border-[#2A2E39] flex flex-col justify-between p-6">
      <div>
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white">
            DYNE
          </h1>

          <p className="text-[#8B949E] text-sm mt-2">
            Founder Infrastructure
          </p>
        </div>

        <nav className="space-y-3">
          {navItems.map(
            (item) => {
              const isActive =
                pathname ===
                item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-5 py-4 rounded-2xl transition font-medium ${
                    isActive
                      ? "bg-[#2962FF] text-white"
                      : "text-[#8B949E] hover:bg-[#1A1F2B] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            }
          )}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-[#1E222D] hover:bg-[#2A2E39] text-white py-4 rounded-2xl font-semibold transition"
      >
        Logout
      </button>
    </aside>
  )
}