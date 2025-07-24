// src/app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth/auth-provider"
import { UserMenu } from "@/components/auth/user-menu" // You'll create this

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Anime Finder",
  description: "Discover your next favorite anime",
}

export default function RootLayout({
  children,
}: {
  children: React.
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <header className="w-full px-4 py-2 flex justify-end border-b">
            <UserMenu />
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
