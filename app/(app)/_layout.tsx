import { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from "nativewind";
import { setupNotificationHandlers } from "@/lib/notifications";
import { useQueryClient } from "@tanstack/react-query";
import { ContactsProvider } from "@/providers/ContactsProvider";

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "white";
    const queryClient = useQueryClient();

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
                screenOptions={{
                    headerShown: false,
                    animation: "ios_from_right",
                    contentStyle: { backgroundColor }
                }}
            />
        </ContactsProvider>
    )
}