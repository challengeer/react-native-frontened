import { View } from "react-native";
import Text from "@/components/Text";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
import OptionButton from "@/components/settings/OptionButton";
import { useColorScheme } from "nativewind";
import RadioButton from "@/components/settings/RadioButton";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from 'react-native';

export default function AppAppearance() {
    const { colorScheme, setColorScheme } = useColorScheme();
    const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>(colorScheme === 'light' ? 'light' : 'dark');

    useEffect(() => {
        // Load saved preference
        AsyncStorage.getItem('themePreference').then(value => {
            if (value) {
                setSelectedTheme(value as 'light' | 'dark' | 'system');
                if (value === 'system') {
                    const systemColorScheme = Appearance.getColorScheme() || 'light';
                    setColorScheme(systemColorScheme);
                }
            }
        });

        // Add listener for system theme changes
        const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
            if (selectedTheme === 'system') {
                setColorScheme(newColorScheme || 'light');
            }
        });

        // Cleanup subscription
        return () => subscription.remove();
    }, [selectedTheme, setColorScheme]);

    const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
        setSelectedTheme(theme);
        await AsyncStorage.setItem('themePreference', theme);

        if (theme === 'system') {
            // Use React Native's Appearance API instead of window.matchMedia
            const systemColorScheme = Appearance.getColorScheme() || 'light';
            setColorScheme(systemColorScheme);
        } else {
            setColorScheme(theme);
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Header
                title="App appearance"
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />
            <View className="px-4 py-2">
                <OptionButton
                    title="Light"
                    value=""
                    onPress={() => handleThemeChange('light')}
                    className="rounded-t-lg"
                    borderBottom
                    rightSection={
                        <RadioButton selected={selectedTheme === 'light'} />
                    }
                />
                <OptionButton
                    title="Dark"
                    value=""
                    onPress={() => handleThemeChange('dark')}
                    borderBottom
                    rightSection={
                        <RadioButton selected={selectedTheme === 'dark'} />
                    }
                />
                <OptionButton
                    title="Match system"
                    value=""
                    onPress={() => handleThemeChange('system')}
                    className="rounded-b-lg"
                    rightSection={
                        <RadioButton selected={selectedTheme === 'system'} />
                    }
                />
            </View>
        </View>
    );
}