
import { useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Menu, X, Apple } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigation = [
    { name: "Dashboard", href: "/" },
    { name: "Workouts", href: "/workouts" },
    { name: "Exercises", href: "/exercises" },
    { name: "Progress", href: "/progress" },
    { name: "Challenges", href: "/challenges" },
    { name: "Diet", href: "/diet" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 text-orange" />
            <span className="font-bold text-lg hidden md:inline-block">Gym Mate</span>
          </Link>
        </div>

        {!isMobile ? (
          <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium transition-colors hover:text-orange"
              >
                {item.name}
              </Link>
            ))}
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

        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Dumbbell className="h-6 w-6 text-orange" />
                <span className="font-bold text-lg">Gym Mate</span>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4 mt-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-lg font-medium py-2 transition-colors hover:text-orange"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
