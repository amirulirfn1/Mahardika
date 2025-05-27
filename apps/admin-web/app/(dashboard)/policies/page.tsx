import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PoliciesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Policies</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Policy Management</CardTitle>
          <CardDescription>Manage insurance policies and coverage details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Policy management functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
