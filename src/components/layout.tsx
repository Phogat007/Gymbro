
import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { ThemeProvider } from "./theme-provider";

export function Layout() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="relative min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with ❤️ by Gym Mate &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}
