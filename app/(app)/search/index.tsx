import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, TextInput, ActivityIndicator } from "react-native"
import { router } from "expo-router";
import { FriendshipStatus } from "@/types/FriendshipTypes";
import UserInterface from "@/types/UserInterface";
import UserItem from "@/components/common/UserItem";
import SearchBar from "@/components/common/SearchBar";
import Text from "@/components/common/Text";
import FriendActionButton from "@/components/common/FriendActionButton";

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
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    }, []);

    const { data: searchResults, isPending, error } = useQuery<SearchResults>({
        queryKey: ["user-search", searchQuery],
        queryFn: async () => {
            const response = await api.get(`/user/search?q=${encodeURIComponent(searchQuery)}`);
            return response.data;
        },
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    return (
        <View className="flex-1">
            <View className="px-4 h-20 w-full flex-row items-center gap-4">
                <SearchBar
                    onSearch={handleSearch}
                    inputRef={searchInputRef}
                />
                <Text onPress={() => {
                    setSearchQuery("");
                    router.back();
                }} >
                    {i18n.t("searchBar.cancel")}
                </Text>
            </View>

            {isPending ? (
                <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
            ) : error ? (
                <Text className="p-4">Error</Text>
            ) : (
                <ScrollView
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="gap-4">
                        {searchResults?.friends.length > 0 && (
                            <View>
                                <Text className="px-4 text-lg font-bold">Friends</Text>
                                {searchResults?.friends.map((user: SearchResult) => (
                                    <UserItem
                                        key={user.user_id}
                                        userId={user.user_id}
                                        displayName={user.display_name}
                                        username={user.username}
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
                                <Text className="px-4 text-lg font-bold">Requests Sent</Text>
                                {searchResults?.request_sent.map((user: SearchResult) => (
                                    <UserItem
                                        key={user.user_id}
                                        userId={user.user_id}
                                        displayName={user.display_name}
                                        username={user.username}
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
                                <Text className="px-4 text-lg font-bold">Requests Received</Text>
                                {searchResults?.request_received.map((user: SearchResult) => (
                                    <UserItem
                                        key={user.user_id}
                                        userId={user.user_id}
                                        displayName={user.display_name}
                                        username={user.username}
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
                                <Text className="px-4 text-lg font-bold">More results</Text>
                                {searchResults?.none.map((user: SearchResult) => (
                                    <UserItem
                                        key={user.user_id}
                                        userId={user.user_id}
                                        displayName={user.display_name}
                                        username={user.username}
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
        </View>
    );
}