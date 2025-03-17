import i18n from "@/i18n";
import api from "@/lib/api";
import React, { ActivityIndicator, RefreshControl, ScrollView, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, ClockIcon, TrophyIcon, Cog8ToothIcon } from "react-native-heroicons/outline";
import { useQuery } from "@tanstack/react-query";
import { useChallengeActions } from "@/lib/hooks/useChallengeActions";
import { Challenge } from "@/types/Challenge";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import ChallengeAvatar from "@/components/challenges/ChallengeAvatar";
import Icon from "@/components/common/Icon";
import Button from "@/components/common/Button";
import UserItem from "@/components/common/UserItem";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";

interface ChallengeDetail extends Challenge {
    user_status: "participant" | "invited" | "submitted";
    invitation_id: string;
}

export default function ChallengePage() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const { acceptInvite, rejectInvite } = useChallengeActions();

    const { data: challenge, isPending, isError, refetch } = useQuery<ChallengeDetail>({
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
                rightSection={
                    <IconCircle
                        icon={Cog8ToothIcon}
                        onPress={() => router.push(`/challenge_settings`)} /* No idea why there is an error*/
                    />
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

                        {challenge?.user_status === "participant" ? (
                            <Button
                                title="Add submission"
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

                    <Text className="px-4 pt-6 pb-2 text-lg font-bold">{i18n.t("challenges.participants")}</Text>
                    {[challenge?.creator, ...(challenge?.participants || [])].map((participant, index) => (
                        <UserItem
                            key={participant.user_id}
                            index={index}
                            userId={participant.user_id}
                            displayName={participant.display_name}
                            username={participant.username}
                            profilePicture={participant.profile_picture}
                            rightSection={
                                <Text type="secondary" className="text-sm">{participant.has_submitted ? "Submitted" : "Not submitted"}</Text>
                            }
                        />
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    )
}