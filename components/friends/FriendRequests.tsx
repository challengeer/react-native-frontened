import i18n from '@/i18n';
import api from '@/lib/api';
import React, { useCallback, useMemo, useRef } from 'react';
import { useColorScheme } from 'nativewind';
import { Pressable, View, ActivityIndicator } from 'react-native'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import { useQuery } from '@tanstack/react-query';
import UserInterface from '@/types/UserInterface';
import IconCircle from '@/components/common/IconCircle';
import Header from '@/components/common/Header';
import Text from '@/components/common/Text';
import UserItem from '@/components/common/UserItem';
import FriendActionButton from '../common/FriendActionButton';

interface FriendRequest extends UserInterface {
    request_id: string;
}

export default function FriendRequests() {
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["100%"], []);

    const { data: friendRequests, isPending, error, refetch } = useQuery<FriendRequest[]>({
        queryKey: ["friend-requests"],
        queryFn: async () => {
            const response = await api.get("/friends/requests");
            return response.data;
        },
    });

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleModalOpen = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const handleModalClose = useCallback(() => {
        bottomSheetRef.current?.dismiss();
    }, []);

    return (
        <>
            {/* Friend request button for opening modal */}
            <View className="relative">
                <IconCircle icon={UserPlusIcon} onPress={handleModalOpen} />
                {friendRequests && friendRequests.length > 0 &&
                    <Pressable onPress={handleModalOpen} className="absolute -top-1.5 -right-1.5 w-5 h-5 items-center justify-center bg-red-500 rounded-full">
                        <Text className="text-white text-xs font-medium">{friendRequests.length}</Text>
                    </Pressable>
                }
            </View>

            {/* MODAL FOR FRIEND REQUESTS */}
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={0}
                backgroundStyle={{ backgroundColor }}
                enableDynamicSizing={false}
                handleComponent={() => (
                    <Header
                        title={i18n.t("friends.friendRequests")}
                        leftSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={handleModalClose}
                            />
                        }
                    />
                )}
            >
                <BottomSheetScrollView
                    className="flex-1"
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                >
                    {isPending ? (
                        <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
                    ) : error ? (
                        <Text className="p-4">Error</Text>
                    ) : (
                        <>
                            {friendRequests.map((friendRequest: FriendRequest) => (
                                <UserItem
                                    key={friendRequest.request_id}
                                    userId={friendRequest.user_id}
                                    displayName={friendRequest.display_name}
                                    username={friendRequest.username}
                                    profilePicture={friendRequest.profile_picture}
                                    rightSection={
                                        <FriendActionButton
                                            userId={friendRequest.user_id}
                                            requestId={friendRequest.request_id}
                                            friendshipStatus="request_received"
                                        />
                                    }
                                />
                            ))}
                        </>
                    )}
                </BottomSheetScrollView>
            </BottomSheetModal>
        </>
    );
}