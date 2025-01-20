import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";

import en from "./locales/en.json";
import sk from "./locales/sk.json";

const translations = { en, sk };
const i18n = new I18n(translations);

i18n.locale = getLocales()[0].languageCode ?? "en";
i18n.enableFallback = true;

export default i18n;