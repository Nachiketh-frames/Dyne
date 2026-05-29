"use client"

import {
  useEffect,
  useState,
} from "react"

import Sidebar from "../sidebar"
import Navbar from "../navbar"

import { supabase }
from "../../lib/supabase"

import { useAuth }
from "../../context/auth-context"

import InvestorRoute from "../../components/routes/InvestorRoute"

type CommunityPost = {
  id: string

  title: string

  content: string

  created_at: string

  startup_name?: string
}

export default function CommunityPage() {
  const { user } =
    useAuth()

  const [posts,
    setPosts] =
    useState<
      CommunityPost[]
    >([])

  const [loading,
    setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchPosts() {

      const {
        data,
        error,
      } = await supabase
        .from(
          "community_posts"
        )
        .select("*")
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

      setPosts(
        data || []
      )

      setLoading(false)
    }

    fetchPosts()
  }, [])

  return (
    <InvestorRoute>

      <main className="flex h-screen bg-[#0D1117] text-white overflow-hidden">

        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">

          <Navbar />

          <section className="flex-1 overflow-y-auto p-8">

            <div className="mb-10">

              <h1 className="text-4xl font-bold">
                Community
              </h1>

              <p className="text-[#8B949E] mt-2">
                Founder updates, investor discussions, and ecosystem intelligence
              </p>

            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">

              <CommunityMetricCard
                title="Total Posts"
                value={`${posts.length}`}
              />

              <CommunityMetricCard
                title="Active Discussions"
                value={`${posts.length}`}
              />

              <CommunityMetricCard
                title="Ecosystem Status"
                value="LIVE"
              />

              <CommunityMetricCard
                title="Engagement"
                value="HIGH"
              />

            </div>

            <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-3xl font-bold">
                    Discussion Feed
                  </h2>

                  <p className="text-[#8B949E] mt-2">
                    Real-time founder and investor ecosystem activity
                  </p>

                </div>

                <span className="text-[#2962FF] text-sm">
                  LIVE
                </span>

              </div>

              {loading ? (
                <div className="py-10 text-center text-[#8B949E]">
                  Loading discussions...
                </div>
              ) : posts.length ===
                0 ? (
                <div className="py-10 text-center text-[#8B949E]">
                  No community posts yet
                </div>
              ) : (
                <div className="space-y-5">

                  {posts.map(
                    (
                      post
                    ) => (
                      <CommunityPostCard
                        key={
                          post.id
                        }
                        title={
                          post.title
                        }
                        content={
                          post.content
                        }
                        timestamp={new Date(
                          post.created_at
                        ).toLocaleString()}
                        startupName={
                          post.startup_name
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

function CommunityMetricCard({
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

function CommunityPostCard({
  title,
  content,
  timestamp,
  startupName,
}: {
  title: string

  content: string

  timestamp: string

  startupName?: string
}) {
  return (
    <div className="bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-6">

      <div className="flex items-center justify-between mb-4">

        <div>

          <h3 className="text-2xl font-bold">
            {title}
          </h3>

          {startupName && (
            <p className="text-[#2962FF] mt-1">
              {startupName}
            </p>
          )}

        </div>

        <p className="text-[#8B949E] text-sm">
          {timestamp}
        </p>

      </div>

      <p className="text-[#8B949E] leading-relaxed">
        {content}
      </p>

    </div>
  )
}