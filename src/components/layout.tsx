
import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { ThemeProvider } from "./theme-provider";
import { Footer } from "./footer";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Layout() {
  return (
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <div className="relative min-h-screen flex flex-col bg-background transition-colors duration-300">
          <Header />
          <main className="flex-1 pt-4 pb-12">
            <Outlet />
          </main>
          <Footer />
          <Toaster />
          <Sonner />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
