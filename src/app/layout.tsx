// app/layout.tsx
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";

export const metadata = {
  title: "Masarat For Transport",
  description: "Transport solutions website",
};

// 'params' comes from Next.js App Router for dynamic routes like /[locale]/...
export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string }; // guaranteed
}) {
  const locale = params.locale;

  let messages;
  try {
    messages = require(`../translations/${locale}.json`).default;
  } catch {
    messages = require(`../translations/en.json`).default;
  }

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

