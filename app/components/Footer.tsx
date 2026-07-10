"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-display text-xl text-white font-semibold">
              Future Bright <span className="text-gold-400">Ventures</span>
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Where Business Excellence meets Sustainability, Strategy &
              Service. Headquartered in Nairobi, Kenya with dynamic presence
              across East Africa.
            </p>
            <p className="text-xs text-gold-400 font-medium tracking-wider uppercase">
              Excellence · Innovation · Integrity · Service
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/subsidiaries", label: "Our Subsidiaries" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 hover:text-gold-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subsidiaries */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Subsidiaries
            </h4>
            <ul className="space-y-2">
              {[
                { name: "Future Bright Consultancy", url: "https://future-bright-consultancy.com" },
                { name: "Bright Academy", url: "https://bright-academy-kappa.vercel.app/" },
                { name: "Bright Eco-Farms", url: "https://bright-eco-farms.com" },
                { name: "Bright Tours & Travel", url: "https://bright-tours.com" },
                { name: "Bright Elite Tours & Travels", url: "https://bright-elite-tours.com" },
                { name: "Bright Real Estate & Property", url: "https://bright-real-estate.com" },
                { name: "Bright Homes & Resort", url: "https://bright-homes.com" },
                { name: "Outdoor Events & Team Building", url: "https://bright-events.com" },
                { name: "Bright Foundation", url: "https://bright-foundation.com" },
              ].map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/60 hover:text-gold-400 transition-colors duration-200"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Phone size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <a
                    href="https://wa.me/254720938031" target="_blank" rel="noopener noreferrer"
                    className="block hover:text-gold-400 transition-colors"
                  >
                    +254 720 938031
                  </a>
                  <a
                    href="https://wa.me/254700460814" target="_blank" rel="noopener noreferrer"
                    className="block hover:text-gold-400 transition-colors"
                  >
                    +254 700 460814
                  </a>
                  <a
                    href="https://wa.me/254723755752" target="_blank" rel="noopener noreferrer"
                    className="block hover:text-gold-400 transition-colors"
                  >
                    +254 723 755752
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail size={16} className="text-gold-400 shrink-0" />
                <a href="mailto:bmasai@fbrightventures.com" className="hover:text-gold-400 transition-colors">
                  bmasai@fbrightventures.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span>Future Bright Centre, Embakasi<br/>P.O.BOX 121313, GPO-00100<br/>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3 pt-2">
                <a
                  href="https://instagram.com/fbright.ventures"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="https://www.tiktok.com/@FUTUREBRIGHTVENTURES"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                  aria-label="TikTok"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                </a>
                <a
                  href="https://facebook.com/share/1XRk1ii3Jy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-gold-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              </li>
            </ul>

            {/* Books & Publications */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                <BookOpen size={16} className="text-gold-400" />
                <span className="font-semibold text-white/80 uppercase tracking-wider text-xs">
                  Books & Publications
                </span>
              </div>
              <p className="text-xs text-white/40">
                Explore our thought leadership, research papers, and industry
                insights shaping East African business.
              </p>
              <button
                type="button"
                onClick={() => alert("Coming soon — subscribe to be notified.")}
                className="mt-2 inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 transition-colors"
              >
                View Publications <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Future Bright Ventures Ltd. All rights
            reserved.
          </p>
          <p className="text-xs text-white/40">
            www.fbrightventures.co.ke
          </p>
        </div>
      </div>
    </footer>
  );
}
