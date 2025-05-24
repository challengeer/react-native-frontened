import React from "react";
import i18n from "@/i18n";
import api from "@/lib/api";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router, Redirect } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from "react-native-heroicons/outline";
import { Challenge } from "@/types/challenge";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRef, useCallback } from "react";
import { useColorScheme } from "nativewind";
import { useAuth } from "@/providers/AuthProvider";
import { useChallenge } from "@/hooks/useChallenges";
import { useFriends } from "@/hooks/useFriends";
import Text from "@/components/common/Text";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import UserItem from "@/components/common/UserItem";
import Button from "@/components/common/Button";
import UserInterface from "@/types/UserInterface";
import Checkbox from "@/components/common/Checkbox";
import Icon from "@/components/common/Icon";

export default function Participants() {
    const { challenge_id } = useLocalSearchParams<{ challenge_id: string }>();
    const { user } = useAuth();
    const { colorScheme } = useColorScheme();
    const backgroundColor = colorScheme === "dark" ? "#171717" : "#ffffff";
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const queryClient = useQueryClient();

    const { challenge, isChallengeLoading, isChallengeError } = useChallenge(challenge_id);
    const { friends, isFriendsLoading, isFriendsError } = useFriends();

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

    const removeParticipantMutation = useMutation({
        mutationFn: async (participantId: string) => {
            await api.post(`/challenges/remove-participant`, {
                challenge_id: challenge_id,
                participant_id: participantId,
            });
        },
        onMutate: async (participantId) => {
            await queryClient.cancelQueries({ queryKey: ["challenge", challenge_id] });
            const previousChallenge = queryClient.getQueryData<Challenge>(["challenge", challenge_id]);

            queryClient.setQueryData<Challenge>(["challenge", challenge_id], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    participants: old.participants.filter((p: any) => p.user_id !== participantId),
                };
            });

            return previousChallenge;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["challenge", challenge_id] });
        },
        onError: (error, participantId, context) => {
            queryClient.setQueryData<Challenge>(["challenge", challenge_id], context);
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

    // If the current user is not the creator, redirect back
    if (challenge && user?.user_id !== challenge.creator.user_id) {
        return <Redirect href=".." />;
    }

    return (
        <>
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

            {challenge ? (
                <ScrollView className="flex-1 pt-2">
                    {challenge?.participants && challenge.participants.length > 0 ? (
                        challenge.participants.map((participant, index) => (
                            <UserItem
                                key={participant.user_id}
                                index={index}
                                userId={participant.user_id}
                                title={participant.display_name}
                                subtitle={`@${participant.username}`}
                                name={participant.display_name}
                                profilePicture={participant.profile_picture}
                                rightSection={
                                    <Icon
                                        icon={XMarkIcon}
                                        variant="secondary"
                                        onPress={() => removeParticipantMutation.mutate(participant.user_id)}
                                    />
                                }
                            />
                        ))
                    ) : (
                        <View className="px-4 py-6">
                            <Text type="secondary" className="text-center">No participants yet</Text>
                        </View>
                    )}
                </ScrollView>
            ) : (
                <ActivityIndicator className="items-center justify-center py-12" size="large" color="#a855f7" />
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
                {friends ? (
                    <BottomSheetScrollView
                        className="flex-1"
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                    >
                        {friends
                            ?.filter((friend) => !challenge?.participants.some(p => p.user_id === friend.user_id))
                            .map((friend: UserInterface, index: number) => (
                                <UserItem
                                    key={friend.user_id}
                                    index={index}
                                    userId={friend.user_id}
                                    title={friend.display_name}
                                    subtitle={`@${friend.username}`}
                                    name={friend.display_name}
                                    profilePicture={friend.profile_picture}
                                    onPress={() => toggleFriendSelection(friend.user_id)}
                                    rightSection={
                                        <Checkbox
                                            checked={selectedFriends.includes(friend.user_id)}
                                        />
                                    }
                                />
                            ))}
                    </BottomSheetScrollView>
                ) : (
                    <ActivityIndicator className="flex-1 items-center justify-center py-12" size="large" color="#a855f7" />
                )}

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
        </>
    );
}
