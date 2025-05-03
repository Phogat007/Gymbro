
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Github, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Github, href: "#", label: "Github" },
  ];

  const footerLinks = [
    { title: "Quick Links", links: [
      { label: "Home", href: "/" },
      { label: "Workouts", href: "/workouts" },
      { label: "Exercises", href: "/exercises" },
      { label: "Progress", href: "/progress" },
      { label: "Challenges", href: "/challenges" },
    ]},
    { title: "Resources", links: [
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Contact Us", href: "#" },
    ]},
    { title: "Legal", links: [
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ]},
  ];

  return (
    <footer className="border-t py-8 mt-auto bg-background transition-colors duration-300">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Dumbbell className="h-6 w-6 text-orange" />
              <span className="font-bold text-xl">Gym Mate</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Your personal fitness companion to help you track workouts, set goals, and achieve results.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-orange transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {currentYear} Gym Mate. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Built with ❤️ for fitness enthusiasts</p>
        </div>
      </div>
    </footer>
  );
}
