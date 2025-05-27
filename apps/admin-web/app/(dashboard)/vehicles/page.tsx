"use client"

import * as React from "react"
import { VehicleTable, type Vehicle } from "@/components/VehicleTable"
import { VehicleForm, type VehicleFormData } from "@/components/VehicleForm"
import { toast } from "sonner"

// Mock data for development - replace with actual data fetching
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    plateNo: "ABC 1234",
    make: "Toyota",
    model: "Camry",
    year: "2022",
    engineCc: "2000"
  },
  {
    id: "2",
    plateNo: "XYZ 5678",
    make: "Honda",
    model: "Civic",
    year: "2023",
    engineCc: "1500"
  },
  {
    id: "3",
    plateNo: "DEF 9012",
    make: "Nissan",
    model: "Almera",
    year: "2021",
  }
]

export default function VehiclesPage() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>(mockVehicles)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingVehicle, setEditingVehicle] = React.useState<Vehicle | null>(null)

  const handleNewVehicle = () => {
    setEditingVehicle(null)
    setIsFormOpen(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle)
    setIsFormOpen(true)
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        // TODO: Call server action to delete vehicle
        setVehicles(prev => prev.filter(v => v.id !== vehicleId))
        toast.success("Vehicle deleted successfully")
      } catch (error) {
        toast.error("Failed to delete vehicle")
      }
    }
  }

  const handleSubmitVehicle = async (data: VehicleFormData) => {
    try {
      if (editingVehicle) {
        // Update existing vehicle
        const updatedVehicle: Vehicle = {
          ...editingVehicle,
          plateNo: data.plateNo,
          make: data.make,
          model: data.model,
          year: data.year,
          engineCc: data.engineCc,
        }
        
        setVehicles(prev => 
          prev.map(v => v.id === editingVehicle.id ? updatedVehicle : v)
        )
        toast.success("Vehicle updated successfully")
      } else {
        // Create new vehicle
        const newVehicle: Vehicle = {
          id: Date.now().toString(), // Temporary ID
          plateNo: data.plateNo,
          make: data.make,
          model: data.model,
          year: data.year,
          engineCc: data.engineCc,
        }
        
        setVehicles(prev => [newVehicle, ...prev])
        toast.success("Vehicle created successfully")
      }
      
      setIsFormOpen(false)
      setEditingVehicle(null)
    } catch (error) {
      toast.error("Failed to save vehicle")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Vehicles</h1>
        <p className="text-muted-foreground">
          Manage vehicle information and registrations
        </p>
      </div>

      <VehicleTable
        vehicles={vehicles}
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
        onNewVehicle={handleNewVehicle}
      />

      <VehicleForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitVehicle}
        initialData={editingVehicle ? {
          plateNo: editingVehicle.plateNo,
          make: editingVehicle.make,
          model: editingVehicle.model,
          year: editingVehicle.year,
          engineCc: editingVehicle.engineCc,
        } : undefined}
        title={editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
      />
    </div>
  )
} 