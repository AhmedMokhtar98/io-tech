import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import messagesEn from "@/translations/en.json";
import messagesAr from "@/translations/ar.json";

export const generateStaticParams = () => [
  { locale: "en" },
  { locale: "ar" },
];

type Locale = "en" | "ar";

interface LayoutProps {
  children: ReactNode;
  params: { locale: Locale };
}

// Synchronously map locales to messages
const messagesMap: Record<Locale, Record<string, string>> = {
  en: messagesEn,
  ar: messagesAr,
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params; // Await params to ensure it's resolved

  if (!["en", "ar"].includes(locale)) notFound();

  const messages = messagesMap[locale];

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div key={locale} className="flex flex-col min-h-screen">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
