'use client';

import { LEGAL_SERVICES_SECTIONS, LegalServiceSection } from '@/constants/legalServicesData';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { MdOutlineArrowBackIos } from "react-icons/md";
import { RiCheckboxBlankFill } from "react-icons/ri";

export default function Service() {
  const t = useTranslations('services');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const section: LegalServiceSection | undefined = LEGAL_SERVICES_SECTIONS.find(
    (s) => s.id === id
  );

  if (!section) {
    return (
      <section
        className={`max-w-6xl mx-auto p-8 font-sans text-[#4A2E2B] text-center`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <h2 className="text-xl font-semibold">
          {t('sectionNotFound')}
        </h2>
      </section>
    );
  }

  return (
    <div>


        {/* Gradient Overlay */}
      {/* Hero Section */}
      <div className="relative w-full h-screen max-h-[600px] mb-12">
        {/* Background Image */}
      <Image
        src="/cover.png"
        alt="Hero Background"
        fill
        className="object-cover"
      />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'linear-gradient(271.47deg, rgba(75, 38, 21, 0.28) 1.2%, rgba(75, 38, 21, 0.68) 86.38%)',
          }}
        />

        {/* Hero Text */}
     <div
  className={`absolute top-1/2 transform -translate-y-1/2 max-w-lg z-10
    left-1/2 -translate-x-1/2 md:translate-x-0 
    ${isRTL ? 'md:right-40 md:left-auto' : 'md:left-40 md:right-auto'}
    w-[90%] md:w-auto
  `}
  dir={isRTL ? 'rtl' : 'ltr'}
>
  <h2
    className={`text-white width-full text-4xl md:text-6xl font-bold mb-4
      text-center md:${isRTL ? 'text-right' : 'text-left'}
    `}
  >
    {t(section.titleKey)}
  </h2>
</div>

      </div>

      {/* Main Content */}
      <section
        className="max-w-6xl mx-auto p-8 font-sans text-[#4A2E2B]"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
         <div className="fixed inset-0 -z-10 w-full h-full">
      <Image
        src="/animation.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
    </div>
        {/* Back button */}
 <button
      className={`mb-6 flex items-center gap-2 text-lg text-[#4A2E2B] hover:underline`}
      onClick={() => router.push(`/${locale}`)}
      aria-label={t("back")}
    >
      <MdOutlineArrowBackIos
        className={`inline-block transition-transform duration-200 ${
          isRTL ? "rotate-180" : "rotate-0"
        }`}
      />
      {t("back")}
    </button>

        {/* Section Title */}
        <h1
          className="text-3xl font-semibold mb-6"
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {t(section.titleKey)}
        </h1>

        {/* Section Content */}
        {section.sections?.map((sec, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-start gap-4 max-w-4xl mb-6`}
            style={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            {/* Header */}
            <h2 className="text-xl font-semibold mb-2">{t(sec.header)}</h2>

            {/* Paragraphs */}
            <div className="text-lg space-y-2">
              {sec.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="flex items-center gap-2"> <RiCheckboxBlankFill className="text-[#4A2E2B]" /> {/* optional color */} {t(p)} </p>
              ))}

              {/* Optional list */}
              {sec.list && (
                <ul className={`list-none space-y-2 mt-2 pl-4 mx-4 ${isRTL ? 'border-r-2 border-[lightgray]' : 'border-l-2 border-[lightgray]'}`}>
                    {sec.list.map((item, liIdx) => (
                    <li key={liIdx} className="flex items-center gap-2 p-2">
                        <span>-</span>
                        {t(item)}
                    </li>
                    ))}
                </ul>
                )}
            </div>
          </div>
        ))}

        {/* Footer note */}
        <p className="text-lg max-w-4xl leading-relaxed mt-8">{t('footer')}</p>
      </section>
    </div>
  );
}
