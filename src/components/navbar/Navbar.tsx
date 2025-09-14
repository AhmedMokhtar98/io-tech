// app/components/navbar/Navbar.tsx
'use client';

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaSearch } from "react-icons/fa";
// NOTE: your navigation.ts (createNavigation) exports Link, useRouter, usePathname
import { Link, useRouter, usePathname } from "@/lib/i18n/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { LEGAL_SERVICES_SECTIONS } from '@/constants/legalServicesData';
import Drawer from "../ui/Drawer";
import { LOCALES, buildLocalePath, buildLocaleUrlFor, stripLocalePrefix } from "@/lib/i18n/i18n";

// ----------------- Helpers -----------------
const onlyLettersNumbersSpaces = /^[\p{L}\p{N}\s]+$/u;
function hasArabic(text = "") { return /[\u0600-\u06FF]/.test(text); }
function hasLatin(text = "") { return /[A-Za-z]/.test(text); }
function sanitizeInput(value = "") { return value.replace(/[^\p{L}\p{N}\s]/gu, ""); }

// ----------------- Validation -----------------
const searchSchema = Yup.object().shape({
  query: Yup.string()
    .trim()
    .matches(onlyLettersNumbersSpaces, "Only letters and numbers are allowed.")
    .min(1, "Enter at least 1 character")
    .required("Please enter a search query."),
});

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [initialQuery, setInitialQuery] = useState("");

  const t = useTranslations("navbar");
  const locale = useLocale() as 'en' | 'ar';
  const router = useRouter();
  const pathname = usePathname();

  // scroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.2);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // resize
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // read q param
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setInitialQuery(params.get("q") || "");
  }, [pathname, locale]);

  const isHome = pathname === "/" || pathname === `/${locale}` || pathname === `/${locale}/`;
  const isMobileSearch = windowWidth <= 1300;

  let navbarBgClass = "bg-transparent";
  if (!isHome) navbarBgClass = "bg-[#4A2E2B]";
  else if (scrolled || servicesOpen || searchHover) navbarBgClass = "bg-[#4A2E2B]";

  // **** Robust language change using utils (fixes /en/ar and similar) ****
// Robust language switch for createNavigation
const handleLangChange = (selectedLocale: 'en' | 'ar') => {
  if (selectedLocale === locale) {
    setLangOpen(false);
    return;
  }

  // Strip current locale from pathname
  const pathWithoutLocale = stripLocalePrefix(pathname);

  // Use createNavigation router.push with locale option
  router.push(pathWithoutLocale, { locale: selectedLocale });

  setLangOpen(false);
};

  // *******************************************************************
const onSubmitSearch = async (rawValue: string) => {
  const value = rawValue.trim();
  let targetLocale: 'en' | 'ar' = locale;

  if (hasArabic(value)) targetLocale = 'ar';
  else if (hasLatin(value)) targetLocale = 'en';

  // Strip current locale from pathname
  const pathWithoutLocale = '/search'; // always pass path WITHOUT locale prefix

  // Use createNavigation router.push with locale option
  router.push(pathWithoutLocale + `?q=${encodeURIComponent(value)}`, {
    locale: targetLocale,
  });
};


  return (
    <nav className={`fixed top-0 w-full z-[50] px-6 py-4 transition-colors duration-300 ${navbarBgClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo: use Link WITHOUT manual locale — createNavigation's Link will prefix */}
        <Link href="/" className="text-xl font-bold text-white">LOGO</Link>

        {/* Nav Links + Search */}
        <div className={`flex items-center flex-1 ${windowWidth <= 1024 ? 'justify-end' : 'justify-center'} space-x-4 md:space-x-8 ${locale === "ar" ? 'mx-0' : 'mx-5'}`}>
          <div className="hidden lg:flex gap-6 items-center">
            <Link href="/" className="hover:underline text-white">{t("home")}</Link>
            <Link href="/about" className="hover:underline text-white">{t("about")}</Link>

            {/* Services */}
           <div
  className="relative"
  onMouseEnter={() => setServicesOpen(true)}
  onMouseLeave={() => setServicesOpen(false)}
>
  <button className="flex items-center hover:underline text-white">
    {t("services")} <FaChevronDown className="ml-1 h-4 w-4" />
  </button>

  <AnimatePresence>
    {servicesOpen && (
      <>
        <motion.div
          className="fixed top-[68px] inset-x-0 bottom-0 bg-black/50 z-[40] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${locale === "ar" ? "-left-[50%] -translate-x-[50%]" : "right-[75%] translate-x-[75%]"} top-[calc(100%+8px)] bg-[#4A2E2B] p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-white text-sm w-[80vw] max-w-5xl z-[51]`}
          >
            {LEGAL_SERVICES_SECTIONS.map((section) => (
              <Link
                key={section.id}
                href={`/services/${section.id}`}
                onClick={() => setServicesOpen(false)}
                className={`relative text-white 
                  hover:after:w-full 
                  after:absolute after:bottom-0 after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300
                  ${locale === "ar" ? "after:right-0" : "after:left-0"}`}
              >
                {t(section.titleKey)}
              </Link>
            ))}
          </motion.div>
      </>
    )}
  </AnimatePresence>
