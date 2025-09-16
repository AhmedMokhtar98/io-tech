// utils/i18n.ts
export const LOCALES = ['en', 'ar'] as const;
export type Locale = typeof LOCALES[number];

export function normalizePathname(pathname: string) {
  return String(pathname).split('/').filter(Boolean);
}

export function stripLocalePrefix(path: string) {
  if (!path || !path.startsWith('/')) return path || '/';
  const segs = normalizePathname(path);
  if (segs.length > 0 && LOCALES.includes(segs[0] as Locale)) segs.shift();
  return '/' + segs.join('/');
}

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

export function buildLocaleUrlFor(routePath: string, selectedLocale: Locale) {
  const clean = stripLocalePrefix(routePath);
  return `/${selectedLocale}${clean === '/' ? '' : clean}`;
}
