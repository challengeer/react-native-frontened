import "../global.css";

import "@/i18n";
import AppearanceProvider from "@/providers/AppearanceProvider";
import { AuthProvider } from "@/providers/AuthProvider";

import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { StatusBar, Platform, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { queryClient } from "@/lib/queryClient";

export default function Root() {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "white";
    const buttonStyle = colorScheme === "dark" ? "light" : "dark";

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setPositionAsync("absolute");
            NavigationBar.setBackgroundColorAsync("transparent");
            NavigationBar.setButtonStyleAsync(buttonStyle);
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AppearanceProvider>
                <AuthProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <BottomSheetModalProvider>
                            <StatusBar
                                barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                                backgroundColor="transparent"
                            />

                            <View style={{ flex: 1, backgroundColor }}>
                                <Slot />
                            </View>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </AuthProvider>
            </AppearanceProvider>
        </QueryClientProvider>
    )
};