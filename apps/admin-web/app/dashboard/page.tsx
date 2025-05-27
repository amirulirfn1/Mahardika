"use client";

import { useAuth } from "@/providers/auth-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, FileText, CreditCard, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, profile, signOut } = useAuth();

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mahardika Insurance</h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{profile.full_name || "User"}</p>
                <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
              </div>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {profile.full_name || "User"}!
            </h2>
            <p className="text-gray-600">
              Manage insurance policies, track renewals, and monitor customer loyalty points.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Coming soon</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and navigation shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center" disabled>
                  <FileText className="h-6 w-6 mb-2" />
                  Manage Policies
                  <span className="text-xs opacity-70">Coming soon</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center" disabled>
                  <Users className="h-6 w-6 mb-2" />
                  Customer Management
                  <span className="text-xs opacity-70">Coming soon</span>
                </Button>
                <Button className="h-20 flex flex-col items-center justify-center" disabled>
                  <CreditCard className="h-6 w-6 mb-2" />
                  Payment Records
                  <span className="text-xs opacity-70">Coming soon</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system information and health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Connection</span>
                  <span className="text-sm text-green-600 font-medium">✓ Connected</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Authentication Service</span>
                  <span className="text-sm text-green-600 font-medium">✓ Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Renewal Reminders</span>
                  <span className="text-sm text-green-600 font-medium">✓ Scheduled</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">File Storage</span>
                  <span className="text-sm text-green-600 font-medium">✓ Available</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
