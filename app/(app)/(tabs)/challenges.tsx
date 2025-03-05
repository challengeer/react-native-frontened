import i18n from "@/i18n";
import api from "@/lib/api";
import React, { useCallback } from "react";
import { View, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Challenge } from "@/types/Challenge";
import { useQuery } from "@tanstack/react-query";
import ChallengeItem from "@/components/challenges/ChallengeItem";
import Text from "@/components/common/Text";
import ChallengesHeader from "@/components/challenges/ChallengesHeader";
import UserInterface from "@/types/UserInterface";
import Button from "@/components/common/Button";
import { router } from "expo-router";
import { PlusIcon } from "react-native-heroicons/outline";
import Icon from "@/components/common/Icon";

interface Invitation extends Challenge {
    sender: UserInterface;
}

interface ChallengesResponse {
    challenges: Challenge[];
    invitations: Invitation[];
}

export default function ChallengesPage() {
    const { data, isPending, error, refetch } = useQuery<ChallengesResponse>({
        queryKey: ["challenges"],
        queryFn: async () => {
            const response = await api.get("/challenges/list");
            return response.data;
        },
    });

    const refresh = useCallback(() => {
        refetch();
    }, [refetch]);

    return (
        <>
            <ChallengesHeader />

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
                {isPending ? (
                    <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
                ) : error ? (
                    <Text className="p-4">Error</Text>
                ) : (
                    <>
                        {data.challenges.length === 0 && (
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

                        {data.challenges.map((challenge, index) => (
                            <ChallengeItem
                                index={index}
                                challengeId={challenge.challenge_id}
                                key={challenge.title}
                                title={challenge.title}
                                emoji={challenge.emoji}
                                category={challenge.category}
                                endDate={challenge.end_date}
                            />
                        ))}

                        {data.invitations.length > 0 && (
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
                                    />
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </>
    )
}