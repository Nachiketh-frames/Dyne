"use client"

import {
  useEffect,
} from "react"

import {
  useRouter,
} from "next/navigation"

import {
  useAuth,
} from "../../context/auth-context"

export default function FounderRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const {
    user,
    role,
    loading,
  } = useAuth()

  const router =
    useRouter()

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.push("/login")
      return
    }

    if (role !== "founder") {
      router.push("/discover")
    }
  }, [
    user,
    role,
    loading,
    router,
  ])

  if (
    loading ||
    !user ||
    role !== "founder"
  ) {
    return null
  }

  return children
}