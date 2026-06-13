import Link from "next/link";
import {
  ExternalLink,
  Home,
  GraduationCap,
  Plane,
  Building2,
  TreePine,
  Mountain,
  Heart,
  ArrowRight,
} from "lucide-react";

const subsidiaries = [
  {
    icon: Plane,
    title: "Bright Elite Tours & Travels",
    desc: "Executive mobility, chauffeur services, corporate driver outsourcing & elite driver training across Kenya and East Africa.",
    image: "https://images.unsplash.com/photo-1563720223185-11003d516659?w=400&q=80",
    href: "https://brightelite.vercel.app",
    hasWebsite: true,
  },
  {
    icon: Home,
    title: "Bright Homes",
    desc: "Premium property management, vacation rentals, and real estate solutions. Unleash your wanderlust with curated stays.",
    image: "/images/logo-bright-homes.jpg",
    href: "#",
    hasWebsite: false,
  },
  {
    icon: GraduationCap,
    title: "Bright Academy",
    desc: "Elite training and leadership development. Building the next generation of certified professionals through world-class education.",
    image: "/images/logo-bright-academy.jpg",
    href: "#",
    hasWebsite: false,
  },
  {
    icon: Building2,
    title: "Bright Consultancy",
    desc: "Operations, risk management, leadership & business transformation advisory services.",
    image: null,
    href: "#",
    hasWebsite: false,
  },
  {
    icon: TreePine,
    title: "Bright Eco-Farms",
    desc: "Sustainable agriculture, tree planting & green innovation for a better tomorrow.",
    image: null,
    href: "#",
    hasWebsite: false,
  },
  {
    icon: Mountain,
    title: "Outdoor Events & Team Building",
    desc: "Hiking, team retreats & nature-based leadership experiences across East Africa.",
    image: null,
    href: "#",
    hasWebsite: false,
  },
  {
    icon: Heart,
    title: "Bright Foundation",
    desc: "CSR: community empowerment, education & environmental conservation.",
    image: null,
    href: "#",
    hasWebsite: false,
  },
];

export default function SubsidiariesOverview() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
            Our Ecosystem
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy-900">
            Our Subsidiaries
          </h2>
          <p className="text-navy-600 max-w-2xl mx-auto mt-4">
            A diversified portfolio of companies. One shared vision. Each business unit is
            designed to solve real problems and create lasting value.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {subsidiaries.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className="group bg-white border border-navy-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-gold-300 transition-all duration-300 flex flex-col"
              >
                {s.image ? (
                  <div className="h-48 overflow-hidden bg-navy-50 flex items-center justify-center p-4">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-navy-50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center">
                      <Icon
                        size={32}
                        className="text-navy-600"
                      />
                    </div>
                  </div>
                )}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="font-display text-lg font-semibold text-navy-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed mb-4 flex-grow">
                    {s.desc}
                  </p>
                  {s.hasWebsite ? (
                    <Link
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
                    >
                      Visit Website <ExternalLink size={14} />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-navy-300">
                      Website Coming Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/subsidiaries"
            className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            View All Subsidiaries <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
