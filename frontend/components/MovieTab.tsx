import React from "react"
import { Film, Star, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import MovieForm from "@/components/forms/MovieForm"
import Pagination from "@/components/Pagination"

export default function MovieTab({
  movies,
  setMovies,
  loading,
  error,
  currentPage,
  setCurrentPage,
  setSelectedMovie,
  isFormOpen,
  onFormClose,
  onMovieDelete,
  onMovieEdit,
  onMovieSelect,
  totalPages,
  onPageChange,
  itemsPerPage,
}: any) {
  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const currentMovies = paginateItems(movies, currentPage)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading movies...</span>
      </div>
    )
  }
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Movies</h2>
        <Dialog open={isFormOpen} onOpenChange={onFormClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Movie</DialogTitle>
            </DialogHeader>
            <MovieForm onClose={onFormClose} setMovies={setMovies} movies={movies} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentMovies.map((movie: any) => (
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
                <Button size="sm" variant="outline" onClick={() => onMovieSelect(movie)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Movie</DialogTitle>
                    </DialogHeader>
                    <MovieForm movie={movie} onClose={() => onMovieEdit(null)} setMovies={setMovies} movies={movies} />
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="destructive" onClick={() => onMovieDelete(movie.id)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </>
  )
} 