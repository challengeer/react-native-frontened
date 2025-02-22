import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, View, TextInput, ActivityIndicator } from "react-native"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, UserPlusIcon } from "react-native-heroicons/solid";
import { router } from "expo-router";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import UserInterface from "@/types/UserInterface";
import UserItem from "@/components/common/UserItem";
import SearchBar from "@/components/common/SearchBar";
import Text from "@/components/common/Text";

interface SearchResult extends UserInterface {
    friendship_status: "friends" | "pending" | "none";
}

export default function FriendSearch() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const searchInputRef = useRef<TextInput>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        setTimeout(() => {
            searchInputRef.current?.focus();
        }, 100);
    }, []);

    const { data: users, isPending, error } = useQuery<SearchResult[]>({
        queryKey: ["user-search", searchQuery],
        queryFn: async () => {
            const response = await api.get(`/user/search?q=${encodeURIComponent(searchQuery)}`);
            return response.data;
        },
    });

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const addFriendMutation = useMutation({
        mutationFn: async (userId: string) => {
            await api.post("/friends/add", { receiver_id: userId });
        },
        onMutate: async (userId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["user-search", searchQuery] });

            // Snapshot the previous value
            const previousUsers = queryClient.getQueryData(["user-search", searchQuery]);

            // Optimistically update friend requests
            queryClient.setQueryData(["user-search", searchQuery], (old: SearchResult[]) =>
                old.map(user => user.user_id === userId ? { ...user, friendship_status: "pending" } : user)
            );

            return { previousUsers };
        },
        onError: (err, userId, context) => {
            // Rollback on error
            queryClient.setQueryData(["user-search", searchQuery], context?.previousUsers);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["user-search", searchQuery] });
        },
    });

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
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
                >
                    {users.map((user: SearchResult) => (
                        <UserItem
                            key={user.user_id}
                            userId={user.user_id}
                            displayName={user.display_name}
                            username={user.username}
                            profilePicture={user.profile_picture}
                            rightSection={
                                <View className="flex-row gap-2 items-center">
                                    {user.friendship_status === "pending" && (
                                        <Button
                                            size="sm"
                                            title="Added"
                                            disabled
                                            leftSection={
                                                <Icon
                                                    icon={CheckCircleIcon}
                                                    lightColor="white"
                                                    darkColor="white"
                                                />
                                            }
                                        />
                                    )}
                                    {user.friendship_status === "none" && (
                                        <Button
                                            size="sm"
                                            title="Add"
                                            onPress={() => addFriendMutation.mutate(user.user_id)}
                                            leftSection={
                                                <Icon
                                                    icon={UserPlusIcon}
                                                    lightColor="white"
                                                    darkColor="white"
                                                />
                                            }
                                        />
                                    )}
                                </View>
                            }
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    );
}