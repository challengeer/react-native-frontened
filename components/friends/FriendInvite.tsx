import React, { useState } from 'react';
import { Modal, Pressable, View } from 'react-native'
import Header from '@/components/Header';
import IconCircle from '@/components/IconCircle';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import FriendDisplay from '@/components/friends/FriendDisplay';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import CustomAvatar from '@/components/CustomAvatar';
import Text from '@/components/Text';

export default function FriendInvite() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    return (
        <>
            {/* Friend request button for opening modal */}
            <View className="relative">
                <IconCircle icon={UserPlusIcon} onPress={() => setIsModalVisible(true)} />
                <Pressable onPress={() => setIsModalVisible(true)} className="z-50 absolute -top-1.5 -right-1.5 w-5 h-5 items-center justify-center bg-red-500 rounded-full">
                    <Text className="text-neutral-100 text-xs font-medium">9</Text>
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
                        rightSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={() => setIsModalVisible(false)}
                            />
                        }
                    />

                    <View className="px-4 gap-3 flex-1">
                        <FriendDisplay rightSection={
                            <View className="flex-row gap-2 items-center">
                                <CustomButton title="Accept" leftSection={
                                    <Icon icon={UserPlusIcon} lightColor="white" darkColor="white" size={16} />
                                } />
                                <Icon icon={XMarkIcon} />
                            </View>
                        }
                            leftSection={
                                <CustomAvatar />
                            } />
                    </View>
                </View>
            </Modal>
        </>
    );
}