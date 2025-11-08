"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Don't show footer on dashboard pages
  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">LegalSnap</h3>
            <p className="text-gray-400 text-sm">
              AI-powered legal assistance for everyone. Get instant legal guidance through voice conversations.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal" className="text-gray-400 hover:text-white transition">
                  Legal Policies
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-400 hover:text-white transition">
                  Security
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">
                Email: contact@legalsnap.ai
              </li>
              <li className="text-gray-400">
                Phone: +91 123-456-7890
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} LegalSnap. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 md:mt-0 italic">
            Start is made by Janvi Chauhan and Sarang Rastogi, 2 final-year CSE students.
          </p>
        </div>
      </div>
    </footer>
  );
}