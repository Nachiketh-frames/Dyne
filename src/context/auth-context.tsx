"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { User } from "@supabase/supabase-js"

import { supabase } from "../lib/supabase"

type Role =
  | "founder"
  | "investor"
  | "admin"
  | null

type AuthContextType = {
  user: User | null

  role: Role

  loading: boolean
}

const AuthContext =
  createContext<AuthContextType>(
    {
      user: null,

      role: null,

      loading: true,
    }
  )

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] =
    useState<User | null>(
      null
    )

  const [role, setRole] =
    useState<Role>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } =
        await supabase.auth.getSession()

      const currentUser =
        session?.user ?? null

      console.log(
        "GET SESSION USER METADATA",
        currentUser?.user_metadata
      )

      setUser(currentUser)

      const currentRole =
        currentUser
          ?.user_metadata
          ?.role || null

      console.log(
        "GET SESSION ROLE",
        currentRole
      )

      setRole(currentRole)

      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          const currentUser =
            session?.user ??
            null

          console.log(
            "USER METADATA",
            currentUser?.user_metadata
          )

          setUser(
            currentUser
          )

          const currentRole =
            currentUser
              ?.user_metadata
              ?.role || null

          console.log(
            "AUTH STATE ROLE",
            currentRole
          )

          setRole(
            currentRole
          )
        }
      )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,

        role,

        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(
    AuthContext
  )
}