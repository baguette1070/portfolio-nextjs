"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface NavbarClientProps {
  user: {
    id: string;
    name: string;
    emailVerified: boolean;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
  } | null;
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 p-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {pathname === "/" ? (
              <button
                onClick={() => scrollToSection("#home")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl font-mono"
              >
                Lamrini Nawfal
              </button>
            ) : (
              <Link href="/">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold text-xl font-mono">
                  Lamrini Nawfal
                </button>
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {pathname === "/" ? (
                <button
                  onClick={() => scrollToSection("#home")}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "cursor-pointer duration-300"
                  )}
                >
                  Home
                </button>
              ) : (
                <Link href="/">
                  <button
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "cursor-pointer duration-300"
                    )}
                  >
                    Home
                  </button>
                </Link>
              )}
              {pathname === "/" ? (
                <button
                  onClick={() => scrollToSection("#projects")}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "cursor-pointer duration-300"
                  )}
                >
                  Projects
                </button>
              ) : (
                <Link href="/#projects">
                  <button
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "cursor-pointer duration-300"
                    )}
                  >
                    Projects
                  </button>
                </Link>
              )}
              {pathname === "/" ? (
                <button
                  onClick={() => scrollToSection("#contact")}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "cursor-pointer duration-300"
                  )}
                >
                  Contact
                </button>
              ) : (
                <Link href="/#contact">
                  <button
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "cursor-pointer duration-300"
                    )}
                  >
                    Contact
                  </button>
                </Link>
              )}

              {user ? (
                <>
                  <button
                    onClick={() => redirect("/auth")}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "cursor-pointer duration-300"
                    )}
                  >
                    My Account
                  </button>
                  <button
                    onClick={() => redirect("/dashboard/my-requests")}
                    className={cn(
                      buttonVariants({ variant: "ghost" }),
                      "cursor-pointer duration-300"
                    )}
                  >
                    Your requests
                  </button>
                  <form action={signOut}>
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => toast.success("Sign out successful")}
                    >
                      Sign out
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button
                      variant="outline"
                      className={cn(
                        "text-sm font-medium transition-colors hover:text-primary cursor-pointer"
                      )}
                    >
                      Sign in
                    </Button>
                  </Link>

                  <Link href="/auth/signup">
                    <Button
                      variant="default"
                      className={cn(
                        "cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                      )}
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {pathname === "/" ? (
              <button
                onClick={() => scrollToSection("#home")}
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Home
              </button>
            ) : (
              <Link href="/">
                <button className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Home
                </button>
              </Link>
            )}
            {pathname === "/" ? (
              <button
                onClick={() => scrollToSection("#projects")}
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Projects
              </button>
            ) : (
              <Link href="/#projects">
                <button className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Projects
                </button>
              </Link>
            )}
            {pathname === "/" ? (
              <button
                onClick={() => scrollToSection("#contact")}
                className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                Contact
              </button>
            ) : (
              <Link href="/#contact">
                <button className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Contact
                </button>
              </Link>
            )}
            <Link href="/auth/signin">
              <Button
                variant="outline"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary cursor-pointer"
                )}
              >
                Signin
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="default" className={cn("text-sm font-medium")}>
                Signup
              </Button>
            </Link>
          </div>
        </div>
      )}
    </motion.nav>
  );
}
