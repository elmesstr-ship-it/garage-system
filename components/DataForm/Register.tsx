"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaGoogle, FaApple, FaCarSide } from "react-icons/fa";
import {
  FiUser,
  FiPhone,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiShield,
} from "react-icons/fi";

import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const DOTS = [
  { l: 10, t: 10, w: 2.0, o: 0.28 },
  { l: 30, t: 20, w: 1.5, o: 0.2 },
  { l: 55, t: 6, w: 2.5, o: 0.22 },
  { l: 75, t: 18, w: 1.2, o: 0.18 },
  { l: 88, t: 38, w: 2.0, o: 0.24 },
  { l: 4, t: 48, w: 1.8, o: 0.26 },
  { l: 22, t: 62, w: 1.3, o: 0.16 },
  { l: 44, t: 77, w: 2.2, o: 0.2 },
  { l: 66, t: 58, w: 1.6, o: 0.3 },
  { l: 84, t: 72, w: 2.0, o: 0.18 },
];

type RegisterForm = {
  fullName: string;
  phone: string;
  vehicleType: string;
  email: string;
  password: string;
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontSize: "1.125rem", fontWeight: 500, color: "#fff", margin: 0 }}>
        {value}
      </p>
      <p
        style={{
          fontSize: "0.625rem",
          color: "rgba(255,255,255,0.4)",
          marginTop: 2,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function StatDivider() {
  return (
    <div
      style={{
        width: "0.5px",
        background: "rgba(255,255,255,0.12)",
        alignSelf: "stretch",
      }}
    />
  );
}

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterForm>();

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true);

    let createdUser: any = null;

    try {
      const cleanName = data.fullName.trim();
      const cleanEmail = data.email.trim();

      console.log("STEP 1: Creating auth user");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        data.password
      );

      const user = userCredential.user;
      createdUser = user;

      console.log("STEP 2: Auth user created", user.uid);

      await updateProfile(user, {
        displayName: cleanName,
      });

      console.log("STEP 3: Saving user to Firestore");

      const firestorePromise = setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: cleanName,
        email: cleanEmail,
        phone: data.phone.trim(),
        country: "Egypt",
        vehicleType: data.vehicleType,
        role: "user",
        status: "active",
        emailVerified: false,
        isProfileCompleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Firestore timeout after 10 seconds")),
          10000
        )
      );

      await Promise.race([firestorePromise, timeoutPromise]);

      console.log("STEP 4: Firestore user saved");
      console.log("STEP 5: Sending verification email");

      await sendEmailVerification(user);

      toast.success("Account created. Verification email sent.");
      reset();
      router.push("/verify-email");
    } catch (error: any) {
      console.error("REGISTER ERROR:", error);

      if (createdUser && error.message?.includes("Firestore timeout")) {
        try {
          await deleteUser(createdUser);
          console.log("Auth user deleted because Firestore failed");
        } catch (deleteError) {
          console.error("Failed to delete auth user:", deleteError);
        }
      }

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already exists");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak");
      } else {
        toast.error(error.code || error.message || "Register failed");
      }
    } finally {
      console.log("STEP 6: Loading stopped");
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .rg-root *, .rg-root *::before, .rg-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .rg-root {
          font-family: 'DM Sans', sans-serif;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          background: #0d1117;
          --rg-heading: #f1f5f9;
          --rg-subtext: #94a3b8;
          --rg-muted: #64748b;
          --rg-border: #2d3748;
          --rg-border-hover: #4a5568;
          --rg-input-bg: #1e2530;
          --rg-input-text: #f1f5f9;
          --rg-input-ph: #4a5568;
          --rg-btn-bg: #3b82f6;
          --rg-btn-text: #ffffff;
          --rg-social-bg: #1e2530;
          --rg-social-text: #94a3b8;
          --rg-social-hover: #252d3a;
          --rg-divider: #2d3748;
          --rg-alert-text: #fca5a5;
        }

        .rg-left {
          position: relative;
          background: #090d18;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
          overflow: hidden;
        }

        .rg-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.08) 0%, transparent 60%);
        }

        .rg-dots { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
        .rg-dot { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.25); }

        .rg-car-svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -60%);
          opacity: 0.04;
          pointer-events: none;
        }

        .rg-brand { position: relative; z-index: 2; }

        .rg-logo-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(59,130,246,0.15);
          border: 0.5px solid rgba(59,130,246,0.3);
          border-radius: 999px;
          padding: 6px 14px 6px 10px;
          margin-bottom: 1.25rem;
          width: fit-content;
        }

        .rg-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 6px #3b82f6;
        }

        .rg-logo-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }

        .rg-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }

        .rg-headline span { color: #3b82f6; }

        .rg-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
          max-width: 260px;
          margin-bottom: 2rem;
        }

        .rg-stats {
          display: flex;
          gap: 20px;
          align-items: center;
          border-top: 0.5px solid rgba(255,255,255,0.08);
          padding-top: 1.5rem;
          width: fit-content;
        }

        .rg-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 2rem;
          background: #0d1117;
          overflow-y: auto;
        }

        .rg-form-wrap { width: 100%; max-width: 340px; }

        .rg-form-header { margin-bottom: 1.75rem; }

        .rg-form-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--rg-heading);
          letter-spacing: -0.02em;
        }

        .rg-form-header p {
          font-size: 13px;
          color: var(--rg-muted);
          margin-top: 4px;
        }

        .rg-field { margin-bottom: 1rem; }

        .rg-field label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: var(--rg-subtext);
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }

        .rg-input-wrap { position: relative; }

        .rg-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--rg-muted);
          display: flex;
          align-items: center;
          pointer-events: none;
          z-index: 2;
        }

        .rg-input {
          width: 100%;
          height: 42px;
          border: 1px solid var(--rg-border);
          border-radius: 10px;
          background: var(--rg-input-bg);
          color: var(--rg-input-text);
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          padding: 0 12px 0 38px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .rg-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }

        .rg-input::placeholder { color: var(--rg-input-ph); }
        .rg-input.rg-has-right { padding-right: 40px; }

        select.rg-input {
          appearance: none;
          cursor: pointer;
        }

        .rg-eye-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--rg-muted);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
        }

        .rg-error-msg {
          font-size: 11px;
          color: var(--rg-alert-text);
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .rg-submit {
          width: 100%;
          height: 44px;
          background: var(--rg-btn-bg);
          border: none;
          border-radius: 10px;
          color: var(--rg-btn-text);
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .rg-submit:hover { opacity: 0.88; }
        .rg-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .rg-spin { animation: rg-spin 0.9s linear infinite; }
        @keyframes rg-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .rg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 1.25rem 0;
        }

        .rg-divider-line { flex: 1; height: 1px; background: var(--rg-divider); }
        .rg-divider span { font-size: 11px; color: var(--rg-muted); white-space: nowrap; }

        .rg-social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .rg-social-btn {
          height: 40px;
          border: 1px solid var(--rg-border);
          border-radius: 10px;
          background: var(--rg-social-bg);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          color: var(--rg-social-text);
          font-family: 'DM Sans', sans-serif;
        }

        .rg-social-btn:hover {
          background: var(--rg-social-hover);
          border-color: var(--rg-border-hover);
        }

        .rg-signin-line {
          text-align: center;
          font-size: 12.5px;
          color: var(--rg-muted);
          margin-top: 1.25rem;
        }

        .rg-signin-line a {
          color: #3b82f6;
          text-decoration: none;
        }

        @media (max-width: 768px) {
          .rg-root { grid-template-columns: 1fr; }
          .rg-left { display: none; }
          .rg-right { padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="rg-root">
        <div className="rg-left">
          <div className="rg-left-bg" />

          <div className="rg-dots">
            {DOTS.map((d, i) => (
              <div
                key={i}
                className="rg-dot"
                style={{
                  left: `${d.l}%`,
                  top: `${d.t}%`,
                  width: `${d.w}px`,
                  height: `${d.w}px`,
                  opacity: d.o,
                }}
              />
            ))}
          </div>

          <svg
            className="rg-car-svg"
            width="340"
            height="170"
            viewBox="0 0 340 170"
            fill="white"
            aria-hidden="true"
          >
            <rect x="50" y="68" width="240" height="66" rx="10" />
            <rect x="85" y="36" width="170" height="48" rx="10" />
            <circle cx="98" cy="140" r="22" />
            <circle cx="242" cy="140" r="22" />
            <rect x="0" y="96" width="340" height="12" rx="4" />
          </svg>

          <div className="rg-brand">
            <div className="rg-logo-chip">
              <div className="rg-logo-dot" />
              <span className="rg-logo-label">Smart Garage</span>
            </div>

            <h1 className="rg-headline">
              JOIN THE
              <br />
              <span>GARAGE</span>
            </h1>

            <p className="rg-sub">
              Create your account and enjoy smart parking, real-time tracking
              and secure access control.
            </p>

            <div className="rg-stats">
              <Stat value="24/7" label="Monitoring" />
              <StatDivider />
              <Stat value="4+" label="Slots" />
              <StatDivider />
              <Stat value="15 Min" label="Hold" />
            </div>
          </div>
        </div>

        <div className="rg-right">
          <div className="rg-form-wrap">
            <div className="rg-form-header">
              <h2>Create account</h2>
              <p>Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="rg-field">
                <label htmlFor="rg-fullName">Full name</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <FiUser size={14} />
                  </span>
                  <input
                    id="rg-fullName"
                    className="rg-input"
                    type="text"
                    placeholder="Ahmed Mohamed"
                    autoComplete="name"
                    {...register("fullName", {
                      required: "Full name is required",
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p className="rg-error-msg">
                    <FiShield size={10} />
                    {String(errors.fullName.message)}
                  </p>
                )}
              </div>

              <div className="rg-field">
                <label htmlFor="rg-phone">Phone number</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <FiPhone size={14} />
                  </span>
                  <input
                    id="rg-phone"
                    className="rg-input"
                    type="tel"
                    placeholder="+20 010 0000 0000"
                    autoComplete="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                    })}
                  />
                </div>
                {errors.phone && (
                  <p className="rg-error-msg">
                    <FiShield size={10} />
                    {String(errors.phone.message)}
                  </p>
                )}
              </div>

              <div className="rg-field">
                <label htmlFor="rg-vehicle">Main vehicle</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <FaCarSide size={14} />
                  </span>
                  <select
                    id="rg-vehicle"
                    className="rg-input"
                    {...register("vehicleType", {
                      required: "Vehicle type is required",
                    })}
                  >
                    <option value="">Select your vehicle</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Kia">Kia</option>
                    <option value="Nissan">Nissan</option>
                    <option value="Chevrolet">Chevrolet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {errors.vehicleType && (
                  <p className="rg-error-msg">
                    <FiShield size={10} />
                    {String(errors.vehicleType.message)}
                  </p>
                )}
              </div>

              <div className="rg-field">
                <label htmlFor="rg-email">Email address</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <FiMail size={14} />
                  </span>
                  <input
                    id="rg-email"
                    className="rg-input"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="rg-error-msg">
                    <FiShield size={10} />
                    {String(errors.email.message)}
                  </p>
                )}
              </div>

              <div className="rg-field">
                <label htmlFor="rg-password">Password</label>
                <div className="rg-input-wrap">
                  <span className="rg-input-icon">
                    <FiLock size={14} />
                  </span>
                  <input
                    id="rg-password"
                    className="rg-input rg-has-right"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                      },
                    })}
                  />

                  <button
                    type="button"
                    className="rg-eye-btn"
                    onClick={() => setShowPassword((p) => !p)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={15} />
                    ) : (
                      <FiEye size={15} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="rg-error-msg">
                    <FiShield size={10} />
                    {String(errors.password.message)}
                  </p>
                )}
              </div>

              <button type="submit" className="rg-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FiLoader className="rg-spin" size={15} />
                    Creating account...
                  </>
                ) : (
                  <>
                    <FiUser size={14} />
                    Create account
                  </>
                )}
              </button>
            </form>

            <div className="rg-divider">
              <div className="rg-divider-line" />
              <span>or continue with</span>
              <div className="rg-divider-line" />
            </div>

            <div className="rg-social-grid">
              <button type="button" className="rg-social-btn">
                <FaApple size={15} /> Apple
              </button>
              <button type="button" className="rg-social-btn">
                <FaGoogle size={14} style={{ color: "#EA4335" }} /> Google
              </button>
            </div>

            <p className="rg-signin-line">
              Already have an account? <Link href="/login">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}