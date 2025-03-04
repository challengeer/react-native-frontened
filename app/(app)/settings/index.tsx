import i18n from "@/i18n";
import api from "@/lib/api";
// import * as Application from "expo-application";
import React, { useCallback } from "react";
import { useAuth } from "@/components/context/AuthProvider";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useQueryClient } from "@tanstack/react-query";
import Text from "@/components/common/Text";
import OptionButton from "@/components/settings/SettingsItem";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Button from "@/components/common/Button";
import Avatar from "@/components/common/Avatar";
import useImagePicker from "@/components/settings/imagePicker";

export default function SettingsPage() {
    const { user, logout, refreshUser } = useAuth();
    const queryClient = useQueryClient();

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

    const accountSettings = [
        {
            key: "profilePicture",
            rightSection: (
                <Avatar
                    name={user?.display_name || ""}
                    size="sm"
                    source={user?.profile_picture}
                />
            ),
            onPress: pickImage,
        },
        {
            key: "displayName",
            rightSection: user?.display_name || "",
            onPress: () => router.push("/settings/name"),
        },
        {
            key: "username",
            rightSection: user?.username || "",
            onPress: () => router.push("/settings/username"),
        },
        {
            key: "phoneNumber",
            rightSection: user?.phone_number || "",
            onPress: () => router.push("/settings/mobile"),
        },
        {
            key: "email",
            rightSection: user?.email || "",
            onPress: () => router.push("/settings/email"),
        },
        {
            key: "password",
            onPress: () => router.push("/settings/password"),
        },
        {
            key: "appearance",
            onPress: () => router.push("/settings/app_appearance"),
        },
        {
            key: "language",
            onPress: () => router.push("/settings/language"),
        },
    ];

    return (
        <SafeAreaView className="flex-1">
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
                <Text className="mb-2 text-lg font-bold">
                    {i18n.t("settings.account.title")}
                </Text>

                <View className="mb-4">
                    {accountSettings.map((item, index) => (
                        <OptionButton
                            key={item.key}
                            itemIndex={index}
                            totalItems={accountSettings.length}
                            title={i18n.t(`settings.account.${item.key}.header`)}
                            rightSection={item.rightSection}
                            onPress={item.onPress}
                            showArrow
                        />
                    ))}
                </View>

                <Text className="mb-2 text-lg font-bold">
                    {i18n.t("settings.privacy.title")}
                </Text>

                <View className="mb-4">
                    <OptionButton
                        itemIndex={0}
                        totalItems={1}
                        title={i18n.t("settings.privacy.privacyPolicy.header")}
                        showArrow
                    />
                </View>

                <Button
                    title={i18n.t("buttons.logout")}
                    size="lg"
                    variant="logout"
                    onPress={logout}
                />

                {/* VERSION */}
                <View className="my-4 items-center justify-center">
                    <Text type="secondary" className="text-sm">
                        {i18n.t("settings.version")}
                        {/* {i18n.t("settings.version", { version: Application.nativeApplicationVersion })} */}
                    </Text>
                    <Text type="secondary" className="text-sm">
                        {i18n.t("settings.location")}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}