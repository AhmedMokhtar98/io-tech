// app/components/navbar/SearchForm.tsx
'use client';

import { Formik, Form } from "formik";
import { FaSearch } from "react-icons/fa";
import { hasArabic, sanitizeInput, onSubmitSearch } from "@/lib/utils";
import { getSearchSchema } from "@/lib/validations";
import { useTranslations } from "next-intl";

type Props = {
  initialQuery: string;
  locale: "en" | "ar";
  router: { push: (path: string, opts?: { locale?: string }) => void };
};

export default function SearchForm({ initialQuery, locale, router }: Props) {
  const t = useTranslations("search");

  return (
    <Formik
      enableReinitialize
      initialValues={{ query: initialQuery || "" }}
      validationSchema={getSearchSchema(t)}
      onSubmit={async (vals, formikHelpers) => {
        const errors = await formikHelpers.validateForm();
        if (Object.keys(errors).length > 0) {
          formikHelpers.setSubmitting(false);
          return;
        }
        const sanitized = sanitizeInput(vals.query).trim();
        await onSubmitSearch(sanitized, locale, router);
        formikHelpers.setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <div className="w-full flex flex-col">
          <Form className="flex w-full items-start gap-2">
            <input
              name="query"
              value={values.query}
              placeholder={locale === "ar" ? "  ابحث هنا..." : "  Search..."}
              dir={hasArabic(values.query) ? "rtl" : locale === "ar" ? "rtl" : "ltr"}
              className="px-3 py-1 bg-[#654545] text-white border border-[#cfcfcf91] rounded-full outline-none w-full"
              onChange={(e) => setFieldValue("query", sanitizeInput(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const form = (e.target as HTMLInputElement).form;
                  form?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-1 px-2 py-2 rounded-full bg-[#3a211d] hover:bg-[#291615] text-white"
            >
              <FaSearch />
            </button>
          </Form>

          <div className="min-h-[1rem] mt-2 absolute bottom-[-13px] mx-2 w-full">
            {errors.query && touched.query && (
              <div className="text-red-500 text-xs">{errors.query as string}</div>
            )}
          </div>
        </div>
      )}
    </Formik>
  );
}
