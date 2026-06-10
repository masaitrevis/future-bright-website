import Link from "next/link";
import { ArrowRight, TrendingUp, Shield, Users, Heart, Globe, Leaf } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
          alt="Modern corporate skyline"
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/5 via-white/50 to-white" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 md:pt-32">
        <p className="text-gold-600 text-sm md:text-base uppercase tracking-[0.25em] font-semibold mb-4 md:mb-6">
          Future Bright Ventures Ltd
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-navy-900 leading-tight mb-6 max-w-4xl mx-auto">
          Where Business Excellence meets{" "}
          <span className="text-gold-600">Sustainability,</span>{" "}
          Strategy & Service
        </h1>
        <p className="text-lg md:text-xl text-navy-600 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
          A dynamic East African conglomerate headquartered in Nairobi, Kenya.
          Driving innovation across consultancy, training, eco-farming, travel,
          real estate, hospitality, and community empowerment.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/subsidiaries"
            className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Explore Our Companies
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-navy-300 hover:border-gold-500 text-navy-900 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 md:mt-24 border-t border-navy-100 pt-8">
          {[
            { num: "9", label: "Subsidiaries" },
            { num: "3", label: "Core Leaders" },
            { num: "East", label: "Africa Region" },
            { num: "100%", label: "Commitment" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-gold-600">
                {s.num}
              </div>
              <div className="text-xs md:text-sm text-navy-500 uppercase tracking-wider mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
