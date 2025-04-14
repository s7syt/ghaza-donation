import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { AdminNavbar } from "./admin-navbar";
import { AuthMiddleware } from "./auth-middleware";
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  CreditCard, 
  UserCog, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Settings
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";

const menuItems = [
  { label: "لوحة التحكم", icon: <LayoutDashboard className="ml-2" size={18} />, link: "/admin/dashboard" },
  { label: "المشاريع", icon: <FolderOpen className="ml-2" size={18} />, link: "/admin/projects" },
  { label: "المتبرعين", icon: <Users className="ml-2" size={18} />, link: "/admin/donors" },
  { label: "طرق الدفع", icon: <CreditCard className="ml-2" size={18} />, link: "/admin/payment-methods" },
  { label: "الأعضاء", icon: <Users className="ml-2" size={18} />, link: "/admin/members" },
  { label: "إعدادات الموقع", icon: <Settings className="ml-2" size={18} />, link: "/admin/site-settings" },
  { label: "إعدادات الحساب", icon: <UserCog className="ml-2" size={18} />, link: "/admin/account" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  
  const Sidebar = () => (
    <aside className={`h-screen bg-card overflow-y-auto ${sidebarCollapsed ? 'w-16' : 'w-64'} hidden md:block border-l`}>
      <div className="h-full flex flex-col">
        <div className="px-4 py-6 flex items-center justify-between">
          {!sidebarCollapsed && (
            <h2 className="text-lg font-bold">
              لوحة الإدارة
            </h2>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-muted"
          >
            {sidebarCollapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>
        
        <Separator />
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.link;
              return (
                <li key={index}>
                  <Link
                    to={item.link}
                    className={`
                      flex items-center px-3 py-2 rounded-md transition-colors
                      ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      ${sidebarCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    {item.icon}
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4">
          <Link
            to="/admin/logout"
            className="flex items-center px-3 py-2 text-destructive rounded-md transition-colors hover:bg-muted"
          >
            <LogOut className="ml-2" size={18} />
            {!sidebarCollapsed && <span>تسجيل الخروج</span>}
          </Link>
        </div>
      </div>
    </aside>
  );
  
  const MobileMenu = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden">
          <span>القائمة</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%]">
        <div className="py-6">
          <h2 className="text-lg font-bold mb-4">
            لوحة الإدارة
          </h2>
          <Separator />
          <nav className="mt-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.link;
                return (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className={`
                        flex items-center px-3 py-2 rounded-md transition-colors
                        ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                      `}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link
                  to="/admin/logout"
                  className="flex items-center px-3 py-2 text-destructive rounded-md transition-colors hover:bg-muted"
                >
                  <LogOut className="ml-2" size={18} />
                  <span>تسجيل الخروج</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
  
  return (
    <AuthMiddleware>
      <div className="h-screen flex flex-col md:flex-row">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          <AdminNavbar />
          <main className="min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </div>
      </div>
    </AuthMiddleware>
  );
}
