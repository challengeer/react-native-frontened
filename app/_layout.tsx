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
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

const queryClient = new QueryClient();

export default function Root() {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setBackgroundColorAsync(backgroundColor);
        }
    }, [colorScheme]);

    return (
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <AuthProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <BottomSheetModalProvider>
                            <StatusBar
                                barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                                backgroundColor={backgroundColor}
                            />

                            <View className="flex-1 bg-white dark:bg-neutral-900">
                                <Slot />
                            </View>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </AuthProvider>
            </LanguageProvider>
        </QueryClientProvider>
    )
};