import i18n from "@/i18n";
import { router, useLocalSearchParams } from "expo-router";
import React, { View, ScrollView } from "react-native";
import { ArrowLeftIcon, EllipsisHorizontalIcon } from "react-native-heroicons/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import SettingsItem from "@/components/settings/SettingsItem";

export default function ChallengeSettings() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const queryClient = useQueryClient();

    const settingsItems = [
        {
            title: i18n.t("challenge_settings.name.title"),
            onPress: () => router.push(`/challenge_settings/name?challenge_id=${challenge_id}`),
        },
        {
            title: i18n.t("challenge_settings.description.title"),
            onPress: () => router.push(`/challenge_settings/description?challenge_id=${challenge_id}`),
        },
        {
            title: i18n.t("challenge_settings.participants.title"),
            onPress: () => router.push(`/challenge_settings/participants?challenge_id=${challenge_id}`),
        },
    ]

    const deleteChallenge = useMutation({
        mutationFn: async () => {
            await api.delete(`/challenges/${challenge_id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            router.replace("/(app)/(tabs)/challenges");
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <>
            <Header
                title={i18n.t("challenge_settings.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
                rightSection={
                    <IconCircle
                        icon={EllipsisHorizontalIcon}
                        onPress={() => router.push(`/challenge_settings/participants?challenge_id=${challenge_id}`)}
                    />
                }
            />

            <ScrollView className="px-4 pt-2">
                <View className="mb-4">
                    {settingsItems.map((item, index) => (
                        <SettingsItem
                            key={index}
                            itemIndex={index}
                            totalItems={settingsItems.length}
                            title={item.title}
                            onPress={item.onPress}
                            showArrow
                        />
                    ))}
                </View>

                <SettingsItem
                    itemIndex={0}
                    totalItems={1}
                    title={i18n.t("challenge_settings.delete.title")}
                    onPress={() => deleteChallenge.mutate()}
                    showArrow
                />
            </ScrollView>
        </>
    )
}
