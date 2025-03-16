import api from "@/lib/api";
import React, { useCallback } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import UserInterface from "@/types/UserInterface";
import FriendsHeader from "@/components/friends/FriendsHeader";
import UserItem from "@/components/common/UserItem";
import Text from "@/components/common/Text";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";

interface Friend extends UserInterface {
    mutual_streak: number;
}

export default function FriendsPage() {
    const { data: friends, isPending, isError, refetch } = useQuery<Friend[]>({
        queryKey: ["friends"],
        queryFn: async () => {
            const response = await api.get("/friends/list");
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <FriendsHeader />


            {isPending ? (
                <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />
            ) : isError ? (
                <NetworkErrorContainer onRetry={refetch} />
            ) : (
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
                    {
                        friends.map((user, index) => (
                            <UserItem
                                key={user.user_id}
                                index={index}
                                userId={user.user_id}
                                displayName={user.display_name}
                                username={user.username}
                                profilePicture={user.profile_picture}
                                rightSection={
                                    <Text>{user.mutual_streak}🔥</Text>
                                }
                            />
                        ))
                    }
                </ScrollView>
            )}
        </View>
    )
}