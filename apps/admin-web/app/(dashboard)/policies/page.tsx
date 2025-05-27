"use client"

import * as React from "react"
import { PolicyTable, type Policy } from "@/components/PolicyTable"
import { PolicyForm, type PolicyFormData } from "@/components/PolicyForm"
import { toast } from "sonner"

// Mock data for development - replace with actual data fetching
const mockPolicies: Policy[] = [
  {
    id: "1",
    policyNo: "POL-2024-001",
    vehiclePlate: "ABC 1234",
    coverage: "First Party",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    documentUrl: "https://example.com/policy1.pdf"
  },
  {
    id: "2",
    policyNo: "POL-2024-002",
    vehiclePlate: "XYZ 5678",
    coverage: "Third Party",
    startDate: "2024-02-01",
    endDate: "2024-01-31",
    status: "pending",
  },
  {
    id: "3",
    policyNo: "POL-2023-050",
    vehiclePlate: "DEF 9012",
    coverage: "First Party",
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    status: "expired",
    documentUrl: "https://example.com/policy3.pdf"
  }
]

export default function PoliciesPage() {
  const [policies, setPolicies] = React.useState<Policy[]>(mockPolicies)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingPolicy, setEditingPolicy] = React.useState<Policy | null>(null)

  const handleNewPolicy = () => {
    setEditingPolicy(null)
    setIsFormOpen(true)
  }

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy)
    setIsFormOpen(true)
  }

  const handleDeletePolicy = async (policyId: string) => {
    if (confirm("Are you sure you want to delete this policy?")) {
      try {
        // TODO: Call server action to delete policy
        setPolicies(prev => prev.filter(p => p.id !== policyId))
        toast.success("Policy deleted successfully")
      } catch (error) {
        toast.error("Failed to delete policy")
      }
    }
  }

  const handleSubmitPolicy = async (data: PolicyFormData) => {
    try {
      if (editingPolicy) {
        // Update existing policy
        const updatedPolicy: Policy = {
          ...editingPolicy,
          policyNo: data.policyNo,
          vehiclePlate: data.vehiclePlate,
          coverage: data.coverageType === "FirstParty" ? "First Party" : "Third Party",
          startDate: data.startDate,
          endDate: data.endDate,
          status: "active", // Default status
        }
        
        setPolicies(prev => 
          prev.map(p => p.id === editingPolicy.id ? updatedPolicy : p)
        )
        toast.success("Policy updated successfully")
      } else {
        // Create new policy
        const newPolicy: Policy = {
          id: Date.now().toString(), // Temporary ID
          policyNo: data.policyNo,
          vehiclePlate: data.vehiclePlate,
          coverage: data.coverageType === "FirstParty" ? "First Party" : "Third Party",
          startDate: data.startDate,
          endDate: data.endDate,
          status: "pending", // Default status for new policies
        }
        
        setPolicies(prev => [newPolicy, ...prev])
        toast.success("Policy created successfully")
      }
      
      setIsFormOpen(false)
      setEditingPolicy(null)
    } catch (error) {
      toast.error("Failed to save policy")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Policies</h1>
        <p className="text-muted-foreground">
          Manage insurance policies and documents
        </p>
      </div>

      <PolicyTable
        policies={policies}
        onEdit={handleEditPolicy}
        onDelete={handleDeletePolicy}
        onNewPolicy={handleNewPolicy}
      />

      <PolicyForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmitPolicy}
        initialData={editingPolicy ? {
          policyNo: editingPolicy.policyNo,
          vehiclePlate: editingPolicy.vehiclePlate,
          coverageType: editingPolicy.coverage === "First Party" ? "FirstParty" : "ThirdParty",
          startDate: editingPolicy.startDate,
          endDate: editingPolicy.endDate,
          premium: "1500.00", // Default value
          insurer: "Default Insurer", // Default value
        } : undefined}
        title={editingPolicy ? "Edit Policy" : "Add New Policy"}
      />
    </div>
  )
} 