import Link from "next/link";
import { ArrowRight } from "lucide-react";

const team = [
  {
    name: "Benjamin Masai",
    role: "CEO & Co-Founder",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    name: "Miriam Njeri",
    role: "Finance Director & Co-Founder",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Michael Kiptoo",
    role: "Head of Business Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
];

export default function Leadership() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
            Our Team
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy-900">
            Leadership
          </h2>
          <p className="text-navy-600 max-w-2xl mx-auto mt-4">
            Visionary leaders driving growth, innovation, and impact across
            East Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {team.map((t) => (
            <div
              key={t.name}
              className="text-center group"
            >
              <div className="relative w-40 h-40 mx-auto mb-5 rounded-full overflow-hidden border-4 border-navy-100 group-hover:border-gold-300 transition-colors">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display text-lg font-semibold text-navy-900">
                {t.name}
              </h3>
              <p className="text-sm text-gold-600 font-medium mt-1">
                {t.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
