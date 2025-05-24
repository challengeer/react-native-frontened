import { useEffect, useContext } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { useColorScheme } from "nativewind";
import { setupNotificationHandlers } from "@/lib/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { ContactsProvider } from "@/providers/ContactsProvider";
import { AppearanceContext } from "@/providers/AppearanceProvider";
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "white";
    const queryClient = useQueryClient();

    // used to re-render the app when the language changes
    const { language } = useContext(AppearanceContext);

    useEffect(() => {
        if (isAuthenticated) {
            // Clean up previous handlers when component unmounts
            const cleanup = setupNotificationHandlers(queryClient);
            return () => {
                if (cleanup) cleanup();
            };
        }
    }, [isAuthenticated]);

    if (isLoading) {
        return null;
    }

    SplashScreen.hideAsync();

    if (!isAuthenticated) {
        return <Redirect href="/auth" />
    }

    return (
        <ContactsProvider>
            <Stack
                key={language}
                screenOptions={{
                    headerShown: false,
                    animation: "ios_from_right",
                    contentStyle: { backgroundColor }
                }}
            />
        </ContactsProvider>
    )
}