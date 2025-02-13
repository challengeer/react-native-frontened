import i18n from '@/i18n';
import api from '@/lib/api';
import { useState } from 'react';
import { Modal, Pressable, View, ScrollView, ActivityIndicator } from 'react-native'
import { XMarkIcon } from 'react-native-heroicons/outline';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import { useQuery } from '@tanstack/react-query';
import UserInterface from '@/types/UserInterface';
import IconCircle from '@/components/IconCircle';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import UserItem from '@/components/UserItem';

export default function FriendRequests() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const { data, isPending, error } = useQuery<UserInterface[]>({
        queryKey: ["friend-requests"],
        queryFn: async () => {
            const response = await api.get("/users/3/requests");
            return response.data;
        },
    });

    return (
        <>
            {/* Friend request button for opening modal */}
            <View className="relative">
                <IconCircle icon={UserPlusIcon} onPress={() => setIsModalVisible(true)} />
                {data && data.length > 0 &&
                    <Pressable onPress={() => setIsModalVisible(true)} className="absolute -top-1.5 -right-1.5 w-5 h-5 items-center justify-center bg-red-500 rounded-full">
                        <Text className="text-white text-xs font-medium">{data.length}</Text>
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
                    {/* Header */}
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
                            {data.map((user) => (
                                <UserItem
                                    key={user.user_id}
                                    userId={user.user_id}
                                    displayName={user.display_name}
                                    username={user.username}
                                    profilePicture={user.profile_picture}
                                    rightSection={
                                        <View className="flex-row gap-2 items-center">
                                            <Button
                                                size="sm"
                                                title="Accept"
                                                leftSection={
                                                    <Icon
                                                        icon={UserPlusIcon}
                                                        lightColor="white"
                                                        darkColor="white"
                                                    />
                                                } />
                                            <Icon icon={XMarkIcon} />
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