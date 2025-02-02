import React, { useState } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native'
import Header from '@/components/Header';
import IconCircle from '@/components/IconCircle';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import FriendDisplay from '@/components/friends/FriendDisplay';
import CustomButton from '@/components/CustomButton';
import Icon from '@/components/Icon';
import CustomAvatar from '@/components/CustomAvatar';


interface CountryPickerProps {
    className?: string;
}

export default function FriendInvite({ className }: CountryPickerProps) {
    const countries = require("@/assets/data/countries.json");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);


    return (
        <>
            {/* Friend request button for opening modal */}
            <TouchableOpacity
                onPress={() => setIsModalVisible(true)}
            >
                <View className="relative">
                    <View className="absolute 
                        items-center 
                        justify-center 
                        left-5 
                        bottom-6 
                        bg-red-500 
                        text-white 
                        text-xs 
                        aspect-square 
                        rounded-full 
                        w-5 
                        h-5">
                        9
                    </View> {/* I have no idea how to make a circle responsible but if there is a lot of friend requests we'll just put 9+ there */}
                    <IconCircle icon={UserPlusIcon} size={36} />
                </View>
            </TouchableOpacity>

            {/* MODAL FOR FRIEND REQUESTS */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onShow={() => setSearchQuery("")}
            >
                <View className="flex-1 bg-white dark:bg-neutral-900">
                    {/* Header */}
                    <Header
                        title="Friend Requests"
                        rightSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={() => setIsModalVisible(false)}
                                size={36}
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