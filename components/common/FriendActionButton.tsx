import i18n from '@/i18n';
import { View } from 'react-native';
import { UserPlusIcon, XMarkIcon } from "react-native-heroicons/solid";
import { CheckCircleIcon } from "react-native-heroicons/outline";
import { FriendshipStatus } from "@/types/FriendshipTypes";
import { useFriendActions } from '@/lib/hooks/useFriendActions';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';

interface FriendActionButtonProps {
    userId: string;
    requestId?: string;
    friendshipStatus: FriendshipStatus;
}

export default function FriendActionButton({
    userId,
    requestId,
    friendshipStatus,
}: FriendActionButtonProps) {
    const { addFriend, acceptRequest, rejectRequest } = useFriendActions();

    if (friendshipStatus === "friends") {
        return null;
    }

    if (friendshipStatus === "request_sent") {
        return (
            <Button
                size="sm"
                variant="secondary"
                title={i18n.t("friendActionButton.added")}
                leftSection={
                    <Icon
                        icon={CheckCircleIcon}
                        lightColor="black"
                        darkColor="white"
                    />
                }
            />
        );
    }

    if (friendshipStatus === "request_received") {
        return (
            <View className="flex-row items-center gap-2">
                <Button
                    size="sm"
                    title={i18n.t("friendActionButton.accept")}
                    onPress={() => requestId && acceptRequest.mutate(requestId)}
                    leftSection={
                        <Icon
                            icon={UserPlusIcon}
                            lightColor="white"
                            darkColor="white"
                        />
                    }
                />
                <Icon
                    icon={XMarkIcon}
                    onPress={() => requestId && rejectRequest.mutate(requestId)}
                />
            </View>
        );
    }

    return (
        <Button
            size="sm"
            title={i18n.t("friendActionButton.add")}
            onPress={() => addFriend.mutate(userId)}
            leftSection={
                <Icon
                    icon={UserPlusIcon}
                    lightColor="white"
                    darkColor="white"
                />
            }
        />
    );
} 