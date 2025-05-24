import { ActivityIndicator, View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useChallenges } from "@/hooks/useChallenges";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";

export default function ChallengeActionButton({ invitationId }: { invitationId: string }) {
    const { acceptChallengeInvite, rejectChallengeInvite, isAcceptingChallengeInvite, isRejectingChallengeInvite } = useChallenges();

    return (
        <View className="flex-row items-center gap-3">
            <Button
                size="sm"
                variant="primary"
                title="Join"
                onPress={() => invitationId && acceptChallengeInvite(invitationId)}
                loading={isAcceptingChallengeInvite}
            />
            {isRejectingChallengeInvite ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <Icon
                    icon={XMarkIcon}
                    variant="secondary"
                    onPress={() => invitationId && rejectChallengeInvite(invitationId)}
                />
            )}
        </View>
    )
}