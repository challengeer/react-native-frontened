import i18n from "@/i18n";
import { useState } from "react";
import { Platform, KeyboardAvoidingView, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { TextAreaInputBar } from "@/components/common/InputBar";
import { useQuery } from "@tanstack/react-query";
import { Challenge } from "@/types/Challenge";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/common/Header";
import IconCircle from "@/components/common/IconCircle";
import Button from "@/components/common/Button";

export default function Description() {
    const { challenge_id } = useLocalSearchParams();

    const { data: challenge } = useQuery<Challenge>({
        queryKey: ['challenge', challenge_id],
    });

    const [description, setDescription] = useState(challenge?.description ?? "");
    const [isValidDescription, setIsValidDescription] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView
                behavior="padding"
                className="flex-1"
            >
                <Header
                    title={i18n.t("challenge_settings.description.header")}
                    leftSection={
                        <IconCircle
                            icon={ArrowLeftIcon}
                            onPress={() => router.back()}
                        />
                    }
                />

                <View className="flex-1 px-4 pb-4 justify-between">
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
                        disabled={!isValidDescription || isLoading}
                        loading={isLoading}
                        onPress={handleSubmit}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
