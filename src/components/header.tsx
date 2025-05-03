
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dumbbell, Menu, X, Apple } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Workouts", href: "/workouts" },
    { name: "Exercises", href: "/exercises" },
    { name: "Progress", href: "/progress" },
    { name: "Challenges", href: "/challenges" },
    { name: "Diet", href: "/diet" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300",
        scrolled && "shadow-md"
      )}
    >
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2 group">
            <Dumbbell className="h-6 w-6 text-orange group-hover:animate-bounce-subtle transition-all" />
            <span className="font-bold text-lg hidden md:inline-block group-hover:text-orange transition-colors">Gym Mate</span>
          </Link>
        </div>

        {!isMobile ? (
          <nav className="flex items-center space-x-1 lg:space-x-6 mx-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href !== "/" && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium px-3 py-2 rounded-md transition-all hover:bg-muted/60 hover:text-orange relative",
                    isActive && "text-orange bg-muted/40"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-orange animate-fade-in" />
                  )}
                </Link>
              );
            })}
          </nav>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && (
        <div 
          className={cn(
            "fixed inset-0 z-50 bg-background transition-transform duration-300 ease-in-out transform",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center space-x-2">
                <Dumbbell className="h-6 w-6 text-orange" />
                <span className="font-bold text-lg">Gym Mate</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== "/" && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "text-lg font-medium py-3 px-4 rounded-md transition-colors hover:bg-muted",
                      isActive && "text-orange bg-muted/60 font-semibold"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-6 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Switch theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
