import { useEffect, useState } from 'react';
import { Modal, Pressable, View, ScrollView } from 'react-native'
import { XMarkIcon } from 'react-native-heroicons/outline';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import IconCircle from '@/components/IconCircle';
import Header from '@/components/Header';
import CustomButton from '@/components/Button';
import Icon from '@/components/Icon';
import Text from '@/components/Text';
import UserItem from '../UserItem';

interface Friend {
    user_id: number;
    display_name: string;
    username: string;
}

export default function FriendInvite() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [requests, setRequests] = useState<Friend[]>([]);

    useEffect(() => {
        fetch("https://challengeer.srodo.sk/users/1/requests")
            .then(res => res.json())
            .then(data => setRequests(data))
    }, [])

    return (
        <>
            {/* Friend request button for opening modal */}
            <View className="relative">
                <IconCircle icon={UserPlusIcon} onPress={() => setIsModalVisible(true)} />
                <Pressable onPress={() => setIsModalVisible(true)} className="absolute -top-1.5 -right-1.5 w-5 h-5 items-center justify-center bg-red-500 rounded-full">
                    <Text className="text-white text-xs font-medium">9</Text>
                </Pressable>
            </View>

            {/* MODAL FOR FRIEND REQUESTS */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
            >
                <View className="flex-1 bg-white dark:bg-neutral-900">
                    {/* Header */}
                    <Header
                        title="Friend Requests"
                        leftSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={() => setIsModalVisible(false)}
                            />
                        }
                    />

                    <ScrollView
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                    >
                        {requests.map(user => (
                            <UserItem
                                key={user.user_id}
                                displayName={user.display_name}
                                username={user.username}
                                rightSection={
                                    <View className="flex-row gap-2 items-center">
                                        <CustomButton
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
                </View>
            </Modal>
        </>
    );
}