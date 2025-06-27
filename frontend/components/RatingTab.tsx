import React from "react"
import { Star, Plus, Trash2, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import RatingForm from "@/components/forms/RatingForm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Pagination from "@/components/Pagination"

export default function RatingTab({
  ratings,
  setRatings,
  loading,
  setError,
  currentPage,
  movies,
  selectedMovieForRating,
  setSelectedMovieForRating,
  isFormOpen,
  onFormClose,
  onRatingDelete,
  onPageChange,
  itemsPerPage,
  onRatingFormOpen,
}: any) {
  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const currentRatings = paginateItems(ratings, currentPage)
  const totalPages = Math.ceil(ratings.length / itemsPerPage)

  const handleRatingAdded = () => {
    setSelectedMovieForRating(null)
  }

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
          <Select
            value={selectedMovieForRating?.toString() || ""}
            onValueChange={(value) => setSelectedMovieForRating(Number.parseInt(value))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select movie" />
            </SelectTrigger>
            <SelectContent>
              {movies.length > 0 ? movies.map((movie: any) => (
                <SelectItem key={movie.id} value={movie.id.toString()}>
                  {movie.title}
                </SelectItem>
              )) : (
                <SelectItem value="" disabled>
                  No movies available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {selectedMovieForRating && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedMovieForRating(null)}
            >
              Clear
            </Button>
          )}
          <Button
            disabled={!selectedMovieForRating}
            onClick={() => onRatingFormOpen()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rating
          </Button>
          <Dialog open={isFormOpen} onOpenChange={onFormClose}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Rating</DialogTitle>
              </DialogHeader>
              {selectedMovieForRating && (
                <RatingForm
                  movieId={selectedMovieForRating}
                  onClose={onFormClose}
                  setRatings={setRatings}
                  ratings={ratings}
                  setError={setError}
                  onRatingAdded={handleRatingAdded}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="space-y-4">
        {currentRatings.map((rating: any) => {
          return (
            <Card key={rating.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{rating.movieTitle}</h3>
                      <span className="text-sm text-gray-500">({rating.movieReleaseYear})</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="font-medium">Reviewer:</span> {rating.reviewerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="font-medium">Date:</span> {new Date(rating.createdAt).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-bold text-lg">{parseFloat(rating.score).toFixed(1)}</span>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => onRatingDelete(rating.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="border-t pt-3">
                  <p className="text-gray-700 leading-relaxed">{rating.comment}</p>
                </div>
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