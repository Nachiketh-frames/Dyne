"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { supabase } from "../lib/supabase"

import { useAuth } from "./auth-context"

type WatchlistContextType = {
  watchlist: string[]

  toggleWatchlist: (
    startupId: string
  ) => Promise<void>

  removeFromWatchlist: (
    startupId: string
  ) => Promise<void>
}

const WatchlistContext =
  createContext<WatchlistContextType | null>(
    null
  )

export function WatchlistProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [watchlist, setWatchlist] =
    useState<string[]>([])

  const { user } = useAuth()

  useEffect(() => {
    async function fetchWatchlist() {
      if (!user) {
        setWatchlist([])

        return
      }

      const { data, error } =
        await supabase
          .from("watchlists")
          .select("startup_id")
          .eq("user_id", user.id)

      if (error) {
        alert(error.message)

        console.error(error)

        return
      }

      const startupIds =
        data.map(
          (item) =>
            item.startup_id
        )

      setWatchlist(startupIds)
    }

    fetchWatchlist()
  }, [user])

  async function toggleWatchlist(
    startupId: string
  ) {
    if (!user) return

    const exists =
      watchlist.includes(
        startupId
      )

    if (exists) {
      await removeFromWatchlist(
        startupId
      )

      return
    }

    const { error } =
      await supabase
        .from("watchlists")
        .insert([
          {
            user_id:
              user.id,

            startup_id:
              startupId,
          },
        ])

    if (error) {
      console.error(error)

      return
    }

    setWatchlist((prev) => [
      ...prev,
      startupId,
    ])
  }

  async function removeFromWatchlist(
    startupId: string
  ) {
    if (!user) return

    const { error } =
      await supabase
        .from("watchlists")
        .delete()
        .eq(
          "user_id",
          user.id
        )
        .eq(
          "startup_id",
          startupId
        )

    if (error) {
      console.error(error)

      return
    }

    setWatchlist((prev) =>
      prev.filter(
        (item) =>
          item !== startupId
      )
    )
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        toggleWatchlist,
        removeFromWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  )
}

export function useWatchlist() {
  const context =
    useContext(
      WatchlistContext
    )

  if (!context) {
    throw new Error(
      "useWatchlist must be used inside WatchlistProvider"
    )
  }

  return context
}