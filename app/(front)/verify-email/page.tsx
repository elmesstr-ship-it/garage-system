"use client";

import { useState } from "react";
import { MailCheck, Loader2, RefreshCw } from "lucide-react";
import {
  sendEmailVerification,
  reload,
  signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  async function resendVerification() {
    if (!auth.currentUser) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent");
    } catch (error) {
      console.error("RESEND VERIFY ERROR:", error);
      toast.error("Failed to send verification email");
    } finally {
      setLoading(false);
    }
  }

  async function checkVerification() {
    if (!auth.currentUser) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

    try {
      setChecking(true);

      await reload(auth.currentUser);

      if (auth.currentUser.emailVerified) {
        toast.success("Email verified successfully");
        router.push("/profile");
        return;
      }

      toast.error("Email is not verified yet");
    } catch (error) {
      console.error("CHECK VERIFY ERROR:", error);
      toast.error("Failed to check verification");
    } finally {
      setChecking(false);
    }
  }

  async function backToLogin() {
    await signOut(auth);
    router.push("/login");
  }

  return (
    <main
      className="min-h-screen px-4 py-16 text-white flex items-center justify-center"
      style={{ background: "#060d1f" }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <section
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 p-7 text-center backdrop-blur-md"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">
          <MailCheck size={30} className="text-blue-400" />
        </div>

        <h1 className="text-3xl font-black">Verify your email</h1>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          We sent a verification link to your email. Open your inbox, click the
          link, then come back and check your verification status.
        </p>

        <div className="mt-7 space-y-3">
          <button
            onClick={checkVerification}
            disabled={checking}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 font-semibold transition hover:bg-blue-700 disabled:opacity-60"
          >
            {checking ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw size={17} />
                I Verified My Email
              </>
            )}
          </button>

          <button
            onClick={resendVerification}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </button>

          <button
            onClick={backToLogin}
            className="text-sm text-slate-400 hover:text-white"
          >
            Back to login
          </button>
        </div>
      </section>
    </main>
  );
}