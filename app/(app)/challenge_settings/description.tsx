import api from "@/lib/api";
import i18n from "@/i18n";
import { useState } from "react";
import React, { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { TextAreaInputBar } from "@/components/common/InputBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChallenge } from "@/hooks/useChallenges";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Button from "@/components/common/Button";

export default function Description() {
    const queryClient = useQueryClient();
    const { challenge_id } = useLocalSearchParams();
    const { challenge, isChallengeLoading, isChallengeError } = useChallenge(challenge_id as string);
    const [description, setDescription] = useState(challenge?.description ?? "");

    const mutation = useMutation({
        mutationFn: async () => {
            await api.put(`/challenges/${challenge_id}/description`, {
                description: description,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenge', challenge_id] });
            router.back();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <>
            <Header
                title={i18n.t("challenge_settings.description.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <View className="flex-1 px-4 pb-4 pt-2 justify-between">
                <TextAreaInputBar
                    value={description}
                    onChangeText={setDescription}
                    description={i18n.t("challenge_settings.description.description")}
                    maxLength={500}
                    autoFocus
                />
                <Button
                    title={i18n.t("buttons.save")}
                    size="lg"
                    disabled={challenge?.description === description || mutation.isPending}
                    loading={mutation.isPending}
                    onPress={() => mutation.mutate()}
                />
            </View>
        </>
    );
}
