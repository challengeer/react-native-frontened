import "../global.css";

import AppearanceProvider from "@/providers/AppearanceProvider";
import { AuthProvider } from "@/providers/AuthProvider";

import React, { useEffect, useContext } from "react";
import { useColorScheme } from "nativewind";
import { StatusBar, Platform } from "react-native";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { queryClient } from "@/lib/queryClient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppearanceContext } from "@/providers/AppearanceProvider";
import * as NavigationBar from "expo-navigation-bar";

function RootContent() {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "white";
    const buttonStyle = colorScheme === "dark" ? "light" : "dark";

    // used to re-render the app when the language changes
    const { language } = useContext(AppearanceContext);

    useEffect(() => {
        if (Platform.OS === "android") {
            NavigationBar.setPositionAsync("absolute");
            NavigationBar.setBackgroundColorAsync("transparent");
            NavigationBar.setButtonStyleAsync(buttonStyle);
            NavigationBar.setVisibilityAsync("visible");
        }
    }, []);

    return (
        <>
            <StatusBar
                barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                backgroundColor="transparent"
                translucent={true}
            />

            <Slot key={language} />
        </>
    );
}

export default function Root() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheetModalProvider>
                        <SafeAreaProvider>
                            <AppearanceProvider>
                                <RootContent />
                            </AppearanceProvider>
                        </SafeAreaProvider>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
            </AuthProvider>
        </QueryClientProvider>
    );
}