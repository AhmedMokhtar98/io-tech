import "./globals.css";
import { NextIntlClientProvider } from "next-intl";

export const metadata = {
  title: "Masarat For Transport",
  description: "Transport solutions website",
};

// Recursive type that allows arrays
type Messages = {
  [key: string]: string | Messages | Array<string | Messages>;
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;

  let messages: Messages;

  try {
    messages = (await import(`../translations/${locale}.json`)).default;
  } catch {
    messages = (await import(`../translations/en.json`)).default;
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
