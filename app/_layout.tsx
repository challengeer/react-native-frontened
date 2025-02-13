import "../global.css";

import "@/i18n";
import LanguageProvider from "@/components/LanguageProvider";

import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Root() {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <LanguageProvider>
                <SafeAreaView className="flex-1 bg-white dark:bg-neutral-900">
                    <Stack
                        screenOptions={{
                            statusBarBackgroundColor: backgroundColor,
                            statusBarStyle: colorScheme === "dark" ? "light" : "dark",
                            navigationBarColor: backgroundColor,
                            headerShown: false,
                            animation: "ios_from_right",
                        }}
                    />
                </SafeAreaView>
            </LanguageProvider>
        </QueryClientProvider>
    )
};