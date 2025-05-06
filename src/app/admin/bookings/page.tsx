'use client'; // Add this directive

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, CheckCircle, XCircle } from 'lucide-react'; // Example icons
import React from 'react'; // Import React for potential future state management

// Mock data - replace with actual API fetch
const mockBookings = [
  { id: 'bk1', carModel: 'Tesla Model X', user: 'Alice', startDate: '2024-08-01', endDate: '2024-08-05', totalCost: 250, status: 'Confirmed' },
  { id: 'bk2', carModel: 'Toyota Camry', user: 'Bob', startDate: '2024-08-03', endDate: '2024-08-07', totalCost: 120, status: 'Completed' },
  { id: 'bk3', carModel: 'Tesla Model X', user: 'Charlie', startDate: '2024-08-10', endDate: '2024-08-12', totalCost: 100, status: 'Cancelled' },
   { id: 'bk4', carModel: 'Honda Civic', user: 'David', startDate: '2024-08-15', endDate: '2024-08-18', totalCost: 90, status: 'Pending Approval' }, // Example Pending
];

export default function AdminBookingsPage() {
  // In a real app, fetch bookings data here, handle loading/error states
  // Example: const [bookings, setBookings] = React.useState(mockBookings);

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'default';
      case 'completed': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'pending approval': return 'outline';
      default: return 'secondary';
    }
  };

  const handleApprove = (bookingId: string) => {
      console.log(`Approving booking ${bookingId}`);
      // Add API call logic here
      // Example: Update booking status in state and call API
      // setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Confirmed' } : b));
  };

    const handleDecline = (bookingId: string) => {
        console.log(`Declining booking ${bookingId}`);
        // Add API call logic here
        // Example: Update booking status in state and call API
        // setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
    };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Bookings</h1>

      {/* Add filtering options here (e.g., by status, date range) */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking ID</TableHead>
            <TableHead>Car Model</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Dates</TableHead>
            <TableHead>Total Cost</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.id}</TableCell>
              <TableCell>{booking.carModel}</TableCell>
              <TableCell>{booking.user}</TableCell>
              <TableCell>{booking.startDate} to {booking.endDate}</TableCell>
              <TableCell>${booking.totalCost.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(booking.status)}>
                  {booking.status}
                </Badge>
              </TableCell>
              <TableCell className="space-x-1">
                <Button variant="ghost" size="icon">
                   <Eye className="h-4 w-4" />
                   <span className="sr-only">View Details</span>
                </Button>
                 {booking.status === 'Pending Approval' && (
                     <>
                        <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700" onClick={() => handleApprove(booking.id)}>
                            <CheckCircle className="h-4 w-4" />
                            <span className="sr-only">Approve</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700" onClick={() => handleDecline(booking.id)}>
                             <XCircle className="h-4 w-4" />
                             <span className="sr-only">Decline</span>
                        </Button>
                     </>
                 )}
                 {/* Add other actions like Edit or Cancel if applicable */}
              </TableCell>
            </TableRow>
          ))}
          {mockBookings.length === 0 && (
             <TableRow>
                <TableCell colSpan={7} className="text-center">No bookings found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
