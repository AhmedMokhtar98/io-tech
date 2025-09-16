// app/components/navbar/Navbar.tsx
'use client';
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { Link, useRouter, usePathname } from "@/lib/i18n/navigation";
import { SERVICES_SECTIONS } from '@/constants/DummyServicesData';
import Drawer from "../ui/Drawer";
// Helpers & Components
import { handleLangChange } from "@/lib/utils";
import SearchForm from "./SearchForm";

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [searchHover, setSearchHover] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [initialQuery, setInitialQuery] = useState("");

  const t = useTranslations("navbar");
  const locale = useLocale() as "en" | "ar";
  const router = useRouter();
  const pathname = usePathname();

  // Scroll listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.2);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Resize listener
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onResize = () => setWindowWidth(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Read ?q param
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

  return (
    <nav className={`fixed top-0 w-full z-[50] px-6 py-4 transition-colors duration-300 ${navbarBgClass}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-white">LOGO</Link>

        {/* Nav Links + Search */}
        <div className={`flex items-center flex-1 ${windowWidth <= 1024 ? 'justify-end' : 'justify-center'} space-x-4 md:space-x-8 ${locale === "ar" ? 'mx-0' : 'mx-5'}`}>
          {/* Desktop Nav Links */}
          <div className="hidden lg:flex gap-6 items-center">
            <Link href="/" className="hover:underline text-white">{t("home")}</Link>
            <Link href="/about" className="hover:underline text-white">{t("about")}</Link>

            {/* Services Dropdown */}
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
                      {SERVICES_SECTIONS.map((section) => (
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
          <div
            className="relative flex items-end"
            onMouseEnter={() => !isMobileSearch && setSearchHover(true)}
            onMouseLeave={() => !isMobileSearch && setSearchHover(false)}
          >
            <div className={`flex items-center relative z-10 ${locale === "ar" ? 'mx-6' : 'mx-0'}`}>
              {!searchHover && (
                <div
                  className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                  onClick={() => {
                    if (isMobileSearch) {
                      router.push('/search', { locale });
                    }
                  }}
                >
                  <FaSearch className="h-5 w-5 text-white" />
                </div>
              )}
              <AnimatePresence>
                {searchHover && !isMobileSearch && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 350, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="ml-2"
                  >
                    <SearchForm initialQuery={initialQuery} locale={locale} router={router} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Buttons */}
        <div className="flex items-center space-x-4 relative">
          <Button
            variant="outline"
            className={`bg-transparent ${windowWidth <= 550 ? 'hidden' : ''} text-[white] border-[#cfcfcf91] hover:bg-gray-200 font-100`}
          >
            {t("book")}
          </Button>

          {/* Language Switch */}
          <div
            className="relative"
            onMouseEnter={() => setLangOpen(true)}
            onMouseLeave={() => setLangOpen(false)}
          >
            <button className="px-3 py-1 bg-transparent border border-[#cfcfcf91] text-white rounded-md flex items-center gap-1 hover:bg-white hover:text-[#4A2E2B] transition-colors">
              {locale === "en" ? "English" : "عربي"} <FaChevronDown className="ml-1 w-3 h-3" />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-1 bg-white text-[#4A2E2B] rounded-md shadow-lg overflow-hidden z-50"
                >
                  <button
                    onClick={() => handleLangChange("en", locale, pathname, router, () => setLangOpen(false))}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLangChange("ar", locale, pathname, router, () => setLangOpen(false))}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  >
                    عربي
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Drawer */}
          <div className={`${windowWidth <= 1024 ? 'block' : 'hidden'}`}>
            <Drawer
              isRTL={locale === "ar"}
              links={[
                { href: `/${locale}`, labelKey: "home" },
                { href: `${locale}/about`, labelKey: "about" },
                { href: `${locale}/team`, labelKey: "team" },
                { href: `${locale}/blogs`, labelKey: "blogs" },
                { href: `${locale}/contact`, labelKey: "contact" },
                { href: `${locale}/book`, labelKey: "book" },
                { labelKey: "services" },
              ]}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
