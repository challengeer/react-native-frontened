import { useContext } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/components/context/AuthProvider";
import { AppearanceContext } from "@/components/context/AppearanceProvider";
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();
    // used to re-render the app when the language changes
    const { language } = useContext(AppearanceContext);

    if (isLoading) {
        return null;
    }

    SplashScreen.hideAsync();

    if (!isAuthenticated) {
        return <Redirect href="/auth" />
    }

    return (
        <Stack
            key={language}
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