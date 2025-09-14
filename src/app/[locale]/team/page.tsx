'use client';

import OurTeamSection from '@/components/ourTeam';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { FaLightbulb, FaHandshake, FaUsers } from 'react-icons/fa';

export default function Team() {
  const t = useTranslations('teamPage');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-gray-50 py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="relative w-full h-[25vh] sm:h-64 md:h-[35vh]">
        <Image
          src="/cover.png"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white animate-fadeIn">
            {t('team')}
          </h1>
          <p className="mt-2 text-white/80 text-sm sm:text-base md:text-lg">
            {t('heroSubtitle')}
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="mt-16 max-w-4xl mx-auto px-6 mb-16">
        <div className="bg-white shadow-lg rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-semibold text-[#4A2E2B] mb-4">{t('missionTitle')}</h2>
          <p className="text-gray-700">{t('missionDescription')}</p>
        </div>
      </div>

      {/* Team Section */}
      <OurTeamSection gridCols={3} cardStyle="shadow-md rounded-xl p-6" />

      {/* Values Section */}
      <div className="mt-16 max-w-5xl mx-auto px-6 grid sm:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <FaLightbulb className="text-4xl text-[#4A2E2B] mb-4" />
          <h3 className="font-bold text-xl mb-2">{t('valuesInnovation')}</h3>
          <p className="text-gray-600">{t('valuesInnovationDesc')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <FaHandshake className="text-4xl text-[#4A2E2B] mb-4" />
          <h3 className="font-bold text-xl mb-2">{t('valuesIntegrity')}</h3>
          <p className="text-gray-600">{t('valuesIntegrityDesc')}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <FaUsers className="text-4xl text-[#4A2E2B] mb-4" />
          <h3 className="font-bold text-xl mb-2">{t('valuesCollaboration')}</h3>
          <p className="text-gray-600">{t('valuesCollaborationDesc')}</p>
        </div>
      </div>
    </div>
  );
}
