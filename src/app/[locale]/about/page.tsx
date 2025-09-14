'use client';

import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { FaLightbulb, FaHandshake, FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function About() {
  const t = useTranslations('aboutPage');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  // Milestones defined statically for better localization support
  const milestones = [
    { yearKey: 'milestone1.year', descKey: 'milestone1.description' },
    { yearKey: 'milestone2.year', descKey: 'milestone2.description' },
    { yearKey: 'milestone3.year', descKey: 'milestone3.description' },
  ];

  // Values for the Values section
  const values = [
    { icon: FaLightbulb, titleKey: 'valuesInnovation', descKey: 'valuesInnovationDesc' },
    { icon: FaHandshake, titleKey: 'valuesIntegrity', descKey: 'valuesIntegrityDesc' },
    { icon: FaRocket, titleKey: 'valuesGrowth', descKey: 'valuesGrowthDesc' },
  ];

  // Wait until locale is ready (optional if your locale is dynamic)
  if (!locale) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Hero Section */}
      <div className="relative w-full h-[30vh] sm:h-64 md:h-[35vh] overflow-hidden">
        <Image
          src="/cover.png"
          alt={t('about')}
          fill
          className="object-cover scale-110 transition-transform duration-500 hover:scale-100"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 animate-gradient-x"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {t('about')}
          </motion.h1>
          <motion.p
            className="mt-2 text-white/80 text-sm sm:text-base md:text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {t('heroSubtitle')}
          </motion.p>
        </div>
      </div>

      {/* Mission Section */}
      <motion.div
        className="max-w-3xl mx-auto bg-white/70 backdrop-blur-lg rounded-3xl p-10 mt-16 shadow-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-[#4A2E2B] mb-4">{t('missionTitle')}</h2>
        <p className="text-gray-700">{t('missionDescription')}</p>
      </motion.div>

      {/* Our Journey Section */}
      <div className="mt-20 max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-[#4A2E2B]">{t('storyTitle')}</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {milestones.map((milestone, idx) => (
            <motion.div
              key={milestone.yearKey}
              className="bg-[#4A2E2B] text-white p-6 rounded-2xl shadow-lg flex flex-col items-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
            >
              <h3 className="text-xl font-bold mb-2">{t(milestone.yearKey)}</h3>
              <p className="text-gray-100">{t(milestone.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      <div className="mt-20 max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-8 text-center">
        {values.map((value, idx) => (
          <motion.div
            key={idx}
            className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
          >
            <value.icon className="text-5xl text-[#4A2E2B] mb-4 animate-bounce-slow" />
            <h3 className="font-bold text-xl mb-2">{t(value.titleKey)}</h3>
            <p className="text-gray-600">{t(value.descKey)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
