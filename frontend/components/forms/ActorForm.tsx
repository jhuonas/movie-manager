import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CreateActorDto, actorsApi } from "@/lib/api"

export default function ActorForm({ actor, onClose, setActors, setError }: any) {
  const [formData, setFormData] = useState({
    name: actor?.name || "",
    biography: actor?.biography || "",
    nationality: actor?.nationality || "",
    birthDate: actor?.birthDate || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const reloadActors = async () => {
    try {
      const response = await actorsApi.getAll()
      setActors(response.data)
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError?.('Authentication error: Invalid or missing token')
      } else {
        setError?.('Error loading actors')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)
    try {
      if (actor) {
        const response = await actorsApi.update(actor.id, formData)
        await reloadActors()
      } else {
        const response = await actorsApi.create(formData as CreateActorDto)
        await reloadActors()
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
        setError?.('Error saving actor')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="biography">Biography</Label>
        <Textarea
          id="biography"
          value={formData.biography}
          onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="nationality">Nationality</Label>
        <Input
          id="nationality"
          value={formData.nationality}
          onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isSuccess ? "Saved!" : "Saving...") : (actor ? "Update Actor" : "Add Actor")}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  )
} 