"use client"

import * as React from "react"
import { UserTableAdmin, type UserProfile } from "@/components/UserTableAdmin"
import { toast } from "sonner"

// Mock data for development - replace with actual data fetching
const mockUsers: UserProfile[] = [
  {
    id: "user-1",
    full_name: "Admin User",
    phone: "+60123456789",
    role: "admin",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "user-2", 
    full_name: "John Smith",
    phone: "+60198765432",
    role: "staff",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z"
  },
  {
    id: "user-3",
    full_name: "Mary Johnson",
    phone: "+60187654321",
    role: "customer",
    created_at: "2024-01-20T00:00:00Z", 
    updated_at: "2024-01-20T00:00:00Z"
  },
  {
    id: "user-4",
    full_name: "Sarah Wilson",
    phone: "+60176543210",
    role: "customer",
    created_at: "2024-01-25T00:00:00Z",
    updated_at: "2024-01-25T00:00:00Z"
  },
  {
    id: "user-5",
    full_name: "Michael Brown",
    phone: "+60165432109",
    role: "staff",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z"
  },
  {
    id: "user-6",
    full_name: "Emily Davis",
    phone: null,
    role: "customer",
    created_at: "2024-02-05T00:00:00Z",
    updated_at: "2024-02-05T00:00:00Z"
  }
]

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserProfile[]>(mockUsers)
  const currentUserId = "user-1" // This would come from auth context

  const handleRoleChange = async (userId: string, newRole: UserProfile["role"]) => {
    try {
      // TODO: Call server action or RPC function to update role
      // await updateUserRole(userId, newRole)
      
      // Optimistically update local state
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, role: newRole, updated_at: new Date().toISOString() }
            : user
        )
      )
      
      // This success toast will be handled by the UserTableAdmin component
      // toast.success(`User role updated to ${newRole}`)
      
    } catch (error) {
      // Revert optimistic update on error
      console.error("Failed to update user role:", error)
      throw error // Re-throw to let UserTableAdmin handle the error toast
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">
          Manage user roles and permissions across the platform
        </p>
      </div>

      <UserTableAdmin
        users={users}
        onRoleChange={handleRoleChange}
        currentUserId={currentUserId}
      />
    </div>
  )
} 