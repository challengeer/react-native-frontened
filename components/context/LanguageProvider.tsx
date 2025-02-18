import React, { createContext, useState, useEffect } from "react";
import i18n from "@/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
}

export const LanguageContext = createContext<LanguageContextType>({
  language: i18n.locale,
  changeLanguage: async () => {
    // Default empty implementation
    console.warn('changeLanguage was called before Provider was initialized');
  }
});

const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<string>(i18n.locale);

    useEffect(() => {
        // Load language preference from AsyncStorage
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem("appLanguage");
                if (savedLanguage) {
                    i18n.locale = savedLanguage;
                    setLanguage(savedLanguage);
                }
            } catch (error) {
                console.error("Failed to load language preference:", error);
            }
        };

        loadLanguage();
    }, []);

    const changeLanguage = async (lang: string) => {
        try {
            i18n.locale = lang;
            setLanguage(lang);
            await AsyncStorage.setItem("appLanguage", lang);
        } catch (error) {
            console.error("Failed to save language preference:", error);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;