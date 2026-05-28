import {
  Mail,
  Phone,
  MapPin,
  SendHorizonal,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-20 text-white">
      <section className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Contact <span className="text-blue-400">Us</span>
          </h1>

          <p className="mt-6 text-lg text-slate-300 leading-8 max-w-xl">
            Have questions about Smart Garage? Our team is
            ready to help you anytime.
          </p>

          <div className="mt-10 space-y-6">
            
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-4 rounded-2xl">
                <Mail className="text-blue-400" />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Email
                </h3>

                <p className="text-slate-300">
                  support@smartgarage.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-4 rounded-2xl">
                <Phone className="text-blue-400" />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Phone
                </h3>

                <p className="text-slate-300">
                  +20 100 000 0000
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-blue-500/20 p-4 rounded-2xl">
                <MapPin className="text-blue-400" />
              </div>

              <div>
                <h3 className="font-bold text-lg">
                  Location
                </h3>

                <p className="text-slate-300">
                  Egypt
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          <h2 className="text-3xl font-bold mb-8">
            Send Message
          </h2>

          <form className="space-y-5">
            
            <input
              type="text"
              placeholder="Your Name"
              className="w-full rounded-2xl bg-white/10 border border-white/10 px-5 py-4 outline-none focus:border-blue-500"
            />

            <input
              type="email"
              placeholder="Your Email"
              className="w-full rounded-2xl bg-white/10 border border-white/10 px-5 py-4 outline-none focus:border-blue-500"
            />

            <textarea
              placeholder="Your Message"
              rows={6}
              className="w-full rounded-2xl bg-white/10 border border-white/10 px-5 py-4 outline-none resize-none focus:border-blue-500"
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-4 font-semibold text-lg shadow-lg"
            >
              <SendHorizonal size={20} />
              Send Message
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}