import i18n from "@/i18n";
import { useCallback } from "react";
import { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { UserPlusIcon } from "react-native-heroicons/solid";
import { useQuery } from "@tanstack/react-query";
import UserInterface from "@/types/UserInterface";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import FriendsHeader from "@/components/friends/FriendsHeader";
import UserItem from "@/components/common/UserItem";
import Text from "@/components/common/Text";
import api from "@/lib/api";

export default function FriendsPage() {
    const { data, isPending, error, refetch } = useQuery({
        queryKey: ["friends"],
        queryFn: async () => {
            const friends = await api.get("/users/4/friends");
            const contacts = await api.get("/users");

            return { friends: friends.data, contacts: contacts.data }
        },
    });

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <FriendsHeader />

            {isPending ? (
                <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
            ) : error ? (
                <Text className="p-4">Error</Text>
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
                    {data.friends.map((user: UserInterface) => (
                        <UserItem
                            key={user.user_id}
                            userId={user.user_id}
                            displayName={user.display_name}
                            username={user.username}
                            profilePicture={user.profile_picture}
                            rightSection={
                                <Text>{Math.floor(Math.random() * 10)}🔥</Text>
                            }
                        />
                    ))}

                    <Text className="text-2xl font-bold px-4 pt-4 pb-2">{i18n.t("friends.contacts")}</Text>
                    {data.contacts.map((user: UserInterface) => (
                        <UserItem
                            key={user.user_id}
                            userId={user.user_id}
                            displayName={user.display_name}
                            username={user.username}
                            profilePicture={user.profile_picture}
                            rightSection={
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    title="Invite"
                                    leftSection={
                                        <Icon icon={UserPlusIcon} />
                                    }
                                />
                            }
                        />
                    ))}
                </ScrollView>
            )}
        </View>
    )
}