"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const benefits = [
  {
    title: "Curated Pipeline",
    description:
      "Access a vetted pipeline of high-quality startups across industries and stages, pre-filtered to match your investment criteria.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: "Advanced Search",
    description:
      "Use powerful filters to find startups by industry, stage, location, traction metrics, and funding requirements.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "Due Diligence Tools",
    description:
      "Access comprehensive startup profiles with financials, team backgrounds, market analysis, and growth metrics.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Direct Communication",
    description:
      "Connect directly with founders through our secure platform, schedule meetings, and manage your investment pipeline.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
];

export function ForInvestors() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="for-investors" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-6 order-2 lg:order-1">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`bg-gray-50 border border-gray-200 rounded-lg p-6 hover:border-orange-600 hover:shadow-lg transition-all duration-300 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 text-orange-600">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-black">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          <div
            className={`space-y-8 order-1 lg:order-2 transition-all duration-1000 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <div className="inline-block px-4 py-2 bg-orange-100 border border-orange-600 rounded-full text-orange-600 text-sm font-medium">
              For Investors
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Discover Your Next Investment
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join a network of active investors discovering and funding the
              next generation of innovative startups. Find opportunities that
              align with your investment thesis.
            </p>
            <div className="pt-4">
              <Link href="/auth/sign-up">
                <Button
                  size="lg"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6 rounded-lg"
                >
                  Join as Investor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

