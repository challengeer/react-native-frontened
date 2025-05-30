import api from "@/lib/api";
import i18n from "@/i18n";
import React, { useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { InputBar } from "@/components/common/InputBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChallenge } from "@/hooks/useChallenges";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";

export default function Name() {
    const queryClient = useQueryClient();
    const { challenge_id } = useLocalSearchParams();
    const { challenge, isChallengeLoading, isChallengeError } = useChallenge(challenge_id as string);
    const [name, setName] = useState(challenge?.title ?? "");

    const handleSubmit = useMutation({
        mutationFn: async () => {
            await api.put(`/challenges/${challenge_id}/title`, {
                title: name,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['challenge', challenge_id] });
            queryClient.invalidateQueries({ queryKey: ['challenges'] });
            router.back();
        },
        onError: (error) => {
            console.error(error);
        },
    });

    return (
        <>
            <Header
                title={i18n.t("challenge_settings.name.header")}
                leftSection={
                    <IconCircle
                        icon={ArrowLeftIcon}
                        onPress={() => router.back()}
                    />
                }
            />

            <View className="flex-1 px-4 pb-4 pt-2 justify-between">
                <InputBar
                    value={name}
                    onChangeText={setName}
                    description={i18n.t("challenge_settings.name.description")}
                    autoFocus
                />
                <Button
                    title={i18n.t("buttons.save")}
                    size="lg"
                    disabled={name === challenge?.title || handleSubmit.isPending}
                    loading={handleSubmit.isPending}
                    onPress={() => handleSubmit.mutate()}
                />
            </View>
        </>
    )
}
