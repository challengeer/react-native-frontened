import i18n from "@/i18n";
import { router, useLocalSearchParams } from "expo-router";
import { View, ScrollView, SafeAreaView } from "react-native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useQuery } from "@tanstack/react-query";
import { Challenge } from "@/types/Challenge";
import api from "@/lib/api";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import SettingsItem from "@/components/settings/SettingsItem";

export default function ChallengeSettings() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();

    const { data: challenge } = useQuery<Challenge>({
        queryKey: ["challenge", challenge_id],
        queryFn: async () => {
            const response = await api.get(`/challenges/${challenge_id}`);
            return response.data;
        }
    });

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

    return (
        <SafeAreaView className="flex-1">
            <Header title={i18n.t("challenge_settings.header")} leftSection={<IconCircle icon={ArrowLeftIcon} onPress={() => router.back()} />} />
            <ScrollView className="px-4">
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
            </ScrollView>
        </SafeAreaView>
    )
}
