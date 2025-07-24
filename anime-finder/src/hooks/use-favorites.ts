"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase"

export interface Anime {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      small_image_url: string
      large_image_url: string
    }
  }
  score?: number
  year?: number
  episodes?: number
  genres?: Array<{ name: string }>
  synopsis?: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Anime[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load favorites from Supabase or localStorage
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        // Load from Supabase for authenticated users
        try {
          const { data, error } = await supabase.from("favorites").select("anime_data").eq("user_id", user.id)

          if (error) throw error

          const animeFavorites = data?.map((item) => item.anime_data) || []
          setFavorites(animeFavorites)
        } catch (error) {
          console.error("Error loading favorites:", error)
          // Fallback to localStorage
          const savedFavorites = localStorage.getItem("animeFavorites")
          if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites))
          }
        }
      } else {
        // Load from localStorage for non-authenticated users
        const savedFavorites = localStorage.getItem("animeFavorites")
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
        }
      }
      setLoading(false)
    }

    loadFavorites()
  }, [user])

  const addFavorite = async (anime: Anime) => {
    const newFavorites = [...favorites, anime]
    setFavorites(newFavorites)

    if (user) {
      // Save to Supabase
      try {
        await supabase.from("favorites").insert({
          user_id: user.id,
          anime_id: anime.mal_id,
          anime_data: anime,
        })
      } catch (error) {
        console.error("Error saving favorite:", error)
      }
    } else {
      // Save to localStorage
      localStorage.setItem("animeFavorites", JSON.stringify(newFavorites))
    }
  }

  const removeFavorite = async (animeId: number) => {
    const newFavorites = favorites.filter((fav) => fav.mal_id !== animeId)
    setFavorites(newFavorites)

    if (user) {
      // Remove from Supabase
      try {
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("anime_id", animeId)
      } catch (error) {
        console.error("Error removing favorite:", error)
      }
    } else {
      // Save to localStorage
      localStorage.setItem("animeFavorites", JSON.stringify(newFavorites))
    }
  }

  const isFavorite = (animeId: number) => {
    return favorites.some((fav) => fav.mal_id === animeId)
  }

  const toggleFavorite = (anime: Anime) => {
    if (isFavorite(anime.mal_id)) {
      removeFavorite(anime.mal_id)
    } else {
      addFavorite(anime)
    }
  }

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  }
}
