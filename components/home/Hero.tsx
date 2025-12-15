"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Lottie from "lottie-react";

export function Hero() {
  const [mounted, setMounted] = useState(false);
  const [startupLink, setStartupLink] = useState("/auth/sign-up");
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    // Load Lottie animation data
    const loadAnimation = async () => {
      try {
        const response = await fetch('/lotties/Investment growth.json');
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load animation:', error);
      }
    };

    loadAnimation();

    // Check user status and determine redirect
    const checkUserStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Check user type from metadata
        const userType = user.user_metadata?.user_type;

        if (userType === 'startup') {
          // Check if startup profile exists
          const { data: startup } = await supabase
            .from('startup')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (startup) {
            setStartupLink("/startup/profile");
          } else {
            setStartupLink("/startup/onboarding");
          }
        } else {
          setStartupLink("/auth/sign-up");
        }
      } else {
        setStartupLink("/auth/sign-up");
      }
    };

    checkUserStatus();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-tight">
                Connect Startups with
                <br />
                <span className="text-orange-600">Visionary Investors</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                The premier marketplace where innovative startups meet strategic
                investors. Launch your venture or discover the next unicorn.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
              <Link href={startupLink}>
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Start Your Journey
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-black text-black hover:bg-black hover:text-white text-lg px-8 py-6 rounded-lg transition-all"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>Trusted Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <span>Free to Start</span>
              </div>
            </div>
          </div>

          {/* Right side - Animation/Visual */}
          <div
            className={`relative transition-all duration-1000 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative w-full h-[500px] lg:h-[600px] flex items-center justify-center bg-transparent">
              {animationData ? (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  className="w-full h-full"
                  style={{ backgroundColor: 'transparent' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

