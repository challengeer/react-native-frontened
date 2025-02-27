import i18n from "@/i18n";
import api from "@/lib/api";
import Text from "@/components/common/Text";
import { useContext, useCallback } from "react";
import { useAuth } from "@/components/context/AuthProvider";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { LanguageContext } from "@/components/context/LanguageProvider";
import { useQueryClient } from "@tanstack/react-query";
import OptionButton from "@/components/settings/SettingsItem";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Button from "@/components/common/Button";
import Avatar from "@/components/common/Avatar";
import useImagePicker from "@/components/settings/imagePicker";

const ROUTE_MAP = {
    appearance: "/settings/app_appearance",
    language: "/settings/language",
    displayName: "/settings/name",
    username: "/settings/username",
    mobileNumber: "/settings/mobile",
    email: "/settings/email",
    password: "/settings/password",
} as const;

export default function SettingsPage() {
    const { user, logout, refreshUser } = useAuth();
    const { language } = useContext(LanguageContext) as { language: string };
    const queryClient = useQueryClient();

    const handleOptionPress = (key: keyof typeof ROUTE_MAP) => {
        const route = ROUTE_MAP[key];
        if (route) {
            router.push(route);
        } else {
            console.log(`No route defined for ${key}`);
        }
    };

    const handleImageSelect = useCallback(async (formData: FormData) => {
        try {
            // Upload the image to the server with proper headers
            await api.put('/user/profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            // Refresh the user profile
            await refreshUser();
            await queryClient.invalidateQueries({
                queryKey: ["user", user?.user_id?.toString()]
            });
        } catch (error) {
            console.error('Error handling image:', error);
        }
    }, [refreshUser]);

    const pickImage = useImagePicker({ onImageSelect: handleImageSelect });

    const data = [
        {
            key: "displayName",
            title: i18n.t("settings.profile.displayName"),
            value: user?.display_name || "",
        },
        {
            key: "username",
            title: i18n.t("settings.profile.username"),
            value: user?.username || "",
        },
        {
            key: "mobileNumber",
            title: i18n.t("settings.profile.mobileNumber"),
            value: user?.phone_number || "",
        },
        {
            key: "email",
            title: i18n.t("settings.profile.email"),
            value: user?.email || "",
        },
        {
            key: "password",
            title: i18n.t("settings.profile.password"),
            value: "",
        },
        {
            key: "appearance",
            title: i18n.t("settings.appearance.header"),
            value: "",
        },
        {
            key: "language",
            title: i18n.t("settings.language.header"),
            value: "",
        },
    ];

    const settingsData = [
        {
            title: "Profile picture",
            value: "",
            route: null,
            onPress: pickImage,
            rightSection: (
                <Avatar 
                    name="John Doe" 
                    size="sm" 
                    source={user?.profile_picture}
                />
            ),
            key: "profile-picture"
        },
        ...data.map((item) => ({
            title: item.title,
            value: item.value,
            key: item.key,
            route: null, // Will use handleOptionPress instead
            rightSection: undefined
        }))
    ];

    return (
        <View key={language} className="flex-1 bg-white dark:bg-neutral-900">
            <Header
                title={i18n.t("settings.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <ScrollView
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                className="px-4"
            >
                {/* ACCOUNT SETTINGS */}
                <View className="mb-4">
                    <Text className="mb-2 text-2xl font-bold">
                        {i18n.t("settings.account")}
                    </Text>
                    <View className="overflow-hidden rounded-lg">
                        {settingsData.map((item, index) => (
                            <OptionButton
                                key={item.key}
                                title={item.title}
                                value={item.value}
                                onPress={item.onPress || (() => item.route ? router.push(item.route as any) : handleOptionPress(item.key as keyof typeof ROUTE_MAP))}
                                rightSection={item.rightSection}
                                borderBottom={index !== settingsData.length - 1}
                                withArrow
                                isFirst={index === 0}
                                isLast={index === settingsData.length - 1}
                            />
                        ))}
                    </View>
                </View>

                {/* PRIVACY POLICY & LOG OUT */}
                <View className="mb-4">
                    <Text className="mb-2 text-2xl font-bold">
                        {i18n.t("settings.privacy")}
                    </Text>
                    <OptionButton
                        title={i18n.t("settings.privacyPolicy")}
                        rounded
                        onPress={() => router.push("/settings/privacyPolicy")}
                        withArrow
                    />
                </View>

                <Button
                    title={i18n.t("settings.logout")}
                    size="lg"
                    variant="logout"
                    onPress={logout}
                />

                {/* VERSION */}
                <View className="my-4 items-center justify-center">
                    <Text type="secondary" className="text-sm">
                        {i18n.t("settings.version")}
                    </Text>
                    <Text type="secondary" className="text-sm">
                        {i18n.t("settings.location")}
                    </Text>
                </View>
            </ScrollView>
        </View>
    )
}