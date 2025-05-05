import i18n from "@/i18n";
import React, { useContext } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { AppearanceContext } from "@/providers/AppearanceProvider";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import OptionButton from "@/components/settings/SettingsItem";
import RadioButton from "@/components/settings/RadioButton";

const languages = ["en", "sk"];

export default function LanguageSettings() {
    const { language, changeLanguage } = useContext(AppearanceContext);

    return (
        <SafeAreaView className="flex-1">
            <Header
                title={i18n.t("settings.account.language.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <ScrollView className="flex-1 px-4">
                {languages.map((lang, index) => (
                    <OptionButton
                        key={lang}
                        itemIndex={index}
                        totalItems={languages.length}
                        title={i18n.t(`settings.account.language.${lang}`)}
                        onPress={() => changeLanguage(lang)}
                        rightSection={
                            <RadioButton selected={language === lang} />
                        }
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
