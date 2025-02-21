import i18n from '@/i18n';
import api from '@/lib/api';
import React, { useState } from 'react';
import { Modal, Pressable, View, ScrollView, ActivityIndicator } from 'react-native'
import { XMarkIcon } from 'react-native-heroicons/outline';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserInterface from '@/types/UserInterface';
import IconCircle from '@/components/common/IconCircle';
import Header from '@/components/common/Header';
import Button from '@/components/common/Button';
import Icon from '@/components/common/Icon';
import Text from '@/components/common/Text';
import UserItem from '@/components/common/UserItem';

export default function FriendRequests() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const { data: friendRequests, isPending, error } = useQuery({
        queryKey: ["friend-requests"],
        queryFn: async () => {
            const response = await api.get("/friends/requests");
            return response.data;
        },
    });

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['friend-requests'] });
        queryClient.invalidateQueries({ queryKey: ['friends'] });
    }

    const acceptMutation = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/accept", { request_id: requestId });
        },
        onSuccess: invalidateQueries,
    });

    const rejectMutation = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/reject", { request_id: requestId });
        },
        onSuccess: invalidateQueries,
    });

    return (
        <>
            {/* Friend request button for opening modal */}
            <View className="relative">
                <IconCircle icon={UserPlusIcon} onPress={() => setIsModalVisible(true)} />
                {friendRequests && friendRequests.length > 0 &&
                    <Pressable onPress={() => setIsModalVisible(true)} className="absolute -top-1.5 -right-1.5 w-5 h-5 items-center justify-center bg-red-500 rounded-full">
                        <Text className="text-white text-xs font-medium">{friendRequests.length}</Text>
                    </Pressable>
                }
            </View>

            {/* MODAL FOR FRIEND REQUESTS */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View className="flex-1 bg-white dark:bg-neutral-900">
                    <Header
                        title={i18n.t("friends.friendRequests")}
                        leftSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={() => setIsModalVisible(false)}
                            />
                        }
                    />

                    {isPending ? (
                        <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
                    ) : error ? (
                        <Text className="p-4">Error</Text>
                    ) : (
                        <ScrollView
                            overScrollMode="never"
                            showsVerticalScrollIndicator={false}
                        >
                            {friendRequests.map((user: UserInterface) => (
                                <UserItem
                                    key={user.request_id}
                                    userId={user.user_id}
                                    displayName={user.display_name}
                                    username={user.username}
                                    profilePicture={user.profile_picture}
                                    rightSection={
                                        <View className="flex-row gap-2 items-center">
                                            <Button
                                                size="sm"
                                                title="Accept"
                                                loading={acceptMutation.isPending && acceptMutation.variables === user.request_id}
                                                onPress={() => acceptMutation.mutate(user.request_id)}
                                                leftSection={
                                                    <Icon
                                                        icon={UserPlusIcon}
                                                        lightColor="white"
                                                        darkColor="white"
                                                    />
                                                } />
                                            <Icon
                                                icon={XMarkIcon}
                                                onPress={() => rejectMutation.mutate(user.request_id)}
                                            />
                                        </View>
                                    }
                                />
                            ))}
                        </ScrollView>
                    )}
                </View>
            </Modal>
        </>
    );
}