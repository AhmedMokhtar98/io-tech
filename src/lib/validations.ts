// app/lib/validations.ts
import * as Yup from "yup";

// ----------------- Regex -----------------
export const onlyLettersNumbersSpaces = /^[\p{L}\p{N}\s]+$/u;

// ----------------- Search Schema -----------------
export const searchSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    search: Yup.string()
      .trim()
      .matches(
        onlyLettersNumbersSpaces,
        t("onlyLettersNumbers") 
      )
      .min(1, t("minChar"))
      .required(t("required")),
  });
// ----------------- Footer Email Schema -----------------
export const emailSchema = (t: (key: string) => string) =>
  Yup.object({
    email: Yup.string()
      .email(t("emailInvalid"))
      .required(t("emailRequired")),
  });
