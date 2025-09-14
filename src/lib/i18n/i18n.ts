// utils/i18n.ts
export const LOCALES = ['en', 'ar'] as const;
export type Locale = typeof LOCALES[number];

/** Split pathname into non-empty segments. e.g. "/en/about/" -> ["en","about"] */
export function normalizePathname(pathname: string) {
  return String(pathname).split('/').filter(Boolean);
}

/** Strip a leading locale (if present). "/en/about" -> "/about", "/" -> "/" */
export function stripLocalePrefix(path: string) {
  if (!path || !path.startsWith('/')) return path || '/';
  const segs = normalizePathname(path);
  if (segs.length > 0 && LOCALES.includes(segs[0] as Locale)) segs.shift();
  return '/' + segs.join('/');
}

/**
 * Build a locale-prefixed path from current pathname + optional search/hash.
 * Replaces first segment if it's a locale otherwise prepends selectedLocale.
 * Examples:
 *  buildLocalePath('ar', '/about', '?q=1') => "/ar/about?q=1"
 *  buildLocalePath('en', '/en/about', '') => "/en/about"
 */
export function buildLocalePath(selectedLocale: Locale, currentPathname = '/', search = '', hash = '') {
  const segs = normalizePathname(currentPathname);
  if (segs.length > 0 && LOCALES.includes(segs[0] as Locale)) {
    segs[0] = selectedLocale;
  } else {
    segs.unshift(selectedLocale);
  }
  const pathname = '/' + segs.join('/');
  return pathname + (search || '') + (hash || '');
}

/** Build a locale-prefixed URL for a route path that may or may not include a locale. */
export function buildLocaleUrlFor(routePath: string, selectedLocale: Locale) {
  const clean = stripLocalePrefix(routePath);
  return `/${selectedLocale}${clean === '/' ? '' : clean}`;
}
