import { stripLocalePrefix } from "@/lib/i18n/i18n";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Yup from "yup";
import { MutableRefObject } from "react";
import { SERVICES_SECTIONS } from "@/constants/DummyServicesData";

/* -------------------- CONSTANTS -------------------- */
export const PAGE_SIZE = 5;
export const HEADER_HEIGHT = 80;
export const SCROLL_DURATION = 450;

/* -------------------- CLASSNAME UTILS -------------------- */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -------------------- TEXT & INPUT HELPERS -------------------- */
export const onlyLettersNumbersSpaces = /^[\p{L}\p{N}\s]+$/u;

export function sanitizeInput(value = ""): string {
  return value.replace(/[^\p{L}\p{N}\s]/gu, "");
}

export function hasArabic(text = ""): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

export function hasLatin(text = ""): boolean {
  return /[A-Za-z]/.test(text);
}

export const normalize = (text: string) =>
  text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s]/gu, "");

export const normalizeArabic = (text: string) =>
  normalize(text)
    .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");

/* -------------------- LOCALE HELPERS -------------------- */
export const withLocale = (path: string, locale: string): string => {
  if (!path) return `/${locale}`;
  const parts = (path.startsWith("/") ? path : "/" + path).split("/");
  if (/^[a-z]{2}$/i.test(parts[1])) parts[1] = locale;
  else parts.splice(1, 0, locale);
  return parts.join("/");
};

type RouterLike = {
  push: (path: string, opts?: { locale?: string }) => void;
};

export function handleLangChange(
  selectedLocale: "en" | "ar",
  currentLocale: "en" | "ar",
  pathname: string,
  router: RouterLike,
  closeMenu: () => void
): void {
  if (selectedLocale === currentLocale) {
    closeMenu();
    return;
  }
  const pathWithoutLocale = stripLocalePrefix(pathname);
  router.push(pathWithoutLocale, { locale: selectedLocale });
  closeMenu();
}

export async function onSubmitSearch(
  rawValue: string,
  locale: "en" | "ar",
  router: RouterLike
): Promise<void> {
  const value = rawValue.trim();
  let targetLocale: "en" | "ar" = locale;

  if (hasArabic(value)) targetLocale = "ar";
  else if (hasLatin(value)) targetLocale = "en";

  router.push(`/search?q=${encodeURIComponent(value)}`, {
    locale: targetLocale,
  });
}

/* -------------------- SCROLL HELPERS -------------------- */
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

const findScrollContainer = (el: HTMLElement | null): HTMLElement | Element =>
  el
    ? (() => {
        let node: HTMLElement | null = el.parentElement;
        while (node) {
          const overflowY = getComputedStyle(node).overflowY;
          if (
            (overflowY === "auto" || overflowY === "scroll") &&
            node.scrollHeight > node.clientHeight
          )
            return node;
          node = node.parentElement;
        }
        return document.scrollingElement || document.documentElement;
      })()
    : document.scrollingElement || document.documentElement;

export function scrollToElement(
  target: HTMLElement,
  cancelRaf: () => void,
  rafRef: MutableRefObject<number | null>,
  duration = SCROLL_DURATION
): void {
  const container = findScrollContainer(target);
  cancelRaf();

  const start =
    container === document.documentElement
      ? window.scrollY
      : (container as HTMLElement).scrollTop;
  const targetOffset =
    container === document.documentElement
      ? target.getBoundingClientRect().top + start
      : target.offsetTop;
  const scrollTarget = Math.max(0, targetOffset - HEADER_HEIGHT);

  const step = (time: number, startTime: number) => {
    const progress = Math.min((time - startTime) / duration, 1);
    const value = Math.round(start + (scrollTarget - start) * ease(progress));

    if (container === document.documentElement) window.scrollTo(0, value);
    else (container as HTMLElement).scrollTop = value;

    if (progress < 1)
      rafRef.current = requestAnimationFrame((t) => step(t, startTime));
  };

  rafRef.current = requestAnimationFrame((t) => step(t, performance.now()));
}

export function cancelRaf(rafRef: MutableRefObject<number | null>): void {
  if (rafRef.current) cancelAnimationFrame(rafRef.current);
  rafRef.current = null;
}

/* -------------------- VALIDATION -------------------- */
export function getValidationSchema(
  t: (key: string, opts?: Record<string, string>) => string
) {
  return Yup.object({
    search: Yup.string()
      .trim()
      .matches(
        /^[\p{L}\p{N}\s]+$/u,
        t("invalidChars", { defaultMessage: "Only letters and numbers allowed." })
      )
      .min(1, t("minChars", { defaultMessage: "Enter at least 1 character" }))
      .required(t("required", { defaultMessage: "Search is required" })),
  });
}

/* -------------------- QUERY + RESULTS -------------------- */
export function syncQueryState(searchParams: URLSearchParams) {
  const rawQuery = searchParams.get("q") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  return { rawQuery, currentPage };
}

export function getQueryAndMode(rawQuery: string) {
  const arabicMode = hasArabic(rawQuery);
  const query = arabicMode ? normalizeArabic(rawQuery) : normalize(rawQuery);
  return { query, arabicMode };
}

export function filterResults(
  query: string,
  arabicMode: boolean,
  t: (key: string, opts?: Record<string, string>) => string
) {
  return SERVICES_SECTIONS.filter((section) => {
    const translatedTitle = t(section.titleKey, { defaultMessage: section.titleKey });
    const titleArabic = normalizeArabic(translatedTitle);
    const titleEnglish = normalize(translatedTitle);
    return arabicMode
      ? titleArabic.includes(query)
      : titleEnglish.includes(query) || titleArabic.includes(normalizeArabic(query));
  });
}

export function paginateResults<T>(results: T[], currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const paginatedResults = results.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  return { totalPages, paginatedResults };
}

/* -------------------- URL + SEARCH ACTIONS -------------------- */
interface NextRouterLike {
  push: (url: string) => void;
}

function updateUrl(
  pathname: string,
  locale: string,
  router: NextRouterLike,
  query: string,
  page = 1
): void {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (page > 1) params.set("page", page.toString());
  router.push(`${withLocale(pathname, locale)}?${params}`);
}

export function handleSearchAction(
  searchValue: string,
  currentLocale: string,
  router: NextRouterLike,
  pathname: string,
  setRawQuery: (v: string) => void,
  setCurrentPage: (v: number) => void,
  setLoading: (v: boolean) => void,
  setScrollTrigger: (cb: (s: number) => number) => void
): void {
  const locale = hasArabic(searchValue)
    ? "ar"
    : hasLatin(searchValue)
    ? "en"
    : currentLocale;
  setLoading(true);
  setTimeout(() => {
    updateUrl(pathname, locale, router, searchValue, 1);
    setRawQuery(searchValue);
    setCurrentPage(1);
    setLoading(false);
    setScrollTrigger((s) => s + 1);
  }, 250);
}

export function handlePageChangeAction(
  page: number,
  query: string,
  currentLocale: string,
  router: NextRouterLike,
  pathname: string,
  setCurrentPage: (v: number) => void,
  setLoading: (v: boolean) => void,
  setScrollTrigger: (cb: (s: number) => number) => void
): void {
  setLoading(true);
  setTimeout(() => {
    updateUrl(pathname, currentLocale, router, query, page);
    setCurrentPage(page);
    setLoading(false);
    setScrollTrigger((s) => s + 1);
  }, 200);
}
