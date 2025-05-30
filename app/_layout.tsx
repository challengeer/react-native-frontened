import "../global.css";

import AppearanceProvider from "@/providers/AppearanceProvider";
import { AuthProvider } from "@/providers/AuthProvider";

import { useEffect, useContext } from "react";
import { useColorScheme } from "nativewind";
import { StatusBar, Platform, View } from "react-native";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClientProvider } from "@tanstack/react-query";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { queryClient } from "@/lib/queryClient";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppearanceContext } from "@/providers/AppearanceProvider";
import * as NavigationBar from "expo-navigation-bar";

export default function Root() {
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
        <QueryClientProvider client={queryClient}>
            <AppearanceProvider>
                <AuthProvider>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <BottomSheetModalProvider>
                            <SafeAreaProvider>
                                <StatusBar
                                    barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                                    backgroundColor="transparent"
                                    translucent={true}
                                />

                                <View key={language} className="flex-1">
                                    <Slot />
                                </View>
                            </SafeAreaProvider>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </AuthProvider>
            </AppearanceProvider>
        </QueryClientProvider>
    )
};