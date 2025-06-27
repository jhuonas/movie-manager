import React, { useState } from "react"
import { Users, Plus, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ActorForm from "@/components/forms/ActorForm"
import Pagination from "@/components/Pagination"

export default function ActorTab({
  actors,
  setActors,
  loading,
  setError,
  currentPage,
  setSelectedActor,
  isFormOpen,
  onFormClose,
  onActorDelete,
  onActorSelect,
  onPageChange,
  itemsPerPage,
  searchTerm,
  onActorFormOpen,
}: any) {
  const [editingActor, setEditingActor] = useState<any>(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)

  const paginateItems = <T,>(items: T[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const filteredActors = actors.filter((actor: any) =>
    actor.name.toLowerCase().includes(searchTerm?.toLowerCase() || '') ||
    actor.nationality.toLowerCase().includes(searchTerm?.toLowerCase() || '')
  )
  const currentActors = paginateItems(filteredActors, currentPage)
  const totalPages = Math.ceil(filteredActors.length / itemsPerPage)

  const handleEditActor = (actor: any): void => {
    setEditingActor(actor)
    setIsEditFormOpen(true)
  }

  const handleCloseEditForm = (): void => {
    setIsEditFormOpen(false)
    setEditingActor(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Loading actors...</span>
      </div>
    )
  }
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Actors</h2>
        <Button onClick={() => onActorFormOpen()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Actor
        </Button>
        <Dialog open={isFormOpen} onOpenChange={onFormClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Actor</DialogTitle>
            </DialogHeader>
            <ActorForm onClose={onFormClose} setActors={setActors} actors={actors} setError={setError} />
          </DialogContent>
        </Dialog>
        <Dialog open={isEditFormOpen} onOpenChange={handleCloseEditForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Actor</DialogTitle>
            </DialogHeader>
            <ActorForm
              actor={editingActor}
              onClose={handleCloseEditForm}
              setActors={setActors}
              actors={actors}
              setError={setError}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentActors.map((actor: any) => (
          <Card key={actor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{actor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Nationality:</strong> {actor.nationality}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Birth Date:</strong> {new Date(actor.birthDate).toLocaleDateString("en-US")}
              </p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{actor.biography}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onActorSelect(actor)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEditActor(actor)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onActorDelete(actor.id)}>
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