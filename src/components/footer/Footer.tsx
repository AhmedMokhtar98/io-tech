'use client';

import { useLocale, useTranslations } from 'next-intl';
import { FaTwitter, FaFacebookF, FaGooglePlusG } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';

interface FormValues {
  email: string;
}

export default function Footer() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('footer');

  const links = [
    { label: t('about') },
    { label: t('strategy') },
    { label: t('advantages') },
    { label: t('social') },
    { label: t('services') },
  ];

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('emailInvalid'))
      .required(t('emailRequired')),
  });

  const handleSubmit = (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>
  ) => {
    console.log('Subscribed email:', values.email);
    resetForm();
    alert(t('subscriptionSuccess'));
  };

  return (
    <footer
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-[#4C2714] text-white px-4 py-10 font-sans mt-20"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Email + Social Section */}
      <div className="max-w-7xl mx-auto w-full py-6">
        <div
          className={`flex flex-col lg:flex-row ${
            isRTL ? 'justify-start' : 'justify-end'
          } items-center gap-4 lg:gap-6 w-full`}
        >
          {/* Email Form */}
          <Formik
            initialValues={{ email: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-1 p-2 bg-white rounded-md relative">
                <div className="flex items-center border border-white rounded-md overflow-hidden">
                  <Field
                    type="email"
                    name="email"
                    placeholder={t('emailPlaceholder')}
                    className="bg-white text-black px-4 py-2 outline-none w-48 md:w-64"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#4C2714] rounded-md text-white px-8 py-2 hover:bg-white hover:text-[#4C2714] transition font-medium border-l border-white"
                  >
                    {t('subscribe')}
                  </button>
                </div>
                <div className="absolute -bottom-5 left-1 right-1">
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-400 text-xs mt-1"
                  />
                </div>
              </Form>
            )}
          </Formik>

          {/* Contacts */}
          <span className="text-white">{t('contacts')}</span>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-white text-lg">
            <FaTwitter className="hover:text-gray-300 cursor-pointer" />
            <FaFacebookF className="hover:text-gray-300 cursor-pointer" />
            <FaGooglePlusG className="hover:text-gray-300 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#BFA89B] my-6" />

      {/* Links + Copyright */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start text-sm gap-4">
        {/* Nav Links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white flex-1">
          {links.map((link, idx) => (
            <span key={idx} className="hover:underline cursor-pointer">
              {link.label}
            </span>
          ))}
        </div>

        {/* Copyright Floated Right (or Left in RTL) */}
        <div
          className={`text-white ${
            isRTL ? 'md:order-first md:mr-auto' : 'md:ml-auto'
          }`}
        >
          © 2024. {t('copyright')}
        </div>
      </div>
    </footer>
  );
}
