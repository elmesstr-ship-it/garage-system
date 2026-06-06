import { Car, ShieldCheck, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: Car,
    title: "Smart Parking",
    text: "Real-time parking management for faster and easier vehicle access.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    text: "Safe and reliable parking reservation and vehicle management.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard",
    text: "Clean control panel for parking operations, bookings, and users.",
  },
];

const checks = [
  "Easy parking control",
  "Secure user access",
  "Live slot tracking",
  "Modern dashboard",
];

const stats = [
  { value: "24/7", label: "Garage Monitoring", accent: true },
  { value: "4+", label: "Parking Slots", accent: false },
  { value: "15 Min", label: "Reservation Hold", accent: false },
];

export default function About() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .ab-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #090d18;
          color: #fff;
        }

        /* ── CSS variables: light mode ── */
        .ab-root {
          --ab-bg:          #090d18;
          --ab-card:        rgba(255,255,255,0.04);
          --ab-border:      rgba(255,255,255,0.07);
          --ab-text:        #f1f5f9;
          --ab-muted:       rgba(255,255,255,0.4);
          --ab-sub:         rgba(255,255,255,0.45);
          --ab-check:       rgba(255,255,255,0.6);
          --ab-divider:     rgba(255,255,255,0.06);
          --ab-accent-bg:   rgba(59,130,246,0.12);
          --ab-accent-brd:  rgba(59,130,246,0.25);
          --ab-accent-text: #93c5fd;
          --ab-stat-val:    #fff;
        }

        @media (prefers-color-scheme: light) {
          .ab-root {
            --ab-bg:          #f5f5f0;
            --ab-card:        rgba(0,0,0,0.03);
            --ab-border:      rgba(0,0,0,0.08);
            --ab-text:        #0f172a;
            --ab-muted:       #64748b;
            --ab-sub:         #475569;
            --ab-check:       #334155;
            --ab-divider:     rgba(0,0,0,0.07);
            --ab-accent-bg:   rgba(59,130,246,0.08);
            --ab-accent-brd:  rgba(59,130,246,0.2);
            --ab-accent-text: #1d4ed8;
            --ab-stat-val:    #0f172a;
          }
          .ab-root { background: var(--ab-bg); color: var(--ab-text); }
          .ab-headline { color: var(--ab-text) !important; }
          .ab-headline span { color: #2563eb !important; }
          .ab-chip-dot { box-shadow: none !important; }
          .ab-feat-icon-wrap { background: rgba(59,130,246,0.08) !important; }
        }

        .ab-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 64px 40px;
        }

        /* ── Chip ── */
        .ab-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,130,246,0.1);
          border: 0.5px solid rgba(59,130,246,0.25);
          border-radius: 999px;
          padding: 5px 14px 5px 10px;
          margin-bottom: 24px;
          width: fit-content;
        }
        .ab-chip-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 5px #3b82f6;
        }
        .ab-chip-txt {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        /* ── Hero grid ── */
        .ab-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
          align-items: center;
          margin-bottom: 56px;
        }

        .ab-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
        }
        .ab-headline span { color: #3b82f6; }

        .ab-sub {
          font-size: 14px;
          color: var(--ab-sub);
          line-height: 1.75;
          max-width: 400px;
          margin-bottom: 28px;
        }

        /* ── Checks ── */
        .ab-checks {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .ab-check {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 13px;
          color: var(--ab-check);
        }
        .ab-check-icon {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: rgba(59,130,246,0.15);
          border: 0.5px solid rgba(59,130,246,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #3b82f6;
        }

        /* ── Feature panel (right side) ── */
        .ab-feat-panel {
          background: var(--ab-card);
          border: 0.5px solid var(--ab-border);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ab-feat-card {
          background: var(--ab-card);
          border: 0.5px solid var(--ab-border);
          border-radius: 10px;
          padding: 16px;
          transition: background 0.15s;
        }
        .ab-feat-card:hover { background: rgba(255,255,255,0.07); }
        .ab-feat-icon-wrap {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: rgba(59,130,246,0.12);
          border: 0.5px solid rgba(59,130,246,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          color: #3b82f6;
        }
        .ab-feat-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--ab-text);
          margin-bottom: 4px;
        }
        .ab-feat-sub {
          font-size: 12px;
          color: var(--ab-muted);
          line-height: 1.65;
        }

        /* ── Divider ── */
        .ab-divider {
          height: 0.5px;
          background: var(--ab-divider);
          margin-bottom: 36px;
        }

        /* ── Stats ── */
        .ab-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .ab-stat {
          background: var(--ab-card);
          border: 0.5px solid var(--ab-border);
          border-radius: 12px;
          padding: 24px 20px;
          text-align: center;
        }
        .ab-stat.ab-accent {
          background: var(--ab-accent-bg);
          border-color: var(--ab-accent-brd);
        }
        .ab-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: var(--ab-stat-val);
          letter-spacing: -0.02em;
        }
        .ab-stat.ab-accent .ab-stat-val { color: var(--ab-accent-text); }
        .ab-stat-lbl {
          font-size: 11px;
          color: var(--ab-muted);
          margin-top: 6px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .ab-inner { padding: 40px 20px; }
          .ab-hero { grid-template-columns: 1fr; gap: 28px; }
          .ab-stats { grid-template-columns: 1fr; }
          .ab-checks { grid-template-columns: 1fr; }
        }
      `}</style>

      <main className="ab-root">
        <div className="ab-inner">

          {/* Chip */}
          <div className="ab-chip">
            <div className="ab-chip-dot" />
            <span className="ab-chip-txt">Smart Garage System</span>
          </div>

          {/* Hero */}
          <div className="ab-hero">

            {/* Left — text */}
            <div>
              <h1 className="ab-headline">
                About <span>RAKNAH</span>
              </h1>
              <p className="ab-sub">
                RAKNAH is a modern parking management platform designed to provide
                real-time slot booking, secure access, and efficient vehicle
                tracking through a simple and intuitive dashboard.
              </p>
              <div className="ab-checks">
                {checks.map((c) => (
                  <div key={c} className="ab-check">
                    <div className="ab-check-icon">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {c}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — feature cards */}
            <div className="ab-feat-panel">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="ab-feat-card">
                    <div className="ab-feat-icon-wrap">
                      <Icon size={18} />
                    </div>
                    <p className="ab-feat-title">{f.title}</p>
                    <p className="ab-feat-sub">{f.text}</p>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Divider */}
          <div className="ab-divider" />

          {/* Stats */}
          <div className="ab-stats">
            {stats.map((s) => (
              <div key={s.label} className={`ab-stat${s.accent ? " ab-accent" : ""}`}>
                <p className="ab-stat-val">{s.value}</p>
                <p className="ab-stat-lbl">{s.label}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}