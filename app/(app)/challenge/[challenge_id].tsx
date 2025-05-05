import i18n from "@/i18n";
import api from "@/lib/api";
import React, { ActivityIndicator, RefreshControl, ScrollView, View, Text as RNText } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, CheckCircleIcon, ClockIcon, Cog8ToothIcon, TrophyIcon, CameraIcon } from "react-native-heroicons/outline";
import { useQuery } from "@tanstack/react-query";
import { useChallengeActions } from "@/hooks/useChallengeActions";
import { Challenge } from "@/types/Challenge";
import { getDetailedTimeLeft } from "@/utils/timeUtils";
import { useAuth } from "@/providers/AuthProvider";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import ChallengeAvatar from "@/components/challenges/ChallengeAvatar";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import UserItem from "@/components/common/UserItem";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import { useEffect, useState } from "react";

interface ChallengeDetail extends Challenge {
    user_status: "participant" | "invited" | "submitted";
    invitation_id: string;
}

export default function ChallengePage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const { acceptInvite, rejectInvite } = useChallengeActions();
    const { user } = useAuth();
    const [countdown, setCountdown] = useState("00:00:00");

    const { data: challenge, isPending, isError, refetch } = useQuery<ChallengeDetail>({
        queryKey: ["challenge", challenge_id],
        queryFn: async () => {
            const response = await api.get(`/challenges/${challenge_id}`);
            return response.data;
        }
    });

    useEffect(() => {
        if (!challenge?.end_date) return;

        const timer = setInterval(() => {
            setCountdown(getDetailedTimeLeft(challenge.end_date));
        }, 1000);

        setCountdown(getDetailedTimeLeft(challenge.end_date));

        return () => clearInterval(timer);
    }, [challenge?.end_date]);

    return (
        <SafeAreaView className="flex-1">
            <Header
                title={i18n.t("challenges.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
                rightSection={
                    challenge && user?.user_id === challenge.creator.user_id && (
                        <IconCircle
                            icon={Cog8ToothIcon}
                            onPress={() => router.push(`/(app)/challenge_settings?challenge_id=${challenge_id}`)}
                        />
                    )
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
                    refreshControl={
                        <RefreshControl
                            refreshing={isPending}
                            onRefresh={refetch}
                        />
                    }
                >
                    <View className="px-4 gap-6">
                        <View className="items-center">
                            <ChallengeAvatar
                                size="lg"
                                challengeId={challenge?.challenge_id}
                                emoji={challenge?.emoji || ""}
                                hasNewSubmissions={challenge?.has_new_submissions}
                            />

                            <Text className="mt-2 text-2xl font-bold">{challenge?.title}</Text>
                            {challenge?.description &&
                                <Text type="secondary" className="mt-1 text-base text-center">{challenge?.description}</Text>
                            }
                        </View>

                        {/* <View className="gap-2">
                            <View className="flex-row items-center gap-2">
                                <Icon icon={TrophyIcon} lightColor="#737373" darkColor="#a3a3a3" />
                                <Text type="secondary" className="text-base">{challenge?.category}</Text>
                            </View>
                            <View className="flex-row items-center gap-2">
                                <Icon icon={ClockIcon} lightColor="#737373" darkColor="#a3a3a3" />
                                <Text type="secondary" className="text-base">{getTimeLeft(challenge?.end_date)}</Text>
                            </View>
                        </View> */}

                        <View className="items-center gap-2">
                            <View className="w-full flex-row items-center gap-4 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-xl flex-1">
                                <Icon icon={TrophyIcon} />
                                <View className="flex-col">
                                    <Text className="font-medium">{challenge?.category}</Text>
                                    <Text type="secondary" className="text-base">Category</Text>
                                </View>
                            </View>
                            <View className="w-full flex-row items-center gap-4 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-xl flex-1">
                                <Icon icon={ClockIcon} />
                                <View className="flex-col">
                                    <Text className="font-medium">{countdown}</Text>
                                    <Text type="secondary" className="text-base">Time left</Text>
                                </View>
                            </View>
                        </View>

                        {challenge?.user_status === "participant" ? (
                            <Button
                                title="Add submission"
                                leftSection={<Icon icon={CameraIcon} />}
                                onPress={() => router.push(`/(app)/camera?challenge_id=${challenge?.challenge_id}`)}
                            />
                        ) : challenge?.user_status === "invited" ? (
                            <View className="flex-row gap-2">
                                <Button
                                    title="Accept"
                                    className="flex-1"
                                    onPress={() => acceptInvite.mutate(challenge?.invitation_id)}
                                />
                                <Button
                                    title="Ignore"
                                    variant="secondary"
                                    className="flex-1"
                                    onPress={() => {
                                        rejectInvite.mutate(challenge?.invitation_id)
                                        router.back()
                                    }}
                                />
                            </View>
                        ) : (
                            <Text>You have already submitted a photo for this challenge.</Text>
                        )}
                    </View>

                    <Text className="px-4 pt-6 pb-2 text-lg font-bold">{i18n.t("challenges.creator")}</Text>
                    <UserItem
                        key={challenge?.creator.user_id}
                        index={0}
                        userId={challenge?.creator.user_id}
                        title={challenge?.creator.display_name}
                        subtitle={
                            <View className="flex-row items-center gap-1">
                                {challenge?.creator.has_submitted ? (
                                    <Icon icon={CheckCircleIcon} size={20} strokeWidth={1.5} lightColor="#737373" darkColor="#a3a3a3" />
                                ) : (
                                    <Icon icon={ClockIcon} size={20} strokeWidth={1.5} lightColor="#737373" darkColor="#a3a3a3" />
                                )}
                                <Text type="secondary" className="text-base">
                                    {challenge?.creator.has_submitted ? "Completed" : "Waiting for submission"}
                                </Text>
                            </View>
                        }
                        name={challenge?.creator.display_name}
                        profilePicture={challenge?.creator.profile_picture}
                    />

                    {challenge?.participants?.length > 0 && (
                        <>
                            <Text className="px-4 pt-6 pb-2 text-lg font-bold">{i18n.t("challenges.participants")}</Text>
                            {[...challenge.participants].map((participant, index) => (
                                <UserItem
                                    key={participant.user_id}
                                    index={index}
                                    userId={participant.user_id}
                                    title={participant.display_name}
                                    subtitle={
                                        <View className="flex-row items-center gap-1">
                                            {participant.has_submitted ? (
                                                <Icon icon={CheckCircleIcon} size={20} strokeWidth={1.5} lightColor="#737373" darkColor="#a3a3a3" />
                                            ) : (
                                                <Icon icon={ClockIcon} size={20} strokeWidth={1.5} lightColor="#737373" darkColor="#a3a3a3" />
                                            )}
                                            <Text type="secondary" className="text-base">
                                                {participant.has_submitted ? "Completed" : "Waiting for submission"}
                                            </Text>
                                        </View>
                                    }
                                    name={participant.display_name}
                                    profilePicture={participant.profile_picture}
                                />
                            ))}
                        </>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}