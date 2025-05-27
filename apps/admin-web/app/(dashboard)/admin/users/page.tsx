import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage system users and their permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            User management functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
