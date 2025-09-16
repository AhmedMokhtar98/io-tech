'use client';

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { SERVICES_SECTIONS } from '@/constants/DummyServicesData';

interface DrawerLink {
  href?: string;
  labelKey: string; // key for translation
  children?: DrawerLink[]; // optional for dropdown
}

export default function Drawer({ isRTL = false, links = [] }: { isRTL?: boolean, links?: DrawerLink[] }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const t = useTranslations("navbar"); 
  const locale = useLocale();

  // Generate services links from SERVICES_SECTIONS
  const servicesLinks: DrawerLink[] = SERVICES_SECTIONS.map(s => ({
    href: `/${locale}/services/${s.id}`,
    labelKey: s.titleKey
  }));

  return (
    <>
      {/* Burger button */}
      <button className="text-white text-xl" onClick={() => setDrawerOpen(true)}>
        <FaBars />
      </button>

      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Shade */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className={cn("fixed top-0 h-full w-64 bg-[#4A2E2B] z-50 p-6 flex flex-col gap-4", isRTL ? "left-0" : "right-0")}
              initial={{ x: isRTL ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? "-100%" : "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              {/* Close button */}
              <button className="self-end text-white text-2xl" onClick={() => setDrawerOpen(false)}>
                <FaTimes />
              </button>

              {/* Links */}
              {links.map(link => (
                <div key={link.labelKey} className="flex flex-col gap-1">
                  {link.labelKey === 'services' ? (
                    <>
                      <button
                        onClick={() => setServicesOpen(prev => !prev)}
                        className="flex items-center justify-between text-white hover:underline w-full"
                      >
                        {t(link.labelKey)} <FaChevronDown className={`ml-1 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {servicesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col pl-4 mt-1 gap-1"
                          >
                            {servicesLinks.map(s => (
                              <Link
                                key={s.href}
                                href={s.href!}
                                locale={locale}
                                className="text-white hover:underline"
                                onClick={() => setDrawerOpen(false)}
                              >
                                {t(s.labelKey)}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href!}
                      locale={locale}
                      className="text-white hover:underline"
                      onClick={() => setDrawerOpen(false)}
                    >
                      {t(link.labelKey)}
                    </Link>
                  )}
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
