"use client"

import type React from "react"

import { useState } from "react"
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

// Mock data
const mockMovies = [
  {
    id: 1,
    title: "O Poderoso Chefão",
    year: 1972,
    genre: "Drama",
    rating: 9.2,
    actors: [1, 2],
    reviews: [1, 2],
  },
  {
    id: 2,
    title: "Pulp Fiction",
    year: 1994,
    genre: "Crime",
    rating: 8.9,
    actors: [3, 4],
    reviews: [3],
  },
  {
    id: 3,
    title: "Cidade de Deus",
    year: 2002,
    genre: "Drama",
    rating: 8.6,
    actors: [5, 6],
    reviews: [4, 5],
  },
  {
    id: 4,
    title: "Parasita",
    year: 2019,
    genre: "Thriller",
    rating: 8.5,
    actors: [7, 8],
    reviews: [6],
  },
  {
    id: 5,
    title: "Interestelar",
    year: 2014,
    genre: "Ficção Científica",
    rating: 8.7,
    actors: [9, 10],
    reviews: [7, 8],
  },
]

const mockActors = [
  { id: 1, name: "Marlon Brando", nationality: "Americano", birthDate: "1924-04-03" },
  { id: 2, name: "Al Pacino", nationality: "Americano", birthDate: "1940-04-25" },
  { id: 3, name: "John Travolta", nationality: "Americano", birthDate: "1954-02-18" },
  { id: 4, name: "Samuel L. Jackson", nationality: "Americano", birthDate: "1948-12-21" },
  { id: 5, name: "Alexandre Rodrigues", nationality: "Brasileiro", birthDate: "1983-05-21" },
  { id: 6, name: "Leandro Firmino", nationality: "Brasileiro", birthDate: "1978-06-23" },
  { id: 7, name: "Song Kang-ho", nationality: "Sul-coreano", birthDate: "1967-01-17" },
  { id: 8, name: "Choi Woo-shik", nationality: "Sul-coreano", birthDate: "1990-03-26" },
  { id: 9, name: "Matthew McConaughey", nationality: "Americano", birthDate: "1969-11-04" },
  { id: 10, name: "Anne Hathaway", nationality: "Americana", birthDate: "1982-11-12" },
]

const mockReviews = [
  { id: 1, movieId: 1, reviewer: "João Silva", comment: "Obra-prima absoluta do cinema!", rating: 10.0 },
  { id: 2, movieId: 1, reviewer: "Maria Santos", comment: "Clássico atemporal.", rating: 9.5 },
  { id: 3, movieId: 2, reviewer: "Pedro Costa", comment: "Tarantino no seu melhor.", rating: 9.0 },
  { id: 4, movieId: 3, reviewer: "Ana Oliveira", comment: "Retrato brutal e realista.", rating: 8.8 },
  { id: 5, movieId: 3, reviewer: "Carlos Lima", comment: "Cinema brasileiro de qualidade.", rating: 9.2 },
  { id: 6, movieId: 4, reviewer: "Lucia Ferreira", comment: "Crítica social brilhante.", rating: 8.7 },
  { id: 7, movieId: 5, reviewer: "Roberto Alves", comment: "Ficção científica épica.", rating: 8.9 },
  { id: 8, movieId: 5, reviewer: "Fernanda Rocha", comment: "Visualmente deslumbrante.", rating: 8.5 },
]

interface Movie {
  id: number
  title: string
  year: number
  genre: string
  rating: number
  actors: number[]
  reviews: number[]
}

interface Actor {
  id: number
  name: string
  nationality: string
  birthDate: string
}

interface Review {
  id: number
  movieId: number
  reviewer: string
  comment: string
  rating: number
}

