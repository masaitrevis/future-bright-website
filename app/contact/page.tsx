import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Youtube,
  Facebook,
  Send,
  ArrowRight,
} from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-navy-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1423666639391-2066f3d27b28?w=1920&q=80"
            alt="Contact"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 to-navy-900" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gold-400 text-sm uppercase tracking-[0.25em] font-semibold mb-3">
            Get in Touch
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            We would love to hear from you. Reach out for partnerships, inquiries,
            or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Contact Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-navy-50 border border-navy-100 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center mb-3">
                  <Phone size={20} className="text-gold-600" />
                </div>
                <h3 className="font-display text-sm font-semibold text-navy-900 uppercase tracking-wider mb-2">
                  Phone
                </h3>
                <div className="space-y-1">
                  <a
                    href="tel:+254700460814"
                    className="block text-sm text-navy-600 hover:text-gold-600 transition-colors"
                  >
                    +254 700 460814
                  </a>
                  <a
                    href="tel:+254720938031"
                    className="block text-sm text-navy-600 hover:text-gold-600 transition-colors"
                  >
                    +254 720 938031
                  </a>
                  <a
                    href="tel:+254723755752"
                    className="block text-sm text-navy-600 hover:text-gold-600 transition-colors"
                  >
                    +254 723 755752
                  </a>
                </div>
              </div>

              <div className="bg-navy-50 border border-navy-100 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center mb-3">
                  <Mail size={20} className="text-gold-600" />
                </div>
                <h3 className="font-display text-sm font-semibold text-navy-900 uppercase tracking-wider mb-2">
                  Email
                </h3>
                <a
                  href="mailto:info@fbrightventures.co.ke"
                  className="text-sm text-navy-600 hover:text-gold-600 transition-colors"
                >
                  info@fbrightventures.co.ke
                </a>
              </div>

              <div className="bg-navy-50 border border-navy-100 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center mb-3">
                  <MapPin size={20} className="text-gold-600" />
                </div>
                <h3 className="font-display text-sm font-semibold text-navy-900 uppercase tracking-wider mb-2">
                  Location
                </h3>
                <p className="text-sm text-navy-600">
                  Headquarters: Nairobi, Kenya
                </p>
                <p className="text-sm text-navy-600">
                  Dynamic presence across East Africa
                </p>
              </div>

              <div className="bg-navy-50 border border-navy-100 rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center mb-3">
                  <Send size={20} className="text-gold-600" />
                </div>
                <h3 className="font-display text-sm font-semibold text-navy-900 uppercase tracking-wider mb-2">
                  Social Media
                </h3>
                <div className="flex items-center gap-3">
                  <a
                    href="https://instagram.com/fbright.ventures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-600 hover:text-gold-600 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a
                    href="https://youtube.com/@futurebrightventures"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-600 hover:text-gold-600 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube size={20} />
                  </a>
                  <a
                    href="https://facebook.com/share/1XRk1ii3Jy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-600 hover:text-gold-600 transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-navy-50 border border-navy-100 rounded-xl p-6 md:p-10">
                <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
                  Send a Message
                </h2>
                <p className="text-sm text-navy-500 mb-8">
                  We will get back to you within 24 hours.
                </p>
                <form action="https://api.web3forms.com/submit" method="POST" className="space-y-5">
                  <input type="hidden" name="access_key" value="5c530529-bf88-47f8-a24e-7abeec54d328" />
                  <input type="hidden" name="redirect" value="https://future-bright-website.vercel.app/contact?sent=true" />
                  <input type="hidden" name="subject" value="New Contact Form Submission - Future Bright Ventures" />
                  <input type="hidden" name="from_name" value="Future Bright Ventures Website" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        className="w-full bg-white border border-navy-200 rounded-lg px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+254 7XX XXX XXX"
                        className="w-full bg-white border border-navy-200 rounded-lg px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="you@company.com"
                      className="w-full bg-white border border-navy-200 rounded-lg px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                      Interest
                    </label>
                    <select name="interest" className="w-full bg-white border border-navy-200 rounded-lg px-4 py-2.5 text-sm text-navy-900 focus:outline-none focus:border-gold-400 transition-colors appearance-none">
                      <option>General Inquiry</option>
                      <option>Future Bright Consultancy</option>
                      <option>Bright Academy</option>
                      <option>Bright Eco-Farms</option>
                      <option>Bright Tours and Travel</option>
                      <option>Bright Elite Tours & Travels</option>
                      <option>Bright Real Estate & Property</option>
                      <option>Bright Homes & Resort</option>
                      <option>Outdoor Events & Team Building</option>
                      <option>Bright Foundation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy-700 uppercase tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="How can we help you?"
                      className="w-full bg-white border border-navy-200 rounded-lg px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-300 focus:outline-none focus:border-gold-400 transition-colors resize-none"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-navy-800 hover:bg-navy-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    Send Message
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
