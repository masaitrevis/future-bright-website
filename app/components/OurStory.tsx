import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OurStory() {
  return (
    <section className="py-20 md:py-28 bg-navy-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
              Our Story
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-6">
              Building a Brighter Future for East Africa
            </h2>
            <p className="text-navy-700 leading-relaxed mb-4">
              Future Bright Ventures Ltd was founded with a bold vision: to create
              a diversified ecosystem of businesses that deliver excellence while
              uplifting communities and protecting the environment. From our
              headquarters in Nairobi, Kenya, we have grown into a dynamic
              conglomerate with a presence across East Africa.
            </p>
            <p className="text-navy-700 leading-relaxed mb-6">
              Our portfolio spans professional consultancy, leadership training,
              sustainable agriculture, executive travel, real estate, eco-friendly
              hospitality, outdoor experiences, and corporate social
              responsibility. Each subsidiary operates with the same commitment to
              quality, integrity, and innovation.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-navy-800 font-semibold hover:text-gold-600 transition-colors"
            >
              Read Our Full Story <ArrowRight size={18} />
            </Link>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Team collaboration"
              className="rounded-xl shadow-lg w-full object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-navy-900 text-white p-6 rounded-xl shadow-lg max-w-xs hidden md:block">
              <p className="font-display text-lg font-semibold mb-1">
                Excellence in Everything
              </p>
              <p className="text-sm text-white/70">
                From strategy to service, we deliver value that lasts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
