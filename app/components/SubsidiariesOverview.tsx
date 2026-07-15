import Link from "next/link";
import {
  ExternalLink,
  Home,
  GraduationCap,
  Car,
  Building2,
  TreePine,
  Mountain,
  Heart,
  ArrowRight,
} from "lucide-react";

const subsidiaries = [
  {
    icon: Car,
    title: "Bright Elite Tours & Travels",
    desc: "Executive mobility, chauffeur services, corporate driver outsourcing & elite driver training across Kenya and East Africa.",
    href: "https://future-bright-mu.vercel.app",
    hasWebsite: true,
    color: "bg-gold-50",
    iconColor: "text-gold-600",
    highlight: true,
  },
  {
    icon: null,
    title: "Bright Homes",
    desc: "Premium property management, vacation rentals, and real estate solutions. Unleash your wanderlust with curated stays.",
    image: "/images/logo-bright-homes.jpg",
    href: "#",
    hasWebsite: false,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: null,
    title: "Bright Academy",
    desc: "Elite training and leadership development. Building the next generation of certified professionals through world-class education.",
    image: "/images/logo-bright-academy.jpg",
    href: "https://bright-academy-kappa.vercel.app/",
    hasWebsite: false,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: Building2,
    title: "Bright Consultancy",
    desc: "Operations, risk management, leadership & business transformation advisory services.",
    href: "#",
    hasWebsite: false,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: TreePine,
    title: "Bright Eco-Farms",
    desc: "Sustainable agriculture, tree planting & green innovation for a better tomorrow.",
    href: "#",
    hasWebsite: false,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Mountain,
    title: "Outdoor Events & Team Building",
    desc: "Hiking, team retreats & nature-based leadership experiences across East Africa.",
    href: "#",
    hasWebsite: false,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Heart,
    title: "Bright Foundation",
    desc: "CSR: community empowerment, education & environmental conservation.",
    href: "#",
    hasWebsite: false,
    color: "bg-rose-50",
    iconColor: "text-rose-600",
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
                className={`group relative bg-white border rounded-xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 flex flex-col ${
                  s.highlight
                    ? "border-gold-400 shadow-md"
                    : "border-navy-100 hover:border-gold-300"
                }`}
              >
                {s.highlight && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-semibold bg-gold-100 text-gold-700 px-2 py-1 rounded-full">
                    <ExternalLink size={12} />
                    Visit Site
                  </span>
                )}
                {Icon && (
                  <div
                    className={`w-12 h-12 rounded-lg ${s.color} flex items-center justify-center mb-4`}
                  >
                    <Icon size={24} className={s.iconColor} />
                  </div>
                )}
                {s.image && (
                  <div className="mb-4 h-20 flex items-center justify-start">
                    <img
                      src={s.image}
                      alt={s.title + " logo"}
                      className="h-full w-auto object-contain"
                    />
                  </div>
                )}
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
