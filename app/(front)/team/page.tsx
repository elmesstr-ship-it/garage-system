import { Users, Sparkles, GraduationCap, UserRoundCheck } from "lucide-react";

const members = [
  { name: "Mariam Samir", gender: "female" },
  { name: "Rahma Mohamed", gender: "female" },
  { name: "Eman ElSayed", gender: "female" },
  { name: "Abdelrahman Ibrahim", gender: "male" },
  { name: "Awad Mohamed", gender: "male" },
  { name: "Mohamed Ayman", gender: "male" },
];

export default function TeamPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060d1f] px-6 py-16 text-white">
      <style>
        {`
          @keyframes floatCard {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-14px); }
          }

          @keyframes glowPulse {
            0%, 100% { opacity: .35; transform: scale(1); }
            50% { opacity: .75; transform: scale(1.08); }
          }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(35px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute -left-40 top-24 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl"
        style={{ animation: "glowPulse 5s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl"
        style={{ animation: "glowPulse 6s ease-in-out infinite" }}
      />

      <section className="relative mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <div className="mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-5 py-2 text-sm font-semibold text-blue-300">
            <Sparkles size={16} />
            Graduation Project Team
          </div>

          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] border border-blue-500/30 bg-blue-600/20 text-blue-300 shadow-2xl shadow-blue-600/20">
            <Users size={40} />
          </div>

          <h1 className="text-4xl font-black tracking-tight md:text-6xl">
            Meet Our Team
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            The Smart Garage system was developed by a dedicated team aiming to
            improve parking management through real-time monitoring, digital
            booking, and modern cloud technologies.
          </p>
        </div>

        <div className="mb-12 rounded-[2rem] border border-white/10 bg-white/[0.04] p-7 shadow-2xl">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-400">
                Final Presentation Section
              </p>
              <h2 className="text-2xl font-black md:text-3xl">
                The people behind Smart Garage
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                This page is designed to be shown at the end of the project
                demo as a clean team showcase.
              </p>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-600 text-white shadow-lg shadow-blue-600/30">
              <GraduationCap size={34} />
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => {
            const isFemale = member.gender === "female";

            return (
              <div
                key={member.name}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 text-center shadow-xl transition duration-300 hover:-translate-y-3 hover:border-blue-500/50 hover:bg-blue-500/10"
                style={{
                  animation: `slideUp .7s ease forwards, floatCard ${
                    5 + index * 0.4
                  }s ease-in-out infinite`,
                  animationDelay: `${index * 0.12}s, ${index * 0.25}s`,
                }}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />

                <div
                  className={`mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border text-5xl shadow-2xl ${
                    isFemale
                      ? "border-pink-400/30 bg-pink-500/10 shadow-pink-500/10"
                      : "border-blue-400/30 bg-blue-500/10 shadow-blue-500/10"
                  }`}
                >
                  {isFemale ? "👩‍💻" : "👨‍💻"}
                </div>

                <div className="mb-4 flex justify-center">
                  <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-300">
                    Team Member #{index + 1}
                  </span>
                </div>

                <h2 className="text-xl font-black">{member.name}</h2>

                <p className="mx-auto mt-3 max-w-xs leading-7 text-slate-400">
                  Contributed to building and presenting the Smart Garage
                  graduation project.
                </p>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-green-400">
                  <UserRoundCheck size={18} />
                  Project Contributor
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}