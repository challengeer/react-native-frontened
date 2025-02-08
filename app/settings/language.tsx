import Text from "@/components/Text";
import { ScrollView, View } from "react-native";
import OptionButton from "@/components/settings/OptionButton";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import Header from "@/components/Header";
import IconCircle from "@/components/IconCircle";
import { router } from "expo-router";
import RadioButton from "@/components/settings/RadioButton";
import i18n from "@/i18n";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react";

export default function LanguageSettings() {
    const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);

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

    const handleLanguageSelect = async (languageCode: string) => {
        try {
            i18n.locale = languageCode;
            setCurrentLanguage(languageCode);
            await AsyncStorage.setItem('userLanguage', languageCode);
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    };

    useEffect(() => {
        // Load saved language
        const loadLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem('userLanguage');
                if (savedLanguage) {
                    i18n.locale = savedLanguage;
                    setCurrentLanguage(savedLanguage);
                }
            } catch (error) {
                console.error('Error loading language:', error);
            }
        };

        loadLanguage();
    }, []);

    return (
        <ScrollView>
            <Header
                title="Language"
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
                        Select language
                    </Text>
                    {languages.map((lang, index) => (
                        <OptionButton
                            key={lang.code}
                            title={lang.title}
                            value=""
                            onPress={() => handleLanguageSelect(lang.code)}
                            borderBottom={index !== languages.length - 1}
                            className={`
                ${index === 0 ? 'rounded-t-lg' : ''}
                ${index === languages.length - 1 ? 'rounded-b-lg border-b-0' : ''}
              `}
                            rightSection={
                                <RadioButton
                                    selected={currentLanguage === lang.code}
                                    onPress={() => handleLanguageSelect(lang.code)}
                                />
                            }
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
