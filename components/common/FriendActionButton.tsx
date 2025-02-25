import React from 'react';
import { View } from 'react-native';
import { UserPlusIcon, CheckIcon, XMarkIcon } from "react-native-heroicons/solid";
import { FriendshipStatus } from "@/types/FriendshipTypes";
import { useFriendActions } from '@/lib/hooks/useFriendActions';
import Button from './Button';
import Icon from './Icon';

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
                title="Added"
                leftSection={
                    <Icon
                        icon={CheckIcon}
                        lightColor="white"
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
                    title="Accept"
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
            title="Add"
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