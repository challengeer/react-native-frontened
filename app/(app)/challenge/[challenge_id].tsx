import i18n from "@/i18n";
import api from "@/lib/api";
import React, { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, ClockIcon, TrophyIcon } from "react-native-heroicons/outline";
import { useQuery } from "@tanstack/react-query";
import { Challenge } from "@/types/Challenge";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import ChallengeAvatar from "@/components/challenges/ChallengeAvatar";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import UserItem from "@/components/common/UserItem";

export default function ChallengePage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();

    const { data: challenge, isPending, error, refetch } = useQuery<Challenge>({
        queryKey: ["challenge", challenge_id],
        queryFn: async () => {
            const response = await api.get(`/challenges/${challenge_id}`);
            return response.data;
        }
    });

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
            />

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
                {isPending ? (
                    <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
                ) : error ? (
                    <Text className="p-4">Error</Text>
                ) : (
                    <>
                        <View className="px-4 gap-6">
                            <View className="items-center">
                                <ChallengeAvatar
                                    size="lg"
                                    challengeId={challenge?.challenge_id}
                                    emoji={challenge?.emoji}
                                    hasNewSubmissions={challenge?.has_new_submissions}
                                />

                                <Text className="mt-2 text-2xl font-bold">{challenge?.title}</Text>
                                {challenge?.description &&
                                    <Text type="secondary" className="mt-1">{challenge?.description}</Text>
                                }
                            </View>

                            <View className="gap-2">
                                <View className="flex-row items-center gap-2">
                                    <Icon icon={TrophyIcon} lightColor="#737373" darkColor="#a3a3a3" />
                                    <Text type="secondary" className="text-base">{challenge?.category}</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Icon icon={ClockIcon} lightColor="#737373" darkColor="#a3a3a3" />
                                    <Text type="secondary" className="text-base">{challenge?.end_date}</Text>
                                </View>
                            </View>

                            <Button
                                title="Add submission"
                                onPress={() => router.push(`/(app)/camera?challenge_id=${challenge?.challenge_id}`)}
                            />
                        </View>

                        <Text className="px-4 pt-6 pb-2 text-lg font-bold">{i18n.t("challenges.participants")}</Text>
                        {[challenge?.creator, ...challenge?.participants].map((participant, index) => (
                            <UserItem
                                key={participant.user_id}
                                index={index}
                                userId={participant.user_id}
                                displayName={participant.display_name}
                                username={participant.username}
                                profilePicture={participant.profile_picture}
                            />
                        ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    )
}