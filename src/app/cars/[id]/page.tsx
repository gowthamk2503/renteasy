'use client';

import type { Car } from '@/services/car-rental';
import { getCar, bookCar } from '@/services/car-rental';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, Fuel, Users, Gauge, MapPin } from 'lucide-react'; // Added MapPin
import { useToast } from '@/hooks/use-toast';
import { format, differenceInDays, parseISO } from 'date-fns';

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Get dates from query params or default
   const getInitialDate = (paramName: string, defaultOffsetDays: number): Date => {
    const dateStr = searchParams.get(paramName);
    if (dateStr) {
      try {
        const parsedDate = parseISO(dateStr);
        // Basic validation: check if it's a valid date
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate;
        }
      } catch (e) {
        console.warn(`Invalid date format for ${paramName}: ${dateStr}`);
      }
    }
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + defaultOffsetDays);
    return defaultDate;
  };


  const [startDate, setStartDate] = useState<Date | undefined>(getInitialDate('startDate', 0));
  const [endDate, setEndDate] = useState<Date | undefined>(getInitialDate('endDate', 1));
  const [pickupLocation, setPickupLocation] = useState('Default Location'); // Add state for location

  const carId = params.id as string;

  useEffect(() => {
    if (carId) {
      const fetchCarDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const result = await getCar(carId);
          if (result) {
            setCar(result);
          } else {
            setError('Car not found.');
          }
        } catch (err) {
          console.error('Failed to fetch car details:', err);
          setError('Failed to load car details. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchCarDetails();
    } else {
      setError('Invalid car ID.');
      setLoading(false);
    }
  }, [carId]);

   const calculateTotalCost = () => {
    if (car && startDate && endDate && startDate < endDate) {
      const days = differenceInDays(endDate, startDate);
      return (days < 1 ? 1 : days) * car.pricePerDay; // Minimum 1 day charge
    }
    return 0;
  };

   const handleBooking = async () => {
    if (!car || !startDate || !endDate) {
        toast({ title: 'Error', description: 'Please select valid dates.', variant: 'destructive' });
        return;
    }
    if (startDate >= endDate) {
         toast({ title: 'Error', description: 'End date must be after start date.', variant: 'destructive' });
        return;
    }

    setBookingLoading(true);
    try {
        const bookingDetails = await bookCar(car.id, startDate, endDate);
        toast({
            title: 'Booking Successful!',
            description: `Your booking for ${car.brand} ${car.model} is confirmed (ID: ${bookingDetails.id}). Total cost: $${bookingDetails.totalCost.toFixed(2)}.`,
        });
        // Optionally redirect to a confirmation page or booking history
        // router.push('/bookings'); // Example redirect
    } catch (err) {
        console.error('Booking failed:', err);
        toast({
            title: 'Booking Failed',
            description: 'Could not complete the booking. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setBookingLoading(false);
    }
   };

  if (loading) {
    return (
         <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
         </div>
        );
  }

  if (error) {
    return <p className="text-center text-destructive mt-8">{error}</p>;
  }

  if (!car) {
    return <p className="text-center text-muted-foreground mt-8">Car details not available.</p>;
  }

  const totalCost = calculateTotalCost();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Car Details & Image */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="overflow-hidden shadow-lg">
           <div className="relative w-full h-64 md:h-96">
             <Image
               src={car.imageUrl || 'https://picsum.photos/800/600'}
               alt={`${car.brand} ${car.model}`}
               layout="fill"
               objectFit="cover"
               data-ai-hint="car vehicle"
               className="transition-transform duration-300 hover:scale-105"
             />
           </div>
           <CardHeader>
            <CardTitle className="text-3xl font-bold">{car.brand} {car.model}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">{car.type}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                 <div className="flex items-center gap-2">
                     <Fuel className="w-5 h-5 text-primary" />
                     <span>{car.fuelType}</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <Users className="w-5 h-5 text-primary" />
                     <span>{car.seatingCapacity} Seats</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <Gauge className="w-5 h-5 text-primary" />
                     <span>{car.mileage} mi range</span> {/* Assuming mileage means range */}
                 </div>
             </div>
             <Separator />
             {/* Add more details/description if available */}
             <p className="text-foreground">
                A reliable and comfortable {car.type.toLowerCase()} perfect for your next trip. Enjoy the smooth ride and modern features of the {car.brand} {car.model}.
             </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Form */}
      <div className="lg:col-span-1 space-y-6">
         <Card className="shadow-lg sticky top-24"> {/* Make booking card sticky */}
           <CardHeader>
            <CardTitle className="text-2xl">Book This Car</CardTitle>
            <CardDescription>Select your dates and confirm booking.</CardDescription>
          </CardHeader>
           <CardContent className="space-y-4">
            {/* Pickup Location (Example - Could be a Select or Input) */}
             <div className="space-y-2">
                <Label htmlFor="pickupLocation" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Pickup Location
                </Label>
                 {/* For now, just display it. Could be an input/select later */}
                 <p id="pickupLocation" className="text-sm p-2 border rounded-md bg-secondary">
                    {pickupLocation}
                 </p>
            </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate" className="flex items-center gap-2">
                         <CalendarIcon className="w-4 h-4" /> Start Date
                    </Label>
                    <DatePicker date={startDate} setDate={setStartDate} className="w-full"/>
                </div>
                <div className="space-y-2">
                     <Label htmlFor="endDate" className="flex items-center gap-2">
                         <CalendarIcon className="w-4 h-4" /> End Date
                     </Label>
                    <DatePicker date={endDate} setDate={setEndDate} className="w-full"/>
                </div>
             </div>
             <Separator />
              <div className="flex justify-between items-center font-semibold">
                <span>Price per day:</span>
                <span>${car.pricePerDay.toFixed(2)}</span>
              </div>
             {totalCost > 0 && (
                 <div className="flex justify-between items-center text-lg font-bold text-primary">
                    <span>Total Cost:</span>
                    <span>${totalCost.toFixed(2)}</span>
                </div>
             )}
           </CardContent>
          <CardFooter>
            <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleBooking}
                disabled={bookingLoading || totalCost <= 0}
            >
              {bookingLoading ? 'Booking...' : (totalCost > 0 ? 'Book Now' : 'Select Valid Dates')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
