import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";

export default function AppLayout() {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "white";
    
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: "none",
                contentStyle: { backgroundColor }
            }}
        />
    )
};