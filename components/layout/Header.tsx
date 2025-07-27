"use client";

import { LogOut, Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast"
import { authApi } from "@/lib/api/auth"
import { useAuthStore } from "@/store/authStore";
import Logo from "../ui/Logo";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "About", href: "/about" },
  { label: "Pricing", href: "/pricing" },
  { label: "Affiliate Program", href: "/affiliate" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const guestCtaButtons = [
  {
    label: "Sign In",
    href: "/auth",
    className: "border-primary text-primary hover:bg-primary hover:text-white",
    variant: "outline" as const,
  },
  {
    label: "Book a Demo",
    href: "/contact",
    className: "btn-gradient",
    variant: "default" as const,
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {
    authenticated: { isAuthenticated },
    userRolesPermissions,
    logout,
  } = useAuthStore();
  const router = useRouter();
  const { toast } = useToast();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      const { data: response } = await authApi.logout();

      if (!response.success) {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Logout",
        description: "You have been signed out successfully.",
      });

      logout();
      router.push("/auth");
    } catch {
      toast({
        title: "Error",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = () => {
    router.push("/dashboard/profile");
  };

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const dropdownActions = [
    {
      label: "Profile",
      icon: <User className="mr-2 h-4 w-4" />,
      onClick: handleProfileClick,
    },
    {
      label: "Log out",
      icon: <LogOut className="mr-2 h-4 w-4" />,
      onClick: handleLogout,
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="w-full bg-background backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-border">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <Logo isAuthenticated={isAuthenticated} />

        {/* Desktop Navigation for guests */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-8 w-8">
                    {userRolesPermissions?.profileImage ? (
                      <AvatarImage src={userRolesPermissions.profileImage} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {userRolesPermissions?.firstName && userRolesPermissions?.lastName
                          ? getInitials(userRolesPermissions.firstName, userRolesPermissions.lastName)
                          : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userRolesPermissions?.username || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userRolesPermissions?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dropdownActions.map((action) => (
                  <DropdownMenuItem key={action.label} className="cursor-pointer" onClick={action.onClick}>
                    {action.icon}
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            guestCtaButtons.map((btn) => (
              <Button key={btn.label} asChild variant={btn.variant} className={btn.className}>
                <Link href={btn.href}>{btn.label}</Link>
              </Button>
            ))
          )}
        </div>

        {/* Mobile Menu Toggle & Avatar */}
        <div className="md:hidden flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {userRolesPermissions?.firstName && userRolesPermissions?.lastName
                        ? getInitials(userRolesPermissions.firstName, userRolesPermissions.lastName)
                        : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userRolesPermissions?.username || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userRolesPermissions?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dropdownActions.map((action) => (
                  <DropdownMenuItem key={action.label} className="cursor-pointer" onClick={action.onClick}>
                    {action.icon}
                    <span>{action.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button className="text-foreground focus:outline-none" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation for guests */}
      {!isAuthenticated && mobileMenuOpen && (
        <div className="md:hidden bg-background w-full">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={toggleMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-2">
              {guestCtaButtons.map((btn) => (
                <Button
                  key={btn.label}
                  asChild
                  variant={btn.variant}
                  className={btn.className}
                  onClick={toggleMobileMenu}
                >
                  <Link href={btn.href}>{btn.label}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
