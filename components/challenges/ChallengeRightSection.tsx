import { router } from "expo-router";
import { CameraIcon } from "react-native-heroicons/outline";
import { CheckCircleIcon, XCircleIcon } from "react-native-heroicons/solid";
import { ChallengeCompletionStatus } from "@/types/challenge";
import Icon from "@/components/common/Icon";

interface ChallengeRightSectionProps {
    challengeId: string;
    completionStatus: ChallengeCompletionStatus;
}

export default function ChallengeRightSection({ challengeId, completionStatus }: ChallengeRightSectionProps) {
    if (completionStatus === 'completed') {
        return (
            <Icon
                icon={CheckCircleIcon}
                lightColor="#a855F7"
                darkColor="#a855F7"
                // className="pr-2"
            />
        )
    }

    if (completionStatus === 'failed') {
        return (
            <Icon
                icon={XCircleIcon}
                variant="secondary"
                // className="pr-2"
            />
        )
    }

    if (completionStatus === 'not_started') {
        return (
            <Icon
                icon={CameraIcon}
                variant="secondary"
                // className="pr-2"
                onPress={() => router.push(`/(app)/camera?challenge_id=${challengeId}`)}
            />
        )
    }

    return null;
}
