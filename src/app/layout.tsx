import "./globals.css"

import { Inter } from "next/font/google"

import { WatchlistProvider } from "../context/watchlist-context"

import { AuthProvider } from "../context/auth-context"

const inter = Inter({
  subsets: ["latin"],
})

export const metadata = {
  title: "DYNE",
  description:
    "AI-powered investing platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <WatchlistProvider>
            {children}
          </WatchlistProvider>
        </AuthProvider>
      </body>
    </html>
  )
}