import Link from "next/link";
import { ArrowRight, Target, Eye, BookOpen, Globe, Shield, HeartHandshake } from "lucide-react";
import Leadership from "../components/Leadership";

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-navy-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Office environment"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
            About Us
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Who We Are
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            A diversified East African conglomerate built on excellence,
            integrity, and innovation.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
                Our Story
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                From Vision to Empire
              </h2>
              <div className="space-y-4 text-navy-700 leading-relaxed">
                <p>
                  Future Bright Ventures Ltd was founded with a clear purpose: to
                  build businesses that matter. Starting in Nairobi, Kenya, we set
                  out to create an ecosystem of companies that would address real
                  needs across East Africa while upholding the highest standards of
                  professionalism and ethics.
                </p>
                <p>
                  Today, we operate nine distinct subsidiaries spanning consultancy,
                  education, agriculture, travel, real estate, hospitality, and
                  community development. Each business is led by specialists who
                  share our commitment to quality and impact.
                </p>
                <p>
                  Our growth has been intentional. We expand not for the sake of
                  scale, but because we see opportunities where our expertise can
                  make a genuine difference. From the boardroom to the farm, from
                  the classroom to the road, we bring excellence everywhere we go.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
                alt="Business handshake"
                className="rounded-xl shadow-lg w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-white border border-navy-100 rounded-xl p-8 md:p-10">
              <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center mb-5">
                <Target size={24} className="text-gold-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-navy-900 mb-3">
                Our Mission
              </h3>
              <p className="text-navy-700 leading-relaxed">
                To build a diversified portfolio of world-class businesses that
                deliver exceptional value to clients, create meaningful employment,
                and contribute positively to the communities and environments we
                operate in.
              </p>
            </div>
            <div className="bg-white border border-navy-100 rounded-xl p-8 md:p-10">
              <div className="w-12 h-12 rounded-lg bg-gold-100 flex items-center justify-center mb-5">
                <Eye size={24} className="text-gold-600" />
              </div>
              <h3 className="font-display text-2xl font-bold text-navy-900 mb-3">
                Our Vision
              </h3>
              <p className="text-navy-700 leading-relaxed">
                To be East Africa&apos;s most trusted and diversified conglomerate —
                recognized for excellence, innovation, integrity, and a lasting
                positive impact on every life we touch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Detail */}
      <section className="py-16 md:py-24 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-16">
            <p className="text-gold-400 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
              What Drives Us
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
              Our Values in Detail
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                <Target size={24} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  Excellence
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  We refuse mediocrity. From the smallest task to the largest
                  project, we apply the same rigorous standard of quality. Our
                  clients deserve nothing less than our best work, every single
                  time.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                <Globe size={24} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  Innovation
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  We challenge conventional thinking. We invest in research, adopt
                  new technologies, and encourage creative problem-solving across
                  all our subsidiaries. Stagnation is not an option.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                <Shield size={24} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  Integrity
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  We do the right thing, even when no one is watching. Our
                  reputation is our most valuable asset, and we protect it through
                  honest dealings, transparent communication, and ethical conduct.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-gold-500/10 flex items-center justify-center shrink-0">
                <HeartHandshake size={24} className="text-gold-400" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-white mb-2">
                  Client-Centric Service
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  We listen first. Every solution we design is tailored to the
                  specific needs of our clients. Their goals become our goals. Their
                  deadlines become our deadlines. Their success is our success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 md:mb-16">
            <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
              Our Environment
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900">
              Culture & Working Environment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-navy-50 rounded-xl p-8">
              <h3 className="font-display text-lg font-semibold text-navy-900 mb-3">
                Collaborative
              </h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                We believe the best ideas emerge from diverse teams working
                together. Cross-pollination of expertise across subsidiaries is
                encouraged and celebrated.
              </p>
            </div>
            <div className="bg-navy-50 rounded-xl p-8">
              <h3 className="font-display text-lg font-semibold text-navy-900 mb-3">
                Growth-Oriented
              </h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                Every team member has a development plan. We invest in training,
                mentorship, and opportunities to lead. Your growth is our growth.
              </p>
            </div>
            <div className="bg-navy-50 rounded-xl p-8">
              <h3 className="font-display text-lg font-semibold text-navy-900 mb-3">
                Impact-Focused
              </h3>
              <p className="text-sm text-navy-700 leading-relaxed">
                We measure success not just in revenue, but in lives changed,
                communities uplifted, and environments protected. This is the
                Future Bright difference.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Books & Publications */}
      <section className="py-16 md:py-24 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-gold-600 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
                Thought Leadership
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                Books & Publications
              </h2>
              <p className="text-navy-700 leading-relaxed mb-6">
                Our leadership team regularly contributes to industry discourse
                through research papers, whitepapers, and published works. We
                believe in sharing knowledge that helps elevate the entire East
                African business ecosystem.
              </p>
              <p className="text-navy-700 leading-relaxed mb-6">
                Topics range from sustainable agriculture practices and leadership
                in the African context, to real estate investment strategies and
                the future of corporate travel in the region.
              </p>
              <a
                href="mailto:info@fbrightventures.co.ke?subject=Publications%20Inquiry"
                className="inline-flex items-center gap-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                View Publications <ArrowRight size={18} />
              </a>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white border border-navy-100 rounded-xl p-8 md:p-10 text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-5">
                  <BookOpen size={28} className="text-gold-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-navy-900 mb-2">
                  Knowledge Library
                </h3>
                <p className="text-sm text-navy-600 mb-4">
                  Our publications cover strategy, operations, sustainability, and
                  innovation across East African markets.
                </p>
                <p className="text-xs text-navy-400">
                  New releases quarterly. Subscribe to receive updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Leadership />
    </div>
  );
}
