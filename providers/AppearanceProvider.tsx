import i18n from "@/i18n";
import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppearanceContextType {
  language: string;
  languageKey: number;
  changeLanguage: (lang: string) => Promise<void>;
  changeColorScheme: (colorScheme: "light" | "dark") => Promise<void>;
}

export const AppearanceContext = createContext<AppearanceContextType>({
  language: i18n.locale,
  languageKey: 0,
  changeLanguage: async () => {
    // Default empty implementation
    console.warn('changeLanguage was called before Provider was initialized');
  },
  changeColorScheme: async () => {
    // Default empty implementation
    console.warn('changeColorScheme was called before Provider was initialized');
  }
});

const AppearanceProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<string>(i18n.locale);
    const [languageKey, setLanguageKey] = useState(0);
    const { setColorScheme } = useColorScheme();

    useEffect(() => {
        // Load language and color scheme preference from AsyncStorage
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem("appLanguage");
                const savedColorScheme = await AsyncStorage.getItem("appColorScheme");
                
                if (savedLanguage) {
                    i18n.locale = savedLanguage;
                    setLanguage(savedLanguage);
                }
                
                if (savedColorScheme) {
                    setColorScheme(savedColorScheme as "light" | "dark");
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
            setLanguageKey(prev => prev + 1);
            await AsyncStorage.setItem("appLanguage", lang);
        } catch (error) {
            console.error("Failed to save language preference:", error);
        }
    };

    const changeColorScheme = async (colorScheme: "light" | "dark") => {
        try {
            setColorScheme(colorScheme);
            await AsyncStorage.setItem("appColorScheme", colorScheme);
        } catch (error) {
            console.error("Failed to save color scheme preference:", error);
        }
    };

    return (
        <AppearanceContext.Provider value={{ language, languageKey, changeLanguage, changeColorScheme }}>
            {children}
        </AppearanceContext.Provider>
    );
};

export default AppearanceProvider;