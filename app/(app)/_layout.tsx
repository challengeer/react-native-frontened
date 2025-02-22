import { Redirect, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from "@/components/context/AuthProvider";
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch the resources
SplashScreen.preventAutoHideAsync();

// Create QueryClient outside component to persist between renders
const queryClient = new QueryClient()

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
        <QueryClientProvider client={queryClient}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "none",
                    contentStyle: {
                        backgroundColor: "transparent",
                    }
                }}
            />
        </QueryClientProvider>
    )
};