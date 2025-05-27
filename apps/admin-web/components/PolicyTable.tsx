"use client"

import * as React from "react"
import { Search, Plus, Download, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Policy {
  id: string
  policyNo: string
  vehiclePlate: string
  coverage: string
  startDate: string
  endDate: string
  status: "active" | "expired" | "pending"
  documentUrl?: string
}

interface PolicyTableProps {
  policies: Policy[]
  onEdit?: (policy: Policy) => void
  onDelete?: (policyId: string) => void
  onNewPolicy?: () => void
  isReadOnly?: boolean
}

const statusVariants = {
  active: "default",
  expired: "destructive",
  pending: "secondary",
} as const

export function PolicyTable({
  policies,
  onEdit,
  onDelete,
  onNewPolicy,
  isReadOnly = false,
}: PolicyTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")

  const filteredPolicies = React.useMemo(() => {
    return policies.filter((policy) => {
      const matchesSearch = 
        policy.policyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || policy.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [policies, searchTerm, statusFilter])

  const handleDownload = (documentUrl: string) => {
    window.open(documentUrl, '_blank')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Policies</CardTitle>
          {!isReadOnly && (
            <Button onClick={onNewPolicy}>
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("pending")}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "expired" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("expired")}
            >
              Expired
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Policy No</TableHead>
              <TableHead>Vehicle Plate</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell className="font-medium">{policy.policyNo}</TableCell>
                <TableCell>{policy.vehiclePlate}</TableCell>
                <TableCell>{policy.coverage}</TableCell>
                <TableCell>{new Date(policy.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(policy.endDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={statusVariants[policy.status]}>
                    {policy.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {policy.documentUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(policy.documentUrl!)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    )}
                    {!isReadOnly && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit?.(policy)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onDelete?.(policy.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {filteredPolicies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No policies found
          </div>
        )}
      </CardContent>
    </Card>
  )
} 