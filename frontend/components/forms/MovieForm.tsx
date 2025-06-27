import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateMovieDto, moviesApi } from "@/lib/api"

export default function MovieForm({ movie, onClose, setMovies, setError }: any) {
  const [formData, setFormData] = useState({
    title: movie?.title || "",
    description: movie?.description || "",
    releaseYear: movie?.releaseYear || new Date().getFullYear(),
    genre: movie?.genre || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const reloadMovies = async () => {
    try {
      const response = await moviesApi.getAll()
      setMovies(response.data)
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError?.('Authentication error: Invalid or missing token')
      } else {
        setError?.('Error loading movies')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)
    try {
      if (movie) {
        const response = await moviesApi.update(movie.id, formData)
        await reloadMovies()
      } else {
        const response = await moviesApi.create(formData as CreateMovieDto)
        await reloadMovies()
      }
      setError?.(null)
      setIsSuccess(true)
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError?.('Authentication error: Invalid or missing token')
      } else {
        setError?.('Error saving movie')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="releaseYear">Release Year</Label>
        <Input
          id="releaseYear"
          type="number"
          value={formData.releaseYear}
          onChange={(e) => setFormData({ ...formData, releaseYear: Number.parseInt(e.target.value) })}
          required
        />
      </div>
      <div>
        <Label htmlFor="genre">Genre</Label>
        <Input
          id="genre"
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isSuccess ? "Saved!" : "Saving...") : (movie ? "Update Movie" : "Add Movie")}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
} 