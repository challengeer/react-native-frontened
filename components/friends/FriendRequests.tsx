import i18n from '@/i18n';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'nativewind';
import { Pressable, View } from 'react-native'
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { UserPlusIcon } from 'react-native-heroicons/solid';
import { useFriends } from '@/hooks/useFriends';
import IconCircle from '@/components/common/IconCircle';
import Header from '@/components/common/Header';
import Text from '@/components/common/Text';
import FriendRequestsList from '@/components/friends/FriendRequestsList';
import SearchBar from '@/components/common/SearchBar';

export default function FriendRequests() {
    const [search, setSearch] = useState<string>("");
    const { colorScheme } = useColorScheme();
    const { friendRequests } = useFriends();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";
    const insets = useSafeAreaInsets();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["100%"], []);

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
                        style={{ marginTop: insets.top }}
                        leftSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={handleModalClose}
                            />
                        }
                    />
                )}
            >
                <SearchBar
                    onSearch={setSearch}
                    className="mx-4 my-2"
                />
                <FriendRequestsList search={search} />
            </BottomSheetModal>
        </>
    );
}