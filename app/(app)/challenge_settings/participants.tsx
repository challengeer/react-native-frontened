import i18n from "@/i18n";
import api from "@/lib/api";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router, Redirect } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { Challenge } from "@/types/Challenge";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import UserItem from "@/components/common/UserItem";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import { useAuth } from "@/components/context/AuthProvider";

export default function Participants() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const { user } = useAuth();

    const { data: challenge, isPending, isError, refetch } = useQuery<Challenge>({
        queryKey: ["challenge", challenge_id],
        queryFn: async () => {
            const response = await api.get(`/challenges/${challenge_id}`);
            return response.data;
        }
    });

    // If the current user is not the creator, redirect back
    if (challenge && user?.user_id !== challenge.creator.user_id) {
        return <Redirect href=".." />;
    }

    return (
        <SafeAreaView className="flex-1">
            <Header
                title={i18n.t("challenge_settings.participants.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            {isPending ? (
                <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />
            ) : isError ? (
                <NetworkErrorContainer onRetry={refetch} />
            ) : (
                <ScrollView className="flex-1">
                    {challenge?.participants && challenge.participants.length > 0 ? (
                        challenge.participants.map((participant, index) => (
                            <UserItem
                                key={participant.user_id}
                                index={index}
                                userId={participant.user_id}
                                title={participant.display_name}
                                subtitle={
                                    <View className="flex-row items-center gap-1">
                                        <Text type="secondary" className="text-sm">
                                            @{participant.username}
                                        </Text>
                                    </View>
                                }
                                name={participant.display_name}
                                profilePicture={participant.profile_picture}
                                rightSection={
                                    <View className="bg-neutral-50 dark:bg-neutral-800 px-3 py-1 rounded-full">
                                        <Text type="secondary" className="text-sm">Added</Text>
                                    </View>
                                }
                            />
                        ))
                    ) : (
                        <View className="px-4 py-6">
                            <Text type="secondary" className="text-center">No participants yet</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
