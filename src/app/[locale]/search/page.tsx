'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { LEGAL_SERVICES_SECTIONS } from '@/constants/legalServicesData';
import Image from 'next/image';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';

const PAGE_SIZE = 5;
const HEADER_HEIGHT = 80;
const SCROLL_DURATION = 450;

// Helpers
function normalizeArabic(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, '')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');
}
function normalizeEnglish(text: string) {
  return text.toLowerCase().trim();
}
function hasArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}
function hasLatin(text: string) {
  return /[A-Za-z]/.test(text);
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('services');
  const currentLocale = useLocale();

  const resultsRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [rawQuery, setRawQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );
  const [loading, setLoading] = useState(false);
  const [scrollTrigger, setScrollTrigger] = useState(0);

  // Sync state with URL
  useEffect(() => {
    setRawQuery(searchParams.get('q') || '');
    setCurrentPage(parseInt(searchParams.get('page') || '1', 10));
  }, [searchParams]);

  const arabicMode = hasArabic(rawQuery);
  const query = arabicMode ? normalizeArabic(rawQuery) : normalizeEnglish(rawQuery);

  // Filter results
  const filteredResults = useMemo(() => {
    return LEGAL_SERVICES_SECTIONS.filter((section) => {
      const translatedTitle = t(section.titleKey, { defaultMessage: section.titleKey });
      const normalizedArabicTitle = normalizeArabic(translatedTitle);
      const normalizedEnglishTitle = normalizeEnglish(translatedTitle);
      if (arabicMode) return normalizedArabicTitle.includes(query);
      return (
        normalizedEnglishTitle.includes(query) ||
        normalizedArabicTitle.includes(normalizeArabic(query))
      );
    });
  }, [query, arabicMode, t]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / PAGE_SIZE));
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const validationSchema = Yup.object().shape({
    search: Yup.string()
      .trim()
      .matches(
        /^[\p{L}\p{N}\s]+$/u,
        t('invalidChars', { defaultMessage: 'Only letters and numbers are allowed.' })
      )
      .min(1, t('minChars', { defaultMessage: 'Enter at least 1 character' }))
      .required(t('required', { defaultMessage: 'Search is required' })),
  });

  function withLocale(path: string, targetLocale: string) {
    if (!path) return `/${targetLocale}`;
    const p = path.startsWith('/') ? path : '/' + path;
    const parts = p.split('/');
    if (parts.length > 1 && /^[a-z]{2}$/i.test(parts[1])) {
      parts[1] = targetLocale;
      return parts.join('/') || `/${targetLocale}`;
    } else {
      parts.splice(1, 0, targetLocale);
      return parts.join('/');
    }
  }

  const updateUrl = (search: string, page = 1, targetLocale?: string) => {
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (page > 1) params.set('page', page.toString());
    const localeToUse = targetLocale || currentLocale;
    const newPath = withLocale(pathname, localeToUse);
    router.push(`${newPath}?${params.toString()}`);
  };

  // Cancel RAF on unmount
  const cancelRaf = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => cancelRaf();
  }, [cancelRaf]);

  const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  // Run scroll after results are loaded
  const runScrollToResults = useCallback(() => {
    const el = resultsRef.current;
    if (!el) return;

    const animateScroll = (container: HTMLElement | Element, from: number, to: number, duration: number) => {
      cancelRaf();
      const startTime = performance.now();
      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutQuad(progress);
        const current = Math.round(from + (to - from) * eased);

        if (container === document.scrollingElement || container === document.documentElement) {
          window.scrollTo(0, current);
        } else {
          (container as HTMLElement).scrollTop = current;
        }

        if (progress < 1) rafRef.current = requestAnimationFrame(step);
        else rafRef.current = null;
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const container = (function findScrollParent(el: HTMLElement | null): HTMLElement | Element {
      if (!el) return document.scrollingElement || document.documentElement;
      let node: HTMLElement | null = el.parentElement;
      while (node) {
        const style = getComputedStyle(node);
        const overflowY = style.overflowY;
        const canScroll = (overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight;
        if (canScroll) return node;
        node = node.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    })(el);

    requestAnimationFrame(() => {
      if (container === document.scrollingElement || container === document.documentElement) {
        const start = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
        const elTop = el.getBoundingClientRect().top + start;
        let target = Math.round(elTop - HEADER_HEIGHT);
        const max = document.documentElement.scrollHeight - window.innerHeight;
        target = Math.min(Math.max(target, 0), max);
        animateScroll(document.scrollingElement || document.documentElement, start, target, SCROLL_DURATION);
      } else {
        const containerEl = container as HTMLElement;
        const start = containerEl.scrollTop;
        const containerRect = containerEl.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const diff = elRect.top - containerRect.top;
        let target = Math.round(start + diff - HEADER_HEIGHT);
        const max = containerEl.scrollHeight - containerEl.clientHeight;
        target = Math.min(Math.max(target, 0), max);
        animateScroll(containerEl, start, target, SCROLL_DURATION);
      }
    });
  }, [cancelRaf]);

  useEffect(() => {
    if (!loading && scrollTrigger > 0) runScrollToResults();
  }, [scrollTrigger, loading, currentPage, paginatedResults.length, runScrollToResults]);

  const handleSearch = (values: { search: string }) => {
    const searchValue = values.search.trim();
    let targetLocale = currentLocale;
    if (hasArabic(searchValue)) targetLocale = 'ar';
    else if (hasLatin(searchValue)) targetLocale = 'en';

    setLoading(true);
    setTimeout(() => {
      updateUrl(searchValue, 1, targetLocale);
      setRawQuery(searchValue);
      setCurrentPage(1);
      setLoading(false);
      setTimeout(() => setScrollTrigger((s) => s + 1), 0);
    }, 350);
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    setTimeout(() => {
      updateUrl(rawQuery, page);
      setCurrentPage(page);
      setLoading(false);
      setTimeout(() => setScrollTrigger((s) => s + 1), 0);
    }, 300);
  };

  /* ======= Render ======= */

  return (
    <div className="relative min-h-screen font-sans text-[#4A2E2B] mt-16 pb-12">
      {/* Hero */}
      <div className="relative w-full h-[20vh] sm:h-64 md:h-96 transition-all duration-300">
        <Image src="/cover.png" alt="Hero Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(75,38,21,0.5)] to-[rgba(75,38,21,0.85)]" />
        <div className="absolute inset-0 flex items-center justify-center z-10 px-4 sm:px-6 text-center">
          <h1 className="text-lg sm:text-2xl md:text-4xl font-semibold text-white break-words">
            { rawQuery.length > 0 ? t('searchResults', { defaultMessage: 'Search Results' }) + ': ' : t('searchServices') }
            <span className="font-normal">{rawQuery}</span>
          </h1>
        </div>
      </div>

      {/* Search Field */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <Formik
          initialValues={{ search: rawQuery }}
          validationSchema={validationSchema}
          onSubmit={(values, { validateForm, setSubmitting }) => {
            validateForm(values).then((errors) => {
              if (Object.keys(errors).length > 0) {
                setSubmitting(false);
                return;
              }
              handleSearch(values);
            });
          }}
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
                  onChange={(e) => setFieldValue('search', e.target.value.replace(/[^\p{L}\p{N}\s]/gu, ''))}
                />
                <ErrorMessage name="search" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <Button type="submit">{t('searchButton', { defaultMessage: 'Search' })}</Button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Results */}
      <div ref={resultsRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 mt-4 sm:mt-6 relative z-10 min-h-[500px] flex flex-col justify-between">
        {loading ? (
          <div className="space-y-4 flex-1">
            {[...Array(PAGE_SIZE)].map((_, i) => (
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
                    currentLocale === 'ar' ? 'border-r-4 border-r-[#4a2e2b]' : 'border-l-4 border-l-[#4a2e2b]'
                  }`}
                >
                  <Link href={`/${currentLocale}/services/${section.id}`} locale={currentLocale} className="text-[#4A2E2B] hover:underline font-semibold block">
                    {t(section.titleKey, { defaultMessage: section.titleKey })}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-6 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === index + 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(index + 1);
                          }}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Background Animation */}
      <div className="fixed inset-0 -z-10 w-full h-full">
        <Image src="/animation.png" alt="Background Animation" fill className="object-cover" priority />
      </div>
    </div>
  );
}
