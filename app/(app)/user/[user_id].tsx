import i18n from "@/i18n";
import api from "@/lib/api";
import { router, useLocalSearchParams } from "expo-router";
import React, { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, ShareIcon, Cog8ToothIcon, CheckCircleIcon } from "react-native-heroicons/outline";
import { UserPlusIcon, UserMinusIcon } from "react-native-heroicons/solid";
import { FriendshipStatus } from "@/types/FriendshipTypes";
import { useAuth } from "@/components/context/AuthProvider";
import { useFriendActions } from '@/lib/hooks/useFriendActions';
import UserInterface from "@/types/UserInterface";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import ActivityCalendar from "@/components/user/ActivityCalendar"
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";

interface UserProfile extends UserInterface {
    request_id?: string;
    friendship_status: FriendshipStatus;
    current_streak: number;
    total_challenges_completed: number;
    challenge_completion_dates: string[];
}

export default function UserPage() {
    const { user_id } = useLocalSearchParams<{ user_id: string }>();
    const { user } = useAuth();
    const { addFriend, acceptRequest, rejectRequest } = useFriendActions();

    const { data, isPending, isError, refetch } = useQuery<UserProfile>({
        queryKey: ["user", user_id],
        queryFn: async () => {
            const response = await api.get(`/user/${encodeURIComponent(user_id)}`);
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });
 
    return (
        <SafeAreaView className="flex-1">
            <Header
                title={i18n.t("user.header")}
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
                <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />
            ) : isError ? (
                <NetworkErrorContainer onRetry={refetch} />
            ) : (
                <ScrollView
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                    className="px-4"
                    refreshControl={
                        <RefreshControl
                            refreshing={isPending}
                            onRefresh={refetch}
                        />
                    }
                >
                    <View className="items-center">
                        <Avatar size="lg" source={data.profile_picture} name={data.display_name} />
                        <Text className="mt-2 text-2xl font-bold">{data.display_name}</Text>
                        <Text type="secondary">@{data.username}</Text>
                    </View>

                    {data.friendship_status == "none" && user?.user_id != user_id && (
                        <Button
                            size="md"
                            className="mt-6 w-full"
                            title={i18n.t("friendActionButton.add")}
                            onPress={() => addFriend.mutate(user_id)}
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
                            title={i18n.t("friendActionButton.added")}
                            onPress={() => { }}
                            leftSection={
                                <Icon
                                    icon={CheckCircleIcon}
                                    lightColor="black"
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
                                title={i18n.t("friendActionButton.accept")}
                                onPress={() => data.request_id && acceptRequest.mutate(data.request_id)}
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
                                title={i18n.t("friendActionButton.ignore")}
                                onPress={() => data.request_id && rejectRequest.mutate(data.request_id)}
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
                    <View className="flex-row items-center gap-2 mt-6">
                        <View className="flex-row items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-xl flex-1">
                            <Text className="text-2xl">🔥</Text>
                            <View className="flex-col">
                                <Text className="text-xl font-bold">{data.current_streak}</Text>
                                <Text type="secondary" className="text-base">{i18n.t("user.streak")}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-xl flex-1">
                            <Text className="text-2xl">🎯</Text>
                            <View className="flex-col">
                                <Text className="text-xl font-bold">{data.total_challenges_completed}</Text>
                                <Text type="secondary" className="text-base">{i18n.t("user.totalChallenges")}</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-2xl font-bold mt-6">{i18n.t("user.activity")}</Text>
                    <ActivityCalendar
                        selectedDates={data.challenge_completion_dates}
                    />
                </ScrollView>
            )}
        </SafeAreaView>
    )
}