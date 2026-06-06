"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle, FaApple } from "react-icons/fa";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiLoader,
  FiMail,
  FiShield,
} from "react-icons/fi";

const DOTS = [
  { l: 12, t: 8, w: 2.0, o: 0.3 },
  { l: 34, t: 22, w: 1.5, o: 0.2 },
  { l: 58, t: 5, w: 2.5, o: 0.25 },
  { l: 78, t: 15, w: 1.2, o: 0.18 },
  { l: 90, t: 35, w: 2.0, o: 0.22 },
  { l: 5, t: 45, w: 1.8, o: 0.28 },
  { l: 25, t: 60, w: 1.3, o: 0.15 },
  { l: 45, t: 75, w: 2.2, o: 0.2 },
  { l: 68, t: 55, w: 1.6, o: 0.32 },
  { l: 85, t: 70, w: 2.0, o: 0.18 },
  { l: 15, t: 82, w: 1.4, o: 0.24 },
  { l: 50, t: 90, w: 1.8, o: 0.2 },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p
        style={{
          fontSize: "1.125rem",
          fontWeight: 500,
          color: "#fff",
          margin: 0,
        }}
      >
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

export default function LoginFormWithBg() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<any>();

  async function handleForgotPassword() {
    const email = getValues("email")?.trim();

    if (!email) {
      toast.error("Enter your email first");
      return;
    }

    try {
      setResetLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (error: any) {
      console.error("RESET PASSWORD ERROR:", error);
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setResetLoading(false);
    }
  }

  async function onSubmit(data: any) {
    setIsLoading(true);
    setShowError(false);

    try {
      console.log("LOGIN STEP 1: Signing in");

      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );

      const user = userCredential.user;

      console.log("LOGIN STEP 2: Auth success", user.uid);

      if (!user.emailVerified) {
        toast.error("Please verify your email first");
        router.push("/verify-email");
        return;
      }

      const fallbackUser: any = {
        uid: user.uid,
        name: user.email?.split("@")[0] || "User",
        email: user.email,
        role: "user",
      };

      let userData = fallbackUser;

      try {
        console.log("LOGIN STEP 3: Getting user data from Firestore");

        const userSnap: any = await Promise.race([
          getDoc(doc(db, "users", user.uid)),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore timeout")), 3000)
          ),
        ]);

        if (userSnap && userSnap.exists()) {
          userData = {
            uid: user.uid,
            ...userSnap.data(),
          };
        }
      } catch (firestoreError) {
        console.warn("LOGIN FIRESTORE FALLBACK:", firestoreError);
      }

      localStorage.setItem("smart-user", JSON.stringify(userData));

      console.log("LOGIN STEP 4: User saved locally");

      reset();
      toast.success("Welcome back!");

      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      setShowError(true);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Invalid email or password");
      } else {
        toast.error(error.message || "Login failed");
      }
    } finally {
      console.log("LOGIN STEP 5: Loading stopped");
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .sg-root *, .sg-root *::before, .sg-root *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .sg-root {
          font-family: 'DM Sans', sans-serif;
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100vh;
          background: #0d1117;
          --sg-bg: #0d1117;
          --sg-heading: #f1f5f9;
          --sg-subtext: #94a3b8;
          --sg-muted: #64748b;
          --sg-border: #2d3748;
          --sg-border-hover: #4a5568;
          --sg-input-bg: #1e2530;
          --sg-input-text: #f1f5f9;
          --sg-input-ph: #4a5568;
          --sg-btn-bg: #3b82f6;
          --sg-btn-text: #ffffff;
          --sg-social-bg: #1e2530;
          --sg-social-text: #94a3b8;
          --sg-social-hover: #252d3a;
          --sg-divider: #2d3748;
          --sg-alert-bg: rgba(239,68,68,0.12);
          --sg-alert-border: rgba(239,68,68,0.3);
          --sg-alert-text: #fca5a5;
        }

        .sg-left {
          position: relative;
          background: #090d18;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 3rem;
          overflow: hidden;
        }

        .sg-left-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.12) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(6,182,212,0.08) 0%, transparent 60%);
        }

        .sg-dots {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .sg-dot {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
        }

        .sg-car-svg {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -62%);
          opacity: 0.04;
          pointer-events: none;
        }

        .sg-brand {
          position: relative;
          z-index: 2;
        }

        .sg-logo-chip {
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

        .sg-logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3b82f6;
          box-shadow: 0 0 6px #3b82f6;
        }

        .sg-logo-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }

        .sg-headline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
        }

        .sg-headline span {
          color: #3b82f6;
        }

        .sg-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          line-height: 1.65;
          max-width: 270px;
          margin-bottom: 2rem;
        }

        .sg-stats {
          display: flex;
          gap: 20px;
          align-items: center;
          border-top: 0.5px solid rgba(255,255,255,0.08);
          padding-top: 1.5rem;
          width: fit-content;
        }

        .sg-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          background: var(--sg-bg);
        }

        .sg-form-wrap {
          width: 100%;
          max-width: 340px;
        }

        .sg-form-header {
          margin-bottom: 2rem;
        }

        .sg-form-header h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--sg-heading);
          letter-spacing: -0.02em;
        }

        .sg-form-header p {
          font-size: 13px;
          color: var(--sg-muted);
          margin-top: 4px;
        }

        .sg-field {
          margin-bottom: 1.125rem;
        }

        .sg-field label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: var(--sg-subtext);
          margin-bottom: 6px;
          letter-spacing: 0.02em;
        }

        .sg-input-wrap {
          position: relative;
        }

        .sg-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--sg-muted);
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .sg-input {
          width: 100%;
          height: 42px;
          border: 1px solid var(--sg-border);
          border-radius: 10px;
          background: var(--sg-input-bg);
          color: var(--sg-input-text);
          font-size: 13.5px;
          font-family: 'DM Sans', sans-serif;
          padding: 0 12px 0 38px;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }

        .sg-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
        }

        .sg-input::placeholder {
          color: var(--sg-input-ph);
        }

        .sg-input.sg-has-right {
          padding-right: 40px;
        }

        .sg-eye-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--sg-muted);
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 4px;
          transition: color 0.15s;
        }

        .sg-eye-btn:hover {
          color: var(--sg-subtext);
        }

        .sg-error-msg {
          font-size: 11px;
          color: #ef4444;
          margin-top: 4px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .sg-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: 6px;
        }

        .sg-forgot {
          font-size: 12px;
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .sg-submit {
          width: 100%;
          height: 44px;
          background: var(--sg-btn-bg);
          border: none;
          border-radius: 10px;
          color: var(--sg-btn-text);
          font-size: 14px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: opacity 0.15s, transform 0.1s;
          letter-spacing: 0.01em;
        }

        .sg-submit:hover {
          opacity: 0.88;
        }

        .sg-submit:active {
          transform: scale(0.99);
        }

        .sg-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .sg-spin {
          animation: sg-spin 0.9s linear infinite;
        }

        @keyframes sg-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .sg-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 1.5rem 0;
        }

        .sg-divider-line {
          flex: 1;
          height: 1px;
          background: var(--sg-divider);
        }

        .sg-divider span {
          font-size: 11px;
          color: var(--sg-muted);
          white-space: nowrap;
          letter-spacing: 0.04em;
        }

        .sg-social-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .sg-social-btn {
          height: 40px;
          border: 1px solid var(--sg-border);
          border-radius: 10px;
          background: var(--sg-social-bg);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 13px;
          color: var(--sg-social-text);
          font-family: 'DM Sans', sans-serif;
          transition: background 0.15s, border-color 0.15s;
        }

        .sg-social-btn:hover {
          background: var(--sg-social-hover);
          border-color: var(--sg-border-hover);
        }

        .sg-signup-line {
          text-align: center;
          font-size: 12.5px;
          color: var(--sg-muted);
          margin-top: 1.5rem;
        }

        .sg-signup-line a {
          color: #3b82f6;
          text-decoration: none;
        }

        .sg-signup-line a:hover {
          text-decoration: underline;
        }

        .sg-alert {
          background: var(--sg-alert-bg);
          border: 1px solid var(--sg-alert-border);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 12.5px;
          color: var(--sg-alert-text);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        @media (max-width: 768px) {
          .sg-root {
            grid-template-columns: 1fr;
          }

          .sg-left {
            display: none;
          }

          .sg-right {
            min-height: 100vh;
            padding: 2rem 1.25rem;
          }
        }
      `}</style>

      <div className="sg-root">
        <div className="sg-left">
          <div className="sg-left-bg" />

          <div className="sg-dots">
            {DOTS.map((d, i) => (
              <div
                key={i}
                className="sg-dot"
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
            className="sg-car-svg"
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

          <div className="sg-brand">
            <div className="sg-logo-chip">
              <div className="sg-logo-dot" />
              <span className="sg-logo-label">Smart Garage</span>
            </div>

            <h1 className="sg-headline">
              SMART
              <br />
              <span>GARAGE</span>
            </h1>

            <p className="sg-sub">
              Manage reservations, track parking availability and enjoy a
              smarter parking experience.
            </p>

            <div className="sg-stats">
              <Stat value="24/7" label="Access" />
              <StatDivider />
              <Stat value="4+" label="Slots" />
              <StatDivider />
              <Stat value="15 Min" label="Reservation" />
            </div>
          </div>
        </div>

        <div className="sg-right">
          <div className="sg-form-wrap">
            <div className="sg-form-header">
              <h2>Welcome back</h2>
              <p>Sign in to access your parking reservations and account.</p>
            </div>

            {showError && (
              <div className="sg-alert">
                <FiShield size={14} />
                Invalid email or password. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="sg-field">
                <label htmlFor="sg-email">Email address</label>
                <div className="sg-input-wrap">
                  <span className="sg-input-icon">
                    <FiMail size={14} />
                  </span>
                  <input
                    id="sg-email"
                    className="sg-input"
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
                  <p className="sg-error-msg">
                    <FiShield size={10} />
                    {String(errors.email.message)}
                  </p>
                )}
              </div>

              <div className="sg-field">
                <label htmlFor="sg-password">Password</label>
                <div className="sg-input-wrap">
                  <span className="sg-input-icon">
                    <FiLock size={14} />
                  </span>
                  <input
                    id="sg-password"
                    className="sg-input sg-has-right"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
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
                    className="sg-eye-btn"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <FiEyeOff size={15} />
                    ) : (
                      <FiEye size={15} />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="sg-error-msg">
                    <FiShield size={10} />
                    {String(errors.password.message)}
                  </p>
                )}

                <div className="sg-forgot-row">
                  <button
                    type="button"
                    className="sg-forgot"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Sending..." : "Forgot password?"}
                  </button>
                </div>
              </div>

              <button type="submit" className="sg-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <FiLoader className="sg-spin" size={15} />
                    Logging in...
                  </>
                ) : (
                  <>
                    <FiLock size={14} />
                    Login
                  </>
                )}
              </button>
            </form>

            <div className="sg-divider">
              <div className="sg-divider-line" />
              <span>or continue with</span>
              <div className="sg-divider-line" />
            </div>

            <div className="sg-social-grid">
              <button type="button" className="sg-social-btn">
                <FaApple size={15} /> Apple
              </button>

              <button type="button" className="sg-social-btn">
                <FaGoogle size={14} style={{ color: "#EA4335" }} /> Google
              </button>
            </div>

            <p className="sg-signup-line">
              Don&apos;t have an account? <Link href="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}