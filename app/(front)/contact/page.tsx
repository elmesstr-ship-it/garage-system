"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  SendHorizonal,
  Loader2,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@smartgarage.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+20 100 000 0000",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Egypt",
  },
];

const supportInfo = [
  {
    icon: Clock,
    label: "Response Time",
    value: "Usually within 24 hours",
  },
  {
    icon: CalendarCheck,
    label: "Support Availability",
    value: "Sunday - Thursday | 9 AM - 5 PM",
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, "contactMessages"), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        status: "unread",
        createdAt: serverTimestamp(),
      });

      toast.success("Message sent successfully");

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("CONTACT MESSAGE ERROR:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen px-4 sm:px-6 py-12 sm:py-16 text-white"
      style={{ background: "#060d1f" }}
    >
      {/* grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <section className="max-w-5xl mx-auto relative z-10 space-y-10 sm:space-y-12">
        {/* header */}
        <div className="text-center space-y-4">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase">
            Smart Garage Support
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
            Contact <span className="text-blue-400">Us</span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-7">
            Need help with parking reservations, payments, or account issues?
            Our team is ready to assist you.
          </p>
        </div>

        {/* layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* LEFT */}
          <div className="space-y-4">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 sm:gap-5 rounded-2xl border border-white/10 p-4 sm:p-5 backdrop-blur-md hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)" }}
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 flex shrink-0 items-center justify-center bg-blue-500/10 rounded-xl">
                  <Icon size={20} className="text-blue-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-500 uppercase">{label}</p>
                  <p className="text-white text-sm sm:text-base break-words">
                    {value}
                  </p>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 pt-2">
              {supportInfo.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="rounded-2xl border border-white/10 p-4 backdrop-blur-md"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={18} className="text-blue-400" />
                    <p className="text-sm font-semibold text-white">{label}</p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="rounded-2xl border border-white/10 p-5 sm:p-7 backdrop-blur-md"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold">Get in Touch</h2>
              <p className="text-sm text-slate-400 mt-2">
                Send us your message and we will get back to you as soon as
                possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
              />

              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
              />

              <textarea
                placeholder="How can we help you?"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <SendHorizonal size={17} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}