import { View, ScrollView, SafeAreaView } from "react-native";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import SettingsItem from "@/components/settings/SettingsItem";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
export default function ChallengeSettings() {

    const settingsItems = [
        {
            title: "Name",
            onPress: () => router.push("/challenge_settings/name"),
        },
        {
            title: "Description",
            onPress: () => router.push("/challenge_settings/description"),
        },
        {
            title: "Participants",
            onPress: () => router.push("/challenge_settings/participants"),
        },
    ]
    return (
        <SafeAreaView className="flex-1">
            <Header title="Challenge Settings" leftSection={<IconCircle icon={ArrowLeftIcon} onPress={() => router.back()} />} />
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
