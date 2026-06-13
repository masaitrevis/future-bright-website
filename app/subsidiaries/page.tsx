import Link from "next/link";
import {
  Building2,
  GraduationCap,
  TreePine,
  Car,
  Home,
  Hotel,
  Mountain,
  Heart,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const subsidiaries = [
  {
    icon: Building2,
    title: "Bright Consultancy",
    desc: "Operations, risk management, leadership & business transformation. We partner with organizations to optimize their operations, manage risk, and lead transformative change.",
    href: "#",
    external: false,
    hasWebsite: false,
    color: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: GraduationCap,
    title: "Bright Academy",
    desc: "Training, coaching & mentorship for leaders and professionals. We build capacity through certified programs, executive coaching, and tailored leadership development.",
    href: "#",
    external: false,
    hasWebsite: false,
    color: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    icon: TreePine,
    title: "Bright Eco-Farms",
    desc: "Sustainable agriculture, tree planting & green innovation. We promote environmentally friendly farming practices and large-scale reforestation initiatives.",
    href: "#",
    external: false,
    hasWebsite: false,
    color: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    icon: Car,
    title: "Bright Elite Tours & Travels",
    desc: "Executive mobility, chauffeur services & driver training. Premium professional transport for executives, corporates, and VIP clients across Nairobi and beyond.",
    href: "https://brightelite.vercel.app",
    external: true,
    hasWebsite: true,
    highlight: true,
    color: "bg-gold-50",
    iconColor: "text-gold-600",
  },
  {
    icon: Home,
    title: "Bright Homes",
    desc: "Premium property management, vacation rentals & real estate solutions. Sustainable, affordable housing with a focus on community value.",
    href: "#",
    external: false,
    hasWebsite: false,
    color: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    icon: Hotel,
    title: "Bright Hospitality",
    desc: "Eco-friendly accommodation for families, travellers & corporates. Our hospitality arm delivers memorable stays with minimal environmental impact.",
    href: "#",
    external: false,
    hasWebsite: false,
    color: "bg-teal-50",
    iconColor: "text-teal-600",
  },
  {
    icon: Mountain,
    title: "Outdoor Events & Team Building",
    desc: "Hiking, team retreats & nature-based leadership experiences. We design outdoor experiences that build teams, develop leaders, and reconnect people with nature.",
    href: "#",
    external: false,
    hasWebsite: false,
    color: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    icon: Heart,
    title: "Bright Foundation",
    desc: "CSR: community empowerment, education & environmental conservation. Our foundation drives social impact through scholarships, community programs, and conservation projects.",
    href: "#",
    external: false,
    hasWebsite: false,
    color: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

export default function SubsidiariesPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-navy-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
            alt="Corporate network"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
            Our Ecosystem
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Our Subsidiaries
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Nine specialized companies. One shared vision. Explore the breadth of
            Future Bright Ventures.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {subsidiaries.map((s) => {
              const Icon = s.icon;
              const linkProps = s.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {};
              return (
                <div
                  key={s.title}
                  className={`group relative bg-white border rounded-xl p-6 md:p-8 hover:shadow-lg transition-all duration-300 ${
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
                  <div
                    className={`w-12 h-12 rounded-lg ${s.color} flex items-center justify-center mb-4`}
                  >
                    <Icon size={24} className={s.iconColor} />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed mb-4">
                    {s.desc}
                  </p>
                  {s.hasWebsite ? (
                    <Link
                      href={s.href}
                      {...linkProps}
                      className="inline-flex items-center gap-1 text-sm font-medium text-gold-600 hover:text-gold-700 transition-colors"
                    >
                      Visit Website <ArrowRight size={14} />
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
        </div>
      </section>
    </div>
  );
}
