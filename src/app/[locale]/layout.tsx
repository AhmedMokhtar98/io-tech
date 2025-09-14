import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";

export const generateStaticParams = () => [
  { locale: "en" },
  { locale: "ar" }
];

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = params;

  if (!["en", "ar"].includes(locale)) notFound();

  let messages;
  try {
    messages = await getMessages({ locale });
  } catch {
    messages = await getMessages({ locale: "en" });
  }

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
