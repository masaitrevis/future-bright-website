import { Award, Lightbulb, Shield, HeartHandshake } from "lucide-react";

const values = [
  {
    icon: Award,
    title: "Excellence",
    desc: "We pursue the highest standards in every project, every service, and every interaction.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We embrace new ideas and technologies to stay ahead and create meaningful solutions.",
  },
  {
    icon: Shield,
    title: "Integrity",
    desc: "Trust is our foundation. We operate with transparency, honesty, and accountability.",
  },
  {
    icon: HeartHandshake,
    title: "Client-Centric Service",
    desc: "Our clients are at the center of everything we do. Their success is our success.",
  },
];

export default function Values() {
  return (
    <section className="py-20 md:py-28 bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 md:mb-20">
          <p className="text-gold-400 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
            What We Stand For
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">
            Our Core Values
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="bg-navy-800/60 border border-white/5 rounded-xl p-6 md:p-8 text-center hover:border-gold-400/30 transition-colors"
              >
                <div className="w-14 h-14 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto mb-5">
                  <Icon size={28} className="text-gold-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  {v.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
