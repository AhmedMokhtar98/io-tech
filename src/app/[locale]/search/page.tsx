'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Formik, Form, ErrorMessage } from 'formik';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PaginationControls } from '@/components/ui/pagination';

import {
  scrollToElement,
  handleSearchAction,
  handlePageChangeAction,
  cancelRaf,
  syncQueryState,
  getQueryAndMode,
  filterResults,
  paginateResults,
} from '@/lib/utils';
import { searchSchema } from '@/lib/validations';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('services');
  const currentLocale = useLocale();

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [rawQuery, setRawQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(0);

  /* Sync state with URL on load & param change */
  useEffect(() => {
    const { rawQuery: query, currentPage } = syncQueryState(searchParams);
    setRawQuery(query);
    setCurrentPage(currentPage);
  }, [searchParams]);

  /* Get query and language mode */
  const { query, arabicMode } = getQueryAndMode(rawQuery);

  /* Filter & paginate results */
  const filteredResults = useMemo(() => filterResults(query, arabicMode, t), [query, arabicMode, t]);
  const { totalPages, paginatedResults } = useMemo(
    () => paginateResults(filteredResults, currentPage),
    [filteredResults, currentPage]
  );

  /* Scroll to results after loading */
  useEffect(() => {
    if (!loading && scrollTrigger > 0 && resultsRef.current) {
      scrollToElement(resultsRef.current, () => cancelRaf(rafRef), rafRef);
    }
  }, [scrollTrigger, loading, currentPage, paginatedResults.length]);

  return (
    <div className="relative min-h-screen font-sans text-[#4A2E2B] mt-16 pb-12">
      {/* Hero Section */}
      <div className="relative w-full h-[20vh] sm:h-64 md:h-96">
        <Image src="/cover.png" alt="Hero Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(75,38,21,0.5)] to-[rgba(75,38,21,0.85)]" />
        <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 z-10 text-center">
          <h1 className="text-lg sm:text-2xl md:text-4xl font-semibold text-white">
            {rawQuery.length > 0
              ? t('searchResults', { defaultMessage: 'Search Results' }) + ': '
              : t('searchServices')}
            <span className="font-normal">{rawQuery}</span>
          </h1>
        </div>
      </div>

      {/* Search Field */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <Formik
          initialValues={{ search: rawQuery }}
          validationSchema={searchSchema(t)}
          onSubmit={(values) =>
            handleSearchAction(
              values.search.trim(),
              currentLocale,
              router,
              pathname,
              setRawQuery,
              setCurrentPage,
              setLoading,
              setScrollTrigger
            )
          }
          enableReinitialize
        >
          {({ values, setFieldValue, errors, touched }) => (
            <Form className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:flex-1">
                <input
                  name="search"
                  type="text"
                  value={values.search}
                  placeholder={t('searchPlaceholder', { defaultMessage: 'Search for services...' })}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a2e2b] ${
                    errors.search && touched.search ? 'border-red-500' : 'border-gray-300'
                  }`}
                  dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
                  onChange={(e) =>
                    setFieldValue('search', e.target.value.replace(/[^\p{L}\p{N}\s]/gu, ''))
                  }
                />
                <ErrorMessage name="search" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <Button type="submit">{t('searchButton', { defaultMessage: 'Search' })}</Button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Results */}
      <div
        ref={resultsRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8 mt-4 sm:mt-6 min-h-[500px] flex flex-col justify-between"
      >
        {loading ? (
          <div className="space-y-4 flex-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-md" />
            ))}
          </div>
        ) : query === '' ? (
          <p className="text-gray-500 text-center sm:text-left flex-1 flex items-center justify-center">
            {t('enterQuery', { defaultMessage: 'Please enter a search query.' })}
          </p>
        ) : paginatedResults.length === 0 ? (
          <p className="text-gray-500 text-center sm:text-left flex-1 flex items-center justify-center">
            {t('noResults', { defaultMessage: 'No results found.' })}
          </p>
        ) : (
          <div className="flex flex-col flex-1">
            <ul className="space-y-4 flex-1">
              {paginatedResults.map((section) => (
                <li
                  key={section.id}
                  className={`p-3 sm:p-4 rounded-md transition border-1 ${
                    currentLocale === 'ar'
                      ? 'border-r-4 border-r-[#4a2e2b]'
                      : 'border-l-4 border-l-[#4a2e2b]'
                  }`}
                >
                  <Link
                    href={`/${currentLocale}/services/${section.id}`}
                    locale={currentLocale}
                    className="text-[#4A2E2B] hover:underline font-semibold block"
                  >
                    {t(section.titleKey, { defaultMessage: section.titleKey })}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) =>
                handlePageChangeAction(
                  page,
                  rawQuery,
                  currentLocale,
                  router,
                  pathname,
                  setCurrentPage,
                  setLoading,
                  setScrollTrigger
                )
              }
            />
          </div>
        )}
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10">
        <Image src="/animation.png" alt="Background Animation" fill className="object-cover" priority />
      </div>
    </div>
  );
}
