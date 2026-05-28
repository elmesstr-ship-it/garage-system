import {
  User,
  Mail,
  Car,
  ShieldCheck,
  Phone,
  MapPin,
} from "lucide-react";

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-20 text-white">
      <section className="max-w-6xl mx-auto">
        
        {/* Header Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            {/* Avatar */}
            <div className="w-36 h-36 rounded-full bg-blue-600 flex items-center justify-center shadow-xl">
              <User size={70} />
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-5xl font-extrabold">
                Awad User
              </h1>

              <p className="flex items-center gap-2 text-slate-300 mt-5">
                <Mail size={18} />
                awad@gmail.com
              </p>

              <p className="flex items-center gap-2 text-slate-300 mt-3">
                <Phone size={18} />
                +20 100 000 0000
              </p>

              <p className="flex items-center gap-2 text-slate-300 mt-3">
                <MapPin size={18} />
                Egypt
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <Car className="text-blue-400 mb-4" size={42} />

            <h2 className="text-4xl font-extrabold">
              12
            </h2>

            <p className="text-slate-300 mt-2">
              Parking Visits
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <ShieldCheck
              className="text-green-400 mb-4"
              size={42}
            />

            <h2 className="text-4xl font-extrabold">
              Verified
            </h2>

            <p className="text-slate-300 mt-2">
              Account Status
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <Car className="text-blue-400 mb-4" size={42} />

            <h2 className="text-4xl font-extrabold">
              BMW
            </h2>

            <p className="text-slate-300 mt-2">
              Main Vehicle
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}