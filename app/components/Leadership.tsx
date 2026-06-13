import Link from "next/link";

const team = [
  {
    name: "Benjamin Masai",
    role: "Chief Executive Officer (CEO) & Co-Founder",
    org: "Future Bright Ventures",
    image: "/images/benjamin-masai.jpg",
  },
  {
    name: "Miriam Njeri",
    role: "Co-Founder & Finance Director",
    org: "Future Bright Ventures",
    image: "/images/miriam-njeri.jpg",
  },
  {
    name: "Trevis Masai",
    role: "Director, ICT & Innovation",
    org: "CEO & Co-Founder, NextBotics",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&q=80",
  },
  {
    name: "Michael Kiptoo",
    role: "Head of Business Operations & Strategy",
    org: "Bright Elite Tours & Travels",
    image: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&q=80",
  },
  {
    name: "Grace Wanjiku",
    role: "Head of Training & Leadership Development",
    org: "Bright Academy",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
  },
  {
    name: "Mercy Wairimu",
    role: "Head of Fleet Operations & Mobility Services",
    org: "Future Bright Ventures",
    image: "https://images.unsplash.com/photo-1531123414780-f74242c2b052?w=400&q=80",
  },
  {
    name: "Esther Chebet",
    role: "Head of Property & Real Estate",
    org: "Bright Homes",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80",
  },
  {
    name: "Kevin Wambua",
    role: "Head of Corporate Services, Environment & Sustainability",
    org: "Future Bright Ventures",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&q=80",
  },
  {
    name: "Thomas Wafula",
    role: "General Manager – Hospitality",
    org: "Future Bright Ventures",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&q=80",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
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
              <p className="text-xs text-navy-400 mt-1">
                {t.org}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
