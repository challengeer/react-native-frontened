import Text from "@/components/common/Text";
import { ScrollView, View } from "react-native";
import OptionButton from "@/components/settings/SettingsItem";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import { router } from "expo-router";
import RadioButton from "@/components/settings/RadioButton";
import i18n from "@/i18n";
import { useContext } from "react";
import { LanguageContext } from "@/components/context/LanguageProvider";

export default function LanguageSettings() {
    const { language, changeLanguage } = useContext(LanguageContext);

    const languages = [
        {
            code: "en",
            title: "English",
            description: "English language"
        },
        {
            code: "sk",
            title: "Slovenčina",
            description: "Slovenský jazyk"
        }
    ];

    return (
        <ScrollView key={language} className="flex-1 bg-white dark:bg-neutral-900">
            <Header
                title={i18n.t("settings.language.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />
            <View className="px-4 py-2 gap-4">
                <View>
                    <Text className="mb-2 text-lg">
                        {i18n.t("settings.language.selectLanguage")}
                    </Text>
                    {languages.map((lang, index) => (
                        <OptionButton
                            key={lang.code}
                            title={lang.title}
                            value=""
                            onPress={() => changeLanguage(lang.code)}
                            borderBottom={index !== languages.length - 1}
                            className={`${index === 0 ? 'rounded-t-lg' : ''} ${index === languages.length - 1 ? 'rounded-b-lg border-b-0' : ''}`}
                            rightSection={
                                <RadioButton
                                    selected={language === lang.code}
                                    onPress={() => changeLanguage(lang.code)}
                                />
                            }
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
