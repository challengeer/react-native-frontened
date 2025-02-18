import { Redirect, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from "@/hooks/useAuth";
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Hide the splash screen once we're done loading
        SplashScreen.hideAsync();
    }

    // Add later when auth is implemented
    // if (!isAuthenticated) {
    //     return <Redirect href="/auth" />
    // }

    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                }}
            />
        </QueryClientProvider>
    )
};