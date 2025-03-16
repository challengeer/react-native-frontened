import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useCallback } from "react";
import { View, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ChallengeSimple } from "@/types/Challenge";
import { PlusIcon } from "react-native-heroicons/outline";
import ChallengeItem from "@/components/challenges/ChallengeItem";
import Text from "@/components/common/Text";
import ChallengesHeader from "@/components/challenges/ChallengesHeader";
import UserInterface from "@/types/UserInterface";
import Button from "@/components/common/Button";
import Icon from "@/components/common/Icon";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";

interface Invitation extends ChallengeSimple {
    sender: UserInterface;
    invitation_id: string;
}

interface ChallengesResponse {
    challenges: ChallengeSimple[];
    invitations: Invitation[];
}

export default function ChallengesPage() {
    const { data, isPending, isError, refetch } = useQuery<ChallengesResponse>({
        queryKey: ["challenges"],
        queryFn: async () => {
            const response = await api.get("/challenges/list");
            return response.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    const refresh = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <>
            <ChallengesHeader />

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
                            onRefresh={refresh}
                        />
                    }
                >
                    {data.challenges?.length === 0 && (
                        <View className="mx-4 p-6 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
                            <Text className="text-lg font-bold mb-2">{i18n.t("challenges.noChallenges.title")}</Text>
                            <Text type="secondary" className="text-base mb-6">
                                {i18n.t("challenges.noChallenges.description")}
                            </Text>
                            <Button
                                title={i18n.t("challenges.noChallenges.button")}
                                onPress={() => router.push("/create_challenge")}
                                leftSection={
                                    <Icon
                                        icon={PlusIcon}
                                        lightColor="#fff"
                                        darkColor="#fff"
                                    />
                                }
                            />
                        </View>
                    )}

                    {data.challenges?.map((challenge, index) => (
                        <ChallengeItem
                            index={index}
                            challengeId={challenge.challenge_id}
                            key={challenge.title}
                            title={challenge.title}
                            emoji={challenge.emoji}
                            category={challenge.category}
                            endDate={challenge.end_date}
                            hasNewSubmissions={challenge.has_new_submissions}
                        />
                    ))}

                    {data.invitations?.length > 0 && (
                        <View>
                            <Text className="px-4 pt-4 pb-2 text-lg font-bold">{i18n.t("challenges.invitations.title")}</Text>

                            {data.invitations.map((invite, index) => (
                                <ChallengeItem
                                    index={index}
                                    challengeId={invite.challenge_id}
                                    key={invite.title}
                                    title={invite.title}
                                    emoji={invite.emoji}
                                    category={invite.category}
                                    endDate={invite.end_date}
                                    sender={invite.sender}
                                    invitationId={invite.invitation_id}
                                />
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}
        </>
    )
}