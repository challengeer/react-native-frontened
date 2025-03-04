import { View, ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import ChallengeItem from "@/components/challenges/ChallengeItem";
import Text from "@/components/common/Text";
import ChallengesHeader from "@/components/challenges/ChallengesHeader";
import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";

export default function ChallengesPage() {
    const { data: challenges, isPending: isChallengesPending, refetch: refetchChallenges } = useQuery({
        queryKey: ["challenges"],
        queryFn: async () => {
            const response = await api.get("/challenges/list");
            return response.data;
        },
    });

    const { data: invites, isPending: isInvitesPending, refetch: refetchInvites } = useQuery({
        queryKey: ["challenge-invites"],
        queryFn: async () => {
            const response = await api.get("/challenges/invites");
            return response.data;
        },
    });

    const refresh = useCallback(() => {
        refetchChallenges();
        refetchInvites();
    }, [refetchChallenges, refetchInvites]);

    return (
        <ScrollView
        className="flex-1 bg-white dark:bg-neutral-900"
        refreshControl={<RefreshControl refreshing={isChallengesPending || isInvitesPending} onRefresh={refresh} />}>
            <ChallengesHeader />
            {challenges?.map((challenge, index) => (
                <ChallengeItem 
                    key={challenge.title}
                    time={challenge.end_date}
                    {...challenge} 
                    onPress={() => router.push("/challenge/1")} 
                    index={index} 
                />
            ))}
            <View className="py-3">
                <Text className="text-left text-neutral-500 text-2xl font-bold px-4">Invites</Text>
                {invites?.map((invite, index) => (
                    <ChallengeItem 
                        key={invite.title} 
                        {...invite} 
                        onPress={() => router.push("/challenge/1")} 
                        index={index}
                        showActions
                        onJoin={() => router.push("/challenge/1")}
                        onCancel={() => console.log("Cancelled invite")}
                    />
                ))}
            </View>
        </ScrollView>
    )
}