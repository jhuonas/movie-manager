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
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [editingActor, setEditingActor] = useState<Actor | null>(null)
  const [selectedMovieForRating, setSelectedMovieForRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const itemsPerPage = 6

  // Carregar dados da API
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [moviesResponse, actorsResponse, ratingsResponse] = await Promise.all([
        moviesApi.getAll(),
        actorsApi.getAll(),
        ratingsApi.getAll()
      ])

      setMovies(moviesResponse.data)
      setActors(actorsResponse.data)
      setRatings(ratingsResponse.data)
    } catch (err) {
      console.error('Erro ao carregar dados:', err)
      setError('Erro ao carregar dados da API')
    } finally {
      setLoading(false)
    }
  }

  // Filter functions
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredActors = actors.filter((actor) =>
    actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    actor.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pagination
  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage)

  // CRUD functions
  const handleDeleteMovie = async (id: number) => {
    try {
      await moviesApi.delete(id)
      setMovies(movies.filter((movie) => movie.id !== id))
      setRatings(ratings.filter((rating) => rating.movieId !== id))
    } catch (err) {
      console.error('Erro ao deletar filme:', err)
      setError('Erro ao deletar filme')
    }
  }

  const handleDeleteActor = async (id: number) => {
    try {
      await actorsApi.delete(id)
      setActors(actors.filter((actor) => actor.id !== id))
    } catch (err) {
      console.error('Erro ao deletar ator:', err)
      setError('Erro ao deletar ator')
    }
  }

  const handleDeleteRating = async (id: number) => {
    try {
      await ratingsApi.delete(id)
      setRatings(ratings.filter((rating) => rating.id !== id))
    } catch (err) {
      console.error('Erro ao deletar avaliação:', err)
      setError('Erro ao deletar avaliação')
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

  const MovieForm = ({ movie, onClose }: { movie?: Movie; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: movie?.title || "",
      description: movie?.description || "",
      releaseYear: movie?.releaseYear || new Date().getFullYear(),
      genre: movie?.genre || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        if (movie) {
          const response = await moviesApi.update(movie.id, formData)
          setMovies(movies.map((m) => (m.id === movie.id ? response.data : m)))
        } else {
          const response = await moviesApi.create(formData as CreateMovieDto)
          setMovies([...movies, response.data])
        }
        onClose()
      } catch (err) {
        console.error('Erro ao salvar filme:', err)
        setError('Erro ao salvar filme')
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="releaseYear">Ano de Lançamento</Label>
          <Input
            id="releaseYear"
            type="number"
            value={formData.releaseYear}
            onChange={(e) => setFormData({ ...formData, releaseYear: Number.parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <Label htmlFor="genre">Gênero</Label>
          <Input
            id="genre"
            value={formData.genre}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">{movie ? "Atualizar" : "Adicionar"}</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    )
  }

  const ActorForm = ({ actor, onClose }: { actor?: Actor; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      name: actor?.name || "",
      biography: actor?.biography || "",
      nationality: actor?.nationality || "",
      birthDate: actor?.birthDate || "",
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        if (actor) {
          const response = await actorsApi.update(actor.id, formData)
          setActors(actors.map((a) => (a.id === actor.id ? response.data : a)))
        } else {
          const response = await actorsApi.create(formData as CreateActorDto)
          setActors([...actors, response.data])
        }
        onClose()
      } catch (err) {
        console.error('Erro ao salvar ator:', err)
        setError('Erro ao salvar ator')
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="biography">Biografia</Label>
          <Textarea
            id="biography"
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="nationality">Nacionalidade</Label>
          <Input
            id="nationality"
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="birthDate">Data de Nascimento</Label>
          <Input
            id="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">{actor ? "Atualizar" : "Adicionar"}</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    )
  }

  const RatingForm = ({ movieId, onClose }: { movieId: number; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      reviewerName: "",
      comment: "",
      score: 0,
    })

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const response = await ratingsApi.create({
          movieId,
          ...formData,
        } as CreateRatingDto)
        setRatings([...ratings, response.data])
        onClose()
      } catch (err) {
        console.error('Erro ao salvar avaliação:', err)
        setError('Erro ao salvar avaliação')
      }
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="reviewerName">Nome do Avaliador</Label>
          <Input
            id="reviewerName"
            value={formData.reviewerName}
            onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="comment">Comentário</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="score">Nota (0.5-5.0)</Label>
          <Input
            id="score"
            type="number"
            step="0.5"
            min="0.5"
            max="5"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: Number.parseFloat(e.target.value) })}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Adicionar Avaliação</Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </form>
    )
  }

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }) => (
    <div className="flex justify-center gap-2 mt-6">
      <Button variant="outline" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Anterior
      </Button>
      <span className="flex items-center px-4">
        Página {currentPage} de {totalPages}
      </span>
      <Button variant="outline" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Próxima
      </Button>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadData}>Tentar Novamente</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Film className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Portal de Filmes</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar filmes ou atores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="movies" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="movies" className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Filmes
            </TabsTrigger>
            <TabsTrigger value="actors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Atores
            </TabsTrigger>
            <TabsTrigger value="ratings" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Avaliações
            </TabsTrigger>
          </TabsList>

          {/* Movies Tab */}
          <TabsContent value="movies">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Filmes</h2>
              <Dialog open={isMovieFormOpen} onOpenChange={setIsMovieFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Filme
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Filme</DialogTitle>
                  </DialogHeader>
                  <MovieForm onClose={() => setIsMovieFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginateItems(filteredMovies, currentPage).map((movie) => (
                <Card key={movie.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{movie.title}</h3>
                        <p className="text-sm text-gray-500">{movie.releaseYear}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{parseFloat(movie.averageRating || '0').toFixed(1)}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{movie.description}</p>
                    <Badge variant="secondary" className="mb-4">
                      {movie.genre}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedMovie(movie)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Filme</DialogTitle>
                          </DialogHeader>
                          <MovieForm movie={movie} onClose={() => setEditingMovie(null)} />
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteMovie(movie.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={getTotalPages(filteredMovies)}
              onPageChange={setCurrentPage}
            />
          </TabsContent>

          {/* Actors Tab */}
          <TabsContent value="actors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Atores</h2>
              <Dialog open={isActorFormOpen} onOpenChange={setIsActorFormOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Ator
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Ator</DialogTitle>
                  </DialogHeader>
                  <ActorForm onClose={() => setIsActorFormOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginateItems(filteredActors, currentPage).map((actor) => (
                <Card key={actor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{actor.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Nacionalidade:</strong> {actor.nationality}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <strong>Nascimento:</strong> {new Date(actor.birthDate).toLocaleDateString("pt-BR")}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{actor.biography}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => setSelectedActor(actor)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Ator</DialogTitle>
                          </DialogHeader>
                          <ActorForm actor={actor} onClose={() => setEditingActor(null)} />
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteActor(actor.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={getTotalPages(filteredActors)}
              onPageChange={setCurrentPage}
            />
          </TabsContent>

          {/* Ratings Tab */}
          <TabsContent value="ratings">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Avaliações</h2>
              <div className="flex gap-2">
                <Select onValueChange={(value) => setSelectedMovieForRating(Number.parseInt(value))}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Selecionar filme" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map((movie) => (
                      <SelectItem key={movie.id} value={movie.id.toString()}>
                        {movie.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isRatingFormOpen} onOpenChange={setIsRatingFormOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={!selectedMovieForRating}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Avaliação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Avaliação</DialogTitle>
                    </DialogHeader>
                    {selectedMovieForRating && (
                      <RatingForm movieId={selectedMovieForRating} onClose={() => setIsRatingFormOpen(false)} />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-4">
              {paginateItems(ratings, currentPage).map((rating) => {
                const movie = movies.find((m) => m.id === rating.movieId)
                return (
                  <Card key={rating.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{movie?.title}</h3>
                          <p className="text-sm text-gray-600">por {rating.reviewerName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{parseFloat(rating.score).toFixed(1)}</span>
                          </div>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteRating(rating.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700">{rating.comment}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Pagination currentPage={currentPage} totalPages={getTotalPages(ratings)} onPageChange={setCurrentPage} />
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
                    <strong>Ano:</strong> {selectedMovie.releaseYear}
                  </div>
                  <div>
                    <strong>Gênero:</strong> {selectedMovie.genre}
                  </div>
                </div>
                <div>
                  <strong>Descrição:</strong>
                  <p className="text-gray-600 mt-1">{selectedMovie.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Avaliações:</h4>
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
                  <h4 className="font-semibold mb-2">Atores:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMovie.actors?.map((actor) => (
                      <Badge key={actor.id} variant="outline">
                        {actor.name}
                      </Badge>
                    )) || <p className="text-gray-500">Nenhum ator cadastrado</p>}
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
                    <strong>Nacionalidade:</strong> {selectedActor.nationality}
                  </div>
                  <div>
                    <strong>Nascimento:</strong> {new Date(selectedActor.birthDate).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <div>
                  <strong>Biografia:</strong>
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
