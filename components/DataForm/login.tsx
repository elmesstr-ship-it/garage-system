"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SubmitButton from "../FormInputs/SubmitButton";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type TRegisterAndLogInIputsProps } from "@/types/dataService";
import TextInputs from "../FormInputs/TextInputs";
import Link from "next/link";
import Image from "next/image";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginFormWithBg() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterAndLogInIputsProps>();

  async function onSubmit(data: TRegisterAndLogInIputsProps) {
    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Login failed");
        return;
      }

      toast.success("Login successful");

      localStorage.setItem(
        "smart-user",
        JSON.stringify(result.user)
      );

      if (result.user.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard"); // أو /home أو /parking
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-[#0b1020] dark:text-white">
      <Card className="w-full overflow-hidden rounded-none border-0 bg-transparent shadow-none">
        <CardContent className="grid min-h-screen p-0 lg:grid-cols-2">
          <div className="relative hidden overflow-hidden lg:block">
            <Image
              src="/images/car-1.avif"
              alt="Garage"
              fill
              sizes="50vw"
              className="object-cover"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            <div className="absolute left-10 top-10 max-w-sm rounded-3xl border border-white/10 bg-black/40 p-8 text-white shadow-2xl backdrop-blur-md">
              <h1 className="text-5xl font-extrabold leading-tight">
                SMART <span className="text-blue-400">GARAGE</span>
              </h1>

              <p className="mt-5 text-sm leading-7 text-slate-200">
                Smart parking management with secure access and real-time
                monitoring.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center bg-slate-50 p-8 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 md:p-14">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl dark:border-white/10 dark:bg-white/10 dark:backdrop-blur-xl"
            >
              <div className="flex flex-col gap-6">
                <div className="text-center">
                  <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                    Welcome Back
                  </h1>

                  <p className="mt-3 text-slate-500 dark:text-slate-300">
                    Login to continue using Smart Garage
                  </p>
                </div>

                <TextInputs
                  label="Email address"
                  name="email"
                  register={register}
                  errors={errors}
                  type="email"
                  placeholder="example@gmail.com"
                />

                <TextInputs
                  label="Password"
                  name="password"
                  register={register}
                  errors={errors}
                  type="password"
                  placeholder="••••••••"
                  page="login"
                />

                <SubmitButton
                  title="Log In"
                  isLoading={isLoading}
                  titleLoading="Logging in..."
                  className="h-12 rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700"
                />

                <div className="relative text-center text-sm">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-white/10"></span>
                  </div>

                  <span className="relative bg-white px-3 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <FaApple className="h-5 w-5" />
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                  >
                    <FaGoogle className="h-5 w-5" />
                  </Button>
                </div>

                <div className="text-center text-sm text-slate-600 dark:text-slate-300">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}