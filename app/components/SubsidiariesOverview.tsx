import Link from "next/link";
import {
  Building2,
  GraduationCap,
  TreePine,
  Plane,
  Car,
  Home,
  Hotel,
  Mountain,
  Heart,
  ArrowRight,
} from "lucide-react";

const subsidiaries = [
  {
    icon: Building2,
    title: "Future Bright Consultancy",
    desc: "Operations, risk management, leadership & business transformation",
    href: "#",
  },
  {
    icon: GraduationCap,
    title: "Bright Academy",
    desc: "Training, coaching & mentorship for leaders and professionals",
    href: "#",
  },
  {
    icon: TreePine,
    title: "Bright Eco-Farms",
    desc: "Sustainable agriculture, tree planting & green innovation",
    href: "#",
  },
  {
    icon: Plane,
    title: "Bright Tours and Travel",
    desc: "Connecting people to destinations and experiences",
    href: "#",
  },
  {
    icon: Car,
    title: "Bright Elite Tours & Travels",
    desc: "Executive mobility, chauffeur services & driver training",
    href: "https://fbrightventures.co.ke",
    external: true,
  },
  {
    icon: Home,
    title: "Bright Real Estate & Property",
    desc: "Sustainable, affordable housing & property investment solutions",
    href: "#",
  },
  {
    icon: Hotel,
    title: "Bright Homes & Resort",
    desc: "Eco-friendly accommodation for families, travellers & corporates",
    href: "#",
  },
  {
    icon: Mountain,
    title: "Outdoor Events & Team Building",
    desc: "Hiking, team retreats & nature-based leadership experiences",
    href: "#",
  },
  {
    icon: Heart,
    title: "Bright Foundation",
    desc: "CSR: community empowerment, education & environmental conservation",
    href: "#",
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
            Nine specialized companies. One shared vision. Each business unit is
            designed to solve real problems and create lasting value.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {subsidiaries.map((s) => {
            const Icon = s.icon;
            const linkProps = s.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <div
                key={s.title}
                className="group bg-white border border-navy-100 rounded-xl p-6 md:p-8 hover:shadow-lg hover:border-gold-300 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-navy-100 flex items-center justify-center mb-4 group-hover:bg-gold-100 transition-colors">
                  <Icon
                    size={24}
                    className="text-navy-700 group-hover:text-gold-600 transition-colors"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-navy-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-navy-600 leading-relaxed mb-4">
                  {s.desc}
                </p>
                <Link
                  href={s.href}
                  {...linkProps}
                  className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
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
