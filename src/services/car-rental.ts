/**
 * Represents a car.
 */
export interface Car {
  /**
   * The ID of the car.
   */
  id: string;
  /**
   * The model of the car.
   */
  model: string;
  /**
   * The price per day to rent the car.
   */
  pricePerDay: number;
  /**
   * The type of car (e.g., SUV, Sedan, Hatchback).
   */
  type: string;
  /**
   * The brand of the car.
   */
  brand: string;
  /**
   * The fuel type of the car.
   */
  fuelType: string;
  /**
   * The seating capacity of the car.
   */
  seatingCapacity: number;
  /**
   * The mileage of the car (could represent range for electric or efficiency for gas).
   */
  mileage: number;
  /**
   * URL of the car image.
   */
  imageUrl: string;
}

/**
 * Represents search criteria for cars.
 */
export interface CarSearchCriteria {
  /**
   * The location to search for cars (currently not used in mock).
   */
  location: string;
  /**
   * The start date for the rental period (currently not used in mock).
   */
  startDate: Date;
  /**
   * The end date for the rental period (currently not used in mock).
   */
  endDate: Date;
}

/**
 * Represents a rental booking.
 */
export interface RentalBooking {
  /**
   * The ID of the booking.
   */
  id: string;
  /**
   * The ID of the car being rented.
   */
  carId: string;
  /**
   * The start date of the rental period.
   */
  startDate: Date;
  /**
   * The end date of the rental period.
   */
  endDate: Date;
  /**
   * The total rental cost.
   */
  totalCost: number;
}

// Enhanced Mock Car Data
const mockCars: Car[] = [
    {
      id: '1',
      model: 'Model X',
      pricePerDay: 75.50,
      type: 'SUV',
      brand: 'Tesla',
      fuelType: 'Electric',
      seatingCapacity: 7,
      mileage: 330,
      imageUrl: 'https://picsum.photos/seed/modelx/400/300',
    },
    {
      id: '2',
      model: 'Camry',
      pricePerDay: 40.00,
      type: 'Sedan',
      brand: 'Toyota',
      fuelType: 'Gasoline',
      seatingCapacity: 5,
      mileage: 35, // MPG
      imageUrl: 'https://picsum.photos/seed/camry/400/300',
    },
     {
      id: '3',
      model: 'Civic',
      pricePerDay: 35.00,
      type: 'Sedan',
      brand: 'Honda',
      fuelType: 'Gasoline',
      seatingCapacity: 5,
      mileage: 38, // MPG
      imageUrl: 'https://picsum.photos/seed/civic/400/300',
    },
    {
      id: '4',
      model: 'Golf',
      pricePerDay: 38.75,
      type: 'Hatchback',
      brand: 'Volkswagen',
      fuelType: 'Gasoline',
      seatingCapacity: 5,
      mileage: 36, // MPG
      imageUrl: 'https://picsum.photos/seed/golf/400/300',
    },
     {
      id: '5',
      model: 'RAV4',
      pricePerDay: 55.00,
      type: 'SUV',
      brand: 'Toyota',
      fuelType: 'Hybrid',
      seatingCapacity: 5,
      mileage: 40, // MPG
      imageUrl: 'https://picsum.photos/seed/rav4/400/300',
    },
     {
      id: '6',
      model: 'Mustang Mach-E',
      pricePerDay: 80.00,
      type: 'SUV',
      brand: 'Ford',
      fuelType: 'Electric',
      seatingCapacity: 5,
      mileage: 300, // Range
      imageUrl: 'https://picsum.photos/seed/mache/400/300',
    },
     {
      id: '7',
      model: 'Fit',
      pricePerDay: 32.50,
      type: 'Hatchback',
      brand: 'Honda',
      fuelType: 'Gasoline',
      seatingCapacity: 5,
      mileage: 37, // MPG
      imageUrl: 'https://picsum.photos/seed/fit/400/300',
    }
];


/**
 * Asynchronously retrieves a list of available cars based on the search criteria.
 * NOTE: Mock implementation ignores criteria for now.
 *
 * @param criteria The search criteria to filter cars.
 * @returns A promise that resolves to an array of Car objects.
 */
export async function searchCars(criteria: CarSearchCriteria): Promise<Car[]> {
  console.log('Searching cars with criteria (mock ignores criteria):', criteria);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockCars;
}

/**
 * Asynchronously retrieves a car by its ID.
 *
 * @param carId The ID of the car to retrieve.
 * @returns A promise that resolves to a Car object, or null if not found.
 */
export async function getCar(carId: string): Promise<Car | null> {
   console.log(`Fetching car with ID: ${carId}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 200));
  const car = mockCars.find(c => c.id === carId);
  return car || null;
}

/**
 * Asynchronously books a car for the given dates.
 *
 * @param carId The ID of the car to book.
 * @param startDate The start date of the rental period.
 * @param endDate The end date of the rental period.
 * @returns A promise that resolves to a RentalBooking object.
 */
export async function bookCar(carId: string, startDate: Date, endDate: Date): Promise<RentalBooking> {
   console.log(`Booking car ID ${carId} from ${startDate} to ${endDate}`);
   // Simulate API call delay
   await new Promise(resolve => setTimeout(resolve, 600));

  const car = await getCar(carId); // Use the existing getCar function

  if (!car) {
    throw new Error(`Car with ID ${carId} not found`);
  }

  // Calculate rental days (ensure at least 1 day)
  const rentalDays = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)));

  const totalCost = car.pricePerDay * rentalDays;

  // Generate a simple mock booking ID
  const bookingId = `bk-${Math.random().toString(36).substring(2, 8)}`;

  return {
    id: bookingId,
    carId: car.id,
    startDate: startDate,
    endDate: endDate,
    totalCost: totalCost,
  };
}
