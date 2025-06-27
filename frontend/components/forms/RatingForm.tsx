import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateRatingDto, ratingsApi } from "@/lib/api"

export default function RatingForm({ movieId, onClose, setRatings, setError, onRatingAdded }: any) {
  const [formData, setFormData] = useState({
    reviewerName: "",
    comment: "",
    score: 0,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const reloadRatings = async () => {
    try {
      const response = await ratingsApi.getAll()
      setRatings(response.data)
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError?.('Authentication error: Invalid or missing token')
      } else {
        setError?.('Error loading ratings')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)
    try {
      const response = await ratingsApi.create({
        movieId,
        ...formData,
      } as CreateRatingDto)
      await reloadRatings()
      setError?.(null)
      setIsSuccess(true)
      onRatingAdded?.()
      setTimeout(() => {
        onClose()
      }, 500)
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError?.('Authentication error: Invalid or missing token')
      } else {
        setError?.('Error saving rating')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="reviewerName">Reviewer Name</Label>
        <Input
          id="reviewerName"
          value={formData.reviewerName}
          onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="score">Score (0.5-5.0)</Label>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isSuccess ? "Saved!" : "Saving...") : "Add Rating"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
} 