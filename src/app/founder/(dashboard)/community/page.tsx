"use client"

import {
  useEffect,
  useState,
} from "react"

import { supabase }
from "../../../../lib/supabase"

import { useAuth }
from "../../../../context/auth-context"

type CommunityPost = {
  id: string

  title: string

  content: string

  role: string

  created_at: string
}

export default function FounderCommunityPage() {
  const { user } =
    useAuth()

  const [posts,
    setPosts] =
    useState<
      CommunityPost[]
    >([])

  const [title,
    setTitle] =
    useState("")

  const [content,
    setContent] =
    useState("")

  const [publishing,
    setPublishing] =
    useState(false)

  const [loading,
    setLoading] =
    useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } =
        await supabase
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

      setPosts(data || [])

      setLoading(false)
    }

    fetchPosts()
  }, [])

  async function publishPost() {
    if (
      !user ||
      !title ||
      !content
    )
      return

    setPublishing(true)

    const { data, error } =
      await supabase
        .from(
          "community_posts"
        )
        .insert({
          user_id:
            user.id,

          title,

          content,

          role: "Founder",
        })
        .select()
        .single()

    if (error) {
      console.error(error)

      setPublishing(false)

      return
    }

    setPosts((prev) => [
      data,
      ...prev,
    ])

    setTitle("")
    setContent("")

    setPublishing(false)
  }

  return (
    <div className="text-white">
      <div className="mb-10">
        <h1 className="text-5xl font-bold mb-3">
          Founder Community
        </h1>

        <p className="text-[#8B949E] text-lg">
          Engage with investors,
          founders, and ecosystem intelligence
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Community Posts"
          value={`${posts.length}`}
        />

        <MetricCard
          title="Founder Presence"
          value="Active"
        />

        <MetricCard
          title="Investor Discussions"
          value="Live"
        />

        <MetricCard
          title="Ecosystem Signal"
          value="High"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8 mb-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-3">
                Start Founder Discussion
              </h2>

              <p className="text-[#8B949E]">
                Share fundraising insights,
                treasury learnings,
                operational strategies,
                and startup intelligence
              </p>
            </div>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder="Discussion title..."
              className="w-full bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5 outline-none focus:border-[#2962FF] text-white mb-5"
            />

            <textarea
              value={content}
              onChange={(e) =>
                setContent(
                  e.target.value
                )
              }
              placeholder="Share insights with the ecosystem..."
              className="w-full h-[220px] bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5 outline-none resize-none focus:border-[#2962FF] text-white"
            />

            <div className="mt-6">
              <button
                onClick={
                  publishPost
                }
                disabled={
                  publishing
                }
                className="bg-[#2962FF] hover:bg-[#3B73FF] px-6 py-3 rounded-2xl font-semibold transition"
              >
                {publishing
                  ? "Publishing..."
                  : "Publish Discussion"}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-20 text-[#8B949E]">
                Loading Discussions...
              </div>
            ) : posts.length ===
              0 ? (
              <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-10 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  No discussions yet
                </h2>

                <p className="text-[#8B949E]">
                  Founder discussions will appear here
                </p>
              </div>
            ) : (
              posts.map(
                (post) => (
                  <DiscussionCard
                    key={post.id}
                    post={post}
                  />
                )
              )
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Founder Intelligence
            </h2>

            <div className="space-y-6">
              <CommunityRow
                label="Founder Activity"
                value="High"
              />

              <CommunityRow
                label="Investor Presence"
                value="Growing"
              />

              <CommunityRow
                label="Treasury Discussions"
                value="Active"
              />

              <CommunityRow
                label="Signal Quality"
                value="High"
              />
            </div>

            <div className="mt-10 bg-[#0D1117] border border-[#2A2E39] rounded-2xl p-5">
              <p className="text-[#8B949E] leading-relaxed">
                DYNE enables founders
                to exchange operational
                intelligence, treasury
                strategies, fundraising
                insights, and investor-facing
                discussions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DiscussionCard({
  post,
}: {
  post: CommunityPost
}) {
  return (
    <div className="bg-[#161B26] border border-[#2A2E39] rounded-3xl p-8">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 rounded-full bg-[#2962FF]" />

            <span className="text-[#2962FF] text-sm">
              {post.role}
            </span>
          </div>

          <h2 className="text-3xl font-bold">
            {post.title}
          </h2>
        </div>

        <span className="text-[#8B949E] text-sm">
          {new Date(
            post.created_at
          ).toLocaleDateString()}
        </span>
      </div>

      <p className="text-[#8B949E] text-lg leading-relaxed">
        {post.content}
      </p>
    </div>
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

function CommunityRow({
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