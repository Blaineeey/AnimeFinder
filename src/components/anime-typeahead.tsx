"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Film, Star, Calendar, Play, Heart, User } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { useFavorites } from "@/hooks/useFavorites"
import {AuthModal} from "@/components/auth/auth-modal"
import AnimatedBackground from "@/components/animated-background"

export default function AnimeTypeahead() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()

  const [topAnime, setTopAnime] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [isLoadingTop, setIsLoadingTop] = useState(true)
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true)

  const { user } = useAuth()
  const { favorites, isFavorite, toggleFavorite } = useFavorites()

  // Fetch top anime and recommendations on component mount
  useEffect(() => {
    // Fetch top anime
    fetch("https://api.jikan.moe/v4/top/anime?limit=12")
      .then((res) => res.json())
      .then((data) => {
        setTopAnime(data.data || [])
        setIsLoadingTop(false)
      })
      .catch((err) => {
        console.error("Error fetching top anime:", err)
        setIsLoadingTop(false)
      })

    // Fetch recommendations
    fetch("https://api.jikan.moe/v4/recommendations/anime?limit=12")
      .then((res) => res.json())
      .then((data) => {
        // Extract anime from recommendations and flatten
        const recommendedAnime = data.data?.slice(0, 6).map((rec: any) => rec.entry[0]) || []
        setRecommendations(recommendedAnime)
        setIsLoadingRecommendations(false)
      })
      .catch((err) => {
        console.error("Error fetching recommendations:", err)
        setIsLoadingRecommendations(false)
      })
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const delay = setTimeout(() => {
      if (query.length > 2) {
        setIsLoading(true)
        fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`, {
          signal: controller.signal,
        })
          .then((res) => res.json())
          .then((data) => {
            setResults(data.data || [])
            setIsLoading(false)
          })
          .catch((err) => {
            if (err.name !== "AbortError") {
              console.error(err)
              setIsLoading(false)
            }
          })
      } else {
        setResults([])
        setIsLoading(false)
      }
    }, 400)

    return () => {
      clearTimeout(delay)
      controller.abort()
    }
  }, [query])

  const handleFavoriteClick = (anime: any, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      setShowAuthModal(true)
      return
    }
    toggleFavorite(anime)
  }

  const displayResults = showFavorites ? favorites : results

  return (
    <div className="anime-finder">
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <h1 className="hero-title">
                <span className="hero-title-gradient">Anime</span> Finder
              </h1>
              <p className="hero-subtitle">
                Search through thousands of anime titles and discover your next binge-worthy series
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation-section">
        <div className="nav-container">
          <button className={`nav-button ${!showFavorites ? "active" : ""}`} onClick={() => setShowFavorites(false)}>
            <Search className="nav-icon" />
            Search
          </button>
          <button className={`nav-button ${showFavorites ? "active" : ""}`} onClick={() => setShowFavorites(true)}>
            <Heart className="nav-icon" />
            My Favorites ({favorites.length})
          </button>
        </div>
      </div>

      {/* Search Section - Only show when not viewing favorites */}
      {!showFavorites && (
        <div className="search-section">
          <div className="search-card">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search for anime titles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="search-input"
                aria-label="Search anime"
              />
            </div>
            {query.length > 0 && query.length <= 2 && (
              <p className="search-hint">Type at least 3 characters to search</p>
            )}
          </div>
        </div>
      )}

      {/* Top Anime Section - Only show when not searching and not viewing favorites */}
      {!showFavorites && query.length <= 2 && (
        <div className="featured-section">
          <div className="section-header">
            <h2 className="section-title">🏆 Top Rated Anime</h2>
            <p className="section-subtitle">Discover the highest-rated anime of all time</p>
          </div>
          {isLoadingTop ? (
            <div className="loading-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="featured-grid">
              {topAnime.slice(0, 8).map((anime: any, index) => (
                <div
                  key={anime.mal_id}
                  className="anime-card featured-card"
                  onClick={() => router.push(`/${anime.mal_id}`)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="anime-card-image">
                    <img
                      src={anime.images?.jpg?.image_url || `/placeholder.svg?height=300&width=200&query=anime poster`}
                      alt={anime.title}
                      className="anime-image"
                    />
                    <div className="anime-card-overlay">
                      <div className="anime-card-actions">
                        <button className="play-button">
                          <Play className="play-icon" />
                        </button>
                      </div>
                    </div>
                    {anime.score && (
                      <div className="anime-rating">
                        <Star className="rating-icon" />
                        <span>{anime.score}</span>
                      </div>
                    )}
                    {anime.rank && <div className="rank-badge">#{anime.rank}</div>}
                    <button
                      className={`favorite-button ${isFavorite(anime.mal_id) ? "favorited" : ""}`}
                      onClick={(e) => handleFavoriteClick(anime, e)}
                      aria-label={isFavorite(anime.mal_id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className="favorite-icon" />
                    </button>
                  </div>
                  <div className="anime-card-content">
                    <h3 className="anime-card-title">{anime.title}</h3>
                    <div className="anime-card-meta">
                      {anime.year && (
                        <div className="anime-meta-item">
                          <Calendar className="meta-icon" />
                          <span>{anime.year}</span>
                        </div>
                      )}
                      {anime.episodes && (
                        <div className="anime-meta-item">
                          <span>{anime.episodes} episodes</span>
                        </div>
                      )}
                    </div>
                    {anime.genres && anime.genres.length > 0 && (
                      <div className="anime-genres">
                        {anime.genres.slice(0, 2).map((genre: any) => (
                          <span key={genre.name} className="genre-badge">
                            {genre.name}
                          </span>
                        ))}
                        {anime.genres.length > 2 && (
                          <span className="genre-badge genre-more">+{anime.genres.length - 2}</span>
                        )}
                      </div>
                    )}
                    {anime.synopsis && <p className="anime-synopsis">{anime.synopsis}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommendations Section - Only show when not searching and not viewing favorites */}
      {!showFavorites && query.length <= 2 && (
        <div className="featured-section">
          <div className="section-header">
            <h2 className="section-title">✨ Recommended for You</h2>
            <p className="section-subtitle">Popular picks from the anime community</p>
          </div>
          {isLoadingRecommendations ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="featured-grid recommendations-grid">
              {recommendations.map((anime: any, index) => (
                <div
                  key={anime.mal_id}
                  className="anime-card featured-card recommendation-card"
                  onClick={() => router.push(`/${anime.mal_id}`)}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="anime-card-image">
                    <img
                      src={anime.images?.jpg?.image_url || `/placeholder.svg?height=300&width=200&query=anime poster`}
                      alt={anime.title}
                      className="anime-image"
                    />
                    <div className="anime-card-overlay">
                      <div className="anime-card-actions">
                        <button className="play-button">
                          <Play className="play-icon" />
                        </button>
                      </div>
                    </div>
                    <div className="recommendation-badge">✨ Recommended</div>
                    <button
                      className={`favorite-button ${isFavorite(anime.mal_id) ? "favorited" : ""}`}
                      onClick={(e) => handleFavoriteClick(anime, e)}
                      aria-label={isFavorite(anime.mal_id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart className="favorite-icon" />
                    </button>
                  </div>
                  <div className="anime-card-content">
                    <h3 className="anime-card-title">{anime.title}</h3>
                    <div className="anime-card-meta">
                      {anime.year && (
                        <div className="anime-meta-item">
                          <Calendar className="meta-icon" />
                          <span>{anime.year}</span>
                        </div>
                      )}
                      {anime.episodes && (
                        <div className="anime-meta-item">
                          <span>{anime.episodes} episodes</span>
                        </div>
                      )}
                    </div>
                    {anime.genres && anime.genres.length > 0 && (
                      <div className="anime-genres">
                        {anime.genres.slice(0, 2).map((genre: any) => (
                          <span key={genre.name} className="genre-badge">
                            {genre.name}
                          </span>
                        ))}
                        {anime.genres.length > 2 && (
                          <span className="genre-badge genre-more">+{anime.genres.length - 2}</span>
                        )}
                      </div>
                    )}
                    {anime.synopsis && <p className="anime-synopsis">{anime.synopsis}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results Section */}
      {!showFavorites && results.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2 className="results-title">Search Results</h2>
            <div className="results-count">{results.length} anime found</div>
          </div>
          <div className="results-grid">
            {results.map((anime: any, index) => (
              <div
                key={anime.mal_id}
                className="anime-card"
                onClick={() => router.push(`/${anime.mal_id}`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="anime-card-image">
                  <img
                    src={anime.images?.jpg?.image_url || `/placeholder.svg?height=300&width=200&query=anime poster`}
                    alt={anime.title}
                    className="anime-image"
                  />
                  <div className="anime-card-overlay">
                    <div className="anime-card-actions">
                      <button className="play-button">
                        <Play className="play-icon" />
                      </button>
                    </div>
                  </div>
                  {anime.score && (
                    <div className="anime-rating">
                      <Star className="rating-icon" />
                      <span>{anime.score}</span>
                    </div>
                  )}
                  <button
                    className={`favorite-button ${isFavorite(anime.mal_id) ? "favorited" : ""}`}
                    onClick={(e) => handleFavoriteClick(anime, e)}
                    aria-label={isFavorite(anime.mal_id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className="favorite-icon" />
                  </button>
                </div>
                <div className="anime-card-content">
                  <h3 className="anime-card-title">{anime.title}</h3>
                  <div className="anime-card-meta">
                    {anime.year && (
                      <div className="anime-meta-item">
                        <Calendar className="meta-icon" />
                        <span>{anime.year}</span>
                      </div>
                    )}
                    {anime.episodes && (
                      <div className="anime-meta-item">
                        <span>{anime.episodes} episodes</span>
                      </div>
                    )}
                  </div>
                  {anime.genres && anime.genres.length > 0 && (
                    <div className="anime-genres">
                      {anime.genres.slice(0, 2).map((genre: any) => (
                        <span key={genre.name} className="genre-badge">
                          {genre.name}
                        </span>
                      ))}
                      {anime.genres.length > 2 && (
                        <span className="genre-badge genre-more">+{anime.genres.length - 2}</span>
                      )}
                    </div>
                  )}
                  {anime.synopsis && <p className="anime-synopsis">{anime.synopsis}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites Results Section */}
      {showFavorites && displayResults.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2 className="results-title">My Favorites</h2>
            <div className="results-count">{displayResults.length} anime found</div>
          </div>
          <div className="results-grid">
            {displayResults.map((anime: any, index) => (
              <div
                key={anime.mal_id}
                className="anime-card"
                onClick={() => router.push(`/${anime.mal_id}`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="anime-card-image">
                  <img
                    src={anime.images?.jpg?.image_url || `/placeholder.svg?height=300&width=200&query=anime poster`}
                    alt={anime.title}
                    className="anime-image"
                  />
                  <div className="anime-card-overlay">
                    <div className="anime-card-actions">
                      <button className="play-button">
                        <Play className="play-icon" />
                      </button>
                    </div>
                  </div>
                  {anime.score && (
                    <div className="anime-rating">
                      <Star className="rating-icon" />
                      <span>{anime.score}</span>
                    </div>
                  )}
                  <button
                    className={`favorite-button ${isFavorite(anime.mal_id) ? "favorited" : ""}`}
                    onClick={(e) => handleFavoriteClick(anime, e)}
                    aria-label={isFavorite(anime.mal_id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className="favorite-icon" />
                  </button>
                </div>
                <div className="anime-card-content">
                  <h3 className="anime-card-title">{anime.title}</h3>
                  <div className="anime-card-meta">
                    {anime.year && (
                      <div className="anime-meta-item">
                        <Calendar className="meta-icon" />
                        <span>{anime.year}</span>
                      </div>
                    )}
                    {anime.episodes && (
                      <div className="anime-meta-item">
                        <span>{anime.episodes} episodes</span>
                      </div>
                    )}
                  </div>
                  {anime.genres && anime.genres.length > 0 && (
                    <div className="anime-genres">
                      {anime.genres.slice(0, 2).map((genre: any) => (
                        <span key={genre.name} className="genre-badge">
                          {genre.name}
                        </span>
                      ))}
                      {anime.genres.length > 2 && (
                        <span className="genre-badge genre-more">+{anime.genres.length - 2}</span>
                      )}
                    </div>
                  )}
                  {anime.synopsis && <p className="anime-synopsis">{anime.synopsis}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty Favorites State */}
      {showFavorites && favorites.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">
              <Heart />
            </div>
            <h3 className="empty-state-title">No favorites yet</h3>
            <p className="empty-state-description">
              Start adding anime to your favorites by clicking the heart icon on any anime card.
            </p>
            <button className="empty-state-button" onClick={() => setShowFavorites(false)}>
              Browse Anime
            </button>
          </div>
        </div>
      )}

      {/* Empty Search State */}
      {!showFavorites && query.length > 2 && results.length === 0 && !isLoading && (
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-state-icon">
              <Film />
            </div>
            <h3 className="empty-state-title">No anime found</h3>
            <p className="empty-state-description">
              We couldn't find any anime matching "{query}". Try different keywords or check your spelling.
            </p>
            <button className="empty-state-button" onClick={() => setQuery("")}>
              Clear Search
            </button>
          </div>
        </div>
      )}

      {/* Initial State */}
      {!showFavorites && query.length <= 2 && (
        <div className="initial-state">
          <div className="initial-state-content">
            <div className="initial-state-icon">
              <Film />
            </div>
            <h3 className="initial-state-title">Start Your Anime Journey</h3>
            <p className="initial-state-description">
              Discover amazing anime series, movies, and OVAs from our extensive database
            </p>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
