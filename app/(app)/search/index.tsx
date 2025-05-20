import i18n from "@/i18n";
import { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { View, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/common/SearchBar";
import Text from "@/components/common/Text";
import FriendRequestsList from "@/components/friends/FriendRequestsList";

export default function FriendSearch() {
    const [search, setSearch] = useState<string>("");
    const searchInputRef = useRef<TextInput>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);

        return () => clearTimeout(timeout);
    }, []);


    return (
        <SafeAreaView className="flex-1">
            <View className="px-4 h-16 w-full flex-row items-center gap-4">
                <SearchBar
                    onSearch={setSearch}
                    inputRef={searchInputRef}
                    className="flex-1"
                />
                <Text
                    className="font-medium"
                    onPress={() => {
                        setSearch("");
                        router.back();
                    }}
                >
                    {i18n.t("searchBar.cancel")}
                </Text>
            </View>

            <FriendRequestsList search={search} />
        </SafeAreaView>
    );
}