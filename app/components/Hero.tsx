"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80",
    alt: "Modern corporate skyline",
  },
  {
    src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    alt: "Business meeting",
  },
  {
    src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    alt: "Corporate office",
  },
  {
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80",
    alt: "Team collaboration",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-navy-900/60" />
      </div>

      {/* Static overlay content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 md:pt-32">
        <p className="text-gold-400 text-sm md:text-base uppercase tracking-[0.25em] font-semibold mb-4 md:mb-6">
          Future Bright Ventures Ltd
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
          Where Business Excellence meets{" "}
          <span className="text-gold-400">Sustainability,</span>{" "}
          Strategy & Service
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
          A dynamic East African conglomerate headquartered in Nairobi, Kenya.
          Driving innovation across consultancy, training, eco-farming, travel,
          real estate, hospitality, and community empowerment.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/subsidiaries"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-900 font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Explore Our Companies
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-white/30 hover:border-gold-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors backdrop-blur-sm"
          >
            Get in Touch
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 md:mt-24 border-t border-white/20 pt-8">
          {[
            { num: "9", label: "Subsidiaries" },
            { num: "3", label: "Core Leaders" },
            { num: "East", label: "Africa Region" },
            { num: "100%", label: "Commitment" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-gold-400">
                {s.num}
              </div>
              <div className="text-xs md:text-sm text-white/60 uppercase tracking-wider mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-gold-400 w-6"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}