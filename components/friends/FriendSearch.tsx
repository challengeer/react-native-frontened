import React, { useState } from 'react';
import { Modal, View } from 'react-native'
import i18n from '@/i18n';
import SearchBar from '@/components/SearchBar';
import Text from '@/components/Text';
import IconCircle from '@/components/IconCircle';
import { XMarkIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import FriendDisplay from '@/components/friends/FriendDisplay';
import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import CustomAvatar from '@/components/CustomAvatar';

interface FriendSearchProps {
    className?: string;
}

export default function FriendSearch({ className }: FriendSearchProps) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);


    return (
        <>
            {/* Prefix Selector Button */}
            <IconCircle icon={MagnifyingGlassIcon} onPress={() => setIsModalVisible(true)} />

            {/* Modal to select country prefix */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onShow={() => setSearchQuery("")}
            >
                <View className="bg-white dark:bg-neutral-900">
                    <View className="px-4 py-4 gap-3">
                        {/* Search Bar */}
                        <View className="flex-row items-center gap-2 justify-between">
                            <View className="flex-1">
                                <SearchBar
                                    onSearch={setSearchQuery}
                                    onCancel={() => setSearchQuery("")}
                                />
                            </View>
                            <Text
                                onPress={() => {
                                    setIsModalVisible(false);
                                }}
                            >
                                {i18n.t("searchBar.cancel")}
                            </Text>
                        </View>
                        <View className="gap-3 flex-1">
                            <FriendDisplay rightSection={
                                <View className="flex-row gap-2 items-center">
                                    <Button size="sm" title="Invite" leftSection={
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
                </View>
            </Modal >
        </>
    );
}