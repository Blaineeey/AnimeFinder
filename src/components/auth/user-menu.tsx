"use client"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { User, LogOut, Heart } from "lucide-react"

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full bg-white/10 backdrop-filter backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
      >
        <User className="w-5 h-5" />
        <span className="hidden sm:block text-sm font-medium">{user.email?.split("@")[0]}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-filter backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-white/80 border-b border-white/10">{user.email}</div>
              <button
                onClick={() => {
                  setIsOpen(false)
                  // Navigate to favorites
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Heart className="w-4 h-4" />
                My Favorites
              </button>
              <button
                onClick={() => {
                  signOut()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
