import Carousel from '@/components/hero/Carousel';
import OurTeamSection from '@/components/ourTeam';
import TestimonialSection from '@/components/testimonials';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

export default function Home({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return (
    <div
      className='grid grid-cols-1 '
      style={{ overflowY: 'hidden' }}
    >
      <Carousel />
      <OurTeamSection />
      <TestimonialSection />
    </div>
  );
}