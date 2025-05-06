import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  // In a real app, you'd fetch dashboard data here

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Cars</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Add, edit, or remove car listings.</p>
            <Link href="/admin/cars">
              <Button variant="outline">Go to Cars</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">View and manage user bookings.</p>
            <Link href="/admin/bookings">
             <Button variant="outline">Go to Bookings</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Add more cards for other admin features as needed */}

      </div>
    </div>
  );
}
