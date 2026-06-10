import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 md:py-28 bg-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
          Partner With Us
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-navy-900 mb-4">
          Ready to Work Together?
        </h2>
        <p className="text-navy-600 max-w-2xl mx-auto mb-8">
          Whether you need consultancy, training, travel, real estate, or
          corporate event planning, we are here to help. Reach out today and let
          us build something great.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Contact Us
            <ArrowRight size={18} />
          </Link>
          <a
            href="tel:+254700460814"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            <Phone size={18} />
            Call +254 700 460814
          </a>
        </div>
      </div>
    </section>
  );
}
