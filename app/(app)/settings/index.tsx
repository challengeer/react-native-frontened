import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useCallback } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { router } from "expo-router";
import { ScrollView, View, Linking } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useQueryClient } from "@tanstack/react-query";
import * as Application from "expo-application";
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
                    size="xxs"
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
        // {
        //     key: "phoneNumber",
        //     rightSection: user?.phone_number || "",
        //     onPress: () => router.push("/settings/mobile"),
        // },
        // {
        //     key: "email",
        //     rightSection: user?.email || "",
        //     onPress: () => router.push("/settings/email"),
        // },
        // {
        //     key: "password",
        //     onPress: () => router.push("/settings/password"),
        // },
        {
            key: "appearance",
            onPress: () => router.push("/settings/app_appearance"),
        },
        {
            key: "language",
            onPress: () => router.push("/settings/language"),
        },
        {
            key: "deleteAccount",
            onPress: () => {
                console.log("delete account");
            },
        }
    ];

    const privacySettings = [
        {
            key: "blockedUsers",
            onPress: () => router.push("/settings/blocked_users"),
        },
        {
            key: "contactSyncing",
            onPress: () => router.push("/settings/contact_syncing"),
        }
    ];

    const legalSettings = [
        {
            key: "privacyPolicy",
            onPress: () => Linking.openURL("https://challengeer.app/privacy-policy"),
        },
        {
            key: "termsOfService",
            onPress: () => Linking.openURL("https://challengeer.app/terms-of-service"),
        }
    ]

    return (
        <>
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
                className="px-4 pt-2"
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

                <View className="mb-8">
                    {privacySettings.map((item, index) => (
                        <OptionButton
                            key={item.key}
                            itemIndex={index}
                            totalItems={privacySettings.length}
                            title={i18n.t(`settings.privacy.${item.key}.header`)}
                            onPress={item.onPress}
                            showArrow
                        />
                    ))}
                </View>

                <Text className="mb-2 text-lg font-bold">
                    {i18n.t("settings.legal.title")}
                </Text>

                <View className="mb-8">
                    {legalSettings.map((item, index) => (
                        <OptionButton
                            key={item.key}
                            itemIndex={index}
                            totalItems={legalSettings.length}
                            title={i18n.t(`settings.legal.${item.key}.header`)}
                            onPress={item.onPress}
                            showArrow
                        />
                    ))}
                </View>

                <Button
                    title={i18n.t("buttons.logout")}
                    variant="logout"
                    onPress={logout}
                />

                {/* VERSION */}
                <View className="my-4 items-center justify-center">
                    <Text type="secondary" className="text-sm">
                        {i18n.t("settings.version", { version: Application.nativeApplicationVersion })}
                    </Text>
                    <Text type="secondary" className="text-sm">
                        {i18n.t("settings.location")}
                    </Text>
                </View>
            </ScrollView>
        </>
    );
}