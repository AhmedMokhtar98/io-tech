// app/not-found.tsx
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
   const t = useTranslations("NotFound");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9f5f3] text-center px-4">
      <h1 className="text-[10rem] font-extrabold text-[#4A2E2B] select-none">404</h1>
      <p className="mt-4 text-2xl text-[#4A2E2B] max-w-lg">{t("message")}</p>
      <Link
        href="/"
        className="mt-8 rounded-lg bg-[#4A2E2B] px-6 py-3 text-white font-medium shadow-lg hover:bg-[#3a1f1c] transition-colors duration-300"
      >
        {t("homeButton")}
      </Link>
    </div>
  );
}
