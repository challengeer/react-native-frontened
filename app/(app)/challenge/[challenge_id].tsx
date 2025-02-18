import { View } from "react-native";
import Text from "@/components/common/Text";
import { useLocalSearchParams } from "expo-router";

export default function ChallengePage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Text>Challenge: {challenge_id}</Text>
        </View>
    )
}