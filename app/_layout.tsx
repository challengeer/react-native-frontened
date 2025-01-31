import "../global.css";

import "@/i18n";
import LanguageProvider from "@/components/LanguageProvider";

import { useEffect } from "react";
import { router, Slot } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from "nativewind";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from 'expo-navigation-bar';
import Text from "@/components/Text";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Root() {
    const { colorScheme, toggleColorScheme } = useColorScheme();

    useEffect(() => {
        const checkAuth = async () => {
            const userToken = await AsyncStorage.getItem("userToken");
            if (userToken) router.push("/challenges")
            else router.push("/auth")
        };

        checkAuth();
    }, [])

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