'use client';

import React, { useState, useEffect } from 'react';
import type { Car } from '@/services/car-rental';
import { searchCars, getCar } from '@/services/car-rental'; // Assume these exist and work for admin too
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea exists
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// Mock functions for add/edit/delete - replace with actual API calls
async function addCarApi(carData: Omit<Car, 'id'>): Promise<Car> {
  console.log('Adding car:', carData);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  const newId = Math.random().toString(36).substring(7);
  const newCar = { ...carData, id: newId };
  // In a real app, update the backend and potentially re-fetch the list
  return newCar;
}

async function editCarApi(carData: Car): Promise<Car> {
  console.log('Editing car:', carData);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, update the backend and potentially re-fetch the list
  return carData;
}

async function deleteCarApi(carId: string): Promise<void> {
    console.log('Deleting car:', carId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, update the backend and potentially re-fetch the list
}


export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [formData, setFormData] = useState<Omit<Car, 'id'>>({
    model: '',
    brand: '',
    type: '',
    pricePerDay: 0,
    fuelType: '',
    seatingCapacity: 0,
    mileage: 0,
    imageUrl: '',
  });
  const { toast } = useToast();

  const fetchAdminCars = async () => {
    setLoading(true);
    try {
       // Using searchCars for demo, ideally use a dedicated admin endpoint
      const result = await searchCars({ location: '', startDate: new Date(), endDate: new Date() });
      setCars(result);
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      toast({
        title: 'Error',
        description: 'Failed to load cars.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminCars();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'pricePerDay' || name === 'seatingCapacity' || name === 'mileage' ? Number(value) : value,
    }));
  };

   const resetForm = () => {
        setFormData({
            model: '',
            brand: '',
            type: '',
            pricePerDay: 0,
            fuelType: '',
            seatingCapacity: 0,
            mileage: 0,
            imageUrl: '',
        });
        setEditingCar(null);
    };

  const handleOpenDialog = (car: Car | null = null) => {
    if (car) {
      setEditingCar(car);
      setFormData({
        model: car.model,
        brand: car.brand,
        type: car.type,
        pricePerDay: car.pricePerDay,
        fuelType: car.fuelType,
        seatingCapacity: car.seatingCapacity,
        mileage: car.mileage,
        imageUrl: car.imageUrl,
      });
    } else {
       resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    // Delay resetting form slightly to avoid UI flicker during close animation
    setTimeout(resetForm, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Indicate loading state during save

    try {
      if (editingCar) {
        // Edit existing car
        const updatedCar = await editCarApi({ ...formData, id: editingCar.id });
        setCars((prevCars) =>
          prevCars.map((c) => (c.id === updatedCar.id ? updatedCar : c))
        );
        toast({ title: 'Success', description: 'Car updated successfully.' });
      } else {
        // Add new car
        const newCar = await addCarApi(formData);
        setCars((prevCars) => [...prevCars, newCar]);
        toast({ title: 'Success', description: 'Car added successfully.' });
      }
       handleCloseDialog(); // Close dialog on success
    } catch (error) {
      console.error('Failed to save car:', error);
      toast({
        title: 'Error',
        description: `Failed to ${editingCar ? 'update' : 'add'} car.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

    const handleDeleteCar = async (carId: string) => {
        if (!window.confirm('Are you sure you want to delete this car?')) {
            return;
        }
        setLoading(true);
        try {
            await deleteCarApi(carId);
            setCars((prevCars) => prevCars.filter((c) => c.id !== carId));
            toast({ title: 'Success', description: 'Car deleted successfully.' });
        } catch (error) {
            console.error('Failed to delete car:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete car.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Cars</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
             <Button onClick={() => handleOpenDialog()}>
               <PlusCircle className="mr-2 h-4 w-4" /> Add New Car
             </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingCar ? 'Edit Car' : 'Add New Car'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {/* Form Fields */}
              <div className="space-y-1">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" name="brand" value={formData.brand} onChange={handleInputChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="model">Model</Label>
                <Input id="model" name="model" value={formData.model} onChange={handleInputChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="type">Type (e.g., SUV, Sedan)</Label>
                <Input id="type" name="type" value={formData.type} onChange={handleInputChange} required />
              </div>
               <div className="space-y-1">
                <Label htmlFor="pricePerDay">Price Per Day ($)</Label>
                <Input id="pricePerDay" name="pricePerDay" type="number" value={formData.pricePerDay} onChange={handleInputChange} required min="0" step="0.01" />
              </div>
               <div className="space-y-1">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Input id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleInputChange} required />
              </div>
               <div className="space-y-1">
                <Label htmlFor="seatingCapacity">Seating Capacity</Label>
                <Input id="seatingCapacity" name="seatingCapacity" type="number" value={formData.seatingCapacity} onChange={handleInputChange} required min="1" />
              </div>
               <div className="space-y-1">
                <Label htmlFor="mileage">Mileage (e.g., 300 miles range)</Label>
                <Input id="mileage" name="mileage" type="number" value={formData.mileage} onChange={handleInputChange} required min="0" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                 <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://picsum.photos/400/300" />
                 {/* Basic image preview */}
                 {formData.imageUrl && (
                    <img src={formData.imageUrl} alt="Preview" className="mt-2 h-20 rounded object-cover" data-ai-hint="car vehicle" />
                 )}
              </div>

             <DialogFooter className="md:col-span-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                 {loading ? 'Saving...' : (editingCar ? 'Save Changes' : 'Add Car')}
                </Button>
             </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading && !isDialogOpen ? ( // Show table loading state only when not in dialog
        <p>Loading cars...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No cars found. Add one to get started!
                </TableCell>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>{car.brand}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.type}</TableCell>
                  <TableCell>${car.pricePerDay.toFixed(2)}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(car)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCar(car.id)} disabled={loading} className="text-destructive hover:text-destructive/80">
                       <Trash2 className="h-4 w-4" />
                       <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
