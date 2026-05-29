"use client"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import Navbar from "../navbar"
import Sidebar from "../sidebar"

import { supabase } from "../../lib/supabase"

import { useAuth } from "../../context/auth-context"

import InvestorRoute from "../../components/routes/InvestorRoute"

type Notification = {
  id: string

  title: string

  description: string

  type: string

  read: boolean

  created_at: string
}

export default function NotificationsPage() {
  const { user } =
    useAuth()

  const [
    notifications,
    setNotifications,
  ] = useState<
    Notification[]
  >([])

  const [loading,
    setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      if (!user) return

      const {
        data,
        error,
      } = await supabase
        .from(
          "notifications"
        )
        .select("*")
        .eq(
          "user_id",
          user.id
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

      setNotifications(
        data || []
      )

      setLoading(false)
    }

    fetchNotifications()
  }, [user])

  const unreadCount =
    useMemo(() => {
      return notifications.filter(
        (
          notification
        ) =>
          !notification.read
      ).length
    }, [notifications])

  const fundingAlerts =
    useMemo(() => {
      return notifications.filter(
        (
          notification
        ) =>
          notification.type ===
          "funding"
      ).length
    }, [notifications])

  return (
    <InvestorRoute>

      <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">

          <Navbar />

          <section className="flex-1 overflow-y-auto p-8">

            <div className="mb-10">

              <h1 className="text-4xl font-bold">
                Notifications
              </h1>

              <p className="text-[#8B949E] mt-2">
                Real-time ecosystem activity and platform intelligence
              </p>

            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">

              <MetricCard
                title="Total Notifications"
                value={`${notifications.length}`}
              />

              <MetricCard
                title="Unread"
                value={`${unreadCount}`}
              />

              <MetricCard
                title="Funding Alerts"
                value={`${fundingAlerts}`}
              />

              <MetricCard
                title="System Status"
                value="LIVE"
              />

            </div>

            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-3xl font-bold">
                    Activity Stream
                  </h2>

                  <p className="text-[#8B949E] mt-2">
                    Platform notifications and ecosystem events
                  </p>

                </div>

                <span className="text-[#2962FF] text-sm">
                  LIVE
                </span>

              </div>

              {loading ? (
                <div className="py-10 text-center text-[#8B949E]">
                  Loading notifications...
                </div>
              ) : notifications.length ===
                0 ? (
                <div className="py-10 text-center text-[#8B949E]">
                  No notifications yet
                </div>
              ) : (
                <div className="space-y-5">

                  {notifications.map(
                    (
                      notification
                    ) => (
                      <NotificationCard
                        key={
                          notification.id
                        }
                        title={
                          notification.title
                        }
                        description={
                          notification.description
                        }
                        type={
                          notification.type
                        }
                        timestamp={new Date(
                          notification.created_at
                        ).toLocaleString()}
                        unread={
                          !notification.read
                        }
                      />
                    )
                  )}

                </div>
              )}

            </div>

          </section>

        </div>

      </main>

    </InvestorRoute>
  )
}

function MetricCard({
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

function NotificationCard({
  title,
  description,
  type,
  timestamp,
  unread,
}: {
  title: string

  description: string

  type: string

  timestamp: string

  unread: boolean
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6">

      <div className="flex items-start justify-between mb-4">

        <div>

          <div className="flex items-center gap-3 mb-2">

            <h3 className="text-2xl font-bold">
              {title}
            </h3>

            {unread && (
              <div className="w-3 h-3 rounded-full bg-[#2962FF]" />
            )}

          </div>

          <p className="text-[#8B949E] leading-relaxed">
            {description}
          </p>

        </div>

        <div className="text-right">

          <p className="text-[#2962FF] text-sm capitalize mb-2">
            {type}
          </p>

          <p className="text-[#8B949E] text-sm">
            {timestamp}
          </p>

        </div>

      </div>

    </div>
  )
}