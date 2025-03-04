import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Text from "@/components/common/Text";

export default function ChallengePage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();

    return (
        <SafeAreaView className="flex-1">
            <Text>Challenge: {challenge_id}</Text>
        </SafeAreaView>
    )
}