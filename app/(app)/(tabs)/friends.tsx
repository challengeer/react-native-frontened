import React, { useCallback } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import UserInterface from "@/types/UserInterface";
import FriendsHeader from "@/components/friends/FriendsHeader";
import UserItem from "@/components/common/UserItem";
import Text from "@/components/common/Text";
import api from "@/lib/api";

export default function FriendsPage() {
    const { data: friends, isPending, error, refetch } = useQuery({
        queryKey: ["friends"],
        queryFn: async () => {
            const response = await api.get("/friends/list");
            return response.data;
        },
    });

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <FriendsHeader />

            <ScrollView
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isPending}
                        onRefresh={handleRefresh}
                    />
                }
            >
                {isPending ? (
                    <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
                ) : error ? (
                    <Text className="p-4">Error</Text>
                ) : (
                    <>
                        {
                            friends.map((user: UserInterface, index: number) => (
                                <UserItem
                                    key={user.user_id}
                                    index={index}
                                    userId={user.user_id}
                                    displayName={user.display_name}
                                    username={user.username}
                                    profilePicture={user.profile_picture}
                                    rightSection={
                                        <Text>{Math.floor(Math.random() * 10)}🔥</Text>
                                    }
                                />
                            ))
                        }
                    </>
                )}
            </ScrollView>
        </View>
    )
}