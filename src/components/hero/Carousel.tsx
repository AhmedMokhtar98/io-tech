'use client';

import React, { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { useLocale, useTranslations } from "next-intl";

type Slide = {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  background: string;
};

export default function FullScreenCarousel() {
  const sliderRef = useRef<Slider>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const locale = useLocale();
  const t = useTranslations("carousel");

  // Convert your object (slide1, slide2) into an array with images/backgrounds
  const slides: Slide[] = [
    {
      title: t("slide1.title"),
      description: t("slide1.description"),
      buttonText: t("slide1.buttonText"),
      image: "/me.jpg", // You can customize per slide if needed
      background: "/cover.png",
    },
    {
      title: t("slide2.title"),
      description: t("slide2.description"),
      buttonText: t("slide2.buttonText"),
      image: "/me.jpg",
      background: "https://picsum.photos/1920/1080?random=4",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    beforeChange: (_: number, next: number) => setCurrentSlide(next),
    appendDots: (dots: React.ReactNode) => (
      <div className="flex flex-col items-center mt-4">{dots}</div>
    ),
    customPaging: (index: number) => (
      <div
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor:
            index === currentSlide ? "#fff" : "rgba(255,255,255,0.5)",
          cursor: "pointer",
          margin: "6px 0",
          transition: "all 0.3s ease",
        }}
      />
    ),
  };

  return (
    <div className="relative w-full h-screen mt-0">
      <Slider ref={sliderRef} {...settings} className="h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="relative w-full h-screen flex flex-col lg:flex-row items-center justify-center"
          >
            {/* Background Image */}
            <img
              src={slide.background}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div
              className="absolute inset-0 z-0"
              style={{
                background:
                  "linear-gradient(271.47deg, rgba(75, 38, 21, 0.28) 1.2%, rgba(75, 38, 21, 0.68) 86.38%)",
              }}
            />

            {/* Content Block */}
            <div className="relative z-10 flex flex-col items-center transform translate-y-1/2 lg:translate-y-0 justify-center w-full px-4 py-8 lg:flex-row lg:justify-start lg:h-screen">
              {/* Image */}
              <div
                className={`mb-6 lg:mb-0 lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2
                  ${locale === "ar" ? "lg:left-40" : "lg:right-40"}
                  w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px]`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="object-cover rounded-lg shadow-lg w-full h-full"
                />
              </div>

              {/* Text */}
              <div
                className={`text-white max-w-lg text-center lg:text-left
                  flex flex-col items-center justify-center h-full
                  lg:absolute lg:top-1/2 lg:transform lg:-translate-y-1/2
                  ${locale === "ar" ? "lg:right-40 text-right" : "lg:left-40 text-left"}`}
              >
                <h2 className="text-3xl font-bold mb-4 sm:text-6xl">{slide.title}</h2>
                <p className="mb-4 sm:text-sm">{slide.description}</p>
                <button className="bg-white text-[#4A2E2B] px-6 py-3 mt-8 rounded-lg hover:bg-gray-200 sm:px-4 sm:py-2">
                  {slide.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Prev Arrow + Vertical Dots */}
      <div
        className={`absolute ${
          locale === "ar" ? "-right-5 md:right-5" : "-left-5 md:left-5"
        } top-1/2 transform -translate-y-1/2 flex flex-col items-center z-20 px-8`}
      >
        <div
          onClick={() => sliderRef.current?.slickPrev()}
          className="w-10 h-10 mb-4 flex items-center justify-center bg-white/10 rounded-full shadow-lg cursor-pointer text-white z-30"
        >
          <MdOutlineArrowBackIosNew
            className={`w-6 h-6 ${locale === "ar" ? "rotate-180" : ""}`}
          />
        </div>
        <div className="flex flex-col">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => sliderRef.current?.slickGoTo(index)}
              className={`w-3 h-3 rounded-full mb-3 cursor-pointer ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
