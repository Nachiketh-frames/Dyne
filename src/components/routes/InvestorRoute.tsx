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

export default function InvestorRoute({
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

    if (
      role !== "investor" &&
      role !== "admin"
    ) {
      router.push(
        "/founder/dashboard"
      )
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
    (
      role !== "investor" &&
      role !== "admin"
    )
  ) {
    return null
  }

  return children
}