export default function MoviePortal() {
  const [movies, setMovies] = useState<Movie[]>(mockMovies)
  const [actors, setActors] = useState<Actor[]>(mockActors)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null)
  const [isMovieFormOpen, setIsMovieFormOpen] = useState(false)
  const [isActorFormOpen, setIsActorFormOpen] = useState(false)
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
  const [editingActor, setEditingActor] = useState<Actor | null>(null)
  const [selectedMovieForReview, setSelectedMovieForReview] = useState<number | null>(null)

  const itemsPerPage = 6

  // Filter functions
  const filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredActors = actors.filter((actor) => actor.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Pagination
  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const getTotalPages = (items: any[]) => Math.ceil(items.length / itemsPerPage)

  // CRUD functions
  const handleDeleteMovie = (id: number) => {
    setMovies(movies.filter((movie) => movie.id !== id))
    setReviews(reviews.filter((review) => review.movieId !== id))
  }

  const handleDeleteActor = (id: number) => {
    setActors(actors.filter((actor) => actor.id !== id))
  }

  const handleDeleteReview = (id: number) => {
    setReviews(reviews.filter((review) => review.id !== id))
  }

  const getActorsByIds = (actorIds: number[]) => {
    return actors.filter((actor) => actorIds.includes(actor.id))
  }

  const getReviewsByMovieId = (movieId: number) => {
    return reviews.filter((review) => review.movieId === movieId)
  }

  const getMoviesByActorId = (actorId: number) => {
    return movies.filter((movie) => movie.actors.includes(actorId))
  }

  const MovieForm = ({ movie, onClose }: { movie?: Movie; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      title: movie?.title || "",
      year: movie?.year || new Date().getFullYear(),
      genre: movie?.genre || "",
      rating: movie?.rating || 0,
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (movie) {
        setMovies(movies.map((m) => (m.id === movie.id ? { ...m, ...formData } : m)))
      } else {
        const newMovie: Movie = {
          id: Math.max(...movies.map((m) => m.id)) + 1,
          ...formData,
          actors: [],
          reviews: [],
        }
        setMovies([...movies, newMovie])
      }
      onClose()
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
          <Label htmlFor="year">Ano</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number.parseInt(e.target.value) })}
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
        <div>
          <Label htmlFor="rating">Nota</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
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
      nationality: actor?.nationality || "",
      birthDate: actor?.birthDate || "",
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (actor) {
        setActors(actors.map((a) => (a.id === actor.id ? { ...a, ...formData } : a)))
      } else {
        const newActor: Actor = {
          id: Math.max(...actors.map((a) => a.id)) + 1,
          ...formData,
        }
        setActors([...actors, newActor])
      }
      onClose()
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

  const ReviewForm = ({ movieId, onClose }: { movieId: number; onClose: () => void }) => {
    const [formData, setFormData] = useState({
      reviewer: "",
      comment: "",
      rating: 0,
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      const newReview: Review = {
        id: Math.max(...reviews.map((r) => r.id)) + 1,
        movieId,
        ...formData,
      }
      setReviews([...reviews, newReview])
      onClose()
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="reviewer">Nome do Avaliador</Label>
          <Input
            id="reviewer"
            value={formData.reviewer}
            onChange={(e) => setFormData({ ...formData, reviewer: e.target.value })}
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
          <Label htmlFor="rating">Nota (0-10)</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number.parseFloat(e.target.value) })}
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
            <TabsTrigger value="reviews" className="flex items-center gap-2">
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
                        <p className="text-sm text-gray-500">{movie.year}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{movie.rating}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Avaliações</h2>
              <div className="flex gap-2">
                <Select onValueChange={(value) => setSelectedMovieForReview(Number.parseInt(value))}>
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
                <Dialog open={isReviewFormOpen} onOpenChange={setIsReviewFormOpen}>
                  <DialogTrigger asChild>
                    <Button disabled={!selectedMovieForReview}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Avaliação
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Avaliação</DialogTitle>
                    </DialogHeader>
                    {selectedMovieForReview && (
                      <ReviewForm movieId={selectedMovieForReview} onClose={() => setIsReviewFormOpen(false)} />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="space-y-4">
              {paginateItems(reviews, currentPage).map((review) => {
                const movie = movies.find((m) => m.id === review.movieId)
                return (
                  <Card key={review.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold">{movie?.title}</h3>
                          <p className="text-sm text-gray-600">por {review.reviewer}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="font-medium">{review.rating.toFixed(1)}</span>
                          </div>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteReview(review.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Pagination currentPage={currentPage} totalPages={getTotalPages(reviews)} onPageChange={setCurrentPage} />
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
                    <strong>Ano:</strong> {selectedMovie.year}
                  </div>
                  <div>
                    <strong>Gênero:</strong> {selectedMovie.genre}
                  </div>
                  <div>
                    <strong>Nota:</strong> {selectedMovie.rating}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Atores:</h4>
                  <div className="flex flex-wrap gap-2">
                    {getActorsByIds(selectedMovie.actors).map((actor) => (
                      <Badge key={actor.id} variant="outline">
                        {actor.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Avaliações:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getReviewsByMovieId(selectedMovie.id).map((review) => (
                      <div key={review.id} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{review.reviewer}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span>{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))}
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
                  <h4 className="font-semibold mb-2">Filmes:</h4>
                  <div className="space-y-2">
                    {getMoviesByActorId(selectedActor.id).map((movie) => (
                      <div key={movie.id} className="flex justify-between items-center border rounded p-3">
                        <div>
                          <span className="font-medium">{movie.title}</span>
                          <span className="text-gray-500 ml-2">({movie.year})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{movie.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
