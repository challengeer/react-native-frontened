import "../global.css";

import "@/i18n";
import LanguageProvider from "@/components/context/LanguageProvider";
import { AuthProvider } from "@/components/context/AuthProvider";

import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { StatusBar, Platform, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Root() {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync(backgroundColor);
        }
    }, [colorScheme]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <LanguageProvider>
                <AuthProvider>
                    <StatusBar
                    barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                    backgroundColor={backgroundColor}
                />
                
                <View className="flex-1 bg-white dark:bg-neutral-900">
                    <Slot />
                    </View>
                </AuthProvider>
            </LanguageProvider>
        </GestureHandlerRootView>
    )
};