import i18n from '@/i18n';
import api from '@/lib/api';
import React, { useCallback, useState } from 'react';
import { Modal, Pressable, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native'
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

interface FriendRequest extends UserInterface {
    request_id: string;
}

export default function FriendRequests() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const { data: friendRequests, isPending, error, refetch } = useQuery({
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
        onMutate: async (requestId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['friend-requests'] });
            
            // Snapshot the previous value
            const previousRequests = queryClient.getQueryData(['friend-requests']);
            
            // Optimistically update friend requests
            queryClient.setQueryData(['friend-requests'], (old: FriendRequest[]) => 
                old.filter(request => request.request_id !== requestId)
            );
            
            return { previousRequests };
        },
        onError: (err, requestId, context) => {
            // Rollback on error
            queryClient.setQueryData(['friend-requests'], context?.previousRequests);
        },
        onSettled: invalidateQueries,
    });

    const rejectMutation = useMutation({
        mutationFn: async (requestId: string) => {
            await api.put("/friends/reject", { request_id: requestId });
        },
        onMutate: async (requestId) => {
            await queryClient.cancelQueries({ queryKey: ['friend-requests'] });
            const previousRequests = queryClient.getQueryData(['friend-requests']);
            
            queryClient.setQueryData(['friend-requests'], (old: FriendRequest[]) => 
                old.filter(request => request.request_id !== requestId)
            );
            
            return { previousRequests };
        },
        onError: (err, requestId, context) => {
            queryClient.setQueryData(['friend-requests'], context?.previousRequests);
        },
        onSettled: invalidateQueries,
    });

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

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
                            refreshControl={
                                <RefreshControl
                                    refreshing={isPending}
                                    onRefresh={handleRefresh}
                                />
                            }
                        >
                            {friendRequests.map((friendRequest: FriendRequest) => (
                                <UserItem
                                    key={friendRequest.request_id}
                                    userId={friendRequest.user_id}
                                    displayName={friendRequest.display_name}
                                    username={friendRequest.username}
                                    profilePicture={friendRequest.profile_picture}
                                    rightSection={
                                        <View className="flex-row gap-2 items-center">
                                            <Button
                                                size="sm"
                                                title="Accept"
                                                onPress={() => acceptMutation.mutate(friendRequest.request_id)}
                                                leftSection={
                                                    <Icon
                                                        icon={UserPlusIcon}
                                                        lightColor="white"
                                                        darkColor="white"
                                                    />
                                                } />
                                            <Icon
                                                icon={XMarkIcon}
                                                onPress={() => rejectMutation.mutate(friendRequest.request_id)}
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