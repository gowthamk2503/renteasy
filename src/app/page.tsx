'use client';

import type { FormEvent } from 'react';
import React, { useState, useEffect } from 'react';
import type { Car } from '@/services/car-rental';
import { searchCars } from '@/services/car-rental';
import CarCard from '@/components/CarCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker'; // Assuming DatePicker exists
import { format } from 'date-fns';

export default function Home() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [carType, setCarType] = useState<string | undefined>(undefined); // Use undefined for initial state
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [error, setError] = useState<string | null>(null);

  // Fetch initial car data (can be modified later to fetch based on default criteria)
  useEffect(() => {
    const fetchInitialCars = async () => {
      setLoading(true);
      setError(null);
      try {
        // Provide default search criteria for initial load
        const defaultCriteria = {
          location: '', // Or a default location
          startDate: new Date(), // Today
          endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
        };
        const result = await searchCars(defaultCriteria);
        setCars(result);
      } catch (err) {
        console.error('Failed to fetch cars:', err);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialCars();
  }, []);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      setLoading(false);
      return;
    }

    if (startDate >= endDate) {
      setError('End date must be after start date.');
      setLoading(false);
      return;
    }

    try {
      const criteria = {
        location,
        startDate,
        endDate,
      };
      const result = await searchCars(criteria);
      // Apply client-side filtering for car type if selected
      const filteredResult = carType
        ? result.filter((car) => car.type.toLowerCase() === carType.toLowerCase())
        : result;
      setCars(filteredResult);
    } catch (err) {
      console.error('Failed to search cars:', err);
      setError('Failed to search cars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <Card className="bg-secondary shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Find Your Perfect Ride</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter city or address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carType">Car Type</Label>
              <Select value={carType} onValueChange={setCarType}>
                <SelectTrigger id="carType" className="bg-background">
                  <SelectValue placeholder="Any Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  {/* Add more types as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker date={startDate} setDate={setStartDate} className="bg-background"/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <DatePicker date={endDate} setDate={setEndDate} className="bg-background"/>
            </div>
            <Button type="submit" className="w-full lg:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              Search Cars
            </Button>
          </form>
           {error && <p className="text-destructive mt-4 text-center">{error}</p>}
        </CardContent>
      </Card>

      {/* Car Listing */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Available Cars</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Skeleton Loaders */}
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-4 space-y-2">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
           <p className="text-destructive text-center">{error}</p>
        ) : cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} startDate={startDate} endDate={endDate} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mt-8">No cars found matching your criteria. Try adjusting your search.</p>
        )}
      </div>
    </div>
  );
}
