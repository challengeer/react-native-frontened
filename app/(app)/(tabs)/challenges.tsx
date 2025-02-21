import { View } from "react-native";
import ChallengesHeader from "@/components/challenges/ChallengesHeader";

export default function ChallengesPage() {
    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <ChallengesHeader />
        </View>
    )
}