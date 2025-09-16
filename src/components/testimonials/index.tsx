'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { RxArrowRight, RxArrowLeft } from 'react-icons/rx';
import { Testimonial, testimonials } from '@/constants/DummyTestimonialsData';


const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function TestimonialSection() {
  const t = useTranslations();
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const [index, setIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  const paginate = (dir: number) => {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= testimonials.length) return;
    setDirection(dir);
    setIndex(newIndex);
  };

  const current: Testimonial = testimonials[index];

  const LeftArrow = isRTL ? RxArrowRight : RxArrowLeft;
  const RightArrow = isRTL ? RxArrowLeft : RxArrowRight;

  const isFirst = index === 0;
  const isLast = index === testimonials.length - 1;

  return (
    <section
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#532F1F] text-white py-16 px-0 font-sans relative w-full overflow-x-hidden min-h-[1080px] lg:min-h-[600px]"
    >
      <div className="max-w-7xl mx-auto relative w-[90vw]">
        {/* Title + Description */}
        <h2
          className={`text-5xl mb-6 font-semibold ${
            isRTL ? 'text-center md:text-right' : 'text-center md:text-left'
          } sm:text-center`}
        >
          {t('testimonials.title')}
        </h2>
        <p
          className={`text-gray-300 font-100 mb-12 text-xl ${
            isRTL ? 'text-center md:text-right' : 'text-center md:text-left'
          } sm:text-center`}
        >
          {t('testimonials.description')}
        </p>

        {/* Testimonials Slider */}
        <div className="mb-20 relative">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left"
            >
              {/* Image */}
              <div className="flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={current.image}
                  alt={t(current.nameKey)}
                  width={360}
                  height={360}
                  style={{ objectFit: 'contain', objectPosition: 'center' }}
                  priority
                />
              </div>

              {/* Quote + Name + Title */}
              <div
                className={`flex-grow max-w-4xl flex flex-col justify-between ${
                  isRTL ? 'md:text-right' : 'md:text-left'
                } sm:text-center`}
              >
                <p className="text-gray-300 leading-relaxed text-lg mb-6">
                  “{t(current.quoteKey)}”
                </p>
                <h4 className="font-bold text-xl">{t(current.nameKey)}</h4>
                <span className="text-gray-400 text-base">{t(current.titleKey)}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Desktop Arrows */}
          <div className={`absolute top-[400px] ${!isRTL ? 'right-0' : 'left-0'} transform -translate-y-1/2 hidden lg:flex flex-row gap-4 z-20`}>
            <button
              onClick={() => paginate(-1)}
              disabled={isFirst}
              className={`${isFirst ? 'bg-white/10 cursor-not-allowed text-white' : 'bg-white hover:bg-black hover:text-white text-black'} p-3 rounded-full transition flex items-center justify-center w-12 h-12 shadow-lg`}
            >
              <LeftArrow size={20} />
            </button>

            <button
              onClick={() => paginate(1)}
              disabled={isLast}
              className={`${isLast ? 'bg-white/10 cursor-not-allowed text-white' : 'bg-white hover:bg-black hover:text-white text-black'} p-3 rounded-full transition flex items-center justify-center w-12 h-12 shadow-lg`}
            >
              <RightArrow size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Arrows */}
        <div className="flex lg:hidden justify-center gap-6 mt-8 bottom-10 w-full">
          <button
            onClick={() => paginate(-1)}
            disabled={isFirst}
            className={`${isFirst ? 'bg-white/10 cursor-not-allowed text-white' : 'bg-white hover:bg-black hover:text-white text-black'} p-3 rounded-full transition flex items-center justify-center w-12 h-12 shadow-lg`}
          >
            <LeftArrow size={20} />
          </button>

          <button
            onClick={() => paginate(1)}
            disabled={isLast}
            className={`${isLast ? 'bg-white/10 cursor-not-allowed text-white' : 'bg-white hover:bg-black hover:text-white text-black'} p-3 rounded-full transition flex items-center justify-center w-12 h-12 shadow-lg`}
          >
            <RightArrow size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
