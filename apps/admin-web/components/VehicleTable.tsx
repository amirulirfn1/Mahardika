"use client"

import * as React from "react"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Vehicle {
  id: string
  plateNo: string
  make: string
  model: string
  year: string
  engineCc?: string
}

interface VehicleTableProps {
  vehicles: Vehicle[]
  onEdit?: (vehicle: Vehicle) => void
  onDelete?: (vehicleId: string) => void
  onNewVehicle?: () => void
  isReadOnly?: boolean
}

export function VehicleTable({
  vehicles,
  onEdit,
  onDelete,
  onNewVehicle,
  isReadOnly = false,
}: VehicleTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")

  const filteredVehicles = React.useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = 
        vehicle.plateNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesSearch
    })
  }, [vehicles, searchTerm])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Vehicles</CardTitle>
          {!isReadOnly && (
            <Button onClick={onNewVehicle}>
              <Plus className="h-4 w-4 mr-2" />
              New Vehicle
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plate Number</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Engine CC</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicles.map((vehicle) => (
              <TableRow key={vehicle.id}>
                <TableCell className="font-medium">{vehicle.plateNo}</TableCell>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.engineCc || "-"}</TableCell>
                <TableCell>
                  {!isReadOnly && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(vehicle)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete?.(vehicle.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredVehicles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No vehicles found
          </div>
        )}
      </CardContent>
    </Card>
  )
} 