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

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TRegisterAndLogInIputsProps>();

  async function onSubmit(data: TRegisterAndLogInIputsProps) {
    try {
      setIsLoading(true);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.fullName,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Register failed");
        return;
      }

      toast.success("Account created successfully");
      reset();
      router.push("/login");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] w-full overflow-hidden bg-white text-slate-900 dark:bg-[#0b1020] dark:text-white">
      <Card className="h-full rounded-none border-0 bg-transparent shadow-none">
        <CardContent className="grid h-full min-h-[calc(100vh-64px)] w-full p-0 lg:grid-cols-2">
          <div className="relative hidden items-center justify-center overflow-hidden lg:flex">
            <Image
              src="/images/car-2.jpg"
              alt="Garage"
              fill
              sizes="50vw"
              className="object-cover scale-105"
              priority
            />

            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

            <div className="relative z-10 max-w-lg rounded-[32px] border border-white/10 bg-white/10 p-10 text-white shadow-2xl backdrop-blur-xl">
              <h1 className="text-5xl font-extrabold leading-tight">
                JOIN <span className="text-blue-400">SMART GARAGE</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-200">
                Create your account and enjoy secure smart parking, real-time
                monitoring, and fast parking requests.
              </p>

              <div className="mt-8 space-y-4 text-lg text-slate-300">
                <p>✔ Smart parking experience</p>
                <p>✔ Secure authentication</p>
                <p>✔ Real-time garage tracking</p>
                <p>✔ Fast provider requests</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-slate-50 px-6 py-10 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-2xl dark:border-white/10 dark:bg-white/10 dark:backdrop-blur-xl"
            >
              <div className="mb-8 flex flex-col items-center text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  Create Account
                </h1>

                <p className="mt-3 text-slate-500 dark:text-slate-300">
                  Enter your information to continue
                </p>
              </div>

              <div className="space-y-5">
                <TextInputs
                  label="Full Name"
                  name="fullName"
                  register={register}
                  errors={errors}
                  type="text"
                  placeholder="EG. Awad Mohamed"
                />

                <TextInputs
                  label="Phone"
                  name="phone"
                  register={register}
                  errors={errors}
                  type="text"
                  placeholder="+20 010 99 50 88 49"
                />

                <TextInputs
                  label="Email Address"
                  name="email"
                  register={register}
                  errors={errors}
                  type="email"
                  placeholder="awad@gmail.com"
                />

                <TextInputs
                  label="Password"
                  name="password"
                  register={register}
                  errors={errors}
                  type="password"
                  placeholder="********"
                />

                <SubmitButton
                  title="Create Account"
                  isLoading={isLoading}
                  titleLoading="Creating please wait..."
                  className="h-12 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                />
              </div>

              <div className="relative my-7 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:flex after:items-center after:border-t after:border-slate-200 dark:after:border-white/10">
                <span className="relative z-10 bg-white px-4 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <FaApple className="h-5 w-5 shrink-0" />
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="h-12 rounded-xl border-slate-200 bg-white text-slate-900 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                >
                  <FaGoogle className="h-5 w-5 shrink-0" />
                </Button>
              </div>

              <div className="mt-7 text-center text-sm text-slate-600 dark:text-slate-300">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 underline underline-offset-4 dark:text-blue-400"
                >
                  Log In
                </Link>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}