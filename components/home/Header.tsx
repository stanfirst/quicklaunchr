"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    // Check user session and type
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Get user type from user metadata
        const userTypeFromMetadata = user.user_metadata?.user_type;
        if (userTypeFromMetadata) {
          setUserType(userTypeFromMetadata);
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Get user type from user metadata
        const userTypeFromMetadata = session.user.user_metadata?.user_type;
        if (userTypeFromMetadata) {
          setUserType(userTypeFromMetadata);
        } else {
          setUserType(null);
        }
      } else {
        setUserType(null);
      }
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/quicklaunchr_logo.png"
              alt="QuickLaunchr Logo"
              width={200}
              height={67}
              className="h-14 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              How It Works
            </Link>
            <Link
              href="#for-startups"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              For Startups
            </Link>
            <Link
              href="#for-investors"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              For Investors
            </Link>
            <Link
              href="#features"
              className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
            >
              Features
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/protected" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {userType === 'startup' && (
                    <DropdownMenuItem asChild>
                      <Link href="/startup/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userType === 'investor' && (
                    <DropdownMenuItem asChild>
                      <Link href="/investor/profile" className="cursor-pointer">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-orange-600 hidden sm:flex"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

