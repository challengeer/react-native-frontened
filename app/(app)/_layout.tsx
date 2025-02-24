import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/components/context/AuthProvider";
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return null;
    }

    SplashScreen.hideAsync();

    if (!isAuthenticated) {
        return <Redirect href="/auth" />
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "none",
                contentStyle: {
                    backgroundColor: "transparent",
                }
            }}
        />
    )
};