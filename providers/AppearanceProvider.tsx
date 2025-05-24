import i18n from "@/i18n";
import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AppearanceContextType {
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
  changeColorScheme: (colorScheme: "light" | "dark") => Promise<void>;
}

export const AppearanceContext = createContext<AppearanceContextType>({
  language: i18n.locale,
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
    const { colorScheme, setColorScheme } = useColorScheme();

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
        if (language === lang) return;

        try {
            i18n.locale = lang;
            setLanguage(lang);
            await AsyncStorage.setItem("appLanguage", lang);
        } catch (error) {
            console.error("Failed to save language preference:", error);
        }
    };

    const changeColorScheme = async (newColorScheme: "light" | "dark") => {
        if (colorScheme === newColorScheme) return;

        try {
            setColorScheme(newColorScheme);
            await AsyncStorage.setItem("appColorScheme", newColorScheme);
        } catch (error) {
            console.error("Failed to save color scheme preference:", error);
        }
    };

    return (
        <AppearanceContext.Provider value={{ language, changeLanguage, changeColorScheme }}>
            {children}
        </AppearanceContext.Provider>
    );
};

export default AppearanceProvider;