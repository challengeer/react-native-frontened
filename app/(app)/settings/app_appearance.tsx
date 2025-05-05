import i18n from "@/i18n";
import React, { useContext } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppearanceContext } from "@/providers/AppearanceProvider";
import { useColorScheme } from "nativewind";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import OptionButton from "@/components/settings/SettingsItem";
import RadioButton from "@/components/settings/RadioButton";

const themes = ["light", "dark"];

export default function AppAppearance() {
    const { colorScheme } = useColorScheme();
    const { changeColorScheme } = useContext(AppearanceContext);

    return (
        <SafeAreaView className="flex-1">
            <Header
                title={i18n.t("settings.account.appearance.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />
            
            <ScrollView className="flex-1 px-4">
                {themes.map((theme, index) => (
                    <OptionButton
                        key={theme}
                        itemIndex={index}
                        totalItems={themes.length}
                        title={i18n.t(`settings.account.appearance.${theme}`)}
                        onPress={() => changeColorScheme(theme as "light" | "dark")}
                        rightSection={
                            <RadioButton selected={colorScheme === theme} />
                        }
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}