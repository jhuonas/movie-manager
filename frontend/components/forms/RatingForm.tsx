import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateRatingDto, ratingsApi, Rating } from "@/lib/api"

export default function RatingForm({ movieId, onClose, setRatings, setError, ratings }: any) {
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
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError?.('Authentication error: Invalid or missing token')
      } else {
        setError?.('Error saving rating')
      }
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
        <Button type="submit">Add Rating</Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
} 