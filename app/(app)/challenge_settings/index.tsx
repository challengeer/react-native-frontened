import { View } from "react-native";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { router } from "expo-router";
export default function ChallengeSettings() {
    return (
        <View>
            <Header title="Challenge Settings" leftSection={<IconCircle icon={ArrowLeftIcon} onPress={() => router.back()} />} />
            <Text>Challenge Settings</Text>
        </View>
    )
}
