import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";

import en from "./locales/en.json";
import sk from "./locales/sk.json";

const translations = { en, sk };
const i18n = new I18n(translations);

// Add a try-catch block and provide a fallback
try {
  const locales = getLocales();
  i18n.locale = locales?.[0]?.languageCode ?? "en";
} catch (error) {
  i18n.locale = "en";  // Fallback to English if there's an error
}

i18n.enableFallback = true;

export default i18n;