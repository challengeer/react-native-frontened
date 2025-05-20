import i18n from '@/i18n';
import { Linking, View } from 'react-native';
import { UserPlusIcon, XMarkIcon } from "react-native-heroicons/solid";
import { CheckCircleIcon } from "react-native-heroicons/outline";
import { useFriends } from '@/hooks/useFriends';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import Text from '@/components/common/Text';

interface FriendActionButtonProps {
    userId: string;
    requestId?: string;
    phoneNumber?: string;
    mutualStreak?: number;
    friendshipStatus: "none" | "request_sent" | "request_received" | "friends" | "contact";
}

export default function FriendActionButton({
    userId,
    requestId,
    phoneNumber,
    mutualStreak,
    friendshipStatus,
}: FriendActionButtonProps) {
    const { addFriend, isAddingFriend, acceptRequest, isAcceptingRequest, rejectRequest, isRejectingRequest } = useFriends();

    if (friendshipStatus === "friends") {
        return (
            <Text className="font-semibold">{mutualStreak}🔥</Text>
        );
    }

    if (friendshipStatus === "contact") {
        const handleInvite = async (phoneNumber: string) => {
            const message = i18n.t("auth.contacts.inviteMessage", { phoneNumber });
            const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
            Linking.openURL(smsUrl);
        };

        return (
            <Button
                size="sm"
                title={i18n.t("auth.contacts.invite")}
                onPress={() => phoneNumber && handleInvite(phoneNumber)}
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
                    onPress={() => requestId && acceptRequest(requestId)}
                    loading={isAcceptingRequest}
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
                    onPress={() => requestId && rejectRequest(requestId)}
                />
            </View>
        );
    }

    return (
        <Button
            size="sm"
            title={i18n.t("friendActionButton.add")}
            onPress={() => addFriend(userId)}
            loading={isAddingFriend}
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