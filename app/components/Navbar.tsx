"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/subsidiaries", label: "Subsidiaries" },
    { href: "/products", label: "Products" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo-main.jpg"
              alt="Future Bright Ventures"
              className="h-10 w-auto rounded"
            />
            <div className="flex flex-col">
              <span className="font-display text-lg md:text-xl font-semibold text-navy-900 tracking-tight leading-tight">
                Future Bright
              </span>
              <span className="hidden sm:inline font-display text-xs text-gold-500 tracking-wide leading-tight">
                Ventures Ltd
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-navy-700 hover:text-gold-600 transition-colors uppercase tracking-wider"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <a
                href="tel:+254700460814"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <Phone size={14} />
                Call Us
              </a>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-navy-900 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-navy-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {links.map((l) => (
              <a
                key={l.href + "-mobile"}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-sm font-medium text-navy-700 hover:text-gold-600 transition-colors py-2 uppercase tracking-wider"
              >
                {l.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-navy-100">
              <a
                href="tel:+254700460814"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 text-sm font-semibold py-2 rounded-lg transition-colors"
              >
                <Phone size={14} />
                Call Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
