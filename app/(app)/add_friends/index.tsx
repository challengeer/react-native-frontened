import i18n from "@/i18n";
import { useState } from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { XMarkIcon } from "react-native-heroicons/outline";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import FriendRequestsList from "@/components/friends/FriendRequestsList";
import SearchBar from "@/components/common/SearchBar";

export default function AddFriends() {
    const [search, setSearch] = useState("");
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1" style={{ paddingTop: insets.top }}>
            <Header
                title={i18n.t("friends.addFriends")}
                leftSection={
                    <IconCircle
                        icon={XMarkIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <SearchBar
                onSearch={setSearch}
                className="mx-4 mt-2"
            />
            <FriendRequestsList search={search} />
        </View>
    );
}