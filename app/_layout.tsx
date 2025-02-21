import "../global.css";

import "@/i18n";
import LanguageProvider from "@/components/context/LanguageProvider";
import { AuthProvider } from "@/components/context/AuthProvider";

import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { StatusBar, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { Slot } from "expo-router";

export default function Root() {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync(backgroundColor);
        }
    }, [colorScheme]);

    return (
        <LanguageProvider>
            <AuthProvider>
                <StatusBar
                    barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                    backgroundColor={backgroundColor}
                />
                
                <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
                    <Slot />
                </SafeAreaView>
            </AuthProvider>
        </LanguageProvider>
    )
};