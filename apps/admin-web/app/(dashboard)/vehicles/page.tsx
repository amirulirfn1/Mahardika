import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VehiclesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Vehicles</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Management</CardTitle>
          <CardDescription>Manage vehicle information and insurance details.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Vehicle management functionality will be implemented here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
