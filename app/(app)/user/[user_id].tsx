import api from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ShareIcon, Cog8ToothIcon, CheckIcon } from "react-native-heroicons/outline";
import { UserPlusIcon, UserMinusIcon } from "react-native-heroicons/solid";
import { useAuth } from "@/components/context/AuthProvider";
import { FriendshipStatus } from "@/types/FriendshipTypes";
import UserInterface from "@/types/UserInterface";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";

interface UserProfile extends UserInterface {
    friendship_status: FriendshipStatus;
}

export default function UserPage() {
    const { user_id } = useLocalSearchParams<{ user_id: string }>();
    const { user } = useAuth();

    const { data, isPending, error } = useQuery<UserProfile>({
        queryKey: ["user", user_id],
        queryFn: async () => {
            const response = await api.get(`/user/${encodeURIComponent(user_id)}`);
            return response.data;
        },
    });

    return (
        <View className="flex-1 bg-white dark:bg-neutral-900">
            <Header
                title="Profile"
                leftSection={<IconCircle icon={ArrowLeftIcon} onPress={() => router.back()} />}
                rightSection={
                    <View className="flex-row items-center gap-2">
                        <IconCircle icon={ShareIcon} />
                        {user_id == user?.user_id &&
                            <IconCircle icon={Cog8ToothIcon} onPress={() => router.push("/settings")} />
                        }
                    </View>
                }
            />

            {isPending ? (
                <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
            ) : error ? (
                <Text className="p-4">Error</Text>
            ) : (
                <ScrollView className="px-4">
                    <View className="items-center">
                        <Avatar size="lg" source={data.profile_picture} name={data.display_name} />
                        <Text className="mt-2 text-2xl font-bold">{data.display_name}</Text>
                        <Text type="secondary">@{data.username}</Text>
                    </View>

                    {data.friendship_status == "none" && user?.user_id != user_id && (
                        <Button
                            size="md"
                            className="mt-6 w-full"
                            title="Add"
                            onPress={() => { }}
                            leftSection={
                                <Icon
                                    icon={UserPlusIcon}
                                    lightColor="white"
                                    darkColor="white"
                                />
                            }
                        />
                    )}

                    {data.friendship_status == "request_sent" && (
                        <Button
                            size="md"
                            className="mt-6 w-full"
                            variant="secondary"
                            title="Added"
                            onPress={() => { }}
                            leftSection={
                                <Icon
                                    icon={CheckIcon}
                                    lightColor="white"
                                    darkColor="white"
                                />
                            }
                        />
                    )}

                    {data.friendship_status == "request_received" && (
                        <View className="mt-6 flex-row items-center gap-2">
                            <Button
                                size="md"
                                className="flex-1"
                                title="Accept"
                                onPress={() => { }}
                                leftSection={
                                    <Icon
                                        icon={UserPlusIcon}
                                        lightColor="white"
                                        darkColor="white"
                                    />
                                }
                            />
                            <Button
                                size="md"
                                className="flex-1"
                                variant="secondary"
                                title="Ignore"
                                onPress={() => { }}
                                leftSection={
                                    <Icon
                                        icon={UserMinusIcon}
                                        lightColor="white"
                                        darkColor="white"
                                    />
                                }
                            />
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    )
}