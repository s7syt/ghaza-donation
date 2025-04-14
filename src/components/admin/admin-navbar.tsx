
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ListTodo,
  Users,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Wallet,
  User,
  UserCircle,
  Settings,
  Share2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function AdminNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState<string | null>(null);
  
  useEffect(() => {
    // Get admin name from localStorage
    const name = localStorage.getItem("adminName");
    if (name) {
      setAdminName(name);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    toast.success("تم تسجيل الخروج بنجاح");
    navigate("/admin/login");
  };
  
  const navItems = [
    { href: "/admin/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/admin/projects", label: "المشاريع", icon: ListTodo },
    { href: "/admin/donors", label: "المتبرعون", icon: Users },
    { href: "/admin/members", label: "الأعضاء", icon: UserCircle },
    { href: "/admin/payment-methods", label: "طرق الدفع", icon: Wallet },
    { href: "/admin/site-settings", label: "إعدادات الموقع", icon: Settings },
    { href: "/admin/social-links", label: "روابط التواصل", icon: Share2 },
  ];
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pr-0">
              <div className="px-7">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-lg">لوحة الإدارة</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 mt-8 pr-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium hover:bg-accent ${
                      isActive(item.href) ? "bg-accent" : ""
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="ghost"
                  className="flex w-full justify-start px-3"
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  تسجيل الخروج
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <Link
            to="/admin/dashboard"
            className="hidden items-center gap-2 font-semibold md:flex"
          >
            <span className="text-xl">لوحة الإدارة</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary ${
                isActive(item.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <span className="hidden sm:inline-block">{adminName || "مدير"}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/admin/account")}>
                <User className="ml-2 h-4 w-4" />
                إعدادات الحساب
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="ml-2 h-4 w-4" />
                تسجيل الخروج
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
