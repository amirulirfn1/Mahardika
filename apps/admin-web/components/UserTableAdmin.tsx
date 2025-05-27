"use client"

import * as React from "react"
import { Search, UserCheck, Shield, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export interface UserProfile {
  id: string
  full_name: string | null
  phone: string | null
  role: "admin" | "staff" | "customer"
  created_at: string
  updated_at: string
}

interface UserTableAdminProps {
  users: UserProfile[]
  onRoleChange: (userId: string, newRole: UserProfile["role"]) => Promise<void>
  currentUserId?: string
}

const roleVariants = {
  admin: "destructive",
  staff: "default",
  customer: "secondary",
} as const

const roleIcons = {
  admin: Shield,
  staff: UserCheck,
  customer: Users,
} as const

export function UserTableAdmin({
  users,
  onRoleChange,
  currentUserId,
}: UserTableAdminProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [loadingUsers, setLoadingUsers] = React.useState<Set<string>>(new Set())

  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  const handleRoleChange = async (userId: string, newRole: UserProfile["role"]) => {
    if (userId === currentUserId && newRole !== "admin") {
      toast.error("You cannot change your own admin role")
      return
    }

    setLoadingUsers(prev => new Set(prev).add(userId))
    
    try {
      await onRoleChange(userId, newRole)
      toast.success(`User role updated to ${newRole}`)
    } catch (error) {
      toast.error("Failed to update user role")
      console.error("Role update error:", error)
    } finally {
      setLoadingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleStats = () => {
    const stats = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      admin: stats.admin || 0,
      staff: stats.staff || 0,
      customer: stats.customer || 0,
      total: users.length
    }
  }

  const stats = getRoleStats()

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Users</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Admins</p>
                <p className="text-2xl font-bold">{stats.admin}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Staff</p>
                <p className="text-2xl font-bold">{stats.staff}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Customers</p>
                <p className="text-2xl font-bold">{stats.customer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role]
                const isCurrentUser = user.id === currentUserId
                const isLoading = loadingUsers.has(user.id)
                
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <RoleIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">
                            {user.full_name || "Unnamed User"}
                            {isCurrentUser && (
                              <span className="text-xs text-blue-600 ml-2">(You)</span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {user.phone && (
                          <p className="font-mono">{user.phone}</p>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant={roleVariants[user.role]} className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                    
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(newRole: UserProfile["role"]) => 
                          handleRoleChange(user.id, newRole)
                        }
                        disabled={isLoading || (isCurrentUser && user.role === "admin")}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 