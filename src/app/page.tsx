"use client"
import AnimeTypeahead from "@/components/anime-typeahead"

interface Anime {
  mal_id: number
  title: string
  images: {
    jpg: {
      image_url: string
      small_image_url: string
    }
  }
  score: number
  year: number
  genres: Array<{ name: string }>
  synopsis: string
}

export default function Home() {
  return <AnimeTypeahead />
}
