import { View } from "react-native";
import { XMarkIcon } from "react-native-heroicons/outline";
import { useChallengeActions } from "@/hooks/useChallengeActions";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";

export default function ChallengeActionButton({ invitationId }: { invitationId: string }) {
    const { acceptInvite, rejectInvite } = useChallengeActions();

    return (
        <View className="flex-row items-center gap-3">
            <Button
                size="sm"
                variant="primary"
                title="Join"
                onPress={() => invitationId && acceptInvite.mutate(invitationId)}
            />
            <Icon
                icon={XMarkIcon}
                variant="secondary"
                onPress={() => invitationId && rejectInvite.mutate(invitationId)}
            />
        </View>
    )
}