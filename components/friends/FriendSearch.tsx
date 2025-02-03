import i18n from '@/i18n';
import { useEffect, useState, useRef } from 'react';
import { Modal, ScrollView, View, TextInput } from 'react-native'
import { XMarkIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import IconCircle from '@/components/IconCircle';
import Icon from '@/components/Icon';
import Button from '@/components/Button';
import UserInterface from '@/types/UserInterface';
import UserItem from '@/components/UserItem';
import SearchBar from '@/components/SearchBar';
import Text from '@/components/Text';

export default function FriendSearch() {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [users, setUsers] = useState<UserInterface[]>([]);
    const searchInputRef = useRef<TextInput>(null);

    useEffect(() => {
        fetch("https://challengeer.srodo.sk/users/")
            .then(res => res.json())
            .then(data => setUsers(data))
    }, [])

    return (
        <>
            {/* Prefix Selector Button */}
            <IconCircle icon={MagnifyingGlassIcon} onPress={() => setIsModalVisible(true)} />

            {/* Modal to select country prefix */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setIsModalVisible(false)}
                onShow={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                }}
            >
                <View className="flex-1 bg-white dark:bg-neutral-900">
                    <View className="p-4 w-full flex-row items-center gap-4">
                        <SearchBar
                            onSearch={setSearchQuery}
                            inputRef={searchInputRef}
                        />
                        <Text onPress={() => setIsModalVisible(false)} >
                            {i18n.t("searchBar.cancel")}
                        </Text>
                    </View>

                    <ScrollView
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                    >
                        {users.map((user) => (
                            <UserItem
                                key={user.user_id}
                                displayName={user.display_name}
                                username={user.username}
                                rightSection={
                                    <View className="flex-row gap-2 items-center">
                                        <Button
                                            size="sm"
                                            title="Add"
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
            </Modal >
        </>
    );
}