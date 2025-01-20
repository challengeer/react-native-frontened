import "../global.css";

import "@/i18n";
import LanguageProvider from "@/components/LanguageProvider";

import { useEffect } from "react";
import { Slot } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from 'expo-navigation-bar';
import Text from "@/components/Text";


export default function Root() {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    useEffect(() => {
        NavigationBar.setBackgroundColorAsync(colorScheme === "dark" ? "#171717" : "#ffffff");
        NavigationBar.setButtonStyleAsync(colorScheme === "dark" ? "light" : "dark");
    }, [colorScheme]);

    return (
        <LanguageProvider>
            <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <Text onPress={toggleColorScheme}>Toogle theme</Text>
                <Slot />
            </SafeAreaView>
        </LanguageProvider>
    )
};