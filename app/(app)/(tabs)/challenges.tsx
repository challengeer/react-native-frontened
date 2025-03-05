import api from "@/lib/api";
import React, { useCallback } from "react";
import { View, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { Challenge } from "@/types/Challenge";
import { useQuery } from "@tanstack/react-query";
import ChallengeItem from "@/components/challenges/ChallengeItem";
import Text from "@/components/common/Text";
import ChallengesHeader from "@/components/challenges/ChallengesHeader";

interface ChallengesResponse {
    challenges: Challenge[];
    invitations: Challenge[];
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
                contentContainerClassName="gap-4"
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
                        {
                            data.challenges.map((challenge, index) => (
                                <ChallengeItem
                                    index={index}
                                    challengeId={challenge.challenge_id}
                                    key={challenge.title}
                                    title={challenge.title}
                                    emoji={challenge.emoji}
                                    category={challenge.category}
                                    endDate={challenge.end_date}
                                />
                            ))
                        }

                        {data.invitations.length > 0 && (
                            <View>
                                <Text className="px-4 pb-2 text-lg font-bold">Invitations</Text>

                                {data.invitations.map((invite, index) => (
                                    <ChallengeItem
                                        index={index}
                                        challengeId={invite.challenge_id}
                                        key={invite.title}
                                        title={invite.title}
                                        emoji={invite.emoji}
                                        category={invite.category}
                                        endDate={invite.end_date}
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