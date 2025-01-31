import Text from "@/components/Text";
import { useLocalSearchParams } from "expo-router";

export default function ChallengePage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();

    return (
        <Text>Challenge: {challenge_id}</Text>
    )
}