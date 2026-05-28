"use client";

import React from "react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "next/navigation";
import { FaHeart, FaLocationDot } from "react-icons/fa6";
import { FaCarSide, FaBusinessTime, FaArrowRight } from "react-icons/fa";
import { MdOutlinePhoneIphone } from "react-icons/md";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const aboutData = [
  {
    icone: FaCarSide,
    title: "Gate",
    disc: "Welcome to Smart Garage. Find available parking spaces faster and easier.",
    subMain: "Get Started",
    subDisc: "Park quickly and drive stress-free!",
  },
  {
    icone: FaLocationDot,
    title: "Find A Spot",
    disc: "Locate the nearest empty parking spot in seconds without wasting time.",
    subMain: "Continue",
    subDisc: "Save time and enjoy convenience!",
  },
  {
    icone: FaBusinessTime,
    title: "Book In Advance",
    disc: "Reserve your parking spot before arrival and avoid last-minute searching.",
    subMain: "Continue",
    subDisc: "Your space is ready when you arrive!",
  },
  {
    icone: MdOutlinePhoneIphone,
    title: "Smart Control",
    disc: "Open the garage, check availability, and manage parking from one app.",
    subMain: "Parking Request",
    subDisc: "Everything is one tap away!",
  },
];

export default function SliderCard() {
  const router = useRouter();
  const [api, setApi] = React.useState<CarouselApi>();

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const handleNextSlide = () => {
    if (!api) return;

    if (api.canScrollNext()) {
      api.scrollNext();
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Carousel
      setApi={setApi}
      plugins={[plugin.current]}
      className="w-full max-w-7xl"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {aboutData.map((item, idx) => {
          const Icon = item.icone;

          return (
            <CarouselItem key={idx}>
              <div className="px-10 py-6">
                <Card
                  className="overflow-hidden border-0 shadow-2xl rounded-3xl bg-white bg-center bg-cover"
                  style={{
                    backgroundImage: "url('/images/wave.svg')",
                  }}
                >
                  <CardContent className="min-h-[650px] p-12 flex flex-col justify-center items-center text-center gap-7">
                    <div className="bg-blue-100 text-blue-700 p-6 rounded-full shadow-md">
                      <Icon className="text-7xl" />
                    </div>

                    <h1 className="text-6xl font-extrabold text-slate-900">
                      {item.title}
                    </h1>

                    <p className="text-2xl text-slate-700 max-w-4xl leading-10">
                      {item.disc}
                    </p>

                    <button
                      type="button"
                      onClick={handleNextSlide}
                      className="group flex flex-col items-center justify-center gap-3 mt-4 cursor-pointer"
                    >
                      <span className="bg-blue-500 text-white p-5 rounded-full shadow-lg transition duration-300 group-hover:bg-blue-600 group-hover:translate-x-2">
                        <FaArrowRight className="text-2xl" />
                      </span>

                      <span className="text-4xl font-bold text-slate-900 transition duration-300 group-hover:text-blue-600">
                        {item.subMain}
                      </span>
                    </button>

                    <div className="flex gap-2 items-center justify-center text-2xl text-slate-700 mt-4">
                      <p>{item.subDisc}</p>
                      <FaHeart className="text-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}