"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const footerLinks = {
  product: [
    { name: "How It Works", href: "#how-it-works" },
    { name: "For Startups", href: "#for-startups" },
    { name: "For Investors", href: "#for-investors" },
    { name: "Features", href: "#features" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number>(2024);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/white_quicklaunchr_logo.png"
                alt="QuickLaunchr Logo"
                width={240}
                height={80}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-gray-400 text-sm">
              Connecting startups with visionary investors.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} QuickLaunchr. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-gray-400 hover:text-orange-600 transition-colors text-sm"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-orange-600 transition-colors text-sm"
            >
              LinkedIn
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-orange-600 transition-colors text-sm"
            >
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

