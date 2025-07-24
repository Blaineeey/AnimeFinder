import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase/client" // ✅ correct

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("*")
          .eq("user_id", user.id)

        if (error) throw error
        setFavorites(data || [])
      } catch (error) {
        console.error("Error loading favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [user])

  const isFavorite = (animeId: number) => {
    return favorites.some((fav) => fav.anime_id === animeId)
  }

  const toggleFavorite = async (anime: any) => {
    const alreadyFavorite = isFavorite(anime.mal_id)

    try {
      if (alreadyFavorite) {
        const { error } = await supabase
          .from("favorites")
          .delete()
          .eq("anime_id", anime.mal_id)
          .eq("user_id", user.id)

        if (error) throw error
        setFavorites(favorites.filter((fav) => fav.anime_id !== anime.mal_id))
      } else {
        const { error } = await supabase.from("favorites").insert([
          {
            user_id: user.id,
            anime_id: anime.mal_id,
            title: anime.title,
          },
        ])

        if (error) throw error
        setFavorites([...favorites, { anime_id: anime.mal_id, title: anime.title, images: anime.images }])
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
  }
}
