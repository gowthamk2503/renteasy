import Link from 'next/link';
import { Car, UserCircle, ShieldCheck } from 'lucide-react'; // Using ShieldCheck for Admin
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-40">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <Car className="h-6 w-6" />
          <span>RentEasy</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/#search" passHref> {/* Example link to search section */}
             <Button variant="ghost" className="text-foreground hover:text-primary">Browse Cars</Button>
          </Link>
          {/* Add other user links like "My Bookings" or "Login" later */}
           <Link href="/admin" passHref>
             <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                <ShieldCheck className="mr-2 h-4 w-4" /> Admin Panel
             </Button>
          </Link>
          {/* Example User Profile/Login Button */}
           {/* <Button variant="ghost" size="icon">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">User Profile</span>
            </Button> */}
        </div>
      </nav>
    </header>
  );
}
