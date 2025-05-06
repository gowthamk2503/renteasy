import type { Car } from '@/services/car-rental';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Fuel, Users, Gauge } from 'lucide-react'; // Icons for features
import { format } from 'date-fns'; // Import format if needed later

interface CarCardProps {
  car: Car;
  startDate?: Date;
  endDate?: Date;
}

export default function CarCard({ car, startDate, endDate }: CarCardProps) {

    const bookingLink = `/cars/${car.id}${startDate && endDate ? `?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}` : ''}`;


  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
       <div className="relative w-full h-48">
          <Image
             src={car.imageUrl || 'https://picsum.photos/400/300'} // Placeholder if no image
             alt={`${car.brand} ${car.model}`}
             layout="fill"
             objectFit="cover"
             className="transition-transform duration-300 hover:scale-105"
             data-ai-hint="car vehicle" // AI Hint for image generation
          />
       </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold truncate">{car.brand} {car.model}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">{car.type}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-2 pb-4">
         <div className="flex justify-between items-center text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
                 <Fuel className="w-4 h-4 text-primary" />
                 <span>{car.fuelType}</span>
             </div>
              <div className="flex items-center gap-1.5">
                 <Users className="w-4 h-4 text-primary" />
                 <span>{car.seatingCapacity} Seats</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <Gauge className="w-4 h-4 text-primary" />
                 <span>{car.mileage} mi</span> {/* Assuming mileage is range or efficiency */}
             </div>
         </div>
        <p className="text-lg font-bold text-primary">
          ${car.pricePerDay.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">/ day</span>
        </p>
      </CardContent>
      <CardFooter className="mt-auto">
         <Link href={bookingLink} className="w-full" passHref>
             <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                View Details & Book
             </Button>
         </Link>
      </CardFooter>
    </Card>
  );
}
