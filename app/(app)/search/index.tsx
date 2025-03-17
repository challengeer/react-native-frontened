import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, TextInput, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FriendshipStatus } from "@/types/FriendshipTypes";
import UserInterface from "@/types/UserInterface";
import UserItem from "@/components/common/UserItem";
import SearchBar from "@/components/common/SearchBar";
import Text from "@/components/common/Text";
import FriendActionButton from "@/components/common/FriendActionButton";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";

interface SearchResult extends UserInterface {
    request_id?: string;
    friendship_status: FriendshipStatus;
}

interface SearchResults {
    friends: SearchResult[];
    request_sent: SearchResult[];
    request_received: SearchResult[];
    none: SearchResult[];
}

export default function FriendSearch() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchInputRef = useRef<TextInput>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    const { data: searchResults, isPending, isError, refetch } = useQuery<SearchResults>({
        queryKey: ["user-search", searchQuery],
        queryFn: async () => {
            const response = await api.get(`/user/search?q=${encodeURIComponent(searchQuery)}`);
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <SafeAreaView className="flex-1">
            <View className="px-4 h-16 w-full flex-row items-center gap-4">
                <SearchBar
                    onSearch={handleSearch}
                    inputRef={searchInputRef}
                />
                <Text
                    className="font-medium"
                    onPress={() => {
                        setSearchQuery("");
                        router.back();
                    }} >
                    {i18n.t("searchBar.cancel")}
                </Text>
            </View>

            {isPending ? (
                <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />
            ) : isError ? (
                <NetworkErrorContainer onRetry={refetch} />
            ) : (
                <ScrollView
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="gap-4">
                        {searchResults?.friends.length > 0 && (
                            <View>
                                <Text className="px-4 pb-2 text-lg font-bold">{i18n.t("userSearch.friends")}</Text>
                                {searchResults?.friends.map((user: SearchResult, index: number) => (
                                    <UserItem
                                        key={user.user_id}
                                        index={index}
                                        userId={user.user_id}
                                        title={user.display_name}
                                        subtitle={`@${user.username}`}
                                        name={user.display_name}
                                        profilePicture={user.profile_picture}
                                        rightSection={
                                            <FriendActionButton
                                                userId={user.user_id}
                                                requestId={user.request_id}
                                                friendshipStatus={user.friendship_status}
                                            />
                                        }
                                    />
                                ))}
                            </View>
                        )}

                        {searchResults?.request_sent.length > 0 && (
                            <View>
                                <Text className="px-4 pb-2 text-lg font-bold">{i18n.t("userSearch.request_sent")}</Text>
                                {searchResults?.request_sent.map((user: SearchResult, index: number) => (
                                    <UserItem
                                        key={user.user_id}
                                        index={index}
                                        userId={user.user_id}
                                        title={user.display_name}
                                        subtitle={`@${user.username}`}
                                        name={user.display_name}
                                        profilePicture={user.profile_picture}
                                        rightSection={
                                            <FriendActionButton
                                                userId={user.user_id}
                                                requestId={user.request_id}
                                                friendshipStatus={user.friendship_status}
                                            />
                                        }
                                    />
                                ))}
                            </View>
                        )}

                        {searchResults?.request_received.length > 0 && (
                            <View>
                                <Text className="px-4 pb-2 text-lg font-bold">{i18n.t("userSearch.request_received")}</Text>
                                {searchResults?.request_received.map((user: SearchResult, index: number) => (
                                    <UserItem
                                        key={user.user_id}
                                        index={index}
                                        userId={user.user_id}
                                        title={user.display_name}
                                        subtitle={`@${user.username}`}
                                        name={user.display_name}
                                        profilePicture={user.profile_picture}
                                        rightSection={
                                            <FriendActionButton
                                                userId={user.user_id}
                                                requestId={user.request_id}
                                                friendshipStatus={user.friendship_status}
                                            />
                                        }
                                    />
                                ))}
                            </View>
                        )}

                        {searchResults?.none.length > 0 && (
                            <View>
                                <Text className="px-4 pb-2 text-lg font-bold">{i18n.t("userSearch.more_results")}</Text>
                                {searchResults?.none.map((user: SearchResult, index: number) => (
                                    <UserItem
                                        key={user.user_id}
                                        index={index}
                                        userId={user.user_id}
                                        title={user.display_name}
                                        subtitle={`@${user.username}`}
                                        name={user.display_name}
                                        profilePicture={user.profile_picture}
                                        rightSection={
                                            <FriendActionButton
                                                userId={user.user_id}
                                                requestId={user.request_id}
                                                friendshipStatus={user.friendship_status}
                                            />
                                        }
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}