</div>


            <Link href="/team" className="hover:underline text-white">{t("ourTeam")}</Link>
            <Link href="/blogs" className="hover:underline text-white">{t("blogs")}</Link>
            <Link href="/contact" className="hover:underline text-white">{t("contact")}</Link>
          </div>

          {/* Search */}
          <div className="relative flex items-end" onMouseEnter={() => !isMobileSearch && setSearchHover(true)} onMouseLeave={() => !isMobileSearch && setSearchHover(false)}>
            <div className={`flex items-center relative z-10 ${locale === "ar" ? 'mx-6' : 'mx-0'}`}>
              {!searchHover && (
                <div
                  className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    if (isMobileSearch) {
                      router.push('/search', { locale }); // use router.push with locale option
                    }
                  }}
                >
                  <FaSearch className="h-5 w-5 text-white" />
                </div>
              )}
              <AnimatePresence>
                {searchHover && !isMobileSearch && (
                  <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 350, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="ml-2">
                    <Formik enableReinitialize initialValues={{ query: initialQuery || "" }} validationSchema={searchSchema} onSubmit={async (vals, formikHelpers) => {
                      const errors = await formikHelpers.validateForm();
                      if (Object.keys(errors).length > 0) { formikHelpers.setSubmitting(false); return; }
                      const sanitized = sanitizeInput(vals.query).trim();
                      await onSubmitSearch(sanitized);
                      formikHelpers.setSubmitting(false);
                    }}>
                      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                        <div className="w-full flex flex-col">
                          <Form className="flex w-full items-start gap-2">
                            <input name="query" value={values.query} placeholder={"  " + t("searchHolder")} dir={hasArabic(values.query) ? "rtl" : locale === "ar" ? "rtl" : "ltr"} className="px-3 py-1 bg-[#654545] text-white border border-[#cfcfcf91] rounded-full outline-none w-full" onChange={(e) => setFieldValue("query", sanitizeInput(e.target.value))} onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const form = (e.target as HTMLInputElement).form;
                                form?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                              }
                            }} />
                            <button type="submit" disabled={isSubmitting} className="ml-1 px-2 py-2 rounded-full bg-[#3a211d] hover:bg-[#291615] text-white"><FaSearch /></button>
                          </Form>

                          <div className="min-h-[1rem] mt-2 absolute bottom-[-13px] width-full">
                            {errors.query && touched.query && (<div className="text-red-500 text-xs ">{errors.query as string}</div>)}
                          </div>
                        </div>
                      )}
                    </Formik>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center space-x-4 relative">
          <Button variant="outline" className={`bg-transparent ${windowWidth <= 550 ? 'hidden' : ''} text-[white] border-[#cfcfcf91] hover:bg-gray-200 font-100`}>{t("book")}</Button>

          <div className="relative" onMouseEnter={() => setLangOpen(true)} onMouseLeave={() => setLangOpen(false)}>
            <button className="px-3 py-1 bg-transparent border border-[#cfcfcf91] text-white rounded-md flex items-center gap-1 hover:bg-white hover:text-[#4A2E2B] transition-colors">{locale === "en" ? "English" : "عربي"} <FaChevronDown className="ml-1 w-3 h-3" /></button>

            <AnimatePresence>
              {langOpen && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }} className="absolute right-0 mt-1 bg-white text-[#4A2E2B] rounded-md shadow-lg overflow-hidden z-50">
                  <button onClick={() => handleLangChange("en")} className="block w-full text-left px-4 py-2 hover:bg-gray-200">English</button>
                  <button onClick={() => handleLangChange("ar")} className="block w-full text-left px-4 py-2 hover:bg-gray-200">عربي</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`${windowWidth <= 1024 ? 'block' : 'hidden'}`}>
            <Drawer isRTL={locale === "ar"} links={[
              { href: `/${locale}`, labelKey: 'home' },
              { href: `${locale}/about`, labelKey: 'about' },
              { href: `${locale}/team`, labelKey: 'team' },
              { href: `${locale}/blogs`, labelKey: 'blogs' },
              { href: `${locale}/contact`, labelKey: 'contact' },
              { href: `${locale}/book`, labelKey: 'book' },
              { labelKey: 'services' }
            ]}/>
          </div>
        </div>
      </div>
    </nav>
  );
}
