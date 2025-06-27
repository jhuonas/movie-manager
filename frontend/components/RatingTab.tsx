import React from "react"
import { Star, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import RatingForm from "@/components/forms/RatingForm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Pagination from "@/components/Pagination"

export default function RatingTab({
  ratings,
  setRatings,
  loading,
  error,
  currentPage,
  setCurrentPage,
  movies,
  setMovies,
  selectedMovieForRating,
  setSelectedMovieForRating,
  isFormOpen,
  onFormClose,
  onRatingDelete,
  totalPages,
  onPageChange,
  itemsPerPage,
}: any) {
  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const currentRatings = paginateItems(ratings, currentPage)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading ratings...</span>
      </div>
    )
  }
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ratings</h2>
        <div className="flex gap-2">
          <Select onValueChange={(value) => setSelectedMovieForRating(Number.parseInt(value))}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select movie" />
            </SelectTrigger>
            <SelectContent>
              {movies.map((movie: any) => (
                <SelectItem key={movie.id} value={movie.id.toString()}>
                  {movie.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isFormOpen} onOpenChange={onFormClose}>
            <DialogTrigger asChild>
              <Button disabled={!selectedMovieForRating}>
                <Plus className="h-4 w-4 mr-2" />
                Add Rating
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Rating</DialogTitle>
              </DialogHeader>
              {selectedMovieForRating && (
                <RatingForm movieId={selectedMovieForRating} onClose={onFormClose} setRatings={setRatings} ratings={ratings} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="space-y-4">
        {currentRatings.map((rating: any) => {
          const movie = movies.find((m: any) => m.id === rating.movieId)
          return (
            <Card key={rating.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{movie?.title}</h3>
                    <p className="text-sm text-gray-600">by {rating.reviewerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{parseFloat(rating.score).toFixed(1)}</span>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => onRatingDelete(rating.id)}>
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
      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
    </>
  )
} 