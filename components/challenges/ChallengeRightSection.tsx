import { View } from "react-native";

import { router } from "expo-router";
import { CameraIcon } from "react-native-heroicons/outline";
import Icon from "@/components/common/Icon";

export default function ChallengeRightSection({ challengeId }: { challengeId: string }) {
    return (
        <View className="pr-2">
            <Icon
                icon={CameraIcon}
                variant="secondary"
                onPress={() => router.push(`/(app)/camera?challenge_id=${challengeId}`)}
            />
        </View>
    )
}
