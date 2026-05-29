"use client"

import Link from "next/link"

import {
  LayoutDashboard,
  Search,
  Briefcase,
  Activity,
  Users,
  Wallet,
  FileText,
  Settings,
  Bookmark,
  Shield,
} from "lucide-react"

import { useAuth } from "../context/auth-context"

export default function Sidebar() {
  const { user } = useAuth()

  const isAdmin =
    user?.user_metadata?.role ===
    "admin"

  return (
    <aside className="w-72 bg-[#161B26] border-r border-[#2A2E39] p-6 flex flex-col">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          DYNE
        </h1>

        <p className="text-[#8B949E] mt-1">
          Investments
        </p>
      </div>

      <nav className="space-y-2">
        <SidebarItem
          href="/"
          icon={
            <LayoutDashboard
              size={20}
            />
          }
          label="Dashboard"
        />

        <SidebarItem
          href="/discover"
          icon={<Search size={20} />}
          label="Discover Startups"
        />

        <SidebarItem
          href="/watchlist"
          icon={
            <Bookmark size={20} />
          }
          label="Watchlist"
        />

        <SidebarItem
          href="/portfolio"
          icon={
            <Briefcase size={20} />
          }
          label="Portfolio"
        />

        <SidebarItem
          href="/intelligence"
          icon={
            <Activity size={20} />
          }
          label="Intelligence Feed"
        />

        <SidebarItem
          href="/community"
          icon={<Users size={20} />}
          label="Community"
        />

        <SidebarItem
          href="/wallet"
          icon={
            <Wallet size={20} />
          }
          label="Wallet"
        />

        <SidebarItem
          href="/documents"
          icon={
            <FileText size={20} />
          }
          label="Documents"
        />

        {isAdmin && (
          <SidebarItem
            href="/admin/dashboard"
            icon={
              <Shield size={20} />
            }
            label="Admin Panel"
          />
        )}

        <SidebarItem
          href="/settings"
          icon={
            <Settings size={20} />
          }
          label="Settings"
        />
      </nav>
    </aside>
  )
}

function SidebarItem({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-[#1E222D] hover:text-white transition-all cursor-pointer">
        {icon}

        <span className="text-sm font-medium">
          {label}
        </span>
      </div>
    </Link>
  )
}