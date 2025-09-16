'use client';

import React, { useState, useEffect, useRef } from "react";
import Slider, { CustomArrowProps } from "react-slick";
import Image from "next/image";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { useTranslations, useLocale } from "next-intl";
import { TeamMember, teamMembers } from "@/constants/DummyTeamData";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const PrevArrow = ({ onClick }: CustomArrowProps) => (
  <div
    className="absolute left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
    onClick={onClick}
  >
    <MdKeyboardArrowLeft className="text-black w-10 h-10" />
  </div>
);

const NextArrow = ({ onClick }: CustomArrowProps) => (
  <div
    className="absolute right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
    onClick={onClick}
  >
    <MdKeyboardArrowRight className="text-black w-10 h-10" />
  </div>
);

// ✅ window size hook stays here
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

export default function OurTeamSection() {
  const t = useTranslations("team");
  const locale = useLocale();
  const size = useWindowSize();
  const sliderRef = useRef<Slider>(null);

  const isReady = size.width > 0;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: size.width >= 1024 ? 3 : size.width >= 640 ? 2 : 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    rtl: locale === "ar",
  };

  return (
    <section className="py-16 bg-[#F3F3F3] relative">
      <div className="max-w-7xl mx-auto text-center px-4 relative">
        <h2 className="text-3xl font-bold mb-4 text-[#4A2E2B]">{t("title")}</h2>
        <p className="text-gray-600 mb-12">{t("description")}</p>

        <div className="relative">
          {isReady && (
            <Slider ref={sliderRef} {...settings}>
              {teamMembers.map((member: TeamMember, index: number) => (
                <div key={index} className="px-3">
                  <div className="rounded-lg overflow-hidden p-4 flex flex-col items-center transition-transform hover:scale-105">
                    <div className="relative w-full h-56 sm:h-52 md:h-48 lg:h-56 xl:h-64 mb-4">
                      <Image
                        src={member.image}
                        alt={t(member.nameKey)}
                        fill
                        style={{ objectFit: "contain" }}
                        className="rounded-md"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-[#4A2E2B]">{t(member.nameKey)}</h3>
                    <p className="text-gray-400 text-sm mb-3">{t(member.positionKey)}</p>

                    {/* Contact Icons */}
                    <div className="flex space-x-4 text-gray-500">
                      <Image
                        src="/whats.png"
                        alt="WhatsApp"
                        width={22}
                        height={22}
                        className="cursor-pointer object-contain m-4"
                      />
                      <Image
                        src="/phone.png"
                        alt="Call"
                        width={25}
                        height={25}
                        className="cursor-pointer object-contain m-4"
                      />
                      <Image
                        src="/mail.png"
                        alt="Email"
                        width={22}
                        height={22}
                        className="cursor-pointer object-contain m-4"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
}
