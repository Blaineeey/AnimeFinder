"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Star, Calendar, Users, Clock, Award, Play, Heart } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useFavorites } from "@/hooks/useFavorites"
import {AuthModal} from "@/components/auth/auth-modal"
import AnimatedBackground from "@/components/animated-background"

interface AnimeDetailsProps {
  id: string
}

export default function AnimeDetails({ id }: AnimeDetailsProps) {
  const [anime, setAnime] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const { user } = useAuth()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  useEffect(() => {
    if (id) {
      fetch(`https://api.jikan.moe/v4/anime/${id}/full`)
        .then((res) => res.json())
        .then((data) => {
          setAnime(data.data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error(err)
          setIsLoading(false)
        })
    }
  }, [id])

  const handleFavoriteClick = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (anime) {
      toggleFavorite(anime)
    }
  }

  const handleWatchNow = () => {
    if (anime?.url) {
      window.open(anime.url, "_blank", "noopener,noreferrer")
    }
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <AnimatedBackground />
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading anime details...</p>
        </div>
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="error-container">
        <AnimatedBackground />
        <div className="error-content">
          <h2 className="error-title">Anime not found</h2>
          <Link href="/" className="back-button">
            <ArrowLeft className="back-icon" />
            Back to Search
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="anime-details">
      <AnimatedBackground />

      {/* Back Button */}
      <Link href="/" className="back-link">
        <ArrowLeft className="back-icon" />
        Back to Search
      </Link>

      {/* Hero Section */}
      <div className="details-hero">
        <div className="details-hero-bg">
          <img
            src={anime.images?.jpg?.large_image_url || `/placeholder.svg?height=600&width=1200&query=anime background`}
            alt=""
            className="hero-bg-image"
          />
          <div className="hero-overlay" />
        </div>
        <div className="details-hero-content">
          <div className="hero-poster">
            <img
              src={anime.images?.jpg?.large_image_url || `/placeholder.svg?height=600&width=400&query=anime poster`}
              alt={anime.title}
              className="hero-poster-image"
            />
          </div>
          <div className="hero-info">
            <h1 className="hero-anime-title">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <p className="hero-anime-subtitle">{anime.title_english}</p>
            )}
            <div className="hero-meta">
              {anime.score && (
                <div className="hero-rating">
                  <Star className="rating-icon" />
                  <span>{anime.score}</span>
                </div>
              )}
              {anime.year && (
                <div className="hero-badge">
                  <Calendar className="badge-icon" />
                  <span>{anime.year}</span>
                </div>
              )}
              {anime.episodes && (
                <div className="hero-badge">
                  <span>{anime.episodes} episodes</span>
                </div>
              )}
            </div>
            <div className="hero-actions">
              <button className="action-button primary" onClick={handleWatchNow}>
                <Play className="action-icon" />
                Watch Now
              </button>
              <button
                className={`action-button secondary ${isFavorite(anime.mal_id) ? "favorited" : ""}`}
                onClick={handleFavoriteClick}
              >
                <Heart className={`action-icon ${isFavorite(anime.mal_id) ? "filled" : ""}`} />
                {isFavorite(anime.mal_id) ? "Remove from List" : "Add to List"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="details-container">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stats-grid">
            {anime.score && (
              <div className="stat-card">
                <div className="stat-icon-wrapper star">
                  <Star className="stat-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{anime.score}</div>
                  <div className="stat-label">Score</div>
                </div>
              </div>
            )}
            {anime.rank && (
              <div className="stat-card">
                <div className="stat-icon-wrapper award">
                  <Award className="stat-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">#{anime.rank}</div>
                  <div className="stat-label">Rank</div>
                </div>
              </div>
            )}
            {anime.members && (
              <div className="stat-card">
                <div className="stat-icon-wrapper users">
                  <Users className="stat-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{(anime.members / 1000000).toFixed(1)}M</div>
                  <div className="stat-label">Members</div>
                </div>
              </div>
            )}
            {anime.episodes && (
              <div className="stat-card">
                <div className="stat-icon-wrapper clock">
                  <Clock className="stat-icon" />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{anime.episodes}</div>
                  <div className="stat-label">Episodes</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="content-grid">
          {/* Synopsis Section */}
          <div className="content-section">
            <div className="section-card synopsis-card">
              <h2 className="section-title">Synopsis</h2>
              <p className="synopsis-text">{anime.synopsis || "No synopsis available."}</p>
            </div>

            {/* Details Section */}
            <div className="section-card details-card">
              <h2 className="section-title">Details</h2>
              <div className="details-grid">
                {anime.genres && anime.genres.length > 0 && (
                  <div className="detail-item">
                    <h3 className="detail-title">Genres</h3>
                    <div className="genre-list">
                      {anime.genres.map((genre: any, index: number) => (
                        <span key={genre.name} className="genre-badge" style={{ animationDelay: `${index * 0.1}s` }}>
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {anime.studios && anime.studios.length > 0 && (
                  <div className="detail-item">
                    <h3 className="detail-title">Studios</h3>
                    <div className="studio-list">
                      {anime.studios.map((studio: any, index: number) => (
                        <span key={studio.name} className="studio-badge" style={{ animationDelay: `${index * 0.1}s` }}>
                          {studio.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {anime.aired && (
                  <div className="detail-item">
                    <h3 className="detail-title">Aired</h3>
                    <p className="aired-text">{anime.aired.string}</p>
                  </div>
                )}

                {anime.status && (
                  <div className="detail-item">
                    <h3 className="detail-title">Status</h3>
                    <span className={`status-badge ${anime.status.toLowerCase().replace(" ", "-")}`}>
                      {anime.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="sidebar-section">
            <div className="section-card links-card">
              <h2 className="section-title">External Links</h2>
              <div className="links-list">
                <a href={anime.url} target="_blank" rel="noopener noreferrer" className="external-link primary">
                  <ExternalLink className="link-icon" />
                  MyAnimeList
                </a>
                {anime.trailer?.youtube_id && (
                  <a
                    href={`https://www.youtube.com/watch?v=${anime.trailer.youtube_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="external-link secondary"
                  >
                    <Play className="link-icon" />
                    Watch Trailer
                  </a>
                )}
              </div>
            </div>

            {favorites.length > 0 && (
              <div className="section-card recommendations-card">
                <h2 className="section-title">Your Favorites</h2>
                <div className="favorites-preview">
                  {favorites.slice(0, 3).map((fav) => (
                    <Link key={fav.mal_id} href={`/anime/${fav.mal_id}`} className="favorite-preview-item">
                      <img
                        src={fav.images?.jpg?.small_image_url || `/placeholder.svg?height=100&width=70&query=anime`}
                        alt={fav.title}
                        className="favorite-preview-image"
                      />
                      <span className="favorite-preview-title">{fav.title}</span>
                    </Link>
                  ))}
                  {favorites.length > 3 && (
                    <Link href="/" className="view-all-favorites">
                      View all {favorites.length} favorites
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
