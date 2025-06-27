"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Film, Users, Star, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { moviesApi, actorsApi, ratingsApi, type Movie, type Actor, type Rating, type CreateMovieDto, type CreateActorDto, type CreateRatingDto } from "@/lib/api"
import MovieTab from "@/components/MovieTab"
import ActorTab from "@/components/ActorTab"
import RatingTab from "@/components/RatingTab"
import Pagination from "@/components/Pagination"
import MovieForm from "@/components/forms/MovieForm"
import ActorForm from "@/components/forms/ActorForm"
import RatingForm from "@/components/forms/RatingForm"

export default function MoviePortal() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [actors, setActors] = useState<Actor[]>([])
  const [ratings, setRatings] = useState<Rating[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null)
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false)
  const [isActorFormOpen, setIsActorFormOpen] = useState(false)
  const [isRatingFormOpen, setIsRatingFormOpen] = useState(false)
  const [selectedMovieForRating, setSelectedMovieForRating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("movies")
  const [loadingMovies, setLoadingMovies] = useState(false)
  const [loadingActors, setLoadingActors] = useState(false)
  const [loadingRatings, setLoadingRatings] = useState(false)

  const itemsPerPage = 6

  useEffect(() => {
    if (activeTab === "movies" && movies.length === 0) {
      setLoadingMovies(true)
      moviesApi.getAll()
        .then(res => setMovies(res.data))
        .catch(() => setError("Error loading movies"))
        .finally(() => setLoadingMovies(false))
    }
    if (activeTab === "actors" && actors.length === 0) {
      setLoadingActors(true)
      actorsApi.getAll()
        .then(res => setActors(res.data))
        .catch(() => setError("Error loading actors"))
        .finally(() => setLoadingActors(false))
    }
    if (activeTab === "ratings" && ratings.length === 0) {
      setLoadingRatings(true)
      ratingsApi.getAll()
        .then(res => setRatings(res.data))
        .catch(() => setError("Error loading ratings"))
        .finally(() => setLoadingRatings(false))
    }
  }, [activeTab])

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredActors = actors.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage)

  const handleDeleteMovie = async (id: number) => {
    try {
      await moviesApi.delete(id)
      setMovies(movies.filter((movie) => movie.id !== id))
      setRatings(ratings.filter((rating) => rating.movieId !== id))
    } catch (err: any) {
      console.error('Erro ao deletar filme:', err)
      if (err.response?.status === 401) {
        setError('Authentication error: Invalid or missing token')
      } else {
        setError('Error deleting movie')
      }
    }
  }

  const handleDeleteActor = async (id: number) => {
    try {
      await actorsApi.delete(id)
      setActors(actors.filter((actor) => actor.id !== id))
    } catch (err: any) {
      console.error('Erro ao deletar ator:', err)
      if (err.response?.status === 401) {
        setError('Authentication error: Invalid or missing token')
      } else {
        setError('Error deleting actor')
      }
    }
  }

  const handleDeleteRating = async (id: number) => {
    try {
      await ratingsApi.delete(id)
      setRatings(ratings.filter((rating) => rating.id !== id))
    } catch (err: any) {
      console.error('Erro ao deletar avaliação:', err)
      if (err.response?.status === 401) {
        setError('Authentication error: Invalid or missing token')
      } else {
        setError('Error deleting rating')
      }
    }
  }

  const getRatingsByMovieId = (movieId: number) => {
    const movie = movies.find(m => m.id === movieId)
    if (movie && movie.ratings) {
      return movie.ratings
    }
    return ratings.filter((rating) => rating.movieId === movieId)
  }

  const getMoviesByActorId = async (actorId: number) => {
    try {
      const response = await actorsApi.getMovies(actorId)
      return response.data
    } catch (err) {
      console.error('Erro ao buscar filmes do ator:', err)
      return []
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => {
            setError(null)
            if (activeTab === "movies") {
              setLoadingMovies(true)
              moviesApi.getAll()
                .then(res => setMovies(res.data))
                .catch(() => setError("Error loading movies"))
                .finally(() => setLoadingMovies(false))
            }
            if (activeTab === "actors") {
              setLoadingActors(true)
              actorsApi.getAll()
                .then(res => setActors(res.data))
                .catch(() => setError("Error loading actors"))
                .finally(() => setLoadingActors(false))
            }
            if (activeTab === "ratings") {
              setLoadingRatings(true)
              ratingsApi.getAll()
                .then(res => setRatings(res.data))
                .catch(() => setError("Error loading ratings"))
                .finally(() => setLoadingRatings(false))
            }
          }}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Film className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Movie Portal</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search movies or actors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="movies" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Movies
            </TabsTrigger>
            <TabsTrigger value="actors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Actors
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Ratings
            </TabsTrigger>
          </TabsList>

          {/* Movies Tab */}
          <TabsContent value="movies">
            <MovieTab
              movies={movies}
              setMovies={setMovies}
              searchTerm={searchTerm}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onMovieSelect={(movie: Movie) => setSelectedMovie(movie)}
              onMovieDelete={handleDeleteMovie}
              onMovieFormOpen={() => setIsMovieFormOpen(true)}
              isFormOpen={isMovieFormOpen}
              onFormClose={() => setIsMovieFormOpen(false)}
              setError={setError}
              loading={loadingMovies}
              itemsPerPage={itemsPerPage}
            />
          </TabsContent>

          {/* Actors Tab */}
          <TabsContent value="actors">
            <ActorTab
              actors={filteredActors}
              setActors={setActors}
              searchTerm={searchTerm}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onActorSelect={(actor: Actor) => setSelectedActor(actor)}
              onActorDelete={handleDeleteActor}
              onActorFormOpen={() => setIsActorFormOpen(true)}
              isFormOpen={isActorFormOpen}
              onFormClose={() => setIsActorFormOpen(false)}
              setError={setError}
              loading={loadingActors}
              itemsPerPage={itemsPerPage}
            />
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <RatingTab
              ratings={ratings}
              setRatings={setRatings}
              movies={movies}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onRatingDelete={handleDeleteRating}
              onRatingFormOpen={() => setIsRatingFormOpen(true)}
              isFormOpen={isRatingFormOpen}
              onFormClose={() => setIsRatingFormOpen(false)}
              selectedMovieForRating={selectedMovieForRating}
              setSelectedMovieForRating={setSelectedMovieForRating}
              setError={setError}
              loading={loadingRatings}
              itemsPerPage={itemsPerPage}
            />
          </TabsContent>
        </Tabs>

        {/* Movie Detail Modal */}
        <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedMovie?.title}</DialogTitle>
            </DialogHeader>
            {selectedMovie && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Year:</strong> {selectedMovie.releaseYear}
                  </div>
                  <div>
                    <strong>Genre:</strong> {selectedMovie.genre}
                  </div>
                </div>
                <div>
                  <strong>Description:</strong>
                  <p className="text-gray-600 mt-1">{selectedMovie.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Ratings:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getRatingsByMovieId(selectedMovie.id).map((rating) => (
                      <div key={rating.id} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{rating.reviewerName}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{parseFloat(rating.score).toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{rating.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Actors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.actors?.map((actor) => (
                      <Badge key={actor.id} variant="outline">
                        {actor.name}
                      </Badge>
                    )) || <p className="text-gray-500">No actors registered</p>}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Actor Detail Modal */}
        <Dialog open={!!selectedActor} onOpenChange={() => setSelectedActor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedActor?.name}</DialogTitle>
            </DialogHeader>
            {selectedActor && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Nationality:</strong> {selectedActor.nationality}
                  </div>
                  <div>
                    <strong>Birth Date:</strong> {new Date(selectedActor.birthDate).toLocaleDateString("en-US")}
                  </div>
                </div>
                <div>
                  <strong>Biography:</strong>
                  <p className="text-gray-600 mt-1">{selectedActor.biography}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
