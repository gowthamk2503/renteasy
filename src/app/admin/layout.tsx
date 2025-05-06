import { SidebarProvider, Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
import { Car, BookMarked, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import AdminHeader from '@/components/AdminHeader'; // Create this component

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          <SidebarHeader className="p-4">
            <Link href="/admin" className="flex items-center gap-2 font-semibold text-lg text-sidebar-primary">
              <LayoutDashboard className="w-5 h-5" />
               <span className="group-data-[collapsible=icon]:hidden">Admin Panel</span>
            </Link>
          </SidebarHeader>
          <SidebarMenu className="flex-1 px-2">
             <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Manage Cars">
                 <Link href="/admin/cars">
                    <Car />
                    <span className="group-data-[collapsible=icon]:hidden">Manage Cars</span>
                 </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Manage Bookings">
                 <Link href="/admin/bookings">
                    <BookMarked />
                    <span className="group-data-[collapsible=icon]:hidden">Manage Bookings</span>
                 </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
             {/* Add more admin links here */}
          </SidebarMenu>
        </Sidebar>
        <SidebarInset className="flex flex-col">
           <AdminHeader />
           <main className="flex-1 p-6 overflow-auto">
             {children}
           </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
