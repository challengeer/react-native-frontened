import React from "react";
import i18n from "@/i18n";
import api from "@/lib/api";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router, Redirect } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets, SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import { Challenge } from "@/types/Challenge";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import UserItem from "@/components/common/UserItem";
import NetworkErrorContainer from "@/components/common/NetworkErrorContainer";
import { useAuth } from "@/components/context/AuthProvider";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef, useCallback } from "react";
import Button from "@/components/common/Button";
import { useColorScheme } from "nativewind";
import ParticipantItem from "@/components/challenge_settings/ParticipantItem";

export default function Participants() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const { user } = useAuth();
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();

    const { data: challenge, isPending, isError, refetch } = useQuery<Challenge>({
        queryKey: ["challenge", challenge_id],
        queryFn: async () => {
            const response = await api.get(`/challenges/${challenge_id}`);
            return response.data;
        }
    });

    const { data: friends, isPending: isFriendsPending } = useQuery({
        queryKey: ["friends"],
        queryFn: async () => {
            const response = await api.get("/friends/list");
            return response.data;
        },
    });

    const inviteMutation = useMutation({
        mutationFn: async (receiverIds: string[]) => {
            await api.post("/challenges/invite", {
                challenge_id: challenge_id,
                receiver_ids: receiverIds,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["challenge", challenge_id] });
            bottomSheetRef.current?.dismiss();
        },
    });


    const [selectedFriends, setSelectedFriends] = React.useState<string[]>([]);

    const handleModalOpen = useCallback(() => {
        bottomSheetRef.current?.present();
    }, []);

    const handleModalClose = useCallback(() => {
        bottomSheetRef.current?.dismiss();
        setSelectedFriends([]);
    }, []);

    const toggleFriendSelection = (userId: string) => {
        setSelectedFriends(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleRemoveParticipant = (participantId: string) => {

    };

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
                rightSection={<IconCircle icon={PlusIcon} onPress={handleModalOpen} />}
            />

            {isPending ? (
                <ActivityIndicator className="flex-1 justify-center items-center" size="large" color="#a855f7" />
            ) : isError ? (
                <NetworkErrorContainer onRetry={refetch} />
            ) : (
                <ScrollView className="flex-1">
                    {challenge?.participants && challenge.participants.length > 0 ? (
                        challenge.participants.map((participant, index) => (
                            <ParticipantItem
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
                                onRemove={() => handleRemoveParticipant(participant.user_id)}
                            />
                        ))
                    ) : (
                        <View className="px-4 py-6">
                            <Text type="secondary" className="text-center">No participants yet</Text>
                        </View>
                    )}
                </ScrollView>
            )}

            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={["100%"]}
                index={0}
                backgroundStyle={{ backgroundColor }}
                enableDynamicSizing={false}
                handleComponent={() => (
                    <Header
                        title="Add Participants"
                        style={{ marginTop: insets.top }}
                        leftSection={
                            <IconCircle
                                icon={XMarkIcon}
                                onPress={handleModalClose}
                            />
                        }
                    />
                )}
            >
                <BottomSheetScrollView
                    className="flex-1"
                    overScrollMode="never"
                    showsVerticalScrollIndicator={false}
                >
                    {isFriendsPending ? (
                        <ActivityIndicator className="justify-center py-12" size="large" color="#a855f7" />
                    ) : (
                        <>
                            {friends?.map((friend: any, index: number) => (
                                <UserItem
                                    key={friend.user_id}
                                    index={index}
                                    userId={friend.user_id}
                                    title={friend.display_name}
                                    subtitle={`@${friend.username}`}
                                    name={friend.display_name}
                                    profilePicture={friend.profile_picture}
                                    rightSection={
                                        <Button
                                            size="sm"
                                            variant={selectedFriends.includes(friend.user_id) ? "primary" : "secondary"}
                                            title={selectedFriends.includes(friend.user_id) ? "Selected" : "Select"}
                                            onPress={() => toggleFriendSelection(friend.user_id)}
                                        />
                                    }
                                />
                            ))}
                        </>
                    )}
                </BottomSheetScrollView>

                <View className="p-4" style={{ marginBottom: insets.bottom }}>
                    <Button
                        size="lg"
                        title="Add Participants"
                        onPress={() => inviteMutation.mutate(selectedFriends)}
                        disabled={selectedFriends.length === 0 || inviteMutation.isPending}
                        loading={inviteMutation.isPending}
                    />
                </View>
            </BottomSheetModal>
        </SafeAreaView>
    );
}
