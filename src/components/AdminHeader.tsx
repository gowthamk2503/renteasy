'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { UserCircle, Bell } from 'lucide-react'; // Example icons
import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2">
      <SidebarTrigger className="sm:hidden" /> {/* Only show toggle on small screens */}
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Optional: Search Bar */}
        {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        /> */}
      </div>
      <div className="flex items-center gap-2">
         <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        {/* Replace with actual user dropdown/profile */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <UserCircle className="h-6 w-6" />
          <span className="sr-only">User Account</span>
        </Button>
         <Link href="/" passHref>
             <Button variant="outline" size="sm">View Site</Button>
         </Link>
      </div>
    </header>
  );
